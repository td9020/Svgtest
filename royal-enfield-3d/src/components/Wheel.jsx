import { useRef } from 'react'
import * as THREE from 'three'
import { SPECS } from './dimensions'

// Royal Enfield Classic 350:
// Front: 100/90-19 (19-inch rim, OD ~678mm)
// Rear: 120/80-18 (18-inch rim, OD ~660mm)
// Wire-spoke wheels with 36 spokes, cross-laced (default)
// Front: 300mm disc brake, Rear: 153mm drum brake

const WIRE_SPOKE_COUNT = 36
const ALLOY_SPOKE_COUNT = 5

export default function Wheel({
  position = [0, 0, 0],
  isRear = false,
  spinAngle = 0,
  spoked = true,
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
    <group ref={group} position={position} rotation={[0, 0, -spinAngle]}>
      {/* Tire - black rubber */}
      <mesh>
        <torusGeometry args={[tireMidRadius, tubeRadius, 24, 48]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.92} metalness={0.03} />
      </mesh>

      {/* Chrome rim - outer bead */}
      <mesh>
        <torusGeometry args={[rimRadius, 0.012, 16, 48]} />
        <meshStandardMaterial
          color={spoked ? '#ddd' : '#b0b0b0'}
          roughness={spoked ? 0.08 : 0.15}
          metalness={spoked ? 0.92 : 0.85}
        />
      </mesh>

      {/* Chrome rim - inner bead */}
      <mesh>
        <torusGeometry args={[rimRadius - 0.024, 0.009, 12, 48]} />
        <meshStandardMaterial
          color={spoked ? '#ddd' : '#b0b0b0'}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Chrome rim center section */}
      <mesh>
        <torusGeometry args={[rimRadius - 0.012, 0.006, 8, 48]} />
        <meshStandardMaterial color={spoked ? '#ccc' : '#aaa'} roughness={0.1} metalness={0.88} />
      </mesh>

      {/* Hub - polished chrome */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[hubRadius, hubRadius, 0.065, 24]} />
        <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Hub flanges - where spokes attach */}
      {[-0.030, 0.030].map((z, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z]}>
          <cylinderGeometry args={[hubRadius + 0.008, hubRadius + 0.008, 0.007, 24]} />
          <meshStandardMaterial color="#ccc" roughness={0.12} metalness={0.88} />
        </mesh>
      ))}

      {/* Axle */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.12, 12]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* === WIRE SPOKES (default for RE Classic 350) === */}
      {spoked && Array.from({ length: WIRE_SPOKE_COUNT }).map((_, i) => {
        const angle = (i / WIRE_SPOKE_COUNT) * Math.PI * 2
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
          <group key={i}>
            {/* Wire spoke */}
            <mesh position={[mx, my, zOff]} rotation={[0, 0, rot - Math.PI / 2]}>
              <cylinderGeometry args={[0.0012, 0.0012, len, 3]} />
              <meshStandardMaterial color="#ddd" roughness={0.15} metalness={0.85} />
            </mesh>
            {/* Spoke nipple at rim end */}
            <mesh position={[ox, oy, zOff]}>
              <sphereGeometry args={[0.0025, 4, 4]} />
              <meshStandardMaterial color="#bbb" roughness={0.2} metalness={0.8} />
            </mesh>
          </group>
        )
      })}

      {/* === ALLOY WHEELS (5-spoke cast) === */}
      {!spoked && Array.from({ length: ALLOY_SPOKE_COUNT }).map((_, i) => {
        const angle = (i / ALLOY_SPOKE_COUNT) * Math.PI * 2
        const mx = Math.cos(angle) * (spokeInner + spokeOuter) / 2
        const my = Math.sin(angle) * (spokeInner + spokeOuter) / 2
        const len = spokeOuter - spokeInner

        return (
          <group key={i}>
            {/* Main spoke - wider, flat alloy */}
            <mesh position={[mx, my, 0]} rotation={[0, 0, angle - Math.PI / 2]}>
              <boxGeometry args={[0.024, len, 0.014]} />
              <meshStandardMaterial color="#b0b0b0" roughness={0.15} metalness={0.85} />
            </mesh>
            {/* Split spoke (Y-shape) */}
            {[-0.009, 0.009].map((off, j) => {
              const splitAngle = angle + off * 3
              const sx = Math.cos(splitAngle) * (spokeOuter * 0.7 + spokeInner * 0.3)
              const sy = Math.sin(splitAngle) * (spokeOuter * 0.7 + spokeInner * 0.3)
              const ex = Math.cos(angle) * spokeOuter
              const ey = Math.sin(angle) * spokeOuter
              const smx = (sx + ex) / 2
              const smy = (sy + ey) / 2
              const slen = Math.sqrt((ex - sx) ** 2 + (ey - sy) ** 2)
              const srot = Math.atan2(ey - sy, ex - sx)
              return (
                <mesh key={j} position={[smx, smy, 0]} rotation={[0, 0, srot - Math.PI / 2]}>
                  <boxGeometry args={[0.011, slen, 0.014]} />
                  <meshStandardMaterial color="#aaa" roughness={0.15} metalness={0.85} />
                </mesh>
              )
            })}
          </group>
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
          <mesh position={[0, 0, 0.058]}>
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
