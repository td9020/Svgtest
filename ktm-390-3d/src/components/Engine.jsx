import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { CSG } from 'three-csg-ts'
import { SPECS } from './dimensions'
import { useMultiCSG } from './CSGMesh'

// KTM 390 Duke engine:
// 373.2cc, single cylinder, 4-stroke, liquid-cooled
// Bore: 89mm, Stroke: 60mm
// 6-speed transmission
// DOHC 4 valves

const ENGINE_COLOR = '#1a1a1a'
const CASE_COLOR = '#2a2a2a'

export default function Engine({ position = [0, 0, 0], pistonOffset = 0 }) {
  const group = useRef()

  const bore = SPECS.bore         // 0.089m
  const stroke = SPECS.stroke     // 0.060m
  const cylinderOD = bore + 0.018 // cylinder wall thickness

  // CSG: Crankcase with bolt holes subtracted
  const crankcaseGeometry = useMemo(() => {
    const base = new THREE.BoxGeometry(0.30, 0.22, 0.25)
    const boltHole = new THREE.CylinderGeometry(0.005, 0.005, 0.35, 8)
    return { base, boltHole }
  }, [])

  const crankcaseCSG = useMultiCSG(crankcaseGeometry.base, [
    // Bolt holes along the crankcase split line
    { geometry: crankcaseGeometry.boltHole, transform: { position: [0.12, -0.09, 0], rotation: [Math.PI / 2, 0, 0] }, type: 'subtract' },
    { geometry: crankcaseGeometry.boltHole, transform: { position: [-0.12, -0.09, 0], rotation: [Math.PI / 2, 0, 0] }, type: 'subtract' },
    { geometry: crankcaseGeometry.boltHole, transform: { position: [0.12, 0.07, 0], rotation: [Math.PI / 2, 0, 0] }, type: 'subtract' },
    { geometry: crankcaseGeometry.boltHole, transform: { position: [-0.12, 0.07, 0], rotation: [Math.PI / 2, 0, 0] }, type: 'subtract' },
  ])

  // CSG: Cylinder with hollow bore (larger than Honda - 89mm vs 57mm)
  const cylinderCSG = useMemo(() => {
    const outer = new THREE.Mesh(
      new THREE.CylinderGeometry(cylinderOD / 2, cylinderOD / 2, stroke + 0.07, 24),
      new THREE.MeshStandardMaterial()
    )
    const inner = new THREE.Mesh(
      new THREE.CylinderGeometry(bore / 2, bore / 2, stroke + 0.09, 24),
      new THREE.MeshStandardMaterial()
    )
    inner.updateMatrix()

    const result = CSG.subtract(outer, inner)
    return result.geometry
  }, [bore, stroke, cylinderOD])

  // CSG: Cylinder head with combustion chamber cavity and spark plug hole
  const headCSG = useMemo(() => {
    const head = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.055, 0.12),
      new THREE.MeshStandardMaterial()
    )
    // Combustion chamber - hemispherical
    const chamber = new THREE.Mesh(
      new THREE.SphereGeometry(bore / 2 - 0.004, 16, 16),
      new THREE.MeshStandardMaterial()
    )
    chamber.position.set(0, -0.022, 0)
    chamber.updateMatrix()

    // Spark plug hole
    const sparkHole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.007, 0.007, 0.07, 8),
      new THREE.MeshStandardMaterial()
    )
    sparkHole.position.set(0.025, 0.01, 0)
    sparkHole.rotation.set(0, 0, -0.4)
    sparkHole.updateMatrix()

    let result = CSG.subtract(head, chamber)
    result = CSG.subtract(result, sparkHole)
    return result.geometry
  }, [bore])

  return (
    <group ref={group} position={position}>
      {/* Crankcase - with bolt holes (CSG) */}
      <mesh geometry={crankcaseCSG}>
        <meshStandardMaterial color={ENGINE_COLOR} roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Lower sump */}
      <mesh position={[0, -0.14, 0]}>
        <boxGeometry args={[0.26, 0.05, 0.23]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Sump drain plug */}
      <mesh position={[0, -0.17, 0.04]}>
        <cylinderGeometry args={[0.008, 0.008, 0.01, 6]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Cylinder barrel - hollow bore (CSG) - liquid cooled, no fins */}
      <group position={[0.02, 0.18, 0]} rotation={[0, 0, 0.10]}>
        <mesh geometry={cylinderCSG}>
          <meshStandardMaterial color={CASE_COLOR} roughness={0.45} metalness={0.65} />
        </mesh>

        {/* Water jacket ridges (liquid cooled - smooth with coolant passages) */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[cylinderOD / 2 + 0.005, cylinderOD / 2 + 0.005, stroke + 0.04, 24]} />
          <meshStandardMaterial color="#333" roughness={0.4} metalness={0.6} transparent opacity={0.6} />
        </mesh>

        {/* Coolant inlet port */}
        <mesh position={[cylinderOD / 2 + 0.01, -0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.008, 0.008, 0.02, 8]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Coolant outlet port */}
        <mesh position={[cylinderOD / 2 + 0.01, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.008, 0.008, 0.02, 8]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Cylinder head - with combustion chamber (CSG) */}
        <mesh geometry={headCSG} position={[0, 0.065, 0]}>
          <meshStandardMaterial color={CASE_COLOR} roughness={0.4} metalness={0.7} />
        </mesh>

        {/* DOHC cam cover */}
        <mesh position={[0, 0.10, 0]}>
          <boxGeometry args={[0.10, 0.03, 0.10]} />
          <meshStandardMaterial color="#222" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Cam cover bolt details */}
        {[[-0.035, 0.115, -0.035], [0.035, 0.115, -0.035], [-0.035, 0.115, 0.035], [0.035, 0.115, 0.035]].map((pos, i) => (
          <mesh key={`cb-${i}`} position={pos}>
            <cylinderGeometry args={[0.005, 0.005, 0.005, 6]} />
            <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
          </mesh>
        ))}

        {/* Spark plug */}
        <group position={[0.045, 0.07, 0]} rotation={[0, 0, -0.4]}>
          <mesh>
            <cylinderGeometry args={[0.008, 0.008, 0.045, 8]} />
            <meshStandardMaterial color="#888" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Hex nut */}
          <mesh position={[0, 0.018, 0]}>
            <cylinderGeometry args={[0.010, 0.010, 0.012, 6]} />
            <meshStandardMaterial color="#aaa" roughness={0.25} metalness={0.8} />
          </mesh>
          {/* Ceramic insulator */}
          <mesh position={[0, 0.032, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.018, 8]} />
            <meshStandardMaterial color="#ddd" roughness={0.8} metalness={0.1} />
          </mesh>
        </group>

        {/* Piston (animated) */}
        <mesh position={[0, pistonOffset, 0]}>
          <cylinderGeometry args={[bore / 2 - 0.003, bore / 2 - 0.003, 0.025, 16]} />
          <meshStandardMaterial color="#aaa" roughness={0.2} metalness={0.85} />
        </mesh>
        {/* Connecting rod */}
        <mesh position={[0, pistonOffset - 0.035, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.045, 6]} />
          <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Cam chain cover */}
        <mesh position={[0, 0.05, 0.065]}>
          <boxGeometry args={[0.045, 0.09, 0.012]} />
          <meshStandardMaterial color="#333" roughness={0.45} metalness={0.6} />
        </mesh>
      </group>

      {/* Clutch cover - right side (KTM branding area) */}
      <mesh position={[0.02, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.025, 24]} />
        <meshStandardMaterial color="#222" roughness={0.4} metalness={0.65} />
      </mesh>
      {/* KTM branding boss */}
      <mesh position={[0.02, 0, 0.155]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.008, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.35} metalness={0.7} />
      </mesh>
      {/* Clutch cover bolts */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2
        const r = 0.072
        return (
          <mesh key={`cc-${i}`} position={[0.02 + Math.cos(a) * r, Math.sin(a) * r, 0.155]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.006, 6]} />
            <meshStandardMaterial color="#666" roughness={0.3} metalness={0.7} />
          </mesh>
        )
      })}

      {/* Stator/alternator cover - left side */}
      <mesh position={[-0.01, -0.02, -0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.025, 24]} />
        <meshStandardMaterial color="#222" roughness={0.4} metalness={0.65} />
      </mesh>

      {/* Oil filter */}
      <mesh position={[0.12, -0.09, 0.08]} rotation={[0.3, 0, 0.4]}>
        <cylinderGeometry args={[0.024, 0.024, 0.055, 12]} />
        <meshStandardMaterial color="#222" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Water pump - liquid cooled feature */}
      <mesh position={[0.14, 0.02, 0.13]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.02, 12]} />
        <meshStandardMaterial color="#333" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Gear shift lever - left side */}
      <group position={[-0.10, -0.12, -0.15]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.08, 6]} />
          <meshStandardMaterial color="#555" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, -0.045]}>
          <boxGeometry args={[0.04, 0.012, 0.018]} />
          <meshStandardMaterial color="#333" roughness={0.7} metalness={0.3} />
        </mesh>
      </group>

      {/* Rear brake pedal - right side */}
      <group position={[-0.08, -0.12, 0.15]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.06, 6]} />
          <meshStandardMaterial color="#555" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <boxGeometry args={[0.05, 0.012, 0.02]} />
          <meshStandardMaterial color="#333" roughness={0.7} metalness={0.3} />
        </mesh>
      </group>

      {/* Engine mounting bolts */}
      {[
        [0.13, 0.07, 0.135],
        [0.13, 0.07, -0.135],
        [-0.13, -0.07, 0.135],
        [-0.13, -0.07, -0.135],
      ].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.009, 0.009, 0.012, 6]} />
          <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}

      {/* Throttle body / intake */}
      <mesh position={[-0.04, 0.22, -0.07]} rotation={[0.3, 0, -0.5]}>
        <cylinderGeometry args={[0.022, 0.018, 0.08, 12]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Air box connector */}
      <mesh position={[-0.06, 0.28, -0.10]} rotation={[0.4, 0, -0.3]}>
        <cylinderGeometry args={[0.025, 0.022, 0.04, 12]} />
        <meshStandardMaterial color="#222" roughness={0.7} metalness={0.2} />
      </mesh>
    </group>
  )
}
