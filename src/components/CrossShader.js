export function createShader(canvas) {
    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  
    const vertexShaderSource = `
    attribute vec4 position;
    void main() {
        gl_Position = position;
    }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform float time; // Time uniform provided by the host application
  uniform vec2 resolution;

  // --- Noise Functions (Unchanged) ---
  float noise(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
      }
      return v;
  }

  // --- Main Shader Logic ---
  void main() {
      // 1. Calculate initial screen-centered UVs (Unchanged)
      vec2 screen_uv = (gl_FragCoord.xy - resolution.xy * 0.5) / resolution.y;
      vec2 uv = screen_uv;
      vec3 finalColor = vec3(0.0);

      // --- Apply Vertical Shift (Unchanged) ---
      float verticalShift = 0.25;
      uv.y -= verticalShift;

      // --- 2. Define the Background Light Source (Unchanged) ---
      float lightNoise = fbm(uv * 1.5 + time * 0.1);
      float baseIntensity = 4.5;
      float dynamicIntensity = baseIntensity * (0.8 + 0.4 * lightNoise) + 0.2 * sin(time * 0.5);
      vec3 backgroundLightColor = vec3(1.0, 0.9, 0.75) * dynamicIntensity;

      // --- 3. Define the Cross Cutout Mask with Width Limit (Unchanged) ---
      float thickness = 0.035;
      float maxWidth = 0.35;
      float widthFactor = smoothstep(maxWidth, maxWidth - 0.05, abs(uv.x));
      float vertDist = abs(uv.x);
      float vertMask = smoothstep(thickness + 0.01, thickness - 0.005, vertDist);
      float horzDist = abs(uv.y);
      float horzMaskBase = smoothstep(thickness + 0.01, thickness - 0.005, horzDist);
      float horzMask = horzMaskBase * widthFactor;
      float crossMask = max(vertMask, horzMask);

      // --- 4. Calculate Light Through the Cutout (Unchanged) ---
      vec3 lightThroughCutout = backgroundLightColor * crossMask;

      // --- 5. Add Bloom/Glow Around the Cutout --- <<< MODIFICATION HERE >>>
      float glowWidth = 0.1;
      float vertGlow = smoothstep(thickness + glowWidth, thickness, abs(uv.x));
      float horzGlowBase = smoothstep(thickness + glowWidth, thickness, abs(uv.y));
      float horzGlow = horzGlowBase * widthFactor;
      float combinedGlowFalloff = max(vertGlow, horzGlow);

      // ** Animate the glow intensity multiplier **
      float minGlowIntensity = 0.05;
      float maxGlowIntensity = 0.2;
      float glowRange = maxGlowIntensity - minGlowIntensity; // = 0.10
      float glowSpeed = 1.8; // Adjust this value to change the speed of the pulse

      // Oscillate between 0.0 and 1.0 using sine wave mapped to [0, 1] range
      float oscillation = (sin(time * glowSpeed) + 1.0) * 0.5;

      // Map the oscillation to the desired intensity range [0.05, 0.15]
      float dynamicGlowMultiplier = minGlowIntensity + oscillation * glowRange;

      // Calculate final glow color using the dynamic multiplier
      vec3 glowColor = backgroundLightColor * combinedGlowFalloff * dynamicGlowMultiplier;

      // --- 6. Add Volumetric Rays (God Rays) (Unchanged) ---
      float dist = length(uv);
      float angle = atan(uv.y, uv.x);
      float rayNoise = fbm(vec2(angle * 1.5, dist * 3.0) + time * 0.2);
      float rays = smoothstep(0.55, 0.75, rayNoise)
                  * crossMask
                  * (1.0 - smoothstep(0.1, 0.8, dist))
                  * 0.35;
      vec3 rayColor = vec3(1.0, 0.88, 0.7) * rays;

      // --- 7. Add Subtle Atmospheric Haze/Dust (Unchanged) ---
      float haze = fbm(uv * 0.8 + time * 0.05) * 0.08;
      haze += crossMask * 0.05;
      vec3 hazeColor = vec3(0.7, 0.8, 1.0) * haze;

      // --- 8. Combine All Components (Unchanged) ---
      finalColor += lightThroughCutout;
      finalColor += glowColor; // Glow is now animated
      finalColor += rayColor;
      finalColor += hazeColor;

      // --- 9. Vignette (Unchanged) ---
      float vignette = 1.0 - smoothstep(0.5, 1.2, length(screen_uv));
      finalColor *= vignette;

      // --- Final Output (Unchanged) ---
      gl_FragColor = vec4(finalColor, 1.0);
  }
  `;


  
    function compileShader(source, type) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }
  
    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
  
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
  
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }
  
    gl.useProgram(program);
  
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);
  
    const positionAttribute = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);
  
    const resolutionUniform = gl.getUniformLocation(program, "resolution");
    const timeUniform = gl.getUniformLocation(program, "time");
  
    function render(time) {
      gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
      gl.uniform1f(timeUniform, time * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    }
  
    requestAnimationFrame(render);
  }


