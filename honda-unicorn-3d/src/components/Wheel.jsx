import { useRef } from 'react'
import * as THREE from 'three'
import { SPECS } from './dimensions'

// Honda Unicorn 150:
// Both wheels: 18-inch alloy rims (457.2mm diameter)
// Front: 80/100-18 tire, OD ~618mm → radius 309mm
// Rear: 100/90-18 tire, OD ~637mm → radius 318.5mm
// Front disc brake: 240mm, Rear drum: 130mm

const SPOKE_COUNT = 20

export default function Wheel({
  position = [0, 0, 0],
  isRear = false,
  hasFrontDisc = false,
}) {
  const group = useRef()

  const rimRadius = SPECS.rimRadius                       // 0.2286m
  const tireRadius = isRear ? SPECS.rearTireRadius : SPECS.frontTireRadius
  const tireWidth = isRear ? SPECS.rearTireWidth : SPECS.frontTireWidth
  const tubeRadius = (tireRadius - rimRadius) / 2 + tireWidth / 5
  const tireMidRadius = rimRadius + tubeRadius
  const hubRadius = 0.035
  const spokeInner = hubRadius + 0.005
  const spokeOuter = rimRadius - 0.012
  const discRadius = hasFrontDisc
    ? SPECS.frontDiscDiameter / 2   // 0.120m
    : SPECS.rearDrumDiameter / 2    // 0.065m

  return (
    <group ref={group} position={position}>
      {/* Tire */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[tireMidRadius, tubeRadius, 24, 48]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.92} metalness={0.03} />
      </mesh>

      {/* Rim - outer bead */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[rimRadius, 0.01, 16, 48]} />
        <meshStandardMaterial color="#b0b0b0" roughness={0.15} metalness={0.85} />
      </mesh>

      {/* Rim - inner bead */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[rimRadius - 0.022, 0.008, 12, 48]} />
        <meshStandardMaterial color="#b0b0b0" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[hubRadius, hubRadius, 0.055, 24]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Hub flanges */}
      {[-0.025, 0.025].map((z, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, z, 0]}>
          <cylinderGeometry args={[hubRadius + 0.006, hubRadius + 0.006, 0.006, 24]} />
          <meshStandardMaterial color="#999" roughness={0.25} metalness={0.75} />
        </mesh>
      ))}

      {/* Axle */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 12]} />
        <meshStandardMaterial color="#555" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Spokes - cross-laced */}
      {Array.from({ length: SPOKE_COUNT }).map((_, i) => {
        const angle = (i / SPOKE_COUNT) * Math.PI * 2
        const offset = (i % 2 === 0) ? 0.1 : -0.1
        const innerAngle = angle + offset
        const ix = Math.cos(innerAngle) * spokeInner
        const iy = Math.sin(innerAngle) * spokeInner
        const ox = Math.cos(angle) * spokeOuter
        const oy = Math.sin(angle) * spokeOuter
        const mx = (ix + ox) / 2
        const my = (iy + oy) / 2
        const len = Math.sqrt((ox - ix) ** 2 + (oy - iy) ** 2)
        const rot = Math.atan2(oy - iy, ox - ix)
        const zOff = (i % 2 === 0) ? 0.014 : -0.014

        return (
          <mesh key={i} position={[mx, my, zOff]} rotation={[0, 0, rot]}>
            <cylinderGeometry args={[0.0015, 0.0015, len, 3]} />
            <meshStandardMaterial color="#ccc" roughness={0.25} metalness={0.75} />
          </mesh>
        )
      })}

      {/* Disc / drum */}
      <mesh position={[0, 0, 0.032]}>
        <ringGeometry args={[hubRadius + 0.008, discRadius, 32]} />
        <meshStandardMaterial color="#999" roughness={0.35} metalness={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* Ventilation holes on disc (front) */}
      {hasFrontDisc && Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2
        const r = discRadius * 0.72
        return (
          <mesh key={`h-${i}`} position={[Math.cos(a) * r, Math.sin(a) * r, 0.033]}>
            <circleGeometry args={[0.005, 6]} />
            <meshStandardMaterial color="#666" side={THREE.DoubleSide} />
          </mesh>
        )
      })}

      {/* Brake caliper */}
      {hasFrontDisc && (
        <group position={[discRadius - 0.015, 0, 0.048]}>
          <mesh>
            <boxGeometry args={[0.038, 0.05, 0.028]} />
            <meshStandardMaterial color="#333" roughness={0.5} metalness={0.5} />
          </mesh>
          <mesh position={[-0.012, 0.018, 0.015]}>
            <cylinderGeometry args={[0.004, 0.004, 0.004, 6]} />
            <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
          </mesh>
        </group>
      )}
    </group>
  )
}
