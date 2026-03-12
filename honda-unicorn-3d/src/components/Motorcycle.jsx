import { useRef } from 'react'
import Wheel from './Wheel'
import Engine from './Engine'
import Frame from './Frame'
import FuelTank from './FuelTank'
import Seat from './Seat'
import Exhaust from './Exhaust'
import FrontFork from './FrontFork'
import TailSection from './TailSection'

export default function Motorcycle({ position = [0, 0, 0] }) {
  const group = useRef()

  return (
    <group ref={group} position={position}>
      {/* Frame - the skeleton everything mounts to */}
      <Frame position={[0, 0, 0]} />

      {/* Rear wheel */}
      <Wheel position={[-0.55, 0.2, 0]} />

      {/* Front wheel */}
      <Wheel position={[0.55, 0.2, 0]} hasFrontBrake />

      {/* Engine - mounted below the frame mid-section */}
      <Engine position={[0.02, 0.15, 0]} />

      {/* Fuel tank - sits on the backbone */}
      <FuelTank position={[0.22, 0.52, 0]} />

      {/* Seat - behind the tank */}
      <Seat position={[-0.22, 0.42, 0]} />

      {/* Exhaust system */}
      <Exhaust position={[0, 0, 0]} />

      {/* Front fork, handlebar, headlight */}
      <FrontFork position={[0.42, 0.18, 0]} />

      {/* Tail section - rear fender, lights, plate */}
      <TailSection position={[-0.55, 0.2, 0]} />

      {/* Kickstand */}
      <mesh position={[-0.05, 0.05, 0.1]} rotation={[0.2, 0, 0.4]}>
        <cylinderGeometry args={[0.006, 0.006, 0.22, 6]} />
        <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Foot pegs */}
      <mesh position={[-0.05, 0.12, -0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.05, 8]} />
        <meshStandardMaterial color="#333" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[-0.05, 0.12, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.05, 8]} />
        <meshStandardMaterial color="#333" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Rear foot pegs (pillion) */}
      <mesh position={[-0.32, 0.18, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.04, 6]} />
        <meshStandardMaterial color="#333" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[-0.32, 0.18, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.04, 6]} />
        <meshStandardMaterial color="#333" roughness={0.6} metalness={0.4} />
      </mesh>
    </group>
  )
}
