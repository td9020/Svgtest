import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SPECS, POS } from './dimensions'

// Royal Enfield Classic 350: Conventional telescopic forks
// 41mm fork tubes with gaiters (rubber boots)
// Wide swept-back handlebars (cruiser position)
// Large 7-inch round headlight with chrome bezel
// Twin round clocks (speedo + tacho, chrome bezels)
// Classic round mirrors on stalks

export default function FrontFork({
  position = [0, 0, 0],
  forkCompression = 0,
  steeringAngle = 0,
  headlightOn = true,
  turnSignalsOn = false,
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

  const forkAngle = 0.44     // ~25 degrees rake (classic cruiser)
  const forkTubeOD = SPECS.forkTubeDiameter / 2  // 41mm / 2 = 20.5mm radius
  const forkSpacing = 0.075   // wider stance for classic look
  const headlightR = SPECS.headlightDiameter / 2  // 7-inch / 2

  return (
    <group ref={group} position={position} rotation={[0, steeringAngle, 0]}>
      <group rotation={[0, 0, -forkAngle]}>
        {/* Left fork - upper tube (chrome) */}
        <mesh position={[0, 0.18, -forkSpacing]}>
          <cylinderGeometry args={[forkTubeOD, forkTubeOD, 0.30, 12]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
        </mesh>

        {/* Left fork - lower leg (dark) */}
        <mesh position={[0, -0.10 - forkCompression, -forkSpacing]}>
          <cylinderGeometry args={[forkTubeOD + 0.005, forkTubeOD + 0.005, 0.24, 12]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.4} />
        </mesh>

        {/* Left fork gaiter (rubber boot - classic RE) */}
        <mesh position={[0, 0.04 - forkCompression / 2, -forkSpacing]}>
          <cylinderGeometry args={[forkTubeOD + 0.008, forkTubeOD + 0.003, 0.10, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.95} metalness={0.02} />
        </mesh>
        {/* Gaiter ridges */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={`lg-${i}`} position={[0, 0.01 + i * 0.018 - forkCompression / 2, -forkSpacing]}>
            <torusGeometry args={[forkTubeOD + 0.007, 0.002, 6, 16]} />
            <meshStandardMaterial color="#111" roughness={0.9} metalness={0.05} />
          </mesh>
        ))}

        {/* Right fork - upper tube (chrome) */}
        <mesh position={[0, 0.18, forkSpacing]}>
          <cylinderGeometry args={[forkTubeOD, forkTubeOD, 0.30, 12]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
        </mesh>

        {/* Right fork - lower leg (dark) */}
        <mesh position={[0, -0.10 - forkCompression, forkSpacing]}>
          <cylinderGeometry args={[forkTubeOD + 0.005, forkTubeOD + 0.005, 0.24, 12]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.4} />
        </mesh>

        {/* Right fork gaiter (rubber boot) */}
        <mesh position={[0, 0.04 - forkCompression / 2, forkSpacing]}>
          <cylinderGeometry args={[forkTubeOD + 0.008, forkTubeOD + 0.003, 0.10, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.95} metalness={0.02} />
        </mesh>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={`rg-${i}`} position={[0, 0.01 + i * 0.018 - forkCompression / 2, forkSpacing]}>
            <torusGeometry args={[forkTubeOD + 0.007, 0.002, 6, 16]} />
            <meshStandardMaterial color="#111" roughness={0.9} metalness={0.05} />
          </mesh>
        ))}

        {/* Upper triple clamp (chrome) */}
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[0.045, 0.020, forkSpacing * 2 + 0.05]} />
          <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.88} />
        </mesh>

        {/* Lower triple clamp */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.040, 0.018, forkSpacing * 2 + 0.04]} />
          <meshStandardMaterial color="#333" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Axle clamp at bottom */}
        <mesh position={[0, -0.22, 0]}>
          <boxGeometry args={[0.028, 0.024, forkSpacing * 2 + 0.025]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Chrome front fender (full coverage, classic) */}
        <mesh position={[0.02, -0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[SPECS.frontTireRadius - 0.008, SPECS.frontTireRadius - 0.008, 0.10, 16, 1, true, -0.9, 1.8]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} side={THREE.DoubleSide} />
        </mesh>

        {/* Fender stays (chrome) */}
        {[-forkSpacing + 0.01, forkSpacing - 0.01].map((z, i) => (
          <mesh key={`fs-${i}`} position={[0.01, -0.05, z]}>
            <boxGeometry args={[0.004, 0.14, 0.007]} />
            <meshStandardMaterial color="#ccc" roughness={0.1} metalness={0.88} />
          </mesh>
        ))}
      </group>

      {/* === Handlebar - wide, swept-back cruiser style === */}
      <group position={[0.04, 0.44, 0]}>
        {/* Main bar - wider sweep */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.62, 8]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
        </mesh>

        {/* Bar pullback bends */}
        {[-0.26, 0.26].map((z, i) => (
          <mesh key={`bend-${i}`} position={[0.03, 0, z]} rotation={[Math.PI / 2, 0, 0.3 * (z > 0 ? -1 : 1)]}>
            <cylinderGeometry args={[0.012, 0.012, 0.10, 8]} />
            <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
          </mesh>
        ))}

        {/* Bar risers */}
        {[-0.04, 0.04].map((z, i) => (
          <mesh key={`riser-${i}`} position={[0, -0.028, z]}>
            <cylinderGeometry args={[0.013, 0.013, 0.045, 8]} />
            <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.88} />
          </mesh>
        ))}

        {/* Left grip (rubber) */}
        <mesh position={[0.06, 0, -0.30]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 0.10, 12]} />
          <meshStandardMaterial color="#111" roughness={0.92} metalness={0.03} />
        </mesh>

        {/* Right grip (throttle, rubber) */}
        <mesh position={[0.06, 0, 0.30]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 0.10, 12]} />
          <meshStandardMaterial color="#111" roughness={0.92} metalness={0.03} />
        </mesh>

        {/* Left lever (clutch) - chrome */}
        <mesh position={[0.08, -0.01, -0.24]} rotation={[0, 0.35, 0]}>
          <boxGeometry args={[0.11, 0.006, 0.014]} />
          <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.88} />
        </mesh>

        {/* Right lever (brake) - chrome */}
        <mesh position={[0.08, -0.01, 0.24]} rotation={[0, -0.35, 0]}>
          <boxGeometry args={[0.11, 0.006, 0.014]} />
          <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.88} />
        </mesh>

        {/* Switch blocks */}
        {[-0.22, 0.22].map((z, i) => (
          <mesh key={`sw-${i}`} position={[0.06, 0.006, z]}>
            <boxGeometry args={[0.035, 0.022, 0.035]} />
            <meshStandardMaterial color="#222" roughness={0.7} metalness={0.2} />
          </mesh>
        ))}

        {/* Left mirror - round on stalk (classic) */}
        <group position={[0.06, 0.02, -0.28]}>
          <mesh position={[0, 0.07, -0.035]} rotation={[0.3, 0, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 0.10, 6]} />
            <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.88} />
          </mesh>
          <mesh position={[0, 0.13, -0.06]} rotation={[0.7, 0, 0]}>
            <sphereGeometry args={[0.032, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.88} />
          </mesh>
          <mesh position={[0, 0.135, -0.064]} rotation={[0.7, 0, 0]}>
            <circleGeometry args={[0.028, 16]} />
            <meshStandardMaterial color="#aaddff" roughness={0.03} metalness={0.92} />
          </mesh>
        </group>

        {/* Right mirror - round on stalk */}
        <group position={[0.06, 0.02, 0.28]}>
          <mesh position={[0, 0.07, 0.035]} rotation={[-0.3, 0, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 0.10, 6]} />
            <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.88} />
          </mesh>
          <mesh position={[0, 0.13, 0.06]} rotation={[-0.7, 0, 0]}>
            <sphereGeometry args={[0.032, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.88} />
          </mesh>
          <mesh position={[0, 0.135, 0.064]} rotation={[-0.7, 0, 0]}>
            <circleGeometry args={[0.028, 16]} />
            <meshStandardMaterial color="#aaddff" roughness={0.03} metalness={0.92} />
          </mesh>
        </group>
      </group>

      {/* === Large round headlight - 7 inch (classic RE) === */}
      <group position={[0.20, 0.36, 0]}>
        {/* Chrome headlight housing (full round) */}
        <mesh rotation={[0, -Math.PI / 2, 0]}>
          <sphereGeometry args={[headlightR, 24, 24, 0, Math.PI]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
        </mesh>
        {/* Reflector / lens */}
        <mesh position={[0.005, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[headlightR - 0.005, 32]} />
          <meshStandardMaterial
            color={headlightOn ? '#ffffee' : '#888'}
            roughness={0.04}
            metalness={0.1}
            emissive={headlightOn ? '#ffffcc' : '#000'}
            emissiveIntensity={headlightOn ? 0.5 : 0}
          />
        </mesh>
        {/* Chrome bezel ring */}
        <mesh position={[0.004, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[headlightR - 0.008, headlightR + 0.004, 32]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} side={THREE.DoubleSide} />
        </mesh>
        {/* Inner chrome ring */}
        <mesh position={[0.006, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[headlightR * 0.55, headlightR * 0.60, 32]} />
          <meshStandardMaterial color="#ccc" roughness={0.1} metalness={0.88} side={THREE.DoubleSide} />
        </mesh>
        {/* Headlight mounting brackets */}
        {[-0.06, 0.06].map((z, i) => (
          <mesh key={`hb-${i}`} position={[-0.04, 0, z]}>
            <boxGeometry args={[0.04, 0.012, 0.008]} />
            <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.88} />
          </mesh>
        ))}
        {headlightOn && <pointLight position={[0.03, 0, 0]} intensity={0.3} distance={0.6} color="#ffffdd" />}
      </group>

      {/* Front turn signals - bullet style (chrome with amber lens) */}
      {[-0.10, 0.10].map((z, i) => (
        <group key={`fts-${i}`} position={[0.15, 0.28, z]}>
          {/* Chrome stalk */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z > 0 ? 0.015 : -0.015]}>
            <cylinderGeometry args={[0.003, 0.003, 0.04, 6]} />
            <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.88} />
          </mesh>
          {/* Bullet housing (chrome) */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.010, 0.015, 4, 8]} />
            <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.88} />
          </mesh>
          {/* Amber lens */}
          <mesh position={[0.014, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.009, 8]} />
            <meshStandardMaterial
              color={turnSignalsOn && blinkOn ? '#ffaa00' : '#ff8800'}
              roughness={0.3}
              emissive={turnSignalsOn && blinkOn ? '#ffaa00' : '#ff6600'}
              emissiveIntensity={turnSignalsOn && blinkOn ? 1.2 : 0.25}
            />
          </mesh>
        </group>
      ))}

      {/* === Twin round instrument clocks (chrome bezels) === */}
      <group position={[0.12, 0.46, 0]}>
        {/* Speedometer (right) - larger */}
        <group position={[0, 0, 0.035]}>
          <mesh rotation={[0.55, 0, 0]}>
            <cylinderGeometry args={[0.042, 0.042, 0.022, 24]} />
            <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
          </mesh>
          <mesh position={[0, 0.008, 0.008]} rotation={[0.55, 0, 0]}>
            <circleGeometry args={[0.038, 24]} />
            <meshStandardMaterial color="#f5f0e0" roughness={0.15} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.010, 0.010]} rotation={[0.55, 0, 0.3]}>
            <boxGeometry args={[0.002, 0.028, 0.001]} />
            <meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* Tachometer (left) - same size */}
        <group position={[0, 0, -0.035]}>
          <mesh rotation={[0.55, 0, 0]}>
            <cylinderGeometry args={[0.042, 0.042, 0.022, 24]} />
            <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
          </mesh>
          <mesh position={[0, 0.008, -0.008]} rotation={[0.55, 0, 0]}>
            <circleGeometry args={[0.038, 24]} />
            <meshStandardMaterial color="#f5f0e0" roughness={0.15} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.010, -0.010]} rotation={[0.55, 0, -0.2]}>
            <boxGeometry args={[0.002, 0.028, 0.001]} />
            <meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* Center indicator panel between clocks */}
        <mesh position={[-0.005, 0.012, 0]} rotation={[0.55, 0, 0]}>
          <boxGeometry args={[0.02, 0.015, 0.03]} />
          <meshStandardMaterial color="#111" roughness={0.7} metalness={0.3} />
        </mesh>
        {/* Indicator lights */}
        {[-0.008, 0, 0.008].map((z, i) => (
          <mesh key={`ind-${i}`} position={[-0.005, 0.022, z]} rotation={[0.55, 0, 0]}>
            <circleGeometry args={[0.004, 8]} />
            <meshStandardMaterial
              color={['#00ff00', '#ff0000', '#0088ff'][i]}
              emissive={['#00ff00', '#ff0000', '#0088ff'][i]}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}

        {/* Ignition key slot */}
        <mesh position={[-0.015, 0.005, 0]} rotation={[0.55, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.008, 12]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.5} />
        </mesh>
      </group>
    </group>
  )
}
