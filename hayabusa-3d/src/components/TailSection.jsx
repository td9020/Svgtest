import { useRef } from 'react'
import * as THREE from 'three'
import { SPECS, POS } from './dimensions'

// Suzuki Hayabusa GSX1300R: Aerodynamic tail section
// Integrated LED tail light
// Aerodynamic tail cowl
// Short license plate bracket
// Integrated turn signals
// blinkOn and paintColor props from parent (no internal blink state)

export default function TailSection({
  position = [0, 0, 0],
  turnSignalsOn = false,
  headlightOn = true,
  blinkOn = false,
  paintColor = '#003DA5',
}) {
  const group = useRef()

  const rearTireR = SPECS.rearTireRadius

  return (
    <group ref={group} position={position}>
      {/* Rear fender */}
      <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[rearTireR + 0.018, rearTireR + 0.018, 0.14, 16, 1, true, Math.PI + 0.3, 1.5]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.55} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner fender */}
      <mesh position={[0.02, rearTireR + 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[rearTireR + 0.025, rearTireR + 0.025, 0.10, 12, 1, true, Math.PI + 0.5, 1.0]} />
        <meshStandardMaterial color="#222" roughness={0.6} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Tail cowl / aerodynamic body panel */}
      <mesh position={[0.02, rearTireR + 0.16, 0]}>
        <boxGeometry args={[0.16, 0.065, 0.16]} />
        <meshStandardMaterial
          color={paintColor}
          roughness={0.10}
          metalness={0.35}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
        />
      </mesh>

      {/* Tail cowl upper (tapered) */}
      <mesh position={[-0.05, rearTireR + 0.18, 0]}>
        <boxGeometry args={[0.08, 0.04, 0.13]} />
        <meshStandardMaterial
          color={paintColor}
          roughness={0.10}
          metalness={0.35}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
        />
      </mesh>

      {/* === INTEGRATED LED TAIL LIGHT === */}
      <mesh position={[-0.08, rearTireR + 0.16, 0]}>
        <boxGeometry args={[0.020, 0.040, 0.12]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Tail light lens (LED strip) */}
      <mesh position={[-0.092, rearTireR + 0.16, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.11, 0.035]} />
        <meshStandardMaterial
          color="#ff0000"
          roughness={0.15}
          metalness={0.08}
          emissive="#ff0000"
          emissiveIntensity={headlightOn ? 0.4 : 0.08}
          transparent
          opacity={0.90}
        />
      </mesh>

      {/* LED segments (detail) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`led-${i}`} position={[-0.094, rearTireR + 0.16, -0.045 + i * 0.013]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.008, 0.028]} />
          <meshStandardMaterial
            color="#ff2222"
            emissive="#ff0000"
            emissiveIntensity={headlightOn ? 0.6 : 0.1}
            transparent
            opacity={0.95}
          />
        </mesh>
      ))}

      {/* === INTEGRATED REAR TURN SIGNALS (in tail) === */}
      {[-0.065, 0.065].map((z, i) => (
        <mesh key={i} position={[-0.085, rearTireR + 0.145, z]}>
          <boxGeometry args={[0.012, 0.015, 0.020]} />
          <meshStandardMaterial
            color={turnSignalsOn && blinkOn ? "#ffaa00" : "#ff8800"}
            roughness={0.3}
            emissive={turnSignalsOn && blinkOn ? "#ffaa00" : "#ff6600"}
            emissiveIntensity={turnSignalsOn && blinkOn ? 1.2 : 0.2}
          />
        </mesh>
      ))}

      {/* === SHORT LICENSE PLATE BRACKET === */}
      <mesh position={[-0.09, rearTireR + 0.08, 0]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.005, 0.06, 0.05]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* License plate */}
      <mesh position={[-0.10, rearTireR + 0.04, 0]} rotation={[0, Math.PI / 2, 0.35]}>
        <planeGeometry args={[0.065, 0.045]} />
        <meshStandardMaterial color="#fff" roughness={0.85} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      {/* License plate light */}
      <mesh position={[-0.09, rearTireR + 0.065, 0]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.006, 0.006, 0.03]} />
        <meshStandardMaterial
          color="#ffffcc"
          emissive="#ffffcc"
          emissiveIntensity={headlightOn ? 0.3 : 0}
        />
      </mesh>

      {/* Reflector */}
      <mesh position={[-0.102, rearTireR + 0.015, 0]} rotation={[0, Math.PI / 2, 0.35]}>
        <circleGeometry args={[0.012, 8]} />
        <meshStandardMaterial color="#ff3300" roughness={0.3} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Rear hugger (close to tire) */}
      <mesh position={[0.05, rearTireR - 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[rearTireR + 0.005, rearTireR + 0.005, 0.13, 12, 1, true, Math.PI - 0.3, 0.8]} />
        <meshStandardMaterial color="#222" roughness={0.6} metalness={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}
