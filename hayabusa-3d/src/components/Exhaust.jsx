import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { SPECS, POS } from './dimensions'
import { useCSG } from './CSGMesh'

// Suzuki Hayabusa GSX1300R: 4-into-2-into-1 exhaust system
// 4 header pipes from inline-4 merge into 2, then into 1
// Under-engine collector
// Single large muffler on right side, under tail
// Catalytic converter in collector

export default function Exhaust({ position = [0, 0, 0] }) {
  const group = useRef()
  const wb = SPECS.wheelbase
  const bore = SPECS.bore
  const cylinderSpacing = bore + 0.008

  // CSG: Muffler body with hollow core
  const mufflerOuter = useMemo(() => new THREE.CylinderGeometry(0.050, 0.045, 0.32, 16), [])
  const mufflerInner = useMemo(() => new THREE.CylinderGeometry(0.038, 0.035, 0.34, 16), [])
  const hollowMuffler = useCSG({
    geometryA: mufflerOuter,
    geometryB: mufflerInner,
    operation: 'subtract',
  })

  // 4 header pipes from each cylinder
  const headerGeometries = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => {
      const zOffset = -1.5 * cylinderSpacing + i * cylinderSpacing
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(wb * 0.42, 0.48, zOffset),       // exhaust port
        new THREE.Vector3(wb * 0.46, 0.34, zOffset * 0.9), // down from cylinder
        new THREE.Vector3(wb * 0.44, 0.24, zOffset * 0.7), // curving under
        new THREE.Vector3(wb * 0.40, 0.20, zOffset * 0.5), // merging
      ])
      return new THREE.TubeGeometry(curve, 24, 0.014, 10, false)
    })
  }, [wb, cylinderSpacing])

  // 2 intermediate pipes (pairs merged)
  const midPipeGeometries = useMemo(() => {
    return [
      // Left pair (cylinders 1-2)
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(wb * 0.40, 0.20, -cylinderSpacing * 0.75),
          new THREE.Vector3(wb * 0.35, 0.18, -cylinderSpacing * 0.3),
          new THREE.Vector3(wb * 0.28, 0.17, 0),
        ]),
        16, 0.018, 10, false
      ),
      // Right pair (cylinders 3-4)
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(wb * 0.40, 0.20, cylinderSpacing * 0.75),
          new THREE.Vector3(wb * 0.35, 0.18, cylinderSpacing * 0.3),
          new THREE.Vector3(wb * 0.28, 0.17, 0),
        ]),
        16, 0.018, 10, false
      ),
    ]
  }, [wb, cylinderSpacing])

  // Final collector pipe to muffler
  const collectorGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(wb * 0.28, 0.17, 0),
      new THREE.Vector3(wb * 0.20, 0.18, 0.02),
      new THREE.Vector3(wb * 0.12, 0.20, 0.06),
      new THREE.Vector3(wb * 0.05, 0.24, 0.10),
      new THREE.Vector3(-0.02, 0.30, 0.12),
    ])
    return new THREE.TubeGeometry(curve, 24, 0.022, 12, false)
  }, [wb])

  // Catalytic converter housing
  const catGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(0.035, 0.035, 0.10, 12)
  }, [])

  return (
    <group ref={group} position={position}>
      {/* 4 Header pipes - chrome/stainless */}
      {headerGeometries.map((geom, i) => (
        <mesh key={`header-${i}`} geometry={geom}>
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
        </mesh>
      ))}

      {/* Exhaust gasket rings at each port */}
      {Array.from({ length: 4 }).map((_, i) => {
        const zOffset = -1.5 * cylinderSpacing + i * cylinderSpacing
        return (
          <mesh key={`gasket-${i}`} position={[wb * 0.42, 0.48, zOffset]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.014, 0.003, 8, 16]} />
            <meshStandardMaterial color="#888" roughness={0.4} metalness={0.6} />
          </mesh>
        )
      })}

      {/* 2 Intermediate merged pipes */}
      {midPipeGeometries.map((geom, i) => (
        <mesh key={`mid-${i}`} geometry={geom}>
          <meshStandardMaterial color="#ccc" roughness={0.10} metalness={0.90} />
        </mesh>
      ))}

      {/* Collector pipe to muffler */}
      <mesh geometry={collectorGeometry}>
        <meshStandardMaterial color="#bbb" roughness={0.12} metalness={0.88} />
      </mesh>

      {/* Catalytic converter */}
      <mesh geometry={catGeometry} position={[wb * 0.16, 0.19, 0.03]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#555" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Muffler body (CSG: hollow) - right side under tail */}
      <group position={[-0.10, 0.34, 0.13]} rotation={[0, 0, 0.08]}>
        <mesh geometry={hollowMuffler} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#333" roughness={0.40} metalness={0.60} />
        </mesh>

        {/* Muffler end cap - front */}
        <mesh position={[-0.16, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.048, 16]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* Muffler end cap - rear */}
        <mesh position={[0.16, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <circleGeometry args={[0.043, 16]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* Exhaust tip - carbon fiber look */}
        <mesh position={[0.19, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.034, 0.06, 12]} />
          <meshStandardMaterial color="#222" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Inner tip */}
        <mesh position={[0.21, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.026, 0.03, 12]} />
          <meshStandardMaterial color="#bbb" roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Chrome heat shield on muffler */}
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.052, 0.052, 0.26, 16, 1, true, 0, Math.PI]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Heat shield on headers near engine */}
      <mesh position={[wb * 0.44, 0.30, 0]}>
        <boxGeometry args={[0.04, 0.06, 0.14]} />
        <meshStandardMaterial color="#888" roughness={0.25} metalness={0.75} />
      </mesh>
    </group>
  )
}
