import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { SPECS } from './dimensions'

// Honda Unicorn 150: Seat height 798mm
// Split seat design with rider and pillion sections

export default function Seat({ position = [0, 0, 0] }) {
  const group = useRef()

  const seatGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    // Side profile of seat - rider + pillion
    shape.moveTo(0.18, 0)
    shape.quadraticCurveTo(0.18, 0.045, 0.12, 0.048)
    shape.lineTo(-0.02, 0.05)        // rider section flat
    shape.quadraticCurveTo(-0.08, 0.042, -0.12, 0.04)  // dip between rider/pillion
    shape.lineTo(-0.22, 0.035)       // pillion section
    shape.quadraticCurveTo(-0.30, 0.03, -0.30, 0)
    shape.quadraticCurveTo(-0.30, -0.015, -0.22, -0.015)
    shape.lineTo(0.12, -0.015)
    shape.quadraticCurveTo(0.18, -0.015, 0.18, 0)

    const extrudeSettings = {
      steps: 1,
      depth: 0.19,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.025,
      bevelSegments: 6,
    }
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  return (
    <group ref={group} position={position}>
      {/* Main seat */}
      <mesh geometry={seatGeometry} position={[0, 0, -0.095]}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.88} metalness={0.03} />
      </mesh>

      {/* Seat stitching lines */}
      {[-0.05, 0.05].map((x, i) => (
        <mesh key={i} position={[x, 0.052, 0]}>
          <boxGeometry args={[0.25, 0.001, 0.003]} />
          <meshStandardMaterial color="#333" roughness={0.95} />
        </mesh>
      ))}

      {/* Grab rail */}
      <group position={[-0.24, 0.02, 0]}>
        {/* Left post */}
        <mesh position={[0, 0, -0.09]}>
          <cylinderGeometry args={[0.007, 0.007, 0.05, 8]} />
          <meshStandardMaterial color="#888" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Right post */}
        <mesh position={[0, 0, 0.09]}>
          <cylinderGeometry args={[0.007, 0.007, 0.05, 8]} />
          <meshStandardMaterial color="#888" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Cross bar */}
        <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.18, 8]} />
          <meshStandardMaterial color="#888" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>

      {/* Seat base / pan */}
      <mesh position={[-0.04, -0.02, 0]}>
        <boxGeometry args={[0.42, 0.008, 0.18]} />
        <meshStandardMaterial color="#222" roughness={0.6} metalness={0.3} />
      </mesh>
    </group>
  )
}
