import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SPECS, POS } from './dimensions'

// KTM 390 Duke: WP USD (upside-down) front forks
// 43mm fork diameter
// GOLD lower tubes, black upper (inverted from conventional)
// Clip-on handlebars (sportier, lower position)
// Split LED headlight design - KTM signature
// Bar-end mirrors

const GOLD = '#DAA520'
const USD_BLACK = '#1a1a1a'

export default function FrontFork({
  position = [0, 0, 0],
  forkCompression = 0,
  steeringAngle = 0,
  headlightOn = true,
  turnSignalsOn = false
}) {
  const group = useRef()
  const [blinkOn, setBlinkOn] = useState(false)

  useFrame(() => {
    if (turnSignalsOn) {
      setBlinkOn(Math.sin(Date.now() * 0.01) > 0)
    } else if (blinkOn) {
      setBlinkOn(false)
    }
  })

  const wb = SPECS.wheelbase
  const forkAngle = 0.42  // ~24 degrees rake (sportier than Honda)
  const forkTubeOD = SPECS.forkDiameter / 2  // 43mm / 2 = 21.5mm radius
  const forkSpacing = 0.075 // distance between fork legs

  return (
    <group ref={group} position={position} rotation={[0, steeringAngle, 0]}>
      <group rotation={[0, 0, -forkAngle]}>
        {/* === USD FORKS - GOLD lower tubes, BLACK upper === */}

        {/* Left fork - UPPER tube (BLACK on USD) */}
        <mesh position={[0, 0.18, -forkSpacing]}>
          <cylinderGeometry args={[forkTubeOD * 0.85, forkTubeOD * 0.85, 0.30, 12]} />
          <meshStandardMaterial color={USD_BLACK} roughness={0.5} metalness={0.4} />
        </mesh>

        {/* Left fork - LOWER tube (GOLD on USD) - slides with compression */}
        <mesh position={[0, -0.08 - forkCompression, -forkSpacing]}>
          <cylinderGeometry args={[forkTubeOD, forkTubeOD, 0.24, 12]} />
          <meshStandardMaterial color={GOLD} roughness={0.15} metalness={0.85} />
        </mesh>

        {/* Right fork - UPPER tube (BLACK on USD) */}
        <mesh position={[0, 0.18, forkSpacing]}>
          <cylinderGeometry args={[forkTubeOD * 0.85, forkTubeOD * 0.85, 0.30, 12]} />
          <meshStandardMaterial color={USD_BLACK} roughness={0.5} metalness={0.4} />
        </mesh>

        {/* Right fork - LOWER tube (GOLD on USD) - slides with compression */}
        <mesh position={[0, -0.08 - forkCompression, forkSpacing]}>
          <cylinderGeometry args={[forkTubeOD, forkTubeOD, 0.24, 12]} />
          <meshStandardMaterial color={GOLD} roughness={0.15} metalness={0.85} />
        </mesh>

        {/* Fork dust seals */}
        {[-forkSpacing, forkSpacing].map((z, i) => (
          <mesh key={i} position={[0, 0.035, z]}>
            <cylinderGeometry args={[forkTubeOD + 0.002, forkTubeOD + 0.002, 0.018, 12]} />
            <meshStandardMaterial color="#111" roughness={0.9} metalness={0.05} />
          </mesh>
        ))}

        {/* USD fork caps (top of gold tube) */}
        {[-forkSpacing, forkSpacing].map((z, i) => (
          <mesh key={`cap-${i}`} position={[0, 0.33, z]}>
            <cylinderGeometry args={[forkTubeOD * 0.88, forkTubeOD * 0.88, 0.012, 12]} />
            <meshStandardMaterial color="#FF6600" roughness={0.3} metalness={0.7} />
          </mesh>
        ))}

        {/* Upper triple clamp */}
        <mesh position={[0, 0.30, 0]}>
          <boxGeometry args={[0.045, 0.02, forkSpacing * 2 + 0.05]} />
          <meshStandardMaterial color="#222" roughness={0.35} metalness={0.65} />
        </mesh>

        {/* Lower triple clamp */}
        <mesh position={[0, 0.07, 0]}>
          <boxGeometry args={[0.04, 0.018, forkSpacing * 2 + 0.04]} />
          <meshStandardMaterial color="#222" roughness={0.35} metalness={0.65} />
        </mesh>

        {/* Axle clamp at bottom */}
        <mesh position={[0, -0.20, 0]}>
          <boxGeometry args={[0.028, 0.024, forkSpacing * 2 + 0.03]} />
          <meshStandardMaterial color="#333" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Front fender - dark/black (KTM style) */}
        <mesh position={[0.02, -0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[SPECS.frontTireRadius - 0.01, SPECS.frontTireRadius - 0.01, 0.10, 16, 1, true, -0.9, 1.8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.15} side={THREE.DoubleSide} />
        </mesh>

        {/* Fender stays */}
        {[-forkSpacing + 0.01, forkSpacing - 0.01].map((z, i) => (
          <mesh key={`fs-${i}`} position={[0.01, -0.03, z]}>
            <boxGeometry args={[0.003, 0.12, 0.006]} />
            <meshStandardMaterial color="#444" roughness={0.4} metalness={0.5} />
          </mesh>
        ))}
      </group>

      {/* === CLIP-ON HANDLEBARS (sportier, lower position) === */}
      <group position={[0.04, 0.38, 0]}>
        {/* Left clip-on */}
        <mesh position={[0, 0, -0.08]} rotation={[Math.PI / 2, 0.15, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 8]} />
          <meshStandardMaterial color="#222" roughness={0.45} metalness={0.55} />
        </mesh>

        {/* Right clip-on */}
        <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, -0.15, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 8]} />
          <meshStandardMaterial color="#222" roughness={0.45} metalness={0.55} />
        </mesh>

        {/* Left grip */}
        <mesh position={[0.01, 0, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.085, 12]} />
          <meshStandardMaterial color="#111" roughness={0.92} metalness={0.03} />
        </mesh>

        {/* Right grip (throttle) */}
        <mesh position={[0.01, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.085, 12]} />
          <meshStandardMaterial color="#111" roughness={0.92} metalness={0.03} />
        </mesh>

        {/* Left lever (clutch) */}
        <mesh position={[0.04, -0.01, -0.18]} rotation={[0, 0.35, 0]}>
          <boxGeometry args={[0.10, 0.005, 0.010]} />
          <meshStandardMaterial color="#888" roughness={0.25} metalness={0.75} />
        </mesh>

        {/* Right lever (brake) */}
        <mesh position={[0.04, -0.01, 0.18]} rotation={[0, -0.35, 0]}>
          <boxGeometry args={[0.10, 0.005, 0.010]} />
          <meshStandardMaterial color="#888" roughness={0.25} metalness={0.75} />
        </mesh>

        {/* Switch blocks */}
        {[-0.16, 0.16].map((z, i) => (
          <mesh key={i} position={[0.01, 0.005, z]}>
            <boxGeometry args={[0.028, 0.018, 0.028]} />
            <meshStandardMaterial color="#222" roughness={0.7} metalness={0.2} />
          </mesh>
        ))}

        {/* === BAR-END MIRRORS (KTM style) === */}
        {/* Left bar-end mirror */}
        <group position={[0, 0, -0.27]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.03, 8]} />
            <meshStandardMaterial color="#222" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0, -0.025]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.06, 0.003, 0.035]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.002, -0.025]} rotation={[0.3, 0, 0]}>
            <planeGeometry args={[0.055, 0.03]} />
            <meshStandardMaterial color="#aaddff" roughness={0.03} metalness={0.92} />
          </mesh>
        </group>

        {/* Right bar-end mirror */}
        <group position={[0, 0, 0.27]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.03, 8]} />
            <meshStandardMaterial color="#222" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.025]} rotation={[-0.3, 0, 0]}>
            <boxGeometry args={[0.06, 0.003, 0.035]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.002, 0.025]} rotation={[-0.3, 0, 0]}>
            <planeGeometry args={[0.055, 0.03]} />
            <meshStandardMaterial color="#aaddff" roughness={0.03} metalness={0.92} />
          </mesh>
        </group>
      </group>

      {/* === SPLIT LED HEADLIGHT - KTM signature dual headlights === */}
      <group position={[0.16, 0.33, 0]}>
        {/* Headlight housing - angular */}
        <mesh>
          <boxGeometry args={[0.06, 0.08, 0.16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.3} />
        </mesh>

        {/* Left LED unit */}
        <mesh position={[0.032, 0.005, -0.04]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.025, 16]} />
          <meshStandardMaterial
            color={headlightOn ? "#ffffee" : "#888"}
            roughness={0.04}
            metalness={0.1}
            emissive={headlightOn ? "#ffffcc" : "#000"}
            emissiveIntensity={headlightOn ? 0.5 : 0}
          />
        </mesh>

        {/* Right LED unit */}
        <mesh position={[0.032, 0.005, 0.04]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.025, 16]} />
          <meshStandardMaterial
            color={headlightOn ? "#ffffee" : "#888"}
            roughness={0.04}
            metalness={0.1}
            emissive={headlightOn ? "#ffffcc" : "#000"}
            emissiveIntensity={headlightOn ? 0.5 : 0}
          />
        </mesh>

        {/* LED bezels */}
        {[-0.04, 0.04].map((z, i) => (
          <mesh key={`bz-${i}`} position={[0.033, 0.005, z]} rotation={[0, Math.PI / 2, 0]}>
            <ringGeometry args={[0.022, 0.028, 16]} />
            <meshStandardMaterial color="#333" roughness={0.2} metalness={0.8} side={THREE.DoubleSide} />
          </mesh>
        ))}

        {/* DRL strip between headlights */}
        <mesh position={[0.033, 0.005, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.04, 0.006, 0.003]} />
          <meshStandardMaterial
            color={headlightOn ? "#ffffff" : "#444"}
            emissive={headlightOn ? "#ffffff" : "#000"}
            emissiveIntensity={headlightOn ? 0.6 : 0}
          />
        </mesh>

        {/* Headlight glow */}
        {headlightOn && <pointLight position={[0.04, 0, 0]} intensity={0.25} distance={0.6} color="#ffffdd" />}
      </group>

      {/* Front turn signals (blink when active) */}
      {[-0.1, 0.1].map((z, i) => (
        <mesh key={i} position={[0.12, 0.27, z]}>
          <boxGeometry args={[0.015, 0.010, 0.022]} />
          <meshStandardMaterial
            color={turnSignalsOn && blinkOn ? "#ffaa00" : "#ff8800"}
            roughness={0.3}
            emissive={turnSignalsOn && blinkOn ? "#ffaa00" : "#ff6600"}
            emissiveIntensity={turnSignalsOn && blinkOn ? 1.2 : 0.25}
          />
        </mesh>
      ))}

      {/* === TFT INSTRUMENT CLUSTER (minimalist KTM) === */}
      <group position={[0.08, 0.42, 0]}>
        {/* TFT display housing */}
        <mesh rotation={[0.5, 0, 0]}>
          <boxGeometry args={[0.08, 0.055, 0.12]} />
          <meshStandardMaterial color="#111" roughness={0.7} metalness={0.3} />
        </mesh>
        {/* TFT screen */}
        <mesh position={[0, 0.008, 0.008]} rotation={[0.5, 0, 0]}>
          <planeGeometry args={[0.07, 0.10]} />
          <meshStandardMaterial
            color="#0a0a2a"
            roughness={0.05}
            metalness={0.3}
            emissive="#001144"
            emissiveIntensity={headlightOn ? 0.3 : 0}
          />
        </mesh>
        {/* KTM logo area on screen */}
        <mesh position={[0.02, 0.01, 0.04]} rotation={[0.5, 0, 0]}>
          <planeGeometry args={[0.02, 0.015]} />
          <meshStandardMaterial
            color="#FF6600"
            emissive="#FF6600"
            emissiveIntensity={headlightOn ? 0.5 : 0}
          />
        </mesh>
      </group>
    </group>
  )
}
