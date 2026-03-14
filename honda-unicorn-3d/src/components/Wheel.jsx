import { useRef } from 'react'
import * as THREE from 'three'
import { SPECS } from './dimensions'

const WIRE_SPOKE_COUNT = 36
const ALLOY_SPOKE_COUNT = 5

export default function Wheel({
  position = [0, 0, 0],
  isRear = false,
  hasFrontDisc = false,
  spinAngle = 0,
  spoked = false,
}) {
  const group = useRef()

  const rimRadius = SPECS.rimRadius
  const tireRadius = isRear ? SPECS.rearTireRadius : SPECS.frontTireRadius
  const tireWidth = isRear ? SPECS.rearTireWidth : SPECS.frontTireWidth
  const tubeRadius = (tireRadius - rimRadius) / 2 + tireWidth / 5
  const tireMidRadius = rimRadius + tubeRadius
  const hubRadius = 0.035
  const spokeInner = hubRadius + 0.005
  const spokeOuter = rimRadius - 0.012
  const discRadius = hasFrontDisc
    ? SPECS.frontDiscDiameter / 2
    : SPECS.rearDrumDiameter / 2

  return (
    <group ref={group} position={position} rotation={[0, 0, -spinAngle]}>
      {/* Tire */}
      <mesh>
        <torusGeometry args={[tireMidRadius, tubeRadius, 24, 48]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.92} metalness={0.03} />
      </mesh>

      {/* Rim - outer bead */}
      <mesh>
        <torusGeometry args={[rimRadius, 0.01, 16, 48]} />
        <meshStandardMaterial
          color={spoked ? '#c0c0c0' : '#b0b0b0'}
          roughness={spoked ? 0.1 : 0.15}
          metalness={spoked ? 0.9 : 0.85}
        />
      </mesh>

      {/* Rim - inner bead */}
      <mesh>
        <torusGeometry args={[rimRadius - 0.022, 0.008, 12, 48]} />
        <meshStandardMaterial
          color={spoked ? '#c0c0c0' : '#b0b0b0'}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[hubRadius, hubRadius, 0.055, 24]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Hub flanges */}
      {[-0.025, 0.025].map((z, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z]}>
          <cylinderGeometry args={[hubRadius + 0.006, hubRadius + 0.006, 0.006, 24]} />
          <meshStandardMaterial color="#999" roughness={0.25} metalness={0.75} />
        </mesh>
      ))}

      {/* Axle */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 12]} />
        <meshStandardMaterial color="#555" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* === SPOKED WHEELS (wire type) === */}
      {spoked && Array.from({ length: WIRE_SPOKE_COUNT }).map((_, i) => {
        const angle = (i / WIRE_SPOKE_COUNT) * Math.PI * 2
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
          <group key={i}>
            {/* Wire spoke */}
            <mesh position={[mx, my, zOff]} rotation={[0, 0, rot - Math.PI / 2]}>
              <cylinderGeometry args={[0.001, 0.001, len, 3]} />
              <meshStandardMaterial color="#d0d0d0" roughness={0.1} metalness={0.9} />
            </mesh>
            {/* Spoke nipple at rim end */}
            <mesh position={[ox, oy, zOff]}>
              <sphereGeometry args={[0.002, 4, 4]} />
              <meshStandardMaterial color="#c0c0c0" roughness={0.15} metalness={0.85} />
            </mesh>
          </group>
        )
      })}

      {/* === ALLOY WHEELS (Y-spoke cast) === */}
      {!spoked && Array.from({ length: ALLOY_SPOKE_COUNT }).map((_, i) => {
        const angle = (i / ALLOY_SPOKE_COUNT) * Math.PI * 2
        const mx = Math.cos(angle) * (spokeInner + spokeOuter) / 2
        const my = Math.sin(angle) * (spokeInner + spokeOuter) / 2
        const len = spokeOuter - spokeInner

        return (
          <group key={i}>
            {/* Main spoke - wider, flat alloy */}
            <mesh position={[mx, my, 0]} rotation={[0, 0, angle - Math.PI / 2]}>
              <boxGeometry args={[0.022, len, 0.012]} />
              <meshStandardMaterial color="#b0b0b0" roughness={0.15} metalness={0.85} />
            </mesh>
            {/* Split spoke (Y-shape) */}
            {[-0.008, 0.008].map((off, j) => {
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
                <mesh key={j} position={[smx, smy, 0]} rotation={[0, 0, srot]}>
                  <boxGeometry args={[0.01, slen, 0.012]} />
                  <meshStandardMaterial color="#aaa" roughness={0.15} metalness={0.85} />
                </mesh>
              )
            })}
          </group>
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
