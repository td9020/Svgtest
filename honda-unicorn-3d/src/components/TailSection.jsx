import { useRef } from 'react'
import * as THREE from 'three'
import { SPECS, POS } from './dimensions'

// Honda Unicorn 150: Rear section
// Monoshock suspension, rear drum brake
// Rear tire: 100/90-18

export default function TailSection({ position = [0, 0, 0] }) {
  const group = useRef()
  const rearTireR = SPECS.rearTireRadius

  return (
    <group ref={group} position={position}>
      {/* Rear fender */}
      <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[rearTireR + 0.015, rearTireR + 0.015, 0.10, 16, 1, true, Math.PI + 0.4, 1.6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.55} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Tail cowl / body panel */}
      <mesh position={[0.02, rearTireR + 0.15, 0]}>
        <boxGeometry args={[0.13, 0.055, 0.14]} />
        <meshStandardMaterial color="#cc0000" roughness={0.18} metalness={0.35} />
      </mesh>

      {/* Tail light housing */}
      <mesh position={[-0.05, rearTireR + 0.15, 0]}>
        <boxGeometry args={[0.025, 0.035, 0.10]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Tail light lens */}
      <mesh position={[-0.065, rearTireR + 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.09, 0.032]} />
        <meshStandardMaterial
          color="#ff0000"
          roughness={0.18}
          metalness={0.08}
          emissive="#ff0000"
          emissiveIntensity={0.35}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Rear turn signals */}
      {[-0.075, 0.075].map((z, i) => (
        <mesh key={i} position={[-0.04, rearTireR + 0.12, z]}>
          <sphereGeometry args={[0.011, 8, 8]} />
          <meshStandardMaterial color="#ff8800" roughness={0.3} emissive="#ff6600" emissiveIntensity={0.2} />
        </mesh>
      ))}

      {/* License plate bracket */}
      <mesh position={[-0.07, rearTireR + 0.06, 0]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.004, 0.06, 0.04]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* License plate */}
      <mesh position={[-0.08, rearTireR + 0.03, 0]} rotation={[0, Math.PI / 2, 0.3]}>
        <planeGeometry args={[0.06, 0.04]} />
        <meshStandardMaterial color="#fff" roughness={0.85} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Reflector */}
      <mesh position={[-0.082, rearTireR + 0.01, 0]} rotation={[0, Math.PI / 2, 0.3]}>
        <circleGeometry args={[0.012, 8]} />
        <meshStandardMaterial color="#ff3300" roughness={0.3} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Monoshock absorber (single rear shock) */}
      <group position={[0.08, rearTireR + 0.06, 0]}>
        {/* Shock body */}
        <mesh rotation={[0, 0, 0.18]}>
          <cylinderGeometry args={[0.014, 0.014, 0.22, 8]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.5} />
        </mesh>
        {/* Spring (gold - Honda typical) */}
        <mesh rotation={[0, 0, 0.18]}>
          <cylinderGeometry args={[0.022, 0.022, 0.14, 8]} />
          <meshStandardMaterial color="#daa520" roughness={0.25} metalness={0.65} />
        </mesh>
        {/* Reservoir */}
        <mesh position={[0.02, 0.05, 0.025]} rotation={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.01, 0.01, 0.06, 8]} />
          <meshStandardMaterial color="#222" roughness={0.5} metalness={0.5} />
        </mesh>
      </group>

      {/* Chain sprocket */}
      <group position={[0, 0, 0.075]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.008, 32]} />
          <meshStandardMaterial color="#555" roughness={0.35} metalness={0.65} />
        </mesh>
        {/* Sprocket teeth (simplified) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.055, 0.004, 6, 40]} />
          <meshStandardMaterial color="#666" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Sprocket holes */}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2
          const r = 0.035
          return (
            <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, 0.078]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.008, 8]} />
              <meshStandardMaterial color="#333" side={THREE.DoubleSide} />
            </mesh>
          )
        })}
      </group>

      {/* Chain - simplified as a tube */}
      <mesh position={[0.14, -0.05, 0.078]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.30, 0.012, 0.008]} />
        <meshStandardMaterial color="#444" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0.14, -0.08, 0.078]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.30, 0.012, 0.008]} />
        <meshStandardMaterial color="#444" roughness={0.6} metalness={0.4} />
      </mesh>
    </group>
  )
}
