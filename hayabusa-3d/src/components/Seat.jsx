import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { SPECS } from './dimensions'

// Suzuki Hayabusa GSX1300R: Sportbike seat
// Narrow front, high tail section
// Integrated tail section design
// Pillion seat with grab handles
// Under-seat storage area

export default function Seat({ position = [0, 0, 0] }) {
  const group = useRef()

  const seatGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    // Side profile of seat - sportbike style (narrow, high tail)
    shape.moveTo(0.20, 0)
    shape.quadraticCurveTo(0.20, 0.040, 0.14, 0.042)
    shape.lineTo(0.02, 0.045)         // rider section
    shape.quadraticCurveTo(-0.04, 0.038, -0.08, 0.036) // dip
    shape.lineTo(-0.18, 0.032)        // pillion section
    shape.quadraticCurveTo(-0.28, 0.028, -0.32, 0.015)
    shape.quadraticCurveTo(-0.34, 0, -0.32, -0.012)
    shape.lineTo(0.14, -0.012)
    shape.quadraticCurveTo(0.20, -0.012, 0.20, 0)

    return new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: 0.20,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.022,
      bevelSegments: 6,
    })
  }, [])

  return (
    <group ref={group} position={position}>
      {/* Main seat body */}
      <mesh geometry={seatGeometry} position={[0, 0, -0.10]}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.88} metalness={0.03} />
      </mesh>

      {/* Seat stitching/seam lines */}
      {[-0.05, 0.05].map((x, i) => (
        <mesh key={i} position={[x, 0.046, 0]}>
          <boxGeometry args={[0.30, 0.001, 0.003]} />
          <meshStandardMaterial color="#333" roughness={0.95} />
        </mesh>
      ))}

      {/* Center seam */}
      <mesh position={[0, 0.047, 0]}>
        <boxGeometry args={[0.001, 0.001, 0.16]} />
        <meshStandardMaterial color="#333" roughness={0.95} />
      </mesh>

      {/* Grab handles (integrated into tail) */}
      <group position={[-0.26, 0.015, 0]}>
        {/* Left handle post */}
        <mesh position={[0, 0, -0.08]}>
          <cylinderGeometry args={[0.006, 0.006, 0.04, 8]} />
          <meshStandardMaterial color="#888" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Right handle post */}
        <mesh position={[0, 0, 0.08]}>
          <cylinderGeometry args={[0.006, 0.006, 0.04, 8]} />
          <meshStandardMaterial color="#888" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Cross bar */}
        <mesh position={[0, 0.025, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.16, 8]} />
          <meshStandardMaterial color="#888" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>

      {/* Seat base / pan */}
      <mesh position={[-0.04, -0.018, 0]}>
        <boxGeometry args={[0.48, 0.006, 0.19]} />
        <meshStandardMaterial color="#222" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Under-seat storage area (simplified) */}
      <mesh position={[-0.12, -0.04, 0]}>
        <boxGeometry args={[0.15, 0.03, 0.14]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.2} />
      </mesh>
    </group>
  )
}
