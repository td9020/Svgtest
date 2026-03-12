import { useRef, useMemo } from 'react'
import * as THREE from 'three'

export default function Exhaust({ position = [0, 0, 0] }) {
  const group = useRef()

  // Header pipe from engine
  const headerGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.08, 0.25, 0.12),    // engine exit
      new THREE.Vector3(0.12, 0.1, 0.13),      // down
      new THREE.Vector3(0.05, 0.02, 0.13),     // under engine
      new THREE.Vector3(-0.1, -0.02, 0.13),    // mid section
      new THREE.Vector3(-0.3, 0.0, 0.12),      // towards rear
    ])
    return new THREE.TubeGeometry(curve, 32, 0.016, 12, false)
  }, [])

  // Main muffler pipe
  const mufflerPipeGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.3, 0.0, 0.12),
      new THREE.Vector3(-0.38, 0.03, 0.12),
      new THREE.Vector3(-0.48, 0.08, 0.12),
    ])
    return new THREE.TubeGeometry(curve, 16, 0.016, 12, false)
  }, [])

  return (
    <group ref={group} position={position}>
      {/* Header pipe - chrome */}
      <mesh geometry={headerGeometry}>
        <meshStandardMaterial
          color="#ccc"
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Mid-pipe connector */}
      <mesh geometry={mufflerPipeGeometry}>
        <meshStandardMaterial
          color="#bbb"
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Muffler body */}
      <group position={[-0.52, 0.1, 0.12]} rotation={[0, 0, 0.15]}>
        {/* Main muffler canister */}
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.22, 16]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.5} />
        </mesh>

        {/* Muffler end cap - front */}
        <mesh position={[-0.11, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* Muffler end cap - rear with exhaust tip */}
        <mesh position={[0.11, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* Exhaust tip */}
        <mesh position={[0.13, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.03, 0.04, 12]} />
          <meshStandardMaterial color="#aaa" roughness={0.15} metalness={0.85} />
        </mesh>

        {/* Chrome heat shield */}
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.042, 0.042, 0.18, 16, 1, true, 0, Math.PI]} />
          <meshStandardMaterial
            color="#ccc"
            roughness={0.1}
            metalness={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Heat shield on header */}
      <mesh position={[0.08, 0.12, 0.13]}>
        <boxGeometry args={[0.06, 0.08, 0.008]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  )
}
