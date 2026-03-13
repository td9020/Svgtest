import { Suspense, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, MeshReflectorMaterial } from '@react-three/drei'
import Motorcycle from './components/Motorcycle'
import AnimationControls from './components/AnimationControls'
import Tachometer from './components/Tachometer'
import useAnimationStore from './store/animationStore'
import './App.css'

// Camera controller for POV mode
function CameraController() {
  const { camera } = useThree()
  const controlsRef = useRef()
  const { povCamera, steeringAngle } = useAnimationStore()
  const prevPov = useRef(false)

  useFrame(() => {
    if (povCamera && !prevPov.current) {
      // Switch to POV: rider position on the bike
      camera.position.set(0.58, 1.08, 0)
      camera.lookAt(1.5, 0.9, 0)
      if (controlsRef.current) controlsRef.current.enabled = false
    } else if (!povCamera && prevPov.current) {
      // Switch back to orbit view
      camera.position.set(2.0, 1.1, 2.0)
      if (controlsRef.current) controlsRef.current.enabled = true
    }
    prevPov.current = povCamera

    if (povCamera) {
      // Subtle head movement with steering
      camera.position.set(0.58, 1.08, steeringAngle * 0.05)
      camera.lookAt(1.5 + steeringAngle * 0.3, 0.9, steeringAngle * 0.2)
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      minDistance={0.5}
      maxDistance={6}
      target={[0, 0.5, 0]}
      enableDamping
      dampingFactor={0.05}
      enabled={!povCamera}
    />
  )
}

// Lighting setup that responds to day/night mode
function SceneLighting() {
  const { nightMode, headlightOn } = useAnimationStore()

  if (nightMode) {
    return (
      <>
        <ambientLight intensity={0.05} color="#112244" />
        <directionalLight position={[5, 5, 5]} intensity={0.1} color="#334466" />
        <pointLight position={[0, 3, 0]} intensity={0.08} color="#223355" />
        {/* Moon-like light */}
        <directionalLight position={[-3, 8, -3]} intensity={0.15} color="#8899cc" />
        {/* Headlight beam - strong when headlight is on */}
        {headlightOn && (
          <spotLight
            position={[0.62, 0.68, 0]}
            target-position={[2.5, 0.2, 0]}
            intensity={2.5}
            angle={0.5}
            penumbra={0.5}
            color="#ffffdd"
            distance={5}
            castShadow
          />
        )}
      </>
    )
  }

  return (
    <>
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
    </>
  )
}

// Ground with reflection
function Ground() {
  const { nightMode } = useAnimationStore()

  return (
    <>
      {/* Reflective ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={nightMode ? 0.8 : 0.3}
          roughness={0.7}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color={nightMode ? '#111122' : '#222233'}
          metalness={0.15}
          mirror={0}
        />
      </mesh>

      <ContactShadows
        position={[0, 0.005, 0]}
        opacity={nightMode ? 0.3 : 0.55}
        scale={5}
        blur={2.5}
        far={2}
      />

      <gridHelper
        args={[6, 30, nightMode ? '#222244' : '#333355', nightMode ? '#1a1a33' : '#2a2a44']}
        position={[0, 0.001, 0]}
      />
    </>
  )
}

function App() {
  const { nightMode } = useAnimationStore()

  return (
    <div style={{ width: '100vw', height: '100vh', background: nightMode ? '#0a0a12' : '#1a1a2e' }}>
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
          Drag to rotate &bull; Scroll to zoom &bull; Click parts for info
        </p>
        <p style={{
          color: '#666',
          fontFamily: 'monospace',
          fontSize: '11px',
          margin: '4px 0 0 0',
        }}>
          349cc &bull; 1390mm wheelbase &bull; 19&quot;/18&quot; wheels &bull; {nightMode ? 'Night' : 'Day'} mode
        </p>
      </div>

      {/* Animation control panel */}
      <AnimationControls />

      {/* Tachometer HUD */}
      <Tachometer />

      <Canvas
        camera={{ position: [2.0, 1.1, 2.0], fov: 40, near: 0.01, far: 100 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <SceneLighting />
          <Environment preset={nightMode ? 'night' : 'city'} />

          {/* Royal Enfield Classic 350 - centered on wheelbase midpoint */}
          <Motorcycle position={[-0.695, 0, 0]} />

          <Ground />
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
