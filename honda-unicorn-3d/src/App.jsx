import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'
import Motorcycle from './components/Motorcycle'
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
          HONDA UNICORN 150
        </h1>
        <p style={{
          color: '#888',
          fontFamily: 'Arial, sans-serif',
          fontSize: '13px',
          margin: '4px 0 0 0',
          letterSpacing: '1px',
        }}>
          Drag to rotate • Scroll to zoom • Right-click to pan
        </p>
      </div>

      <Canvas
        camera={{ position: [1.2, 0.8, 1.2], fov: 45, near: 0.01, far: 100 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-3, 3, -3]} intensity={0.5} />
        <pointLight position={[0, 3, 0]} intensity={0.3} />

        {/* Environment for reflections */}
        <Environment preset="city" />

        {/* The Motorcycle */}
        <Motorcycle position={[0, 0.12, 0]} />

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#222233" roughness={0.8} metalness={0.2} />
        </mesh>

        {/* Contact shadows for realism */}
        <ContactShadows
          position={[0, -0.115, 0]}
          opacity={0.6}
          scale={4}
          blur={2.5}
          far={1.5}
        />

        {/* Grid helper for scale reference */}
        <gridHelper args={[4, 20, '#333355', '#2a2a44']} position={[0, -0.11, 0]} />

        {/* Camera controls */}
        <OrbitControls
          makeDefault
          minDistance={0.5}
          maxDistance={5}
          target={[0, 0.35, 0]}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  )
}

export default App
