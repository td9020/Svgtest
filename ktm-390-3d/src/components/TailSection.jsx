import { useRef } from 'react'
import * as THREE from 'three'
import { SPECS } from './dimensions'

// KTM 390 Duke: Rear section
// LED tail light strip
// Short rear fender
// License plate on swingarm-mounted bracket
// Monoshock suspension

export default function TailSection({
  position = [0, 0, 0],
  turnSignalsOn = false,
  headlightOn = true,
  blinkOn = false,
  paintColor = '#FF6600',
}) {
  const group = useRef()

  const rearTireR = SPECS.rearTireRadius

  return (
    <group ref={group} position={position}>
      {/* Short rear fender - KTM style (minimal) */}
      <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[rearTireR + 0.015, rearTireR + 0.015, 0.10, 16, 1, true, Math.PI + 0.5, 1.3]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.55} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* LED tail light strip - KTM signature */}
      <mesh position={[-0.04, rearTireR + 0.16, 0]}>
        <boxGeometry args={[0.012, 0.015, 0.10]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* LED tail light lens - strip across rear */}
      <mesh position={[-0.048, rearTireR + 0.16, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.09, 0.013]} />
        <meshStandardMaterial
          color="#ff0000"
          roughness={0.15}
          metalness={0.08}
          emissive="#ff0000"
          emissiveIntensity={headlightOn ? 0.45 : 0.08}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Additional LED strip elements */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`led-${i}`} position={[-0.049, rearTireR + 0.16, -0.035 + i * 0.01]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.003, 6]} />
          <meshStandardMaterial
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={headlightOn ? 0.6 : 0.05}
          />
        </mesh>
      ))}

      {/* Rear turn signals - compact LED (blink when active) */}
      {[-0.065, 0.065].map((z, i) => (
        <mesh key={i} position={[-0.03, rearTireR + 0.13, z]}>
          <boxGeometry args={[0.012, 0.008, 0.018]} />
          <meshStandardMaterial
            color={turnSignalsOn && blinkOn ? "#ffaa00" : "#ff8800"}
            roughness={0.3}
            emissive={turnSignalsOn && blinkOn ? "#ffaa00" : "#ff6600"}
            emissiveIntensity={turnSignalsOn && blinkOn ? 1.2 : 0.2}
          />
        </mesh>
      ))}

      {/* License plate bracket - swingarm mounted (KTM style) */}
      <group position={[-0.06, rearTireR - 0.10, 0.08]}>
        {/* Bracket arm */}
        <mesh rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.005, 0.18, 0.015]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.4} />
        </mesh>

        {/* License plate */}
        <mesh position={[-0.06, -0.06, 0]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.002, 0.05, 0.08]} />
          <meshStandardMaterial color="#fff" roughness={0.85} metalness={0} side={THREE.DoubleSide} />
        </mesh>

        {/* License plate light */}
        <mesh position={[-0.04, -0.03, 0]}>
          <boxGeometry args={[0.008, 0.006, 0.02]} />
          <meshStandardMaterial
            color="#ffffee"
            emissive="#ffffcc"
            emissiveIntensity={headlightOn ? 0.3 : 0}
          />
        </mesh>
      </group>

      {/* Reflector */}
      <mesh position={[-0.05, rearTireR + 0.10, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.012, 8]} />
        <meshStandardMaterial color="#ff3300" roughness={0.3} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* WP Monoshock absorber */}
      <group position={[0.10, rearTireR + 0.06, 0]}>
        {/* Shock body */}
        <mesh rotation={[0, 0, 0.20]}>
          <cylinderGeometry args={[0.016, 0.016, 0.24, 8]} />
          <meshStandardMaterial color="#222" roughness={0.5} metalness={0.5} />
        </mesh>
        {/* Spring (orange - KTM typical) */}
        <mesh rotation={[0, 0, 0.20]}>
          <cylinderGeometry args={[0.024, 0.024, 0.16, 8]} />
          <meshStandardMaterial color={paintColor} roughness={0.25} metalness={0.65} />
        </mesh>
        {/* Preload adjuster */}
        <mesh position={[0.02, 0.10, 0]} rotation={[0, 0, 0.20]}>
          <cylinderGeometry args={[0.018, 0.018, 0.025, 12]} />
          <meshStandardMaterial color={paintColor} roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Reservoir */}
        <mesh position={[0.025, 0.05, 0.03]} rotation={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.012, 0.012, 0.065, 8]} />
          <meshStandardMaterial color="#222" roughness={0.5} metalness={0.5} />
        </mesh>
      </group>

      {/* Chain sprocket */}
      <group position={[0, 0, 0.08]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.008, 32]} />
          <meshStandardMaterial color="#555" roughness={0.35} metalness={0.65} />
        </mesh>
        {/* Sprocket teeth */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.055, 0.004, 6, 40]} />
          <meshStandardMaterial color="#666" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Sprocket holes */}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2
          const r = 0.035
          return (
            <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, 0.008]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.008, 8]} />
              <meshStandardMaterial color="#333" side={THREE.DoubleSide} />
            </mesh>
          )
        })}
      </group>

      {/* Chain - simplified */}
      <mesh position={[0.14, -0.05, 0.083]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.30, 0.012, 0.008]} />
        <meshStandardMaterial color="#444" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0.14, -0.08, 0.083]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.30, 0.012, 0.008]} />
        <meshStandardMaterial color="#444" roughness={0.6} metalness={0.4} />
      </mesh>
    </group>
  )
}
