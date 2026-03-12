import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { SPECS, POS } from './dimensions'
import { useCSG } from './CSGMesh'

// Honda Unicorn 150: Single cylinder exhaust
// Header exits from right side of cylinder, curves down and back to muffler

export default function Exhaust({ position = [0, 0, 0] }) {
  const group = useRef()
  const wb = SPECS.wheelbase

  // CSG: Muffler body with hollow core
  const mufflerOuter = useMemo(() => new THREE.CylinderGeometry(0.04, 0.04, 0.24, 16), [])
  const mufflerInner = useMemo(() => new THREE.CylinderGeometry(0.03, 0.03, 0.26, 16), [])
  const hollowMuffler = useCSG({
    geometryA: mufflerOuter,
    geometryB: mufflerInner,
    operation: 'subtract',
  })

  // Header pipe - from engine down and back
  const headerGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(wb * 0.42, 0.45, 0.12),   // engine exhaust port
      new THREE.Vector3(wb * 0.45, 0.30, 0.13),   // down
      new THREE.Vector3(wb * 0.38, 0.22, 0.13),   // under engine
      new THREE.Vector3(wb * 0.25, 0.19, 0.12),   // mid
      new THREE.Vector3(wb * 0.12, 0.20, 0.12),   // towards rear
    ])
    return new THREE.TubeGeometry(curve, 32, 0.016, 12, false)
  }, [wb])

  // Collector pipe to muffler
  const collectorGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(wb * 0.12, 0.20, 0.12),
      new THREE.Vector3(wb * 0.05, 0.22, 0.12),
      new THREE.Vector3(-0.05, 0.28, 0.12),
    ])
    return new THREE.TubeGeometry(curve, 16, 0.016, 12, false)
  }, [wb])

  return (
    <group ref={group} position={position}>
      {/* Header pipe - chrome */}
      <mesh geometry={headerGeometry}>
        <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
      </mesh>

      {/* Collector pipe */}
      <mesh geometry={collectorGeometry}>
        <meshStandardMaterial color="#ccc" roughness={0.1} metalness={0.88} />
      </mesh>

      {/* Muffler body (CSG: hollow) */}
      <group position={[-0.15, 0.32, 0.12]} rotation={[0, 0, 0.12]}>
        <mesh geometry={hollowMuffler} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#333" roughness={0.45} metalness={0.55} />
        </mesh>

        {/* Muffler end cap - front */}
        <mesh position={[-0.12, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* Muffler end cap - rear */}
        <mesh position={[0.12, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* Exhaust tip */}
        <mesh position={[0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.028, 0.04, 12]} />
          <meshStandardMaterial color="#bbb" roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Chrome heat shield */}
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.042, 0.042, 0.20, 16, 1, true, 0, Math.PI]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Heat shield on header pipe */}
      <mesh position={[wb * 0.42, 0.34, 0.135]}>
        <boxGeometry args={[0.05, 0.06, 0.006]} />
        <meshStandardMaterial color="#888" roughness={0.25} metalness={0.75} />
      </mesh>

      {/* Exhaust gasket ring at engine port */}
      <mesh position={[wb * 0.42, 0.45, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.016, 0.003, 8, 16]} />
        <meshStandardMaterial color="#888" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  )
}
