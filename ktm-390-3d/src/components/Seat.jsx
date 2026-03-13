import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { SPECS } from './dimensions'

// KTM 390 Duke: Split seat design
// Aggressive sharp tail
// Orange tail cowl
// Exposed rear subframe section

const KTM_ORANGE = '#FF6600'

export default function Seat({ position = [0, 0, 0] }) {
  const group = useRef()

  // Rider seat - more aggressive shape than Honda
  const riderSeatGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    // Side profile of rider seat
    shape.moveTo(0.15, 0)
    shape.quadraticCurveTo(0.15, 0.04, 0.10, 0.045)
    shape.lineTo(-0.04, 0.048)        // flat rider section
    shape.quadraticCurveTo(-0.10, 0.035, -0.12, 0.02)
    shape.lineTo(-0.12, -0.012)
    shape.lineTo(0.10, -0.012)
    shape.quadraticCurveTo(0.15, -0.012, 0.15, 0)

    const extrudeSettings = {
      steps: 1,
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.02,
      bevelSegments: 4,
    }
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  // Pillion seat - smaller, narrower
  const pillionSeatGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0.06, 0)
    shape.quadraticCurveTo(0.06, 0.03, 0.03, 0.032)
    shape.lineTo(-0.06, 0.025)
    shape.quadraticCurveTo(-0.08, 0.015, -0.08, 0)
    shape.lineTo(-0.08, -0.01)
    shape.lineTo(0.04, -0.01)
    shape.quadraticCurveTo(0.06, -0.01, 0.06, 0)

    const extrudeSettings = {
      steps: 1,
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.015,
      bevelSegments: 3,
    }
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  return (
    <group ref={group} position={position}>
      {/* Rider seat */}
      <mesh geometry={riderSeatGeometry} position={[0, 0, -0.09]}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.88} metalness={0.03} />
      </mesh>

      {/* Pillion seat */}
      <mesh geometry={pillionSeatGeometry} position={[-0.18, -0.005, -0.07]}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.88} metalness={0.03} />
      </mesh>

      {/* Seat stitching lines */}
      {[-0.04, 0.04].map((x, i) => (
        <mesh key={i} position={[x, 0.05, 0]}>
          <boxGeometry args={[0.20, 0.001, 0.003]} />
          <meshStandardMaterial color="#333" roughness={0.95} />
        </mesh>
      ))}

      {/* Sharp tail cowl - ORANGE (KTM signature) */}
      <group position={[-0.26, 0.01, 0]}>
        {/* Main tail cowl */}
        <mesh>
          <boxGeometry args={[0.10, 0.04, 0.12]} />
          <meshStandardMaterial
            color={KTM_ORANGE}
            roughness={0.12}
            metalness={0.45}
            clearcoat={0.8}
            clearcoatRoughness={0.05}
          />
        </mesh>

        {/* Tail cowl taper */}
        <mesh position={[-0.06, -0.005, 0]}>
          <boxGeometry args={[0.04, 0.03, 0.08]} />
          <meshStandardMaterial
            color={KTM_ORANGE}
            roughness={0.12}
            metalness={0.45}
          />
        </mesh>

        {/* Angular crease on tail cowl */}
        <mesh position={[0, 0.021, 0]}>
          <boxGeometry args={[0.09, 0.002, 0.08]} />
          <meshStandardMaterial color="#CC5500" roughness={0.15} metalness={0.5} />
        </mesh>
      </group>

      {/* Seat base / pan */}
      <mesh position={[-0.06, -0.02, 0]}>
        <boxGeometry args={[0.40, 0.008, 0.17]} />
        <meshStandardMaterial color="#222" roughness={0.6} metalness={0.3} />
      </mesh>
    </group>
  )
}
