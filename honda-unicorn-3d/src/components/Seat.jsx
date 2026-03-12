import { useRef, useMemo } from 'react'
import * as THREE from 'three'

export default function Seat({ position = [0, 0, 0] }) {
  const group = useRef()

  const seatGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    // Seat profile from side - rider section to pillion
    shape.moveTo(0.15, 0)
    shape.quadraticCurveTo(0.15, 0.04, 0.1, 0.04)
    shape.lineTo(-0.22, 0.035)
    shape.quadraticCurveTo(-0.28, 0.03, -0.28, 0)
    shape.quadraticCurveTo(-0.28, -0.01, -0.22, -0.01)
    shape.lineTo(0.1, -0.01)
    shape.quadraticCurveTo(0.15, -0.01, 0.15, 0)

    const extrudeSettings = {
      steps: 1,
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 5,
    }
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  return (
    <group ref={group} position={position}>
      {/* Main seat */}
      <mesh geometry={seatGeometry} position={[0, 0, -0.09]}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Seat stitching line */}
      <mesh position={[0, 0.045, 0]}>
        <boxGeometry args={[0.3, 0.002, 0.005]} />
        <meshStandardMaterial color="#333" roughness={0.9} metalness={0} />
      </mesh>

      {/* Grab rail - left */}
      <group position={[-0.2, 0.02, 0]}>
        <mesh position={[0, 0, -0.1]}>
          <cylinderGeometry args={[0.008, 0.008, 0.06, 8]} />
          <meshStandardMaterial color="#888" roughness={0.25} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.008, 0.008, 0.06, 8]} />
          <meshStandardMaterial color="#888" roughness={0.25} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.2, 8]} />
          <meshStandardMaterial color="#888" roughness={0.25} metalness={0.8} />
        </mesh>
      </group>
    </group>
  )
}
