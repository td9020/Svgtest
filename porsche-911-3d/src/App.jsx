import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Car from './components/Car';
import AnimationControls from './components/AnimationControls';
import './App.css';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0a' }}>
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 20,
          zIndex: 100,
          fontFamily: 'monospace',
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
      </div>

      <Canvas
        camera={{ position: [5, 2, 5], fov: 32 }}
        shadows
        gl={{ antialias: true, toneMapping: 3 }}
      >
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 8, 25]} />

        {/* Lighting */}
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

        {/* Environment for reflections */}
        <Environment preset="city" />

        {/* Ground plane */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial
            color="#111111"
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>

        {/* Ground grid */}
        <gridHelper
          args={[20, 40, '#222222', '#181818']}
          position={[0, 0.001, 0]}
        />

        {/* The Car */}
        <Car />

        <OrbitControls
          target={[0, 0.6, 0]}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={2}
          maxDistance={15}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>

      <AnimationControls />
    </div>
  );
}
