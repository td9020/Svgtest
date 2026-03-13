import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import Car from './components/Car';
import AnimationControls from './components/AnimationControls';
import './App.css';

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#1a1a2e" roughness={0.8} metalness={0.2} />
    </mesh>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[-3, 5, -3]} intensity={0.4} color="#aabbff" />
      <pointLight position={[0, 3, 3]} intensity={0.5} color="#ffffff" />
      <pointLight position={[0, 2, -3]} intensity={0.3} color="#ffddaa" />
      <hemisphereLight intensity={0.3} groundColor="#1a1a2e" />
    </>
  );
}

function Title() {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      color: '#ffffff',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      zIndex: 1000,
      pointerEvents: 'none',
    }}>
      <div style={{ fontSize: '10px', letterSpacing: '4px', color: '#6688bb', fontWeight: '700' }}>
        VOLKSWAGEN
      </div>
      <div style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '6px', color: '#ffffff' }}>
        VIRTUS
      </div>
      <div style={{ fontSize: '10px', color: '#556688', letterSpacing: '2px', marginTop: '2px' }}>
        1.0 TSI 3-CYLINDER TURBO SEDAN
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a1a' }}>
      <Title />
      <Canvas
        shadows
        camera={{ position: [4, 2, 4], fov: 35 }}
        gl={{ antialias: true, toneMapping: 3, toneMappingExposure: 1.0 }}
      >
        <SceneLighting />
        <Car />
        <GroundPlane />
        <ContactShadows
          position={[0, 0.001, 0]}
          opacity={0.6}
          scale={12}
          blur={2.5}
          far={4}
          color="#000011"
        />
        <Environment preset="city" background={false} />
        <OrbitControls
          target={[0, 0.7, 0]}
          enablePan={true}
          enableDamping={true}
          dampingFactor={0.1}
          minDistance={2}
          maxDistance={15}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
      </Canvas>
      <AnimationControls />
    </div>
  );
}
