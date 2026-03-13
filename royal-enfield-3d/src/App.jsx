import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import Motorcycle from './components/Motorcycle'
import AnimationControls from './components/AnimationControls'
import './App.css'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a2e' }}>
      {/* Title overlay */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        <h1 style={{
          color: '#fff',
          fontFamily: 'Arial, sans-serif',
          fontSize: '28px',
          fontWeight: 'bold',
          margin: 0,
          letterSpacing: '3px',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}>
          ROYAL ENFIELD CLASSIC 350
        </h1>
        <p style={{
          color: '#888',
          fontFamily: 'Arial, sans-serif',
          fontSize: '13px',
          margin: '4px 0 0 0',
          letterSpacing: '1px',
        }}>
          Drag to rotate &bull; Scroll to zoom &bull; Right-click to pan
        </p>
        <p style={{
          color: '#666',
          fontFamily: 'monospace',
          fontSize: '11px',
          margin: '4px 0 0 0',
        }}>
          Built with real specs: 1390mm wheelbase &bull; 349cc &bull; 19&quot;/18&quot; wheels &bull; CSG boolean geometry
        </p>
      </div>

      {/* Animation control panel */}
      <AnimationControls />

      <Canvas
        camera={{ position: [2.0, 1.1, 2.0], fov: 40, near: 0.01, far: 100 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.35} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.3}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <directionalLight position={[-3, 4, -3]} intensity={0.5} />
          <pointLight position={[0, 3, 0]} intensity={0.25} />
          <pointLight position={[1.4, 0.5, 1]} intensity={0.15} color="#ffffee" />

          {/* Environment for PBR reflections (chrome!) */}
          <Environment preset="city" />

          {/* Royal Enfield Classic 350 - centered on wheelbase midpoint */}
          <Motorcycle position={[-0.695, 0, 0]} />

          {/* Ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[12, 12]} />
            <meshStandardMaterial color="#222233" roughness={0.85} metalness={0.15} />
          </mesh>

          {/* Contact shadows */}
          <ContactShadows
            position={[0, 0.005, 0]}
            opacity={0.55}
            scale={5}
            blur={2.5}
            far={2}
          />

          {/* Grid */}
          <gridHelper args={[6, 30, '#333355', '#2a2a44']} position={[0, 0.001, 0]} />

          {/* Camera controls */}
          <OrbitControls
            makeDefault
            minDistance={0.5}
            maxDistance={6}
            target={[0, 0.5, 0]}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
