import React, { Suspense, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, MeshReflectorMaterial } from '@react-three/drei';
import Car from './components/Car';
import AnimationControls from './components/AnimationControls';
import Tachometer from './components/Tachometer';
import useAnimationStore from './store/animationStore';
import './App.css';

// Camera controller for POV mode
function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef();
  const { povCamera, steeringAngle } = useAnimationStore();
  const prevPov = useRef(false);

  useFrame(() => {
    if (povCamera && !prevPov.current) {
      // Switch to POV: driver seat position in a 911
      camera.position.set(0.4, 0.65, 0.35);
      camera.lookAt(2.5, 0.60, 0.35);
      if (controlsRef.current) controlsRef.current.enabled = false;
    } else if (!povCamera && prevPov.current) {
      // Switch back to orbit view
      camera.position.set(5, 2, 5);
      if (controlsRef.current) controlsRef.current.enabled = true;
    }
    prevPov.current = povCamera;

    if (povCamera) {
      // Subtle head movement with steering
      camera.position.set(0.4, 0.65, 0.35 + steeringAngle * 0.03);
      camera.lookAt(2.5 + steeringAngle * 0.2, 0.60, 0.35 + steeringAngle * 0.15);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      target={[0, 0.6, 0]}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minDistance={2}
      maxDistance={15}
      enableDamping
      dampingFactor={0.05}
      enabled={!povCamera}
    />
  );
}

// Lighting setup that responds to day/night mode
function SceneLighting() {
  const { nightMode, headlightsOn } = useAnimationStore();

  if (nightMode) {
    return (
      <>
        <ambientLight intensity={0.05} color="#112244" />
        <directionalLight position={[5, 5, 5]} intensity={0.1} color="#334466" />
        <pointLight position={[0, 3, 0]} intensity={0.08} color="#223355" />
        {/* Moon-like light */}
        <directionalLight position={[-3, 8, -3]} intensity={0.15} color="#8899cc" />
        {/* Dramatic spotlight from above */}
        <spotLight
          position={[0, 6, 0]}
          intensity={0.5}
          angle={0.4}
          penumbra={0.8}
          color="#334466"
          distance={12}
          castShadow
        />
        {/* Headlight beams - strong when headlights are on */}
        {headlightsOn && (
          <>
            <spotLight
              position={[2.15, 0.80, 0.55]}
              target-position={[6, 0.3, 0.55]}
              intensity={3}
              angle={0.4}
              penumbra={0.5}
              color="#FFFFDD"
              distance={8}
              castShadow
            />
            <spotLight
              position={[2.15, 0.80, -0.55]}
              target-position={[6, 0.3, -0.55]}
              intensity={3}
              angle={0.4}
              penumbra={0.5}
              color="#FFFFDD"
              distance={8}
              castShadow
            />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[-4, 4, -3]} intensity={0.4} color="#aaccff" />
      <pointLight position={[0, 3, 0]} intensity={0.3} color="#ffffff" />
    </>
  );
}

// Ground with reflective material
function Ground() {
  const { nightMode } = useAnimationStore();

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[30, 30]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={nightMode ? 0.8 : 0.3}
          roughness={0.7}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color={nightMode ? '#0a0a12' : '#111111'}
          metalness={0.2}
          mirror={0}
        />
      </mesh>

      <ContactShadows
        position={[0, 0.005, 0]}
        opacity={nightMode ? 0.3 : 0.55}
        scale={8}
        blur={2.5}
        far={3}
      />

      <gridHelper
        args={[20, 40, nightMode ? '#181828' : '#222222', nightMode ? '#111118' : '#181818']}
        position={[0, 0.001, 0]}
      />
    </>
  );
}

export default function App() {
  const { nightMode } = useAnimationStore();

  return (
    <div style={{ width: '100vw', height: '100vh', background: nightMode ? '#050510' : '#0a0a0a' }}>
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 20,
          zIndex: 100,
          fontFamily: 'monospace',
          pointerEvents: 'none',
        }}
      >
        <h1
          style={{
            color: '#FF0000',
            fontSize: '18px',
            letterSpacing: '3px',
            margin: 0,
            fontWeight: 'bold',
          }}
        >
          PORSCHE 911 GT3 (992)
        </h1>
        <p
          style={{
            color: '#666',
            fontSize: '10px',
            margin: '4px 0 0 0',
            letterSpacing: '1px',
          }}
        >
          4.0L FLAT-6 | 502 HP @ 8400 RPM | 9000 RPM REDLINE
        </p>
        <p
          style={{
            color: '#555',
            fontSize: '9px',
            margin: '3px 0 0 0',
          }}
        >
          Drag to rotate &bull; Scroll to zoom &bull; Click parts for info
        </p>
      </div>

      {/* Tachometer HUD */}
      <Tachometer />

      <Canvas
        camera={{ position: [5, 2, 5], fov: 32, near: 0.01, far: 100 }}
        shadows
        gl={{ antialias: true, alpha: false, toneMapping: 3 }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={[nightMode ? '#050510' : '#0a0a0a']} />
          <fog attach="fog" args={[nightMode ? '#050510' : '#0a0a0a', 8, 25]} />

          <SceneLighting />

          {/* Environment for reflections */}
          <Environment preset={nightMode ? 'night' : 'city'} />

          {/* Ground */}
          <Ground />

          {/* The Car */}
          <Car />

          <CameraController />
        </Suspense>
      </Canvas>

      <AnimationControls />
    </div>
  );
}
