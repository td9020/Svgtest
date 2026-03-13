import { useRef } from 'react'
import * as THREE from 'three'
import { SPECS, POS } from './dimensions'

// Suzuki Hayabusa GSX1300R: 43mm USD (upside-down) front forks (KYB)
// Clip-on handlebars (very low, sporty position)
// Integrated dual headlights in fairing
// TFT instrument cluster
// Aerodynamic mirrors integrated into fairing
// blinkOn and paintColor props from parent (no internal blink state)

export default function FrontFork({
  position = [0, 0, 0],
  forkCompression = 0,
  steeringAngle = 0,
  headlightOn = true,
  turnSignalsOn = false,
  blinkOn = false,
  paintColor = '#003DA5',
}) {
  const group = useRef()

  const forkAngle = 0.42  // ~24 degrees rake (sportier)
  const forkTubeOD = SPECS.forkDiameter / 2  // 43mm USD forks -> 21.5mm radius
  const forkSpacing = 0.075 // wider spacing for dual disc setup

  return (
    <group ref={group} position={position} rotation={[0, steeringAngle, 0]}>
      <group rotation={[0, 0, -forkAngle]}>
        {/* === USD Forks (Upside Down - gold/black lowers at top, chrome tubes slide in bottom) === */}

        {/* Left fork - upper tube (gold - USD outer tube is at top) */}
        <mesh position={[0, 0.16, -forkSpacing]}>
          <cylinderGeometry args={[forkTubeOD + 0.004, forkTubeOD + 0.004, 0.28, 12]} />
          <meshStandardMaterial color="#B8860B" roughness={0.20} metalness={0.80} />
        </mesh>

        {/* Left fork - lower inner tube (chrome) - slides with compression */}
        <mesh position={[0, -0.09 - forkCompression, -forkSpacing]}>
          <cylinderGeometry args={[forkTubeOD, forkTubeOD, 0.22, 12]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
        </mesh>

        {/* Right fork - upper tube (gold) */}
        <mesh position={[0, 0.16, forkSpacing]}>
          <cylinderGeometry args={[forkTubeOD + 0.004, forkTubeOD + 0.004, 0.28, 12]} />
          <meshStandardMaterial color="#B8860B" roughness={0.20} metalness={0.80} />
        </mesh>

        {/* Right fork - lower inner tube (chrome) */}
        <mesh position={[0, -0.09 - forkCompression, forkSpacing]}>
          <cylinderGeometry args={[forkTubeOD, forkTubeOD, 0.22, 12]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
        </mesh>

        {/* Fork dust seals */}
        {[-forkSpacing, forkSpacing].map((z, i) => (
          <mesh key={i} position={[0, 0.02, z]}>
            <cylinderGeometry args={[forkTubeOD + 0.006, forkTubeOD + 0.006, 0.018, 12]} />
            <meshStandardMaterial color="#222" roughness={0.9} metalness={0.05} />
          </mesh>
        ))}

        {/* Upper triple clamp */}
        <mesh position={[0, 0.29, 0]}>
          <boxGeometry args={[0.045, 0.020, forkSpacing * 2 + 0.05]} />
          <meshStandardMaterial color="#333" roughness={0.35} metalness={0.65} />
        </mesh>

        {/* Lower triple clamp */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[0.040, 0.018, forkSpacing * 2 + 0.04]} />
          <meshStandardMaterial color="#333" roughness={0.35} metalness={0.65} />
        </mesh>

        {/* Axle clamp at bottom */}
        <mesh position={[0, -0.20, 0]}>
          <boxGeometry args={[0.028, 0.025, forkSpacing * 2 + 0.03]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Front fender - color matched */}
        <mesh position={[0.02, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[SPECS.frontTireRadius - 0.01, SPECS.frontTireRadius - 0.01, 0.10, 16, 1, true, -0.8, 1.6]} />
          <meshStandardMaterial color={paintColor} roughness={0.20} metalness={0.30} side={THREE.DoubleSide} />
        </mesh>

        {/* Fender stays */}
        {[-forkSpacing + 0.01, forkSpacing - 0.01].map((z, i) => (
          <mesh key={`stay-${i}`} position={[0.01, -0.04, z]}>
            <boxGeometry args={[0.003, 0.12, 0.006]} />
            <meshStandardMaterial color="#555" roughness={0.4} metalness={0.5} />
          </mesh>
        ))}
      </group>

      {/* === CLIP-ON HANDLEBARS (very low, sporty) === */}
      <group position={[0.04, 0.38, 0]}>
        {/* Left clip-on bar */}
        <mesh position={[0.03, -0.01, -0.12]} rotation={[Math.PI / 2, 0, 0.15]}>
          <cylinderGeometry args={[0.010, 0.010, 0.18, 8]} />
          <meshStandardMaterial color="#333" roughness={0.45} metalness={0.45} />
        </mesh>

        {/* Right clip-on bar */}
        <mesh position={[0.03, -0.01, 0.12]} rotation={[Math.PI / 2, 0, -0.15]}>
          <cylinderGeometry args={[0.010, 0.010, 0.18, 8]} />
          <meshStandardMaterial color="#333" roughness={0.45} metalness={0.45} />
        </mesh>

        {/* Left grip */}
        <mesh position={[0.05, -0.02, -0.22]} rotation={[Math.PI / 2, 0, 0.15]}>
          <cylinderGeometry args={[0.014, 0.014, 0.08, 12]} />
          <meshStandardMaterial color="#111" roughness={0.92} metalness={0.03} />
        </mesh>

        {/* Right grip (throttle) */}
        <mesh position={[0.05, -0.02, 0.22]} rotation={[Math.PI / 2, 0, -0.15]}>
          <cylinderGeometry args={[0.014, 0.014, 0.08, 12]} />
          <meshStandardMaterial color="#111" roughness={0.92} metalness={0.03} />
        </mesh>

        {/* Left lever (clutch) */}
        <mesh position={[0.08, -0.03, -0.19]} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[0.09, 0.005, 0.010]} />
          <meshStandardMaterial color="#888" roughness={0.25} metalness={0.75} />
        </mesh>

        {/* Right lever (brake) */}
        <mesh position={[0.08, -0.03, 0.19]} rotation={[0, -0.4, 0]}>
          <boxGeometry args={[0.09, 0.005, 0.010]} />
          <meshStandardMaterial color="#888" roughness={0.25} metalness={0.75} />
        </mesh>

        {/* Switch blocks */}
        {[-0.17, 0.17].map((z, i) => (
          <mesh key={i} position={[0.04, -0.005, z]}>
            <boxGeometry args={[0.028, 0.018, 0.028]} />
            <meshStandardMaterial color="#222" roughness={0.7} metalness={0.2} />
          </mesh>
        ))}

        {/* Brake master cylinder (right) */}
        <mesh position={[0.06, 0.005, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.010, 0.010, 0.04, 8]} />
          <meshStandardMaterial color="#333" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Clutch master cylinder (left) */}
        <mesh position={[0.06, 0.005, -0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.010, 0.010, 0.04, 8]} />
          <meshStandardMaterial color="#333" roughness={0.4} metalness={0.5} />
        </mesh>
      </group>

      {/* === INTEGRATED DUAL HEADLIGHTS (in fairing) === */}
      <group position={[0.20, 0.35, 0]}>
        {/* Left headlight */}
        <group position={[0, 0.02, -0.05]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.032, 16]} />
            <meshStandardMaterial
              color={headlightOn ? "#ffffee" : "#888"}
              roughness={0.04}
              metalness={0.1}
              emissive={headlightOn ? "#ffffcc" : "#000"}
              emissiveIntensity={headlightOn ? 0.5 : 0}
            />
          </mesh>
          {/* Headlight bezel */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[-0.002, 0, 0]}>
            <ringGeometry args={[0.028, 0.035, 16]} />
            <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} side={THREE.DoubleSide} />
          </mesh>
          {headlightOn && <pointLight position={[0.03, 0, 0]} intensity={0.15} distance={0.4} color="#ffffdd" />}
        </group>

        {/* Right headlight */}
        <group position={[0, 0.02, 0.05]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.032, 16]} />
            <meshStandardMaterial
              color={headlightOn ? "#ffffee" : "#888"}
              roughness={0.04}
              metalness={0.1}
              emissive={headlightOn ? "#ffffcc" : "#000"}
              emissiveIntensity={headlightOn ? 0.5 : 0}
            />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]} position={[-0.002, 0, 0]}>
            <ringGeometry args={[0.028, 0.035, 16]} />
            <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} side={THREE.DoubleSide} />
          </mesh>
          {headlightOn && <pointLight position={[0.03, 0, 0]} intensity={0.15} distance={0.4} color="#ffffdd" />}
        </group>

        {/* Position/DRL light (between headlights) */}
        <mesh position={[0.005, 0.04, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.06, 0.008, 0.004]} />
          <meshStandardMaterial
            color={headlightOn ? "#ccddff" : "#555"}
            emissive={headlightOn ? "#aaccff" : "#000"}
            emissiveIntensity={headlightOn ? 0.6 : 0}
          />
        </mesh>
      </group>

      {/* Front turn signals (integrated in fairing) */}
      {[-0.12, 0.12].map((z, i) => (
        <mesh key={i} position={[0.16, 0.30, z]}>
          <boxGeometry args={[0.015, 0.010, 0.025]} />
          <meshStandardMaterial
            color={turnSignalsOn && blinkOn ? "#ffaa00" : "#ff8800"}
            roughness={0.3}
            emissive={turnSignalsOn && blinkOn ? "#ffaa00" : "#ff6600"}
            emissiveIntensity={turnSignalsOn && blinkOn ? 1.2 : 0.25}
          />
        </mesh>
      ))}

      {/* === AERODYNAMIC MIRRORS (integrated into fairing) === */}
      {/* Left mirror */}
      <group position={[0.10, 0.40, -0.18]}>
        <mesh position={[0, 0.02, -0.02]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.04, 0.008, 0.04]} />
          <meshStandardMaterial color="#222" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.028, -0.025]} rotation={[0.5, 0, 0]}>
          <planeGeometry args={[0.035, 0.020]} />
          <meshStandardMaterial color="#aaddff" roughness={0.03} metalness={0.92} />
        </mesh>
        {/* Mirror stalk */}
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <boxGeometry args={[0.012, 0.006, 0.035]} />
          <meshStandardMaterial color="#333" roughness={0.4} metalness={0.5} />
        </mesh>
      </group>

      {/* Right mirror */}
      <group position={[0.10, 0.40, 0.18]}>
        <mesh position={[0, 0.02, 0.02]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.04, 0.008, 0.04]} />
          <meshStandardMaterial color="#222" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.028, 0.025]} rotation={[-0.5, 0, 0]}>
          <planeGeometry args={[0.035, 0.020]} />
          <meshStandardMaterial color="#aaddff" roughness={0.03} metalness={0.92} />
        </mesh>
        <mesh rotation={[-Math.PI / 4, 0, 0]}>
          <boxGeometry args={[0.012, 0.006, 0.035]} />
          <meshStandardMaterial color="#333" roughness={0.4} metalness={0.5} />
        </mesh>
      </group>

      {/* === TFT INSTRUMENT CLUSTER === */}
      <group position={[0.12, 0.44, 0]}>
        {/* TFT screen housing */}
        <mesh rotation={[0.55, 0, 0]}>
          <boxGeometry args={[0.10, 0.06, 0.018]} />
          <meshStandardMaterial color="#111" roughness={0.7} metalness={0.3} />
        </mesh>
        {/* TFT screen face */}
        <mesh position={[0, 0.006, 0.006]} rotation={[0.55, 0, 0]}>
          <planeGeometry args={[0.088, 0.048]} />
          <meshStandardMaterial color="#0a1520" roughness={0.05} metalness={0.3}
            emissive="#002244" emissiveIntensity={headlightOn ? 0.15 : 0} />
        </mesh>
        {/* Speed readout simulation */}
        <mesh position={[0.02, 0.009, 0.009]} rotation={[0.55, 0, 0]}>
          <planeGeometry args={[0.025, 0.020]} />
          <meshStandardMaterial color="#00ff88" roughness={0.1}
            emissive="#00ff88" emissiveIntensity={headlightOn ? 0.3 : 0} transparent opacity={0.8} />
        </mesh>
        {/* RPM bar */}
        <mesh position={[-0.02, 0.009, 0.009]} rotation={[0.55, 0, 0]}>
          <planeGeometry args={[0.035, 0.008]} />
          <meshStandardMaterial color="#ff4444" roughness={0.1}
            emissive="#ff4444" emissiveIntensity={headlightOn ? 0.2 : 0} transparent opacity={0.7} />
        </mesh>
      </group>
    </group>
  )
}
