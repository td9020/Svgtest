import { useRef } from 'react'
import * as THREE from 'three'

export default function TailSection({ position = [0, 0, 0] }) {
  const group = useRef()

  return (
    <group ref={group} position={position}>
      {/* Rear fender */}
      <mesh position={[0, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.11, 16, 1, true, Math.PI + 0.3, 1.8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Tail cowl */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.12, 0.06, 0.14]} />
        <meshStandardMaterial color="#cc0000" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Tail light housing */}
      <mesh position={[-0.07, 0.18, 0]}>
        <boxGeometry args={[0.03, 0.04, 0.1]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Tail light lens */}
      <mesh position={[-0.088, 0.18, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.09, 0.035]} />
        <meshStandardMaterial
          color="#ff0000"
          roughness={0.2}
          metalness={0.1}
          emissive="#ff0000"
          emissiveIntensity={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Rear turn signals */}
      <mesh position={[-0.06, 0.16, -0.08]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#ff8800" roughness={0.3} emissive="#ff6600" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[-0.06, 0.16, 0.08]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#ff8800" roughness={0.3} emissive="#ff6600" emissiveIntensity={0.2} />
      </mesh>

      {/* License plate bracket */}
      <mesh position={[-0.09, 0.08, 0]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.005, 0.06, 0.05]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* License plate */}
      <mesh position={[-0.1, 0.05, 0]} rotation={[0, Math.PI / 2, 0.3]}>
        <planeGeometry args={[0.06, 0.04]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Rear shock absorber */}
      <group position={[0.04, 0.1, 0.06]}>
        {/* Shock body */}
        <mesh rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.18, 8]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.5} />
        </mesh>
        {/* Spring */}
        <mesh rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.12, 8]} />
          <meshStandardMaterial color="#daa520" roughness={0.3} metalness={0.6} />
        </mesh>
      </group>

      {/* Rear shock - left side */}
      <group position={[0.04, 0.1, -0.06]}>
        <mesh rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.18, 8]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.12, 8]} />
          <meshStandardMaterial color="#daa520" roughness={0.3} metalness={0.6} />
        </mesh>
      </group>

      {/* Chain sprocket */}
      <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.01, 24]} />
        <meshStandardMaterial color="#555" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.085]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.03, 0.05, 24]} />
        <meshStandardMaterial color="#666" roughness={0.35} metalness={0.65} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}
