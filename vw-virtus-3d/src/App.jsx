import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import Car from './components/Car';
import AnimationControls from './components/AnimationControls';
import Tachometer from './components/Tachometer';
import useAnimationStore from './store/animationStore';
import { VW } from './components/dimensions';
import './App.css';

function Ground({ nightMode }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={nightMode ? 0.6 : 0.3}
        roughness={0.8}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color={nightMode ? '#0a0a18' : '#1a1a2e'}
        metalness={nightMode ? 0.4 : 0.2}
        mirror={0}
      />
    </mesh>
  );
}

function SceneLighting({ nightMode, headlightsOn }) {
  const halfL = VW.length / 2;

  if (nightMode) {
    return (
      <>
        {/* Dim ambient for night */}
        <ambientLight intensity={0.08} color="#334466" />

        {/* Moonlight */}
        <directionalLight
          position={[-3, 8, 2]}
          intensity={0.15}
          color="#6688cc"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
        />

        {/* Very dim fill */}
        <hemisphereLight intensity={0.05} groundColor="#0a0a18" color="#223344" />

        {/* Headlight spots when on */}
        {headlightsOn && (
          <>
            <spotLight
              position={[VW.bodyWidth / 2 - 0.18, VW.hoodHeight - 0.06, halfL + 0.15]}
              angle={0.5}
              penumbra={0.5}
              intensity={5}
              color="#ffffee"
              distance={12}
              decay={2}
              target-position={[VW.bodyWidth / 2 - 0.18, 0, halfL + 8]}
              castShadow
            />
            <spotLight
              position={[-(VW.bodyWidth / 2 - 0.18), VW.hoodHeight - 0.06, halfL + 0.15]}
              angle={0.5}
              penumbra={0.5}
              intensity={5}
              color="#ffffee"
              distance={12}
              decay={2}
              target-position={[-(VW.bodyWidth / 2 - 0.18), 0, halfL + 8]}
              castShadow
            />
          </>
        )}
      </>
    );
  }

  // Day mode
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

function CameraController() {
  const povCamera = useAnimationStore((s) => s.povCamera);
  const steerAngle = useAnimationStore((s) => s.steerAngle);
  const { camera } = useThree();
  const controlsRef = useRef();
  const savedPos = useRef(null);
  const savedTarget = useRef(null);

  useEffect(() => {
    if (povCamera) {
      // Save current camera state
      savedPos.current = camera.position.clone();
      savedTarget.current = new THREE.Vector3(0, 0.7, 0);
    }
  }, [povCamera, camera]);

  useFrame(() => {
    if (povCamera) {
      // Driver POV position (left-hand drive)
      const halfL = VW.length / 2;
      const driverX = 0.30;
      const driverY = VW.beltLine + 0.15;
      const driverZ = halfL - 1.2;

      camera.position.lerp(new THREE.Vector3(driverX, driverY, driverZ), 0.05);

      // Look forward, following steering
      const lookTarget = new THREE.Vector3(
        driverX + Math.sin(steerAngle) * 5,
        driverY - 0.05,
        driverZ + 5
      );
      const currentLook = new THREE.Vector3();
      camera.getWorldDirection(currentLook);
      currentLook.multiplyScalar(5).add(camera.position);
      currentLook.lerp(lookTarget, 0.05);
      camera.lookAt(currentLook);
    } else if (savedPos.current) {
      // Restore camera
      camera.position.lerp(savedPos.current, 0.05);
      if (savedPos.current.distanceTo(camera.position) < 0.1) {
        savedPos.current = null;
      }
    }
  });

  if (povCamera) return null;

  return (
    <OrbitControls
      ref={controlsRef}
      target={[0, 0.7, 0]}
      enablePan={true}
      enableDamping={true}
      dampingFactor={0.1}
      minDistance={2}
      maxDistance={15}
      minPolarAngle={0.1}
      maxPolarAngle={Math.PI / 2 - 0.05}
    />
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

function SceneContent() {
  const nightMode = useAnimationStore((s) => s.nightMode);
  const headlightsOn = useAnimationStore((s) => s.headlightsOn);

  return (
    <>
      <SceneLighting nightMode={nightMode} headlightsOn={headlightsOn} />
      <Car />
      <Ground nightMode={nightMode} />
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={nightMode ? 0.3 : 0.6}
        scale={12}
        blur={2.5}
        far={4}
        color="#000011"
      />
      <Environment preset={nightMode ? 'night' : 'city'} background={false} />
      <CameraController />
    </>
  );
}

export default function App() {
  const nightMode = useAnimationStore((s) => s.nightMode);

  return (
    <div style={{ width: '100vw', height: '100vh', background: nightMode ? '#020208' : '#0a0a1a' }}>
      <Title />
      <Canvas
        shadows
        camera={{ position: [4, 2, 4], fov: 35 }}
        gl={{ antialias: true, toneMapping: 3, toneMappingExposure: nightMode ? 0.6 : 1.0 }}
      >
        <SceneContent />
      </Canvas>
      <AnimationControls />
      <Tachometer />
    </div>
  );
}