//backups:
//   const vertexShaderSource = `
//     attribute vec4 position;
//     void main() {
//         gl_Position = position;
//     }
// `;

// const fragmentShaderSource = `
//     precision highp float;
//     uniform float time;
//     uniform vec2 resolution;

//     // Hash function for randomness
//     float hash(vec2 p) {
//         return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
//     }

//     // Noise function for smoke and light texture
//     float noise(vec2 p) {
//         vec2 i = floor(p);
//         vec2 f = fract(p);
//         vec2 u = f * f * (3.0 - 2.0 * f);
//         return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
//                    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
//     }

//     // Fractal Brownian Motion (fbm) for organic effects
//     float fbm(vec2 p) {
//         float v = 0.0;
//         float a = 0.5;
//         for (int i = 0; i < 5; i++) {
//             v += a * noise(p);
//             p *= 2.0;
//             a *= 0.5;
//         }
//         return v;
//     }

//     void main() {
//         vec2 uv = gl_FragCoord.xy / resolution.xy;
//         vec3 color = vec3(0.0);

//         if (uv.x < 0.5) { // Left side: Shadowy Smoke
//             vec2 p = uv * 8.0;
//             float distortion = fbm(p + time * 0.5);
//             float shadowDensity = smoothstep(0.4, 1.0, distortion);

//             vec3 smokeColor1 = vec3(0.1, 0.0, 0.0); // Deep dark red
//             vec3 smokeColor2 = vec3(0.4, 0.0, 0.1); // Murky crimson
//             vec3 smoke = mix(smokeColor1, smokeColor2, shadowDensity);
            
//             // Swirling distortion for realism
//             vec2 swirlOffset = vec2(fbm(uv * 10.0 - time * 0.2), fbm(uv * 12.0 + time * 0.3)) * 0.04;
//             uv += swirlOffset;

//             // More refined smoke shadows
//             float shadowDepth = smoothstep(0.3, 0.9, fbm(uv * 5.0 + time * 0.7));
//             color = mix(smoke, vec3(0.0), shadowDepth * 0.6);

//         } else { // Right side: Ethereal Luminescence
//             vec2 p = (uv - vec2(0.75, 0.5)) * 2.5;
//             float radial = 1.0 - length(p);

//             // Primary glow effect
//             float glow = smoothstep(0.0, 0.7, radial);
//             glow = pow(glow, 2.5);

//             // Raycasting / Light Beams
//             float angle = atan(p.y, p.x) + time * 0.5;
//             float rays = sin(angle * 10.0) * cos(angle * 5.0);
//             rays = pow(abs(rays), 3.0) * 0.5;

//             // Ethereal refraction shimmer
//             float shimmer = sin(uv.x * 20.0 + time * 2.0) + cos(uv.y * 15.0 - time * 1.5);
//             shimmer *= 0.05;
//             vec2 distortedUV = uv + vec2(shimmer, -shimmer * 0.7);

//             float lightStreaks = sin(distortedUV.x * 30.0 + time * 5.0) * cos(distortedUV.y * 25.0 - time * 3.0);
//             lightStreaks = pow(abs(lightStreaks), 3.0) * 0.8;

