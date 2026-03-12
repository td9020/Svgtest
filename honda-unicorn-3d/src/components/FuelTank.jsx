import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'

const HONDA_RED = '#cc0000'
const TANK_CAP_COLOR = '#333'

export default function FuelTank({ position = [0, 0, 0] }) {
  const group = useRef()

  // Create tank shape using LatheGeometry for a smooth profile
  const tankGeometry = useMemo(() => {
    const points = []
    // Profile curve for the tank (half cross-section)
    points.push(new THREE.Vector2(0, -0.22))
    points.push(new THREE.Vector2(0.06, -0.2))
    points.push(new THREE.Vector2(0.1, -0.15))
    points.push(new THREE.Vector2(0.12, -0.08))
    points.push(new THREE.Vector2(0.13, 0))
    points.push(new THREE.Vector2(0.12, 0.08))
    points.push(new THREE.Vector2(0.1, 0.15))
    points.push(new THREE.Vector2(0.06, 0.2))
    points.push(new THREE.Vector2(0, 0.22))
    return new THREE.LatheGeometry(points, 32)
  }, [])

  return (
    <group ref={group} position={position} rotation={[0, 0, Math.PI / 2]}>
      {/* Main tank body */}
      <mesh geometry={tankGeometry} scale={[1, 1, 0.85]}>
        <meshStandardMaterial
          color={HONDA_RED}
          roughness={0.15}
          metalness={0.4}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Tank stripe - white accent line */}
      <mesh position={[0.01, 0, 0.105]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.015, 0.38]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.01, 0, -0.105]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.015, 0.38]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Honda text area - silver/chrome panel on side */}
      <mesh position={[0, 0.03, 0.115]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, 0.2]} />
        <meshStandardMaterial color="#ddd" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.03, -0.115]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, 0.2]} />
        <meshStandardMaterial color="#ddd" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Fuel cap */}
      <mesh position={[0.135, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.015, 16]} />
        <meshStandardMaterial color={TANK_CAP_COLOR} roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0.14, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.008, 16]} />
        <meshStandardMaterial color="#444" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Tank knee grips */}
      <mesh position={[0.02, -0.08, 0.12]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.04, 0.15, 0.01]} />
        <meshStandardMaterial color="#222" roughness={0.9} metalness={0.05} />
      </mesh>
      <mesh position={[0.02, -0.08, -0.12]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.04, 0.15, 0.01]} />
        <meshStandardMaterial color="#222" roughness={0.9} metalness={0.05} />
      </mesh>
    </group>
  )
}
