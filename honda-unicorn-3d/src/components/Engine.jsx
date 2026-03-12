import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { CSG } from 'three-csg-ts'
import { SPECS } from './dimensions'
import { useMultiCSG } from './CSGMesh'

// Honda Unicorn 150 engine:
// 149.1cc, single cylinder, 4-stroke, air-cooled
// Bore: 57.3mm, Stroke: 57.8mm
// 5-speed transmission

const ENGINE_COLOR = '#3a3a3a'
const FIN_COLOR = '#555'

export default function Engine({ position = [0, 0, 0] }) {
  const group = useRef()

  const bore = SPECS.bore         // 0.0573m
  const stroke = SPECS.stroke     // 0.0578m
  const cylinderOD = bore + 0.016 // cylinder wall thickness

  // CSG: Crankcase with bolt holes subtracted
  const crankcaseGeometry = useMemo(() => {
    const base = new THREE.BoxGeometry(0.26, 0.20, 0.22)
    const boltHole = new THREE.CylinderGeometry(0.004, 0.004, 0.3, 8)
    return { base, boltHole }
  }, [])

  const crankcaseCSG = useMultiCSG(crankcaseGeometry.base, [
    // Bolt holes along the crankcase split line
    { geometry: crankcaseGeometry.boltHole, transform: { position: [0.10, -0.08, 0], rotation: [Math.PI / 2, 0, 0] }, type: 'subtract' },
    { geometry: crankcaseGeometry.boltHole, transform: { position: [-0.10, -0.08, 0], rotation: [Math.PI / 2, 0, 0] }, type: 'subtract' },
    { geometry: crankcaseGeometry.boltHole, transform: { position: [0.10, 0.06, 0], rotation: [Math.PI / 2, 0, 0] }, type: 'subtract' },
    { geometry: crankcaseGeometry.boltHole, transform: { position: [-0.10, 0.06, 0], rotation: [Math.PI / 2, 0, 0] }, type: 'subtract' },
  ])

  // CSG: Cylinder with hollow bore
  const cylinderCSG = useMemo(() => {
    const outer = new THREE.Mesh(
      new THREE.CylinderGeometry(cylinderOD / 2, cylinderOD / 2, stroke + 0.06, 24),
      new THREE.MeshStandardMaterial()
    )
    const inner = new THREE.Mesh(
      new THREE.CylinderGeometry(bore / 2, bore / 2, stroke + 0.08, 24),
      new THREE.MeshStandardMaterial()
    )
    inner.updateMatrix()

    const result = CSG.subtract(outer, inner)
    return result.geometry
  }, [bore, stroke, cylinderOD])

  // CSG: Cylinder head with combustion chamber cavity and spark plug hole
  const headCSG = useMemo(() => {
    const head = new THREE.Mesh(
      new THREE.BoxGeometry(0.10, 0.05, 0.10),
      new THREE.MeshStandardMaterial()
    )
    // Combustion chamber - hemispherical
    const chamber = new THREE.Mesh(
      new THREE.SphereGeometry(bore / 2 - 0.003, 16, 16),
      new THREE.MeshStandardMaterial()
    )
    chamber.position.set(0, -0.02, 0)
    chamber.updateMatrix()

    // Spark plug hole
    const sparkHole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.06, 8),
      new THREE.MeshStandardMaterial()
    )
    sparkHole.position.set(0.02, 0.01, 0)
    sparkHole.rotation.set(0, 0, -0.4)
    sparkHole.updateMatrix()

    let result = CSG.subtract(head, chamber)
    result = CSG.subtract(result, sparkHole)
    return result.geometry
  }, [bore])

  const finCount = 10

  return (
    <group ref={group} position={position}>
      {/* Crankcase - with bolt holes (CSG) */}
      <mesh geometry={crankcaseCSG}>
        <meshStandardMaterial color={ENGINE_COLOR} roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Lower sump */}
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[0.22, 0.05, 0.20]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Cylinder barrel - hollow bore (CSG) */}
      <group position={[0.02, 0.17, 0]} rotation={[0, 0, 0.12]}>
        <mesh geometry={cylinderCSG}>
          <meshStandardMaterial color="#4a4a4a" roughness={0.45} metalness={0.65} />
        </mesh>

        {/* Cooling fins - real air-cooled look */}
        {Array.from({ length: finCount }).map((_, i) => {
          const finWidth = cylinderOD + 0.02 + (i < 5 ? i * 0.004 : (9 - i) * 0.004)
          return (
            <mesh key={i} position={[0, -0.03 + i * (stroke / finCount), 0]}>
              <boxGeometry args={[finWidth, 0.002, finWidth]} />
              <meshStandardMaterial color={FIN_COLOR} roughness={0.4} metalness={0.6} />
            </mesh>
          )
        })}

        {/* Cylinder head - with combustion chamber (CSG) */}
        <mesh geometry={headCSG} position={[0, 0.06, 0]}>
          <meshStandardMaterial color="#4a4a4a" roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Spark plug */}
        <group position={[0.04, 0.065, 0]} rotation={[0, 0, -0.4]}>
          <mesh>
            <cylinderGeometry args={[0.007, 0.007, 0.04, 8]} />
            <meshStandardMaterial color="#888" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Hex nut */}
          <mesh position={[0, 0.015, 0]}>
            <cylinderGeometry args={[0.009, 0.009, 0.01, 6]} />
            <meshStandardMaterial color="#aaa" roughness={0.25} metalness={0.8} />
          </mesh>
          {/* Ceramic insulator */}
          <mesh position={[0, 0.028, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.015, 8]} />
            <meshStandardMaterial color="#ddd" roughness={0.8} metalness={0.1} />
          </mesh>
        </group>

        {/* Cam chain cover */}
        <mesh position={[0, 0.04, 0.055]}>
          <boxGeometry args={[0.04, 0.08, 0.01]} />
          <meshStandardMaterial color="#444" roughness={0.45} metalness={0.6} />
        </mesh>
      </group>

      {/* Clutch cover - right side (with raised circular boss) */}
      <mesh position={[0.02, 0, 0.125]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.025, 24]} />
        <meshStandardMaterial color="#444" roughness={0.4} metalness={0.65} />
      </mesh>
      <mesh position={[0.02, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.008, 16]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.35} metalness={0.7} />
      </mesh>

      {/* Stator/alternator cover - left side */}
      <mesh position={[-0.01, -0.02, -0.125]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.065, 0.065, 0.025, 24]} />
        <meshStandardMaterial color="#444" roughness={0.4} metalness={0.65} />
      </mesh>

      {/* Oil filter */}
      <mesh position={[0.10, -0.08, 0.07]} rotation={[0.3, 0, 0.4]}>
        <cylinderGeometry args={[0.022, 0.022, 0.05, 12]} />
        <meshStandardMaterial color="#222" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Gear shift lever - left side */}
      <group position={[-0.10, -0.10, -0.14]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.07, 6]} />
          <meshStandardMaterial color="#555" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, -0.04]}>
          <boxGeometry args={[0.035, 0.01, 0.015]} />
          <meshStandardMaterial color="#333" roughness={0.7} metalness={0.3} />
        </mesh>
      </group>

      {/* Kick starter - right side */}
      <mesh position={[-0.04, -0.06, 0.14]} rotation={[Math.PI / 2, 0, 0.3]}>
        <cylinderGeometry args={[0.005, 0.005, 0.10, 6]} />
        <meshStandardMaterial color="#555" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Engine mounting bolts */}
      {[
        [0.12, 0.06, 0.12],
        [0.12, 0.06, -0.12],
        [-0.12, -0.06, 0.12],
        [-0.12, -0.06, -0.12],
      ].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.01, 6]} />
          <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
    </group>
  )
}
