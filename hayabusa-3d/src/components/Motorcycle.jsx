import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import Wheel from './Wheel'
import Engine from './Engine'
import Frame from './Frame'
import FuelTank from './FuelTank'
import Seat from './Seat'
import Exhaust from './Exhaust'
import FrontFork from './FrontFork'
import TailSection from './TailSection'
import Bodywork from './Bodywork'
import { SPECS, POS } from './dimensions'
import useAnimationStore from '../store/animationStore'

// Suzuki Hayabusa GSX1300R - assembled from real dimensions
// Coordinate system:
//   x = 0 at rear axle, positive forward
//   y = 0 at ground level, positive up
//   z = 0 at centerline, positive right

export default function Motorcycle({ position = [0, 0, 0] }) {
  const group = useRef()
  const kickstandRef = useRef()
  const kickstandFootRef = useRef()

  const wb = SPECS.wheelbase         // 1.480m
  const rearAxleY = POS.rearAxle.y   // 0.316m
  const frontAxleY = POS.frontAxle.y // 0.310m
  const sh = SPECS.seatHeight        // 0.800m

  useFrame((_, delta) => {
    // Tick the animation store each frame
    useAnimationStore.getState().tick(delta)

    // Update kickstand rotation directly via ref
    if (kickstandRef.current) {
      const angle = useAnimationStore.getState().kickstandAngle
      kickstandRef.current.rotation.set(0.15, 0, angle)
    }
    if (kickstandFootRef.current) {
      const angle = useAnimationStore.getState().kickstandAngle
      const footX = wb * 0.28 - 0.06 - Math.sin(angle) * 0.04
      const footY = 0.01 + (0.35 - angle) * 0.08
      kickstandFootRef.current.position.set(footX, footY, 0.12)
    }
  })

  // Read animation values (reactive for rendering)
  const {
    wheelAngle,
    pistonOffset,
    forkCompression,
    steeringAngle,
    explodeProgress,
    headlightOn,
    turnSignals,
    fairingTransparent,
  } = useAnimationStore()

  // Exploded view offsets
  const ex = explodeProgress
  const explodeOffsets = {
    frame:     [0, ex * 0.0, 0],
    rearWheel: [-ex * 0.35, 0, 0],
    frontWheel:[ex * 0.35, 0, 0],
    engine:    [0, -ex * 0.30, 0],
    tank:      [0, ex * 0.35, 0],
    seat:      [0, ex * 0.40, -ex * 0.1],
    exhaust:   [0, -ex * 0.18, ex * 0.35],
    frontFork: [ex * 0.25, ex * 0.18, 0],
    tail:      [-ex * 0.30, ex * 0.12, 0],
    bodywork:  [0, ex * 0.20, ex * 0.25],
  }

  function addOffset(base, offset) {
    return [base[0] + offset[0], base[1] + offset[1], base[2] + offset[2]]
  }

  // Fairing opacity: transparent when X-ray is on
  const fairingOpacity = fairingTransparent ? 0.15 : 1.0

  return (
    <group ref={group} position={position}>
      {/* Frame - the skeleton (twin-spar aluminum) */}
      <Frame position={addOffset([0, 0, 0], explodeOffsets.frame)} />

      {/* Rear wheel - at origin (x=0) */}
      <Wheel
        position={addOffset([0, rearAxleY, 0], explodeOffsets.rearWheel)}
        isRear
        spinAngle={wheelAngle}
      />

      {/* Front wheel - at wheelbase distance */}
      <Wheel
        position={addOffset([wb, frontAxleY, 0], explodeOffsets.frontWheel)}
        spinAngle={wheelAngle}
      />

      {/* Engine - inline-4, mounted in the frame */}
      <Engine
        position={addOffset([wb * 0.38, 0.34, 0], explodeOffsets.engine)}
        pistonOffset={pistonOffset}
      />

      {/* Fuel tank - on the backbone, larger than most */}
      <FuelTank position={addOffset([wb * 0.56, sh + 0.06, 0], explodeOffsets.tank)} />

      {/* Seat - behind the tank */}
      <Seat position={addOffset([wb * 0.22, sh + 0.01, 0], explodeOffsets.seat)} />

      {/* Exhaust system - 4-into-2-into-1 */}
      <Exhaust position={addOffset([0, 0, 0], explodeOffsets.exhaust)} />

      {/* Front fork, clip-on bars, dual headlights, TFT cluster */}
      <FrontFork
        position={addOffset([wb - 0.08, frontAxleY + 0.12, 0], explodeOffsets.frontFork)}
        forkCompression={forkCompression}
        steeringAngle={steeringAngle}
        headlightOn={headlightOn}
        turnSignalsOn={turnSignals}
      />

      {/* Tail section */}
      <TailSection
        position={addOffset([0, rearAxleY, 0], explodeOffsets.tail)}
        turnSignalsOn={turnSignals}
        headlightOn={headlightOn}
      />

      {/* FULL FAIRING - Bodywork (the defining Hayabusa feature!) */}
      <Bodywork
        position={addOffset([0, 0, 0], explodeOffsets.bodywork)}
        fairingOpacity={fairingOpacity}
      />

      {/* Kickstand (animated via ref) */}
      <mesh ref={kickstandRef} position={[wb * 0.28, 0.12, 0.10]} rotation={[0.15, 0, 0.35]}>
        <cylinderGeometry args={[0.006, 0.006, 0.24, 6]} />
        <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Kickstand foot */}
      <mesh ref={kickstandFootRef} position={[wb * 0.28 - 0.06, 0.01, 0.12]}>
        <boxGeometry args={[0.035, 0.005, 0.025]} />
        <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Foot pegs - rider (lower, more rearward = sporty position) */}
      {[-0.13, 0.13].map((z, i) => (
        <group key={i} position={[wb * 0.30, 0.26, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.04, 6]} />
            <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z > 0 ? 0.025 : -0.025]}>
            <cylinderGeometry args={[0.007, 0.007, 0.03, 8]} />
            <meshStandardMaterial color="#222" roughness={0.9} metalness={0.05} />
          </mesh>
        </group>
      ))}

      {/* Foot pegs - pillion */}
      {[-0.12, 0.12].map((z, i) => (
        <mesh key={`p-${i}`} position={[0.10, 0.34, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.04, 6]} />
          <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
        </mesh>
      ))}

      {/* Front sprocket */}
      <mesh position={[wb * 0.30, 0.20, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.010, 16]} />
        <meshStandardMaterial color="#555" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  )
}
