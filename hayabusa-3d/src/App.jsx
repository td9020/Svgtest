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
      // Switch to POV: rider position on the Hayabusa (lower, more forward)
      camera.position.set(0.62, 1.02, 0)
      camera.lookAt(1.6, 0.85, 0)
      if (controlsRef.current) controlsRef.current.enabled = false
    } else if (!povCamera && prevPov.current) {
      // Switch back to orbit view
      camera.position.set(2.0, 1.1, 2.0)
      if (controlsRef.current) controlsRef.current.enabled = true
    }
    prevPov.current = povCamera

    if (povCamera) {
      // Subtle head movement with steering
      camera.position.set(0.62, 1.02, steeringAngle * 0.05)
      camera.lookAt(1.6 + steeringAngle * 0.3, 0.85, steeringAngle * 0.2)
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      minDistance={0.5}
      maxDistance={7}
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
            position={[0.66, 0.67, 0]}
            target-position={[2.8, 0.2, 0]}
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
      <pointLight position={[1.5, 0.5, 1]} intensity={0.15} color="#ffffee" />
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
        <planeGeometry args={[14, 14]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={nightMode ? 0.8 : 0.3}
          roughness={0.7}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color={nightMode ? '#111122' : '#181828'}
          metalness={0.15}
          mirror={0}
        />
      </mesh>

      <ContactShadows
        position={[0, 0.005, 0]}
        opacity={nightMode ? 0.3 : 0.55}
        scale={6}
        blur={2.5}
        far={2}
      />

      <gridHelper
        args={[8, 40, nightMode ? '#222244' : '#222244', nightMode ? '#1a1a33' : '#1a1a33']}
        position={[0, 0.001, 0]}
      />
    </>
  )
}

function App() {
  const { nightMode } = useAnimationStore()

  return (
    <div style={{ width: '100vw', height: '100vh', background: nightMode ? '#0a0a12' : '#0d0d1a' }}>
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
          textShadow: '0 2px 10px rgba(0,61,165,0.4)',
        }}>
          SUZUKI HAYABUSA GSX1300R
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
          1340cc inline-4 &bull; 1480mm wheelbase &bull; 17&quot; wheels &bull; {nightMode ? 'Night' : 'Day'} mode
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

          {/* Suzuki Hayabusa - centered on wheelbase midpoint */}
          <Motorcycle position={[-0.740, 0, 0]} />

          <Ground />
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