//             // Final glowing light color mix
//             color = vec3(1.0, 0.95, 0.8) * glow;
//             color += vec3(0.9, 1.0, 1.0) * lightStreaks;
//             color += vec3(1.0, 0.85, 0.7) * rays;
//         }

//         gl_FragColor = vec4(color, 1.0);
//     }
// `;


////moving star
// export function createShader(canvas) {
//   const gl = canvas.getContext("webgl");
//   if (!gl) {

//     return;
//   }

//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
//   gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

//   const vertexShaderSource = `
//     attribute vec4 position;
//     void main() {
//       gl_Position = position;
//     }
//   `;

//   const fragmentShaderSource = `
//     precision highp float;
//     uniform float time;
//     uniform vec2 resolution;
//     uniform vec2 mouse;

//     float star(vec2 uv, int points, float outerRadius, float innerRadius) {
//       float angle = atan(uv.y, uv.x);
//       float r = length(uv);
//       float segment = 6.28318 / float(points * 2);
//       float modAngle = mod(angle, segment);
//       return mix(outerRadius, innerRadius, smoothstep(0.0, segment * 0.5, modAngle) - smoothstep(segment * 0.5, segment, modAngle)) - r;
//     }

//     void main() {
//       vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
//       vec3 finalColor = vec3(0.0);

//       vec2 normalizedMouse = (mouse / resolution - 0.5) * vec2(resolution.y / resolution.x, 1.0);

//       float starSize = 0.05 + 0.01 * sin(time * 2.0);
//       float innerRadius = starSize * 0.4;
//       float outerRadius = starSize;
//       float starDist = star(uv - normalizedMouse, 5, outerRadius, innerRadius);
//       float starMask = smoothstep(0.0, 0.01, starDist);
//       vec3 starColor = vec3(1.0, 1.0, 0.8);
//       finalColor += starColor * starMask;

//       float glowRadius = starSize * 1.5;
//       float glowAmount = smoothstep(glowRadius, starSize, length(uv - normalizedMouse));
//       finalColor += starColor * 0.3 * glowAmount * (0.5 + 0.5 * sin(time * 3.0));

//       vec2 trailOffset = vec2(-0.01, 0.005) * (0.5 + 0.5 * sin(time * 2.0)); 
//       vec2 prevMouse = normalizedMouse - trailOffset;
//       float trailDist = star(uv - prevMouse, 5, outerRadius * 0.8, innerRadius * 0.8);
//       float trailMask = smoothstep(0.0, 0.008, trailDist);
//       float trailFade = smoothstep(0.5, 0.0, length(normalizedMouse - prevMouse) * 50.0);
//       finalColor += starColor * 0.2 * trailMask * trailFade;

//       gl_FragColor = vec4(finalColor, 1.0);
//     }
//   `;

//   function compileShader(source, type) {
//     const shader = gl.createShader(type);
//     gl.shaderSource(shader, source);
//     gl.compileShader(shader);
//     if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

//       return null;
//     }
//     return shader;
//   }

//   const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
//   const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
//   const program = gl.createProgram();

//   gl.attachShader(program, vertexShader);
//   gl.attachShader(program, fragmentShader);
//   gl.linkProgram(program);

//   if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {

//     return;
//   }

//   gl.useProgram(program);

//   const positionBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
//     -1, -1, 1, -1, -1, 1,
//     -1, 1, 1, -1, 1, 1
//   ]), gl.STATIC_DRAW);

//   const positionAttribute = gl.getAttribLocation(program, "position");
//   gl.enableVertexAttribArray(positionAttribute);
//   gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

//   const resolutionUniform = gl.getUniformLocation(program, "resolution");
//   const timeUniform = gl.getUniformLocation(program, "time");
//   const mouseUniform = gl.getUniformLocation(program, "mouse");

//   // Track mouse even when canvas is behind other elements
//   window.addEventListener("mousemove", (event) => {
//     const rect = canvas.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;
//     gl.uniform2f(mouseUniform, x, canvas.height - y);
//   });

//   function render(time) {
//     gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
//     gl.uniform1f(timeUniform, time * 0.001);
//     gl.drawArrays(gl.TRIANGLES, 0, 6);
//     requestAnimationFrame(render);
//   }

//   requestAnimationFrame(render);
// }
