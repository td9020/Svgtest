import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SPECS, POS } from './dimensions'

// Honda Unicorn 150: Telescopic front fork
// Rake angle ~26 degrees (typical for commuter bikes)
// Fork tube diameter ~33mm

export default function FrontFork({ position = [0, 0, 0], forkCompression = 0, steeringAngle = 0, headlightOn = true, turnSignalsOn = false }) {
  const group = useRef()
  const [blinkOn, setBlinkOn] = useState(false)

  useFrame(() => {
    if (turnSignalsOn) {
      // Blink at ~1.5 Hz
      setBlinkOn(Math.sin(Date.now() * 0.01) > 0)
    } else if (blinkOn) {
      setBlinkOn(false)
    }
  })

  const wb = SPECS.wheelbase
  const forkAngle = 0.45  // ~26 degrees rake
  const forkTubeOD = 0.0165 // ~33mm fork tubes
  const forkSpacing = 0.065 // distance between fork legs (center to center)

  return (
    <group ref={group} position={position} rotation={[0, steeringAngle, 0]}>
      <group rotation={[0, 0, -forkAngle]}>
        {/* Left fork - upper tube (chrome) */}
        <mesh position={[0, 0.15, -forkSpacing]}>
          <cylinderGeometry args={[forkTubeOD, forkTubeOD, 0.28, 12]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
        </mesh>

        {/* Left fork - lower leg (dark) - slides with compression */}
        <mesh position={[0, -0.10 - forkCompression, -forkSpacing]}>
          <cylinderGeometry args={[forkTubeOD + 0.004, forkTubeOD + 0.004, 0.22, 12]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.4} />
        </mesh>

        {/* Right fork - upper tube (chrome) */}
        <mesh position={[0, 0.15, forkSpacing]}>
          <cylinderGeometry args={[forkTubeOD, forkTubeOD, 0.28, 12]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
        </mesh>

        {/* Right fork - lower leg (dark) - slides with compression */}
        <mesh position={[0, -0.10 - forkCompression, forkSpacing]}>
          <cylinderGeometry args={[forkTubeOD + 0.004, forkTubeOD + 0.004, 0.22, 12]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.4} />
        </mesh>

        {/* Fork dust seals */}
        {[-forkSpacing, forkSpacing].map((z, i) => (
          <mesh key={i} position={[0, 0.02, z]}>
            <cylinderGeometry args={[forkTubeOD + 0.005, forkTubeOD + 0.005, 0.015, 12]} />
            <meshStandardMaterial color="#222" roughness={0.9} metalness={0.05} />
          </mesh>
        ))}

        {/* Upper triple clamp */}
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.04, 0.018, forkSpacing * 2 + 0.04]} />
          <meshStandardMaterial color="#333" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Lower triple clamp */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[0.035, 0.016, forkSpacing * 2 + 0.03]} />
          <meshStandardMaterial color="#333" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Axle clamp at bottom */}
        <mesh position={[0, -0.21, 0]}>
          <boxGeometry args={[0.025, 0.022, forkSpacing * 2 + 0.02]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Front fender - red */}
        <mesh position={[0.02, -0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[SPECS.frontTireRadius - 0.01, SPECS.frontTireRadius - 0.01, 0.09, 16, 1, true, -0.8, 1.6]} />
          <meshStandardMaterial color="#cc0000" roughness={0.25} metalness={0.25} side={THREE.DoubleSide} />
        </mesh>

        {/* Fender stay */}
        <mesh position={[0.01, -0.04, -forkSpacing + 0.01]}>
          <boxGeometry args={[0.003, 0.12, 0.006]} />
          <meshStandardMaterial color="#555" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0.01, -0.04, forkSpacing - 0.01]}>
          <boxGeometry args={[0.003, 0.12, 0.006]} />
          <meshStandardMaterial color="#555" roughness={0.4} metalness={0.5} />
        </mesh>
      </group>

      {/* === Handlebar === */}
      <group position={[0.06, 0.40, 0]}>
        {/* Main bar */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.011, 0.011, 0.56, 8]} />
          <meshStandardMaterial color="#333" roughness={0.45} metalness={0.45} />
        </mesh>

        {/* Bar risers */}
        {[-0.04, 0.04].map((z, i) => (
          <mesh key={i} position={[0, -0.025, z]}>
            <cylinderGeometry args={[0.012, 0.012, 0.04, 8]} />
            <meshStandardMaterial color="#333" roughness={0.4} metalness={0.6} />
          </mesh>
        ))}

        {/* Left grip */}
        <mesh position={[0, 0, -0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.09, 12]} />
          <meshStandardMaterial color="#111" roughness={0.92} metalness={0.03} />
        </mesh>

        {/* Right grip (throttle) */}
        <mesh position={[0, 0, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.09, 12]} />
          <meshStandardMaterial color="#111" roughness={0.92} metalness={0.03} />
        </mesh>

        {/* Left lever (clutch) */}
        <mesh position={[0.03, -0.01, -0.22]} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[0.10, 0.006, 0.012]} />
          <meshStandardMaterial color="#888" roughness={0.25} metalness={0.75} />
        </mesh>

        {/* Right lever (brake) */}
        <mesh position={[0.03, -0.01, 0.22]} rotation={[0, -0.4, 0]}>
          <boxGeometry args={[0.10, 0.006, 0.012]} />
          <meshStandardMaterial color="#888" roughness={0.25} metalness={0.75} />
        </mesh>

        {/* Switch blocks */}
        {[-0.2, 0.2].map((z, i) => (
          <mesh key={i} position={[0, 0.005, z]}>
            <boxGeometry args={[0.03, 0.02, 0.03]} />
            <meshStandardMaterial color="#222" roughness={0.7} metalness={0.2} />
          </mesh>
        ))}

        {/* Left mirror */}
        <group position={[0.01, 0.02, -0.26]}>
          <mesh position={[0, 0.06, -0.03]} rotation={[0.25, 0, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 0.08, 6]} />
            <meshStandardMaterial color="#333" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.11, -0.05]} rotation={[0.7, 0, 0]}>
            <sphereGeometry args={[0.028, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#222" roughness={0.5} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.115, -0.053]} rotation={[0.7, 0, 0]}>
            <circleGeometry args={[0.025, 12]} />
            <meshStandardMaterial color="#aaddff" roughness={0.03} metalness={0.92} />
          </mesh>
        </group>

        {/* Right mirror */}
        <group position={[0.01, 0.02, 0.26]}>
          <mesh position={[0, 0.06, 0.03]} rotation={[-0.25, 0, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 0.08, 6]} />
            <meshStandardMaterial color="#333" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.11, 0.05]} rotation={[-0.7, 0, 0]}>
            <sphereGeometry args={[0.028, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#222" roughness={0.5} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.115, 0.053]} rotation={[-0.7, 0, 0]}>
            <circleGeometry args={[0.025, 12]} />
            <meshStandardMaterial color="#aaddff" roughness={0.03} metalness={0.92} />
          </mesh>
        </group>
      </group>

      {/* === Headlight === */}
      <group position={[0.18, 0.32, 0]}>
        {/* Housing */}
        <mesh>
          <sphereGeometry args={[0.058, 16, 16, 0, Math.PI]} />
          <meshStandardMaterial color="#222" roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Reflector */}
        <mesh position={[0.003, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.053, 24]} />
          <meshStandardMaterial color={headlightOn ? "#ffffee" : "#888"} roughness={0.04} metalness={0.1} emissive={headlightOn ? "#ffffcc" : "#000"} emissiveIntensity={headlightOn ? 0.4 : 0} />
        </mesh>
        {/* Chrome bezel */}
        <mesh position={[0.002, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.048, 0.058, 24]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} side={THREE.DoubleSide} />
        </mesh>
        {/* Headlight bulb glow */}
        {headlightOn && <pointLight position={[0.02, 0, 0]} intensity={0.2} distance={0.5} color="#ffffdd" />}
      </group>

      {/* Front turn signals (blink when active) */}
      {[-0.09, 0.09].map((z, i) => (
        <mesh key={i} position={[0.14, 0.26, z]}>
          <sphereGeometry args={[0.013, 8, 8]} />
          <meshStandardMaterial
            color={turnSignalsOn && blinkOn ? "#ffaa00" : "#ff8800"}
            roughness={0.3}
            emissive={turnSignalsOn && blinkOn ? "#ffaa00" : "#ff6600"}
            emissiveIntensity={turnSignalsOn && blinkOn ? 1.2 : 0.25}
          />
        </mesh>
      ))}

      {/* === Instrument cluster === */}
      <group position={[0.10, 0.42, 0]}>
        {/* Speedometer housing */}
        <mesh rotation={[0.55, 0, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.02, 16]} />
          <meshStandardMaterial color="#111" roughness={0.7} metalness={0.3} />
        </mesh>
        {/* Speedometer face */}
        <mesh position={[0, 0.006, 0.006]} rotation={[0.55, 0, 0]}>
          <circleGeometry args={[0.035, 16]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.08} metalness={0.3} />
        </mesh>
        {/* Needle */}
        <mesh position={[0, 0.008, 0.008]} rotation={[0.55, 0, 0.3]}>
          <boxGeometry args={[0.002, 0.025, 0.001]} />
          <meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={0.5} />
        </mesh>

        {/* Tachometer (smaller, to the left) */}
        <mesh position={[-0.05, 0, 0.025]} rotation={[0.55, 0, 0]}>
          <cylinderGeometry args={[0.026, 0.026, 0.018, 16]} />
          <meshStandardMaterial color="#111" roughness={0.7} metalness={0.3} />
        </mesh>
        <mesh position={[-0.05, 0.006, 0.03]} rotation={[0.55, 0, 0]}>
          <circleGeometry args={[0.023, 12]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.08} metalness={0.3} />
        </mesh>

        {/* Indicator lights */}
        {[-0.015, 0, 0.015].map((x, i) => (
          <mesh key={i} position={[x - 0.02, 0.012, 0.035]} rotation={[0.55, 0, 0]}>
            <circleGeometry args={[0.004, 8]} />
            <meshStandardMaterial
              color={['#00ff00', '#ff0000', '#0088ff'][i]}
              emissive={['#00ff00', '#ff0000', '#0088ff'][i]}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}
