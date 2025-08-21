import React, { useRef } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Define the shader material using drei's shaderMaterial helper
const StaticShaderMaterial = shaderMaterial(
  // Uniforms
  { 
    time: 0, 
    opacity: 1.0,
    grainSize: 0.05, // Keep very large grain
    grainIntensity: 0.55, // Keep contrast
    rippleSpeed: 5.0, // Added: Speed of the ripple wave
    rippleFrequency: 30.0 // Added: Frequency/tightness of the ripple wave
  },
  // Vertex Shader
  ` varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  ` precision highp float;
    uniform float time;
    uniform float opacity;
    uniform float grainSize;
    uniform float grainIntensity;
    uniform float rippleSpeed;     // Added uniform
    uniform float rippleFrequency; // Added uniform
    varying vec2 vUv;

    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123 + time * 0.1);
    }

    void main() {
      // Calculate ripple effect
      float wave = sin(vUv.y * rippleFrequency - time * rippleSpeed) * 0.5 + 0.5; // Sine wave based on Y and time
      wave = pow(wave, 4.0); // Sharpen the wave peaks for a more distinct ripple

      // Modulate intensity with the wave
      float currentIntensity = grainIntensity + wave * 0.1; // Add wave effect, adjust multiplier (0.1) as needed
      
      // Calculate noise using modulated intensity
      float noise = random(vUv * grainSize) * currentIntensity; 
      
      // Invert the noise effect: Mostly white, subtract noise for black dots
      vec3 color = vec3(1.0) - vec3(noise);

      // Output inverted color with opacity
      gl_FragColor = vec4(color, opacity); 
    }
  `
);

// Extend THREE namespace to include the shader material
extend({ StaticShaderMaterial });

// The actual shader plane component - Restored useFrame for opacity
const ShaderPlane = ({ shaderOpacity }) => {
  const materialRef = useRef();

  // Update time and opacity uniforms
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      // Update opacity uniform directly from prop changes here
      materialRef.current.uniforms.opacity.value = shaderOpacity; 
    }
  });

  return (
    <mesh>
      <planeGeometry args={[20, 20]} /> 
      <staticShaderMaterial ref={materialRef} transparent={true} />
    </mesh>
  );
};

// Main component to export - Renders the Canvas
const StaticShader = ({ opacity }) => {
  return (
    <Canvas 
      camera={{ position: [0, 0, 1] }} 
      style={{ 
        position: 'fixed', 
        // Overscan technique for mobile viewports
        top: '-2.5vh',      // Pull up slightly
        left: '-2.5vw',     // Pull left slightly
        width: '110%',     // Make wider than viewport
        height: '110%',    // Make taller than viewport
        // inset: 0,        // Remove inset
        zIndex: 9998, 
        pointerEvents: 'none' 
      }}
    >
      <ShaderPlane shaderOpacity={opacity} />
    </Canvas>
  );
};

export default StaticShader; 