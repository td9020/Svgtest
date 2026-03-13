import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { SPECS } from './dimensions'

// Royal Enfield Classic 350: Wide, comfortable single-piece seat
// Brown leather look (classic sprung style)
// Chrome grab rail behind pillion
// Visible classic springs underneath

const LEATHER_BROWN = '#6B3A2A'

export default function Seat({ position = [0, 0, 0] }) {
  const group = useRef()

  const seatGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    // Wide single-piece seat profile - classic style
    shape.moveTo(0.20, 0)
    shape.quadraticCurveTo(0.20, 0.050, 0.14, 0.055)
    shape.lineTo(0.00, 0.058)        // rider section - wider, flatter
    shape.quadraticCurveTo(-0.06, 0.055, -0.10, 0.052)
    shape.lineTo(-0.24, 0.045)       // pillion section
    shape.quadraticCurveTo(-0.32, 0.038, -0.32, 0)
    shape.quadraticCurveTo(-0.32, -0.018, -0.24, -0.018)
    shape.lineTo(0.14, -0.018)
    shape.quadraticCurveTo(0.20, -0.018, 0.20, 0)

    const extrudeSettings = {
      steps: 1,
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.030,
      bevelSegments: 6,
    }
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  return (
    <group ref={group} position={position}>
      {/* Main seat - brown leather */}
      <mesh geometry={seatGeometry} position={[0, 0, -0.11]}>
        <meshStandardMaterial color={LEATHER_BROWN} roughness={0.82} metalness={0.05} />
      </mesh>

      {/* Seat stitching lines (classic diamond pattern hint) */}
      {[-0.06, 0, 0.06].map((x, i) => (
        <mesh key={i} position={[x, 0.060, 0]}>
          <boxGeometry args={[0.28, 0.001, 0.004]} />
          <meshStandardMaterial color="#4a2a1a" roughness={0.95} />
        </mesh>
      ))}

      {/* Cross stitching */}
      {[-0.08, 0.04, 0.16].map((x, i) => (
        <mesh key={`cs-${i}`} position={[x, 0.061, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.15, 0.001, 0.004]} />
          <meshStandardMaterial color="#4a2a1a" roughness={0.95} />
        </mesh>
      ))}

      {/* Piping along edge (brown contrast) */}
      <mesh position={[0.0, 0.040, 0.14]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.48, 0.006, 0.006]} />
        <meshStandardMaterial color="#4a2518" roughness={0.85} metalness={0.05} />
      </mesh>
      <mesh position={[0.0, 0.040, -0.14]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.48, 0.006, 0.006]} />
        <meshStandardMaterial color="#4a2518" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Visible classic springs underneath (RE signature) */}
      {[-0.06, 0.06].map((z, i) => (
        <group key={`spring-${i}`} position={[-0.06, -0.03, z]}>
          {Array.from({ length: 6 }).map((_, j) => (
            <mesh key={j} position={[0, -j * 0.008, 0]}>
              <torusGeometry args={[0.015, 0.002, 6, 12]} />
              <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.88} />
            </mesh>
          ))}
          {/* Spring mount bracket */}
          <mesh position={[0, -0.055, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.02, 6]} />
            <meshStandardMaterial color="#444" roughness={0.4} metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Chrome grab rail behind pillion */}
      <group position={[-0.28, 0.025, 0]}>
        {/* Left post */}
        <mesh position={[0, 0, -0.10]}>
          <cylinderGeometry args={[0.008, 0.008, 0.055, 8]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
        </mesh>
        {/* Right post */}
        <mesh position={[0, 0, 0.10]}>
          <cylinderGeometry args={[0.008, 0.008, 0.055, 8]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
        </mesh>
        {/* Cross bar (chrome) */}
        <mesh position={[0, 0.035, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.20, 8]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
        </mesh>
      </group>

      {/* Seat base / pan */}
      <mesh position={[-0.04, -0.025, 0]}>
        <boxGeometry args={[0.46, 0.008, 0.20]} />
        <meshStandardMaterial color="#222" roughness={0.6} metalness={0.3} />
      </mesh>
    </group>
  )
}
