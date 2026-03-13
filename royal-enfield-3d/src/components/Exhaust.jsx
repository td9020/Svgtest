import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { SPECS, POS } from './dimensions'
import { useCSG } from './CSGMesh'

// Royal Enfield Classic 350: Long chrome exhaust
// Full-length chrome pipe from engine to rear
// Upswept chrome muffler (classic cigar shape)
// Chrome heat shields

export default function Exhaust({ position = [0, 0, 0] }) {
  const group = useRef()
  const wb = SPECS.wheelbase

  // CSG: Muffler body with hollow core (cigar shape)
  const mufflerOuter = useMemo(() => new THREE.CylinderGeometry(0.045, 0.042, 0.35, 20), [])
  const mufflerInner = useMemo(() => new THREE.CylinderGeometry(0.035, 0.032, 0.37, 20), [])
  const hollowMuffler = useCSG({
    geometryA: mufflerOuter,
    geometryB: mufflerInner,
    operation: 'subtract',
  })

  // Header pipe - from engine exhaust port, running full length down right side
  const headerGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(wb * 0.44, 0.50, 0.14),    // engine exhaust port
      new THREE.Vector3(wb * 0.48, 0.35, 0.15),    // down from cylinder
      new THREE.Vector3(wb * 0.42, 0.26, 0.15),    // under engine
      new THREE.Vector3(wb * 0.30, 0.22, 0.14),    // mid run
      new THREE.Vector3(wb * 0.18, 0.21, 0.14),    // continuing back
      new THREE.Vector3(wb * 0.08, 0.23, 0.13),    // near rear
    ])
    return new THREE.TubeGeometry(curve, 48, 0.018, 12, false)
  }, [wb])

  // Collector pipe to muffler
  const collectorGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(wb * 0.08, 0.23, 0.13),
      new THREE.Vector3(wb * 0.02, 0.26, 0.13),
      new THREE.Vector3(-0.06, 0.32, 0.13),
    ])
    return new THREE.TubeGeometry(curve, 16, 0.018, 12, false)
  }, [wb])

  return (
    <group ref={group} position={position}>
      {/* Header pipe - chrome, full length */}
      <mesh geometry={headerGeometry}>
        <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
      </mesh>

      {/* Collector pipe to muffler */}
      <mesh geometry={collectorGeometry}>
        <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
      </mesh>

      {/* Muffler body (CSG: hollow, classic cigar shape, upswept) */}
      <group position={[-0.18, 0.38, 0.13]} rotation={[0, 0, 0.15]}>
        <mesh geometry={hollowMuffler} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
        </mesh>

        {/* Muffler end cap - front (chrome) */}
        <mesh position={[-0.175, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.044, 20]} />
          <meshStandardMaterial color="#ccc" roughness={0.1} metalness={0.88} side={THREE.DoubleSide} />
        </mesh>

        {/* Muffler end cap - rear (chrome) */}
        <mesh position={[0.175, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <circleGeometry args={[0.044, 20]} />
          <meshStandardMaterial color="#ccc" roughness={0.1} metalness={0.88} side={THREE.DoubleSide} />
        </mesh>

        {/* Chrome exhaust tip */}
        <mesh position={[0.19, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.032, 0.04, 16]} />
          <meshStandardMaterial color="#ddd" roughness={0.06} metalness={0.94} />
        </mesh>

        {/* Chrome heat shield over muffler */}
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.045, 0]}>
          <cylinderGeometry args={[0.047, 0.047, 0.30, 16, 1, true, 0, Math.PI]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} side={THREE.DoubleSide} />
        </mesh>

        {/* Heat shield perforations - decorative slots */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={`perf-${i}`} position={[-0.10 + i * 0.03, 0.048, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.004, 0.018, 0.004]} />
            <meshStandardMaterial color="#aaa" roughness={0.15} metalness={0.85} />
          </mesh>
        ))}

        {/* Muffler mounting bracket */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[0.04, 0.015, 0.020]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.5} />
        </mesh>
      </group>

      {/* Chrome heat shield on header pipe (near engine) */}
      <mesh position={[wb * 0.44, 0.38, 0.16]}>
        <boxGeometry args={[0.06, 0.07, 0.008]} />
        <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.88} />
      </mesh>

      {/* Header pipe chrome heat shield (mid section) */}
      <mesh position={[wb * 0.28, 0.23, 0.155]}>
        <boxGeometry args={[0.12, 0.04, 0.006]} />
        <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.88} />
      </mesh>

      {/* Exhaust gasket ring at engine port */}
      <mesh position={[wb * 0.44, 0.50, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.018, 0.004, 8, 16]} />
        <meshStandardMaterial color="#888" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Exhaust clamp at header junction */}
      <mesh position={[wb * 0.08, 0.23, 0.13]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.020, 0.003, 6, 12]} />
        <meshStandardMaterial color="#aaa" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  )
}
