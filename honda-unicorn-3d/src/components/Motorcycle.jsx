import { useRef } from 'react'
import Wheel from './Wheel'
import Engine from './Engine'
import Frame from './Frame'
import FuelTank from './FuelTank'
import Seat from './Seat'
import Exhaust from './Exhaust'
import FrontFork from './FrontFork'
import TailSection from './TailSection'
import { SPECS, POS } from './dimensions'

// Honda CB Unicorn 150 - assembled from real dimensions
// Coordinate system:
//   x = 0 at rear axle, positive forward
//   y = 0 at ground level, positive up
//   z = 0 at centerline, positive right

export default function Motorcycle({ position = [0, 0, 0] }) {
  const group = useRef()

  const wb = SPECS.wheelbase         // 1.338m
  const rearAxleY = POS.rearAxle.y   // 0.3185m
  const frontAxleY = POS.frontAxle.y // 0.309m
  const sh = SPECS.seatHeight        // 0.798m

  return (
    <group ref={group} position={position}>
      {/* Frame - the skeleton */}
      <Frame position={[0, 0, 0]} />

      {/* Rear wheel - at origin (x=0) */}
      <Wheel position={[0, rearAxleY, 0]} isRear />

      {/* Front wheel - at wheelbase distance */}
      <Wheel position={[wb, frontAxleY, 0]} hasFrontDisc />

      {/* Engine - mounted in the frame triangle, slightly forward of center */}
      <Engine position={[wb * 0.37, 0.32, 0]} />

      {/* Fuel tank - on the backbone, between steering head and seat */}
      <FuelTank position={[wb * 0.58, sh + 0.05, 0]} />

      {/* Seat - behind the tank */}
      <Seat position={[wb * 0.22, sh, 0]} />

      {/* Exhaust system - routed from engine to right side */}
      <Exhaust position={[0, 0, 0]} />

      {/* Front fork, handlebar, headlight, instruments */}
      <FrontFork position={[wb - 0.08, frontAxleY + 0.12, 0]} />

      {/* Tail section - behind rear wheel */}
      <TailSection position={[0, rearAxleY, 0]} />

      {/* Kickstand */}
      <mesh position={[wb * 0.3, 0.12, 0.08]} rotation={[0.15, 0, 0.35]}>
        <cylinderGeometry args={[0.005, 0.005, 0.22, 6]} />
        <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Kickstand foot */}
      <mesh position={[wb * 0.3 - 0.06, 0.01, 0.1]}>
        <boxGeometry args={[0.03, 0.004, 0.02]} />
        <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Foot pegs - rider */}
      {[-0.12, 0.12].map((z, i) => (
        <group key={i} position={[wb * 0.28, 0.25, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.04, 6]} />
            <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
          </mesh>
          {/* Rubber grip */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z > 0 ? 0.025 : -0.025]}>
            <cylinderGeometry args={[0.007, 0.007, 0.03, 8]} />
            <meshStandardMaterial color="#222" roughness={0.9} metalness={0.05} />
          </mesh>
        </group>
      ))}

      {/* Foot pegs - pillion */}
      {[-0.11, 0.11].map((z, i) => (
        <mesh key={`p-${i}`} position={[0.08, 0.32, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.035, 6]} />
          <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
        </mesh>
      ))}

      {/* Front sprocket (engine output) */}
      <mesh position={[wb * 0.28, 0.18, 0.075]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.008, 16]} />
        <meshStandardMaterial color="#555" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  )
}
