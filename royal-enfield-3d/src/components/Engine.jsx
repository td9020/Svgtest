import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { CSG } from 'three-csg-ts'
import { SPECS } from './dimensions'
import { useMultiCSG } from './CSGMesh'

// Royal Enfield Classic 350 engine:
// 349cc, single cylinder, 4-stroke, air-cooled, SOHC
// Bore: 72mm, Stroke: 85.8mm (long stroke thumper)
// Large prominent cooling fins (classic air-cooled look)
// Chrome engine covers (signature RE style)
// Visible pushrod tubes on the side

const ENGINE_COLOR = '#3a3a3a'
const FIN_COLOR = '#555'
const CHROME = { color: '#ddd', roughness: 0.08, metalness: 0.92 }

export default function Engine({ position = [0, 0, 0], pistonOffset = 0 }) {
  const group = useRef()

  const bore = SPECS.bore         // 0.072m
  const stroke = SPECS.stroke     // 0.0858m
  const cylinderOD = bore + 0.020 // cylinder wall thickness

  // CSG: Crankcase with bolt holes subtracted
  const crankcaseGeometry = useMemo(() => {
    const base = new THREE.BoxGeometry(0.30, 0.22, 0.26)
    const boltHole = new THREE.CylinderGeometry(0.005, 0.005, 0.35, 8)
    return { base, boltHole }
  }, [])

  const crankcaseCSG = useMultiCSG(crankcaseGeometry.base, [
    { geometry: crankcaseGeometry.boltHole, transform: { position: [0.12, -0.09, 0], rotation: [Math.PI / 2, 0, 0] }, type: 'subtract' },
    { geometry: crankcaseGeometry.boltHole, transform: { position: [-0.12, -0.09, 0], rotation: [Math.PI / 2, 0, 0] }, type: 'subtract' },
    { geometry: crankcaseGeometry.boltHole, transform: { position: [0.12, 0.07, 0], rotation: [Math.PI / 2, 0, 0] }, type: 'subtract' },
    { geometry: crankcaseGeometry.boltHole, transform: { position: [-0.12, 0.07, 0], rotation: [Math.PI / 2, 0, 0] }, type: 'subtract' },
  ])

  // CSG: Cylinder with hollow bore
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
      new THREE.BoxGeometry(0.12, 0.06, 0.12),
      new THREE.MeshStandardMaterial()
    )
    const chamber = new THREE.Mesh(
      new THREE.SphereGeometry(bore / 2 - 0.004, 16, 16),
      new THREE.MeshStandardMaterial()
    )
    chamber.position.set(0, -0.025, 0)
    chamber.updateMatrix()

    const sparkHole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.007, 0.007, 0.07, 8),
      new THREE.MeshStandardMaterial()
    )
    sparkHole.position.set(0.025, 0.015, 0)
    sparkHole.rotation.set(0, 0, -0.35)
    sparkHole.updateMatrix()

    let result = CSG.subtract(head, chamber)
    result = CSG.subtract(result, sparkHole)
    return result.geometry
  }, [bore])

  // Large cooling fins for air-cooled character
  const finCount = 14

  return (
    <group ref={group} position={position}>
      {/* Crankcase - with bolt holes (CSG) */}
      <mesh geometry={crankcaseCSG}>
        <meshStandardMaterial color={ENGINE_COLOR} roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Lower sump - larger for 350cc */}
      <mesh position={[0, -0.13, 0]}>
        <boxGeometry args={[0.26, 0.055, 0.24]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Sump drain bolt */}
      <mesh position={[0, -0.16, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.01, 6]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Cylinder barrel - hollow bore (CSG) - slightly forward tilted */}
      <group position={[0.03, 0.20, 0]} rotation={[0, 0, 0.10]}>
        <mesh geometry={cylinderCSG}>
          <meshStandardMaterial color="#4a4a4a" roughness={0.45} metalness={0.65} />
        </mesh>

        {/* LARGE cooling fins - air-cooled classic look (RE signature) */}
        {Array.from({ length: finCount }).map((_, i) => {
          const t = i / (finCount - 1)
          const finWidth = cylinderOD + 0.035 + Math.sin(t * Math.PI) * 0.020
          return (
            <mesh key={i} position={[0, -0.035 + i * (stroke / finCount), 0]}>
              <boxGeometry args={[finWidth, 0.0025, finWidth]} />
              <meshStandardMaterial color={FIN_COLOR} roughness={0.4} metalness={0.6} />
            </mesh>
          )
        })}

        {/* Cylinder head - with combustion chamber (CSG) */}
        <mesh geometry={headCSG} position={[0, 0.07, 0]}>
          <meshStandardMaterial color="#4a4a4a" roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Head fins (larger, more prominent) */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={`hf-${i}`} position={[0, 0.05 + i * 0.008, 0]}>
            <boxGeometry args={[cylinderOD + 0.04 - i * 0.004, 0.002, cylinderOD + 0.04 - i * 0.004]} />
            <meshStandardMaterial color={FIN_COLOR} roughness={0.4} metalness={0.6} />
          </mesh>
        ))}

        {/* Spark plug */}
        <group position={[0.05, 0.075, 0]} rotation={[0, 0, -0.35]}>
          <mesh>
            <cylinderGeometry args={[0.008, 0.008, 0.045, 8]} />
            <meshStandardMaterial color="#888" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.018, 0]}>
            <cylinderGeometry args={[0.010, 0.010, 0.012, 6]} />
            <meshStandardMaterial color="#aaa" roughness={0.25} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.032, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.018, 8]} />
            <meshStandardMaterial color="#ddd" roughness={0.8} metalness={0.1} />
          </mesh>
          {/* Spark plug wire */}
          <mesh position={[0, 0.045, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.03, 6]} />
            <meshStandardMaterial color="#222" roughness={0.9} metalness={0.05} />
          </mesh>
        </group>

        {/* Piston (animated) */}
        <mesh position={[0, pistonOffset, 0]}>
          <cylinderGeometry args={[bore / 2 - 0.003, bore / 2 - 0.003, 0.025, 16]} />
          <meshStandardMaterial color="#aaa" roughness={0.2} metalness={0.85} />
        </mesh>
        {/* Connecting rod */}
        <mesh position={[0, pistonOffset - 0.035, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.05, 6]} />
          <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Pushrod tubes - visible on RE engines (left side) */}
        <mesh position={[0.02, 0.02, -0.055]}>
          <cylinderGeometry args={[0.006, 0.006, 0.14, 8]} />
          <meshStandardMaterial {...CHROME} />
        </mesh>
        <mesh position={[-0.02, 0.02, -0.055]}>
          <cylinderGeometry args={[0.006, 0.006, 0.14, 8]} />
          <meshStandardMaterial {...CHROME} />
        </mesh>

        {/* Cam chain cover */}
        <mesh position={[0, 0.04, 0.065]}>
          <boxGeometry args={[0.045, 0.10, 0.012]} />
          <meshStandardMaterial color="#444" roughness={0.45} metalness={0.6} />
        </mesh>
      </group>

      {/* Right-side chrome engine cover - Royal Enfield signature */}
      <mesh position={[0.02, 0, 0.145]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.028, 32]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      {/* Inner circular detail on chrome cover */}
      <mesh position={[0.02, 0, 0.162]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.050, 0.050, 0.008, 24]} />
        <meshStandardMaterial color="#ccc" roughness={0.1} metalness={0.88} />
      </mesh>
      {/* RE branding area (raised boss) */}
      <mesh position={[0.02, 0.02, 0.168]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.005, 16]} />
        <meshStandardMaterial color="#bbb" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Left-side engine cover (alternator/stator) - also chrome */}
      <mesh position={[-0.01, -0.02, -0.145]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.028, 24]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      <mesh position={[-0.01, -0.02, -0.162]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.040, 0.040, 0.008, 16]} />
        <meshStandardMaterial color="#ccc" roughness={0.1} metalness={0.88} />
      </mesh>

      {/* Oil filter - classic external */}
      <mesh position={[0.12, -0.10, 0.08]} rotation={[0.3, 0, 0.4]}>
        <cylinderGeometry args={[0.025, 0.025, 0.06, 12]} />
        <meshStandardMaterial color="#222" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Gear shift lever - left side */}
      <group position={[-0.12, -0.12, -0.16]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.08, 6]} />
          <meshStandardMaterial color="#555" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, -0.045]}>
          <boxGeometry args={[0.04, 0.012, 0.018]} />
          <meshStandardMaterial color="#333" roughness={0.7} metalness={0.3} />
        </mesh>
      </group>

      {/* Kick starter - right side (Royal Enfield still has one!) */}
      <mesh position={[-0.05, -0.07, 0.16]} rotation={[Math.PI / 2, 0, 0.35]}>
        <cylinderGeometry args={[0.006, 0.006, 0.12, 6]} />
        <meshStandardMaterial color="#555" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Kick starter tip */}
      <mesh position={[-0.09, -0.11, 0.16]} rotation={[Math.PI / 2, 0, 0.35]}>
        <cylinderGeometry args={[0.010, 0.008, 0.03, 8]} />
        <meshStandardMaterial color="#333" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Engine mounting bolts (chrome) */}
      {[
        [0.14, 0.07, 0.14],
        [0.14, 0.07, -0.14],
        [-0.14, -0.07, 0.14],
        [-0.14, -0.07, -0.14],
      ].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.009, 0.009, 0.012, 6]} />
          <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
    </group>
  )
}
