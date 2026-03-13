import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { CSG } from 'three-csg-ts'
import { SPECS } from './dimensions'
import { useMultiCSG } from './CSGMesh'

// Suzuki Hayabusa GSX1300R engine:
// 1340cc, INLINE-4 cylinder, 4-stroke, liquid-cooled
// Bore: 81mm x 4, Stroke: 65mm
// 6-speed transmission
// Firing order: 1-3-4-2 (typical inline-4)

const ENGINE_COLOR = '#3a3a3a'
const CYLINDER_COLOR = '#4a4a4a'
const HEAD_COLOR = '#505050'

export default function Engine({ position = [0, 0, 0], pistonOffset = 0 }) {
  const group = useRef()

  const bore = SPECS.bore         // 0.081m
  const stroke = SPECS.stroke     // 0.065m
  const cylinderOD = bore + 0.012 // cylinder wall thickness
  const cylinderSpacing = bore + 0.008 // gap between cylinders

  // Total width of 4 cylinders
  const blockWidth = cylinderSpacing * 3 + cylinderOD

  // CSG: Crankcase with bolt holes subtracted
  const crankcaseGeometry = useMemo(() => {
    const base = new THREE.BoxGeometry(0.30, 0.22, blockWidth + 0.06)
    const boltHole = new THREE.CylinderGeometry(0.004, 0.004, 0.4, 8)
    return { base, boltHole }
  }, [blockWidth])

  const crankcaseCSG = useMultiCSG(crankcaseGeometry.base, [
    // Bolt holes along the crankcase split line
    { geometry: crankcaseGeometry.boltHole, transform: { position: [0.12, -0.09, 0], rotation: [Math.PI / 2, 0, 0] }, type: 'subtract' },
    { geometry: crankcaseGeometry.boltHole, transform: { position: [-0.12, -0.09, 0], rotation: [Math.PI / 2, 0, 0] }, type: 'subtract' },
    { geometry: crankcaseGeometry.boltHole, transform: { position: [0.12, 0.07, 0], rotation: [Math.PI / 2, 0, 0] }, type: 'subtract' },
    { geometry: crankcaseGeometry.boltHole, transform: { position: [-0.12, 0.07, 0], rotation: [Math.PI / 2, 0, 0] }, type: 'subtract' },
    { geometry: crankcaseGeometry.boltHole, transform: { position: [0, -0.09, 0], rotation: [Math.PI / 2, 0, 0] }, type: 'subtract' },
    { geometry: crankcaseGeometry.boltHole, transform: { position: [0, 0.07, 0], rotation: [Math.PI / 2, 0, 0] }, type: 'subtract' },
  ])

  // CSG: Inline-4 cylinder block with 4 hollow bores
  const cylinderBlockCSG = useMemo(() => {
    const blockOuter = new THREE.Mesh(
      new THREE.BoxGeometry(cylinderOD + 0.02, stroke + 0.06, blockWidth + 0.02),
      new THREE.MeshStandardMaterial()
    )

    let current = blockOuter

    // Subtract 4 cylinder bores
    for (let i = 0; i < 4; i++) {
      const zPos = -1.5 * cylinderSpacing + i * cylinderSpacing
      const boreMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(bore / 2, bore / 2, stroke + 0.08, 24),
        new THREE.MeshStandardMaterial()
      )
      boreMesh.position.set(0, 0, zPos)
      boreMesh.updateMatrix()
      current = CSG.subtract(current, boreMesh)
    }

    return current.geometry
  }, [bore, stroke, cylinderOD, blockWidth, cylinderSpacing])

  // CSG: Cylinder head with 4 combustion chambers and spark plug holes
  const headCSG = useMemo(() => {
    const head = new THREE.Mesh(
      new THREE.BoxGeometry(cylinderOD + 0.03, 0.05, blockWidth + 0.03),
      new THREE.MeshStandardMaterial()
    )

    let current = head

    // 4 combustion chambers
    for (let i = 0; i < 4; i++) {
      const zPos = -1.5 * cylinderSpacing + i * cylinderSpacing
      const chamber = new THREE.Mesh(
        new THREE.SphereGeometry(bore / 2 - 0.005, 16, 16),
        new THREE.MeshStandardMaterial()
      )
      chamber.position.set(0, -0.018, zPos)
      chamber.updateMatrix()
      current = CSG.subtract(current, chamber)

      // Spark plug hole
      const sparkHole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.006, 0.06, 8),
        new THREE.MeshStandardMaterial()
      )
      sparkHole.position.set(0.015, 0.01, zPos)
      sparkHole.rotation.set(0, 0, -0.3)
      sparkHole.updateMatrix()
      current = CSG.subtract(current, sparkHole)
    }

    return current.geometry
  }, [bore, blockWidth, cylinderSpacing])

  // Firing order offsets (1-3-4-2): phase offsets for each piston
  const firingOffsets = [0, Math.PI, 3 * Math.PI / 2, Math.PI / 2]

  return (
    <group ref={group} position={position}>
      {/* Crankcase - with bolt holes (CSG) */}
      <mesh geometry={crankcaseCSG}>
        <meshStandardMaterial color={ENGINE_COLOR} roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Lower sump / oil pan */}
      <mesh position={[0, -0.13, 0]}>
        <boxGeometry args={[0.26, 0.05, blockWidth + 0.04]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Sump drain plug */}
      <mesh position={[0, -0.158, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.006, 6]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Cylinder block - 4 hollow bores (CSG) */}
      <group position={[0.02, 0.18, 0]} rotation={[0, 0, 0.10]}>
        <mesh geometry={cylinderBlockCSG}>
          <meshStandardMaterial color={CYLINDER_COLOR} roughness={0.45} metalness={0.65} />
        </mesh>

        {/* Water jacket ridges (liquid-cooled look) */}
        {Array.from({ length: 3 }).map((_, i) => (
          <mesh key={i} position={[0, -0.02 + i * 0.025, 0]}>
            <boxGeometry args={[cylinderOD + 0.03, 0.003, blockWidth + 0.025]} />
            <meshStandardMaterial color="#555" roughness={0.4} metalness={0.6} />
          </mesh>
        ))}

        {/* Cylinder head (CSG) */}
        <mesh geometry={headCSG} position={[0, 0.055, 0]}>
          <meshStandardMaterial color={HEAD_COLOR} roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Cam cover (top of head) */}
        <mesh position={[0, 0.088, 0]}>
          <boxGeometry args={[cylinderOD + 0.015, 0.018, blockWidth + 0.01]} />
          <meshStandardMaterial color="#444" roughness={0.35} metalness={0.65} />
        </mesh>

        {/* 4 intake ports on top of head */}
        {Array.from({ length: 4 }).map((_, i) => {
          const zPos = -1.5 * cylinderSpacing + i * cylinderSpacing
          return (
            <group key={`intake-${i}`} position={[-0.03, 0.075, zPos]}>
              <mesh rotation={[0, 0, 0.5]}>
                <cylinderGeometry args={[0.012, 0.012, 0.03, 8]} />
                <meshStandardMaterial color="#555" roughness={0.4} metalness={0.6} />
              </mesh>
            </group>
          )
        })}

        {/* 4 Spark plugs */}
        {Array.from({ length: 4 }).map((_, i) => {
          const zPos = -1.5 * cylinderSpacing + i * cylinderSpacing
          return (
            <group key={`spark-${i}`} position={[0.035, 0.068, zPos]} rotation={[0, 0, -0.3]}>
              <mesh>
                <cylinderGeometry args={[0.006, 0.006, 0.035, 8]} />
                <meshStandardMaterial color="#888" roughness={0.3} metalness={0.8} />
              </mesh>
              <mesh position={[0, 0.014, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.008, 6]} />
                <meshStandardMaterial color="#aaa" roughness={0.25} metalness={0.8} />
              </mesh>
              <mesh position={[0, 0.025, 0]}>
                <cylinderGeometry args={[0.004, 0.004, 0.012, 8]} />
                <meshStandardMaterial color="#ddd" roughness={0.8} metalness={0.1} />
              </mesh>
            </group>
          )
        })}

        {/* 4 Pistons (animated with firing order offsets) */}
        {Array.from({ length: 4 }).map((_, i) => {
          const zPos = -1.5 * cylinderSpacing + i * cylinderSpacing
          // Firing order offset creates realistic staggered piston motion
          const freq = 12 * 1.0
          const offset = pistonOffset !== 0
            ? Math.sin((Date.now() * 0.001 * freq * Math.PI * 2) + firingOffsets[i]) * 0.020
            : 0
          return (
            <group key={`piston-${i}`}>
              {/* Piston */}
              <mesh position={[0, offset, zPos]}>
                <cylinderGeometry args={[bore / 2 - 0.002, bore / 2 - 0.002, 0.018, 16]} />
                <meshStandardMaterial color="#aaa" roughness={0.2} metalness={0.85} />
              </mesh>
              {/* Connecting rod */}
              <mesh position={[0, offset - 0.025, zPos]}>
                <cylinderGeometry args={[0.005, 0.005, 0.035, 6]} />
                <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* Clutch cover - right side (large, prominent) */}
      <mesh position={[0.02, 0, (blockWidth / 2) + 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.025, 24]} />
        <meshStandardMaterial color="#444" roughness={0.4} metalness={0.65} />
      </mesh>
      <mesh position={[0.02, 0, (blockWidth / 2) + 0.055]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.008, 16]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.35} metalness={0.7} />
      </mesh>
      {/* Clutch cover bolts */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2
        const r = 0.068
        return (
          <mesh key={`cb-${i}`} position={[0.02 + Math.cos(a) * r, Math.sin(a) * r, (blockWidth / 2) + 0.055]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.006, 6]} />
            <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
          </mesh>
        )
      })}

      {/* Alternator cover - left side (large) */}
      <mesh position={[-0.01, -0.02, -(blockWidth / 2) - 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.080, 0.080, 0.025, 24]} />
        <meshStandardMaterial color="#444" roughness={0.4} metalness={0.65} />
      </mesh>
      <mesh position={[-0.01, -0.02, -(blockWidth / 2) - 0.055]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.008, 16]} />
        <meshStandardMaterial color="#555" roughness={0.35} metalness={0.7} />
      </mesh>

      {/* Oil filter */}
      <mesh position={[0.12, -0.08, 0.08]} rotation={[0.3, 0, 0.4]}>
        <cylinderGeometry args={[0.024, 0.024, 0.055, 12]} />
        <meshStandardMaterial color="#222" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Gear shift lever - left side */}
      <group position={[-0.10, -0.10, -(blockWidth / 2) - 0.06]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.08, 6]} />
          <meshStandardMaterial color="#555" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, -0.045]}>
          <boxGeometry args={[0.035, 0.01, 0.015]} />
          <meshStandardMaterial color="#333" roughness={0.7} metalness={0.3} />
        </mesh>
      </group>

      {/* Coolant hoses (liquid-cooled) */}
      <mesh position={[0.15, 0.10, 0.08]} rotation={[0.5, 0.3, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.10, 8]} />
        <meshStandardMaterial color="#222" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0.15, 0.10, -0.08]} rotation={[0.5, -0.3, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.10, 8]} />
        <meshStandardMaterial color="#222" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Radiator (in front of engine) */}
      <mesh position={[0.18, 0.05, 0]}>
        <boxGeometry args={[0.025, 0.18, blockWidth - 0.04]} />
        <meshStandardMaterial color="#222" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* Radiator fins */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={`rf-${i}`} position={[0.195, -0.06 + i * 0.015, 0]}>
          <boxGeometry args={[0.002, 0.012, blockWidth - 0.06]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.5} />
        </mesh>
      ))}

      {/* Engine mounting bolts */}
      {[
        [0.13, 0.06, (blockWidth / 2) + 0.02],
        [0.13, 0.06, -(blockWidth / 2) - 0.02],
        [-0.13, -0.06, (blockWidth / 2) + 0.02],
        [-0.13, -0.06, -(blockWidth / 2) - 0.02],
      ].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.009, 0.009, 0.012, 6]} />
          <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
    </group>
  )
}
