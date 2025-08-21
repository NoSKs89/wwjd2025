import React, { Suspense, useRef, useState, useEffect, memo } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';

// Memoize the Model component
const Model = memo(({ url }) => {
  const geom = useLoader(STLLoader, url);

  // Center the geometry
  geom.computeBoundingBox();
  geom.center();

  // Tilt the model forward (around X-axis)
  const rotationX = -Math.PI / 5.14;

  return (
    <mesh geometry={geom} rotation={[rotationX, 0, 0]}>
      {/* Use standard material with a default color */}
      <meshStandardMaterial color="#f0e68c" flatShading={false} /> {/* Khaki color, adjust as needed */}
    </mesh>
  );
});

// Memoize the ControlsWrapper component
const ControlsWrapper = memo(({ startRotation }) => {
  const controlsRef = useRef();

  useFrame(({ clock }) => {
    // Only run rotation if delay has passed and controls are available
    if (startRotation && controlsRef.current) {
      const elapsedTime = clock.getElapsedTime();
      const swingSpeed = 0.5;
      const amplitude = (55 * Math.PI) / 180;

      // Calculate the target angle based on time
      const targetAngle = Math.sin(elapsedTime * swingSpeed) * amplitude;

      // Get the current angle
      const currentAngle = controlsRef.current.getAzimuthalAngle();

      // Lerp the current angle towards the target angle
      const lerpFactor = 0.1; // Adjust for desired smoothness (0 to 1)
      const lerpedAngle = THREE.MathUtils.lerp(currentAngle, targetAngle, lerpFactor);

      controlsRef.current.setAzimuthalAngle(lerpedAngle);
      controlsRef.current.update();
    }
  });

  // Keep controls enabled
  return <OrbitControls ref={controlsRef} enableZoom={true} />;
});

// Main viewer component
const ModelViewer = ({ stlUrl }) => {
  const [startRotation, setStartRotation] = useState(false);

  // Start rotation after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setStartRotation(true);
    }, 3000); // 3-second delay

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []); // Run only once on mount

  // Increased Z position significantly more for zoom out
  const cameraPosition = [0, 150, 80];

  return (
    <Canvas
      camera={{ position: cameraPosition, fov: 50 }} // Reinstated static camera prop
      style={{ 
        width: '100%', 
        height: '250px', 
        background: 'black', 
        borderRadius: '4px',
        touchAction: 'none' // Prevent default touch actions like scroll
      }}
      shadows
    >
      {/* Removed Animated Perspective Camera */}
      <Suspense fallback={null}>
        <Stage environment="city" intensity={0.6}>
           <Model url={stlUrl} />
        </Stage>
      </Suspense>
      {/* Pass rotation start state to controls */}
      <ControlsWrapper startRotation={startRotation} />
    </Canvas>
  );
};

export default ModelViewer; 