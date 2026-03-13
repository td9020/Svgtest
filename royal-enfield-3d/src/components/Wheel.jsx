import { useRef } from 'react'
import * as THREE from 'three'
import { SPECS } from './dimensions'

// Royal Enfield Classic 350:
// Front: 100/90-19 (19-inch rim, OD ~678mm)
// Rear: 120/80-18 (18-inch rim, OD ~660mm)
// Wire-spoke wheels with 36 spokes, cross-laced
// Front: 300mm disc brake, Rear: 153mm drum brake

const SPOKE_COUNT = 36

export default function Wheel({
  position = [0, 0, 0],
  isRear = false,
  spinAngle = 0,
}) {
  const group = useRef()

  const rimRadius = isRear ? SPECS.rearRimRadius : SPECS.frontRimRadius
  const tireRadius = isRear ? SPECS.rearTireRadius : SPECS.frontTireRadius
  const tireWidth = isRear ? SPECS.rearTireWidth : SPECS.frontTireWidth
  const tubeRadius = (tireRadius - rimRadius) / 2 + tireWidth / 5
  const tireMidRadius = rimRadius + tubeRadius
  const hubRadius = 0.038
  const spokeInner = hubRadius + 0.006
  const spokeOuter = rimRadius - 0.014
  const hasFrontDisc = !isRear
  const discRadius = hasFrontDisc
    ? SPECS.frontDiscDiameter / 2   // 0.150m
    : SPECS.rearDrumDiameter / 2    // 0.0765m

  return (
    <group ref={group} position={position} rotation={[0, 0, spinAngle]}>
      {/* Tire - black rubber */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[tireMidRadius, tubeRadius, 24, 48]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.92} metalness={0.03} />
      </mesh>

      {/* Chrome rim - outer bead */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[rimRadius, 0.012, 16, 48]} />
        <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
      </mesh>

      {/* Chrome rim - inner bead */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[rimRadius - 0.024, 0.009, 12, 48]} />
        <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Chrome rim center section */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[rimRadius - 0.012, 0.006, 8, 48]} />
        <meshStandardMaterial color="#ccc" roughness={0.1} metalness={0.88} />
      </mesh>

      {/* Hub - polished chrome */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[hubRadius, hubRadius, 0.065, 24]} />
        <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Hub flanges - where spokes attach */}
      {[-0.030, 0.030].map((z, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, z, 0]}>
          <cylinderGeometry args={[hubRadius + 0.008, hubRadius + 0.008, 0.007, 24]} />
          <meshStandardMaterial color="#ccc" roughness={0.12} metalness={0.88} />
        </mesh>
      ))}

      {/* Axle */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.12, 12]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Wire spokes - 36 cross-laced (classic RE character) */}
      {Array.from({ length: SPOKE_COUNT }).map((_, i) => {
        const angle = (i / SPOKE_COUNT) * Math.PI * 2
        // Cross-lacing: alternating spokes go to offset positions
        const crossOffset = (i % 2 === 0) ? 0.12 : -0.12
        const innerAngle = angle + crossOffset
        const ix = Math.cos(innerAngle) * spokeInner
        const iy = Math.sin(innerAngle) * spokeInner
        const ox = Math.cos(angle) * spokeOuter
        const oy = Math.sin(angle) * spokeOuter
        const mx = (ix + ox) / 2
        const my = (iy + oy) / 2
        const len = Math.sqrt((ox - ix) ** 2 + (oy - iy) ** 2)
        const rot = Math.atan2(oy - iy, ox - ix)
        const zOff = (i % 2 === 0) ? 0.018 : -0.018

        return (
          <mesh key={i} position={[mx, my, zOff]} rotation={[0, 0, rot]}>
            <cylinderGeometry args={[0.0012, 0.0012, len, 3]} />
            <meshStandardMaterial color="#ddd" roughness={0.15} metalness={0.85} />
          </mesh>
        )
      })}

      {/* Spoke nipples at rim end */}
      {Array.from({ length: SPOKE_COUNT }).map((_, i) => {
        const angle = (i / SPOKE_COUNT) * Math.PI * 2
        const r = rimRadius - 0.016
        const zOff = (i % 2 === 0) ? 0.018 : -0.018
        return (
          <mesh key={`n-${i}`} position={[Math.cos(angle) * r, Math.sin(angle) * r, zOff]}>
            <sphereGeometry args={[0.0025, 4, 4]} />
            <meshStandardMaterial color="#bbb" roughness={0.2} metalness={0.8} />
          </mesh>
        )
      })}

      {/* Front disc brake - 300mm */}
      {hasFrontDisc && (
        <>
          {/* Disc rotor */}
          <mesh position={[0, 0, 0.038]}>
            <ringGeometry args={[hubRadius + 0.01, discRadius, 48]} />
            <meshStandardMaterial color="#aaa" roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
          </mesh>

          {/* Disc ventilation holes */}
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2
            const r = discRadius * 0.72
            return (
              <mesh key={`h-${i}`} position={[Math.cos(a) * r, Math.sin(a) * r, 0.039]}>
                <circleGeometry args={[0.006, 6]} />
                <meshStandardMaterial color="#666" side={THREE.DoubleSide} />
              </mesh>
            )
          })}

          {/* Brake caliper */}
          <group position={[discRadius - 0.02, 0, 0.055]}>
            <mesh>
              <boxGeometry args={[0.045, 0.06, 0.032]} />
              <meshStandardMaterial color="#333" roughness={0.5} metalness={0.5} />
            </mesh>
            <mesh position={[-0.015, 0.022, 0.018]}>
              <cylinderGeometry args={[0.005, 0.005, 0.005, 6]} />
              <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
            </mesh>
          </group>
        </>
      )}

      {/* Rear drum brake - 153mm */}
      {isRear && (
        <>
          <mesh position={[0, 0, 0.035]}>
            <cylinderGeometry args={[discRadius, discRadius, 0.04, 24]} />
            <meshStandardMaterial color="#888" roughness={0.35} metalness={0.65} />
          </mesh>
          {/* Drum backing plate */}
          <mesh position={[0, 0, 0.058]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[discRadius + 0.005, 24]} />
            <meshStandardMaterial color="#777" roughness={0.4} metalness={0.6} side={THREE.DoubleSide} />
          </mesh>
          {/* Brake arm */}
          <mesh position={[-discRadius * 0.6, -discRadius * 0.3, 0.06]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.06, 0.012, 0.008]} />
            <meshStandardMaterial color="#555" roughness={0.4} metalness={0.6} />
          </mesh>
        </>
      )}
    </group>
  )
}
