import { useRef } from 'react'
import * as THREE from 'three'

const SPOKE_COUNT = 16
const TIRE_COLOR = '#1a1a1a'
const RIM_COLOR = '#b0b0b0'
const HUB_COLOR = '#888888'
const BRAKE_COLOR = '#999999'

export default function Wheel({ position = [0, 0, 0], hasFrontBrake = false }) {
  const group = useRef()
  const tireRadius = 0.32
  const tireThickness = 0.09
  const rimRadius = 0.24
  const hubRadius = 0.05
  const spokeRadius = 0.004

  return (
    <group ref={group} position={position}>
      {/* Tire - outer rubber */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[tireRadius, tireThickness, 24, 48]} />
        <meshStandardMaterial color={TIRE_COLOR} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[rimRadius, 0.015, 16, 48]} />
        <meshStandardMaterial color={RIM_COLOR} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Inner rim ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[rimRadius - 0.03, 0.012, 12, 48]} />
        <meshStandardMaterial color={RIM_COLOR} roughness={0.25} metalness={0.75} />
      </mesh>

      {/* Hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[hubRadius, hubRadius, 0.08, 24]} />
        <meshStandardMaterial color={HUB_COLOR} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Axle */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.12, 12]} />
        <meshStandardMaterial color="#555" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Spokes */}
      {Array.from({ length: SPOKE_COUNT }).map((_, i) => {
        const angle = (i / SPOKE_COUNT) * Math.PI * 2
        const innerX = Math.cos(angle) * hubRadius
        const innerY = Math.sin(angle) * hubRadius
        const outerX = Math.cos(angle) * (rimRadius - 0.02)
        const outerY = Math.sin(angle) * (rimRadius - 0.02)
        const midX = (innerX + outerX) / 2
        const midY = (innerY + outerY) / 2
        const length = Math.sqrt((outerX - innerX) ** 2 + (outerY - innerY) ** 2)
        const rotation = Math.atan2(outerY - innerY, outerX - innerX)

        return (
          <mesh
            key={i}
            position={[midX, midY, 0]}
            rotation={[0, 0, rotation]}
          >
            <cylinderGeometry args={[spokeRadius, spokeRadius, length, 4]} />
            <meshStandardMaterial color="#ccc" roughness={0.3} metalness={0.7} />
          </mesh>
        )
      })}

      {/* Disc brake */}
      <mesh position={[0, 0, 0.03]} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.06, 0.14, 32]} />
        <meshStandardMaterial
          color={BRAKE_COLOR}
          roughness={0.4}
          metalness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Brake caliper */}
      {hasFrontBrake && (
        <mesh position={[0.16, 0, 0.04]}>
          <boxGeometry args={[0.04, 0.06, 0.03]} />
          <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
        </mesh>
      )}

      {/* Brake caliper rear */}
      <mesh position={[-0.14, 0.04, 0.035]}>
        <boxGeometry args={[0.035, 0.05, 0.025]} />
        <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
      </mesh>
    </group>
  )
}
