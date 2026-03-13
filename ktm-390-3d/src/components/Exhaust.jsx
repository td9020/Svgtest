import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { SPECS, POS } from './dimensions'
import { useCSG } from './CSGMesh'

// KTM 390 Duke: Under-belly exhaust
// Header exits from right side of cylinder
// Routes UNDER the engine belly
// Short side-exit muffler on right

export default function Exhaust({ position = [0, 0, 0] }) {
  const group = useRef()
  const wb = SPECS.wheelbase

  // CSG: Muffler body with hollow core
  const mufflerOuter = useMemo(() => new THREE.CylinderGeometry(0.038, 0.042, 0.20, 16), [])
  const mufflerInner = useMemo(() => new THREE.CylinderGeometry(0.028, 0.032, 0.22, 16), [])
  const hollowMuffler = useCSG({
    geometryA: mufflerOuter,
    geometryB: mufflerInner,
    operation: 'subtract',
  })

  // Header pipe - from engine exhaust port, curving down under belly
  const headerGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(wb * 0.43, 0.45, 0.12),   // engine exhaust port
      new THREE.Vector3(wb * 0.46, 0.32, 0.10),   // curve down
      new THREE.Vector3(wb * 0.42, 0.22, 0.06),   // under engine
      new THREE.Vector3(wb * 0.35, 0.19, 0.04),   // belly route
      new THREE.Vector3(wb * 0.25, 0.19, 0.03),   // continue under
      new THREE.Vector3(wb * 0.15, 0.20, 0.04),   // towards catalytic converter
    ])
    return new THREE.TubeGeometry(curve, 40, 0.016, 12, false)
  }, [wb])

  // Mid pipe (catalytic converter section)
  const midPipeGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(wb * 0.15, 0.20, 0.04),
      new THREE.Vector3(wb * 0.08, 0.22, 0.06),
      new THREE.Vector3(0.02, 0.25, 0.10),
      new THREE.Vector3(-0.05, 0.30, 0.12),
    ])
    return new THREE.TubeGeometry(curve, 20, 0.018, 12, false)
  }, [wb])

  return (
    <group ref={group} position={position}>
      {/* Header pipe - stainless steel look */}
      <mesh geometry={headerGeometry}>
        <meshStandardMaterial color="#bbb" roughness={0.12} metalness={0.88} />
      </mesh>

      {/* Catalytic converter - wider section under belly */}
      <mesh position={[wb * 0.22, 0.19, 0.035]} rotation={[0, 0, 0.05]}>
        <boxGeometry args={[0.12, 0.05, 0.06]} />
        <meshStandardMaterial color="#555" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Mid pipe to muffler */}
      <mesh geometry={midPipeGeometry}>
        <meshStandardMaterial color="#999" roughness={0.15} metalness={0.85} />
      </mesh>

      {/* Muffler - short side-exit on right (CSG: hollow) */}
      <group position={[-0.10, 0.33, 0.12]} rotation={[0, 0, 0.08]}>
        <mesh geometry={hollowMuffler} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#222" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Muffler end cap - front */}
        <mesh position={[-0.10, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color="#333" roughness={0.4} metalness={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* Muffler end cap - rear with exhaust tip */}
        <mesh position={[0.10, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <circleGeometry args={[0.042, 16]} />
          <meshStandardMaterial color="#333" roughness={0.4} metalness={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* Exhaust tip - slash cut */}
        <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2 + 0.3]}>
          <cylinderGeometry args={[0.025, 0.030, 0.04, 12]} />
          <meshStandardMaterial color="#aaa" roughness={0.08} metalness={0.92} />
        </mesh>

        {/* Heat shield wrap */}
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.044, 0.044, 0.16, 16, 1, true, 0, Math.PI * 1.5]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Exhaust gasket ring at engine port */}
      <mesh position={[wb * 0.43, 0.45, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.016, 0.003, 8, 16]} />
        <meshStandardMaterial color="#888" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Under-belly heat shield */}
      <mesh position={[wb * 0.30, 0.175, 0.01]} rotation={[0, 0, 0.02]}>
        <boxGeometry args={[0.22, 0.004, 0.08]} />
        <meshStandardMaterial color="#666" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Lambda/O2 sensor */}
      <mesh position={[wb * 0.18, 0.22, 0.045]} rotation={[0.5, 0, 0.3]}>
        <cylinderGeometry args={[0.006, 0.006, 0.03, 8]} />
        <meshStandardMaterial color="#777" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  )
}
