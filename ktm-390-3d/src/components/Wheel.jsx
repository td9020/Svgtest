import { useRef } from 'react'
import * as THREE from 'three'
import { SPECS } from './dimensions'

// KTM 390 Duke:
// Both wheels: 17-inch alloy rims (431.8mm diameter)
// Front: 110/70-17 tire, OD ~594mm -> radius 297mm
// Rear: 150/60-17 tire, OD ~618mm -> radius 309mm
// Front disc: 320mm, Rear disc: 230mm
// 5-spoke star pattern alloy wheels (default) or 36 wire spokes

const WIRE_SPOKE_COUNT = 36
const ALLOY_SPOKE_COUNT = 5

export default function Wheel({
  position = [0, 0, 0],
  isRear = false,
  spinAngle = 0,
  spoked = false,
}) {
  const group = useRef()

  const rimRadius = SPECS.rimRadius                       // 0.2159m
  const tireRadius = isRear ? SPECS.rearTireRadius : SPECS.frontTireRadius
  const tireWidth = isRear ? SPECS.rearTireWidth : SPECS.frontTireWidth
  const tubeRadius = (tireRadius - rimRadius) / 2 + tireWidth / 5
  const tireMidRadius = rimRadius + tubeRadius
  const hubRadius = 0.04
  const spokeInner = hubRadius + 0.005
  const spokeOuter = rimRadius - 0.012
  const discRadius = isRear
    ? SPECS.rearDiscDiameter / 2   // 0.115m
    : SPECS.frontDiscDiameter / 2  // 0.160m

  return (
    <group ref={group} position={position} rotation={[0, 0, -spinAngle]}>
      {/* Tire */}
      <mesh>
        <torusGeometry args={[tireMidRadius, tubeRadius, 24, 48]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.92} metalness={0.03} />
      </mesh>

      {/* Rim - outer bead */}
      <mesh>
        <torusGeometry args={[rimRadius, 0.012, 16, 48]} />
        <meshStandardMaterial
          color={spoked ? '#c0c0c0' : '#1a1a1a'}
          roughness={spoked ? 0.1 : 0.2}
          metalness={spoked ? 0.9 : 0.8}
        />
      </mesh>

      {/* Rim - inner bead */}
      <mesh>
        <torusGeometry args={[rimRadius - 0.025, 0.009, 12, 48]} />
        <meshStandardMaterial
          color={spoked ? '#c0c0c0' : '#1a1a1a'}
          roughness={0.25}
          metalness={0.75}
        />
      </mesh>

      {/* Hub - central */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[hubRadius, hubRadius, 0.06, 24]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Hub flanges */}
      {[-0.028, 0.028].map((z, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z]}>
          <cylinderGeometry args={[hubRadius + 0.008, hubRadius + 0.008, 0.006, 24]} />
          <meshStandardMaterial color="#333" roughness={0.25} metalness={0.75} />
        </mesh>
      ))}

      {/* Axle */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.11, 12]} />
        <meshStandardMaterial color="#555" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* === WIRE SPOKES (when spoked=true) === */}
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

      {/* === ALLOY Y-SPOKES (when spoked=false) - KTM signature 5-spoke star === */}
      {!spoked && Array.from({ length: ALLOY_SPOKE_COUNT }).map((_, i) => {
        const angle = (i / ALLOY_SPOKE_COUNT) * Math.PI * 2
        // Each spoke is a Y-split - main spoke from hub to rim
        const spokeInnerR = hubRadius + 0.01
        const spokeOuterR = rimRadius - 0.015
        const rot = angle - Math.PI / 2

        // Split spoke into two arms near the rim
        const splitStart = spokeOuterR * 0.55
        const splitAngleOffset = 0.18

        const arm1Angle = angle + splitAngleOffset
        const arm2Angle = angle - splitAngleOffset
        const arm1mx = (Math.cos(angle) * splitStart + Math.cos(arm1Angle) * spokeOuterR) / 2
        const arm1my = (Math.sin(angle) * splitStart + Math.sin(arm1Angle) * spokeOuterR) / 2
        const arm2mx = (Math.cos(angle) * splitStart + Math.cos(arm2Angle) * spokeOuterR) / 2
        const arm2my = (Math.sin(angle) * splitStart + Math.sin(arm2Angle) * spokeOuterR) / 2

        const armLen = spokeOuterR - splitStart + 0.02
        const arm1rot = Math.atan2(
          Math.sin(arm1Angle) * spokeOuterR - Math.sin(angle) * splitStart,
          Math.cos(arm1Angle) * spokeOuterR - Math.cos(angle) * splitStart
        )
        const arm2rot = Math.atan2(
          Math.sin(arm2Angle) * spokeOuterR - Math.sin(angle) * splitStart,
          Math.cos(arm2Angle) * spokeOuterR - Math.cos(angle) * splitStart
        )

        return (
          <group key={i}>
            {/* Main spoke trunk - from hub to split point */}
            <mesh position={[
              Math.cos(angle) * (spokeInnerR + splitStart) / 2,
              Math.sin(angle) * (spokeInnerR + splitStart) / 2,
              0
            ]} rotation={[0, 0, rot]}>
              <boxGeometry args={[0.022, splitStart - spokeInnerR, 0.014]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
            </mesh>

            {/* Left arm of Y-split */}
            <mesh position={[arm1mx, arm1my, 0]} rotation={[0, 0, arm1rot - Math.PI / 2]}>
              <boxGeometry args={[0.015, armLen * 0.65, 0.012]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
            </mesh>

            {/* Right arm of Y-split */}
            <mesh position={[arm2mx, arm2my, 0]} rotation={[0, 0, arm2rot - Math.PI / 2]}>
              <boxGeometry args={[0.015, armLen * 0.65, 0.012]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
            </mesh>
          </group>
        )
      })}

      {/* Disc brake - both wheels have discs on KTM 390 */}
      <mesh position={[0, 0, 0.035]}>
        <ringGeometry args={[hubRadius + 0.01, discRadius, 48]} />
        <meshStandardMaterial color="#aaa" roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Disc ventilation holes - wave pattern */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2
        const r = discRadius * 0.7
        return (
          <mesh key={`h-${i}`} position={[Math.cos(a) * r, Math.sin(a) * r, 0.036]}>
            <circleGeometry args={[0.006, 6]} />
            <meshStandardMaterial color="#666" side={THREE.DoubleSide} />
          </mesh>
        )
      })}

      {/* Disc ventilation holes - inner ring */}
      {!isRear && Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2
        const r = discRadius * 0.5
        return (
          <mesh key={`hi-${i}`} position={[Math.cos(a) * r, Math.sin(a) * r, 0.036]}>
            <circleGeometry args={[0.005, 6]} />
            <meshStandardMaterial color="#666" side={THREE.DoubleSide} />
          </mesh>
        )
      })}

      {/* Brake caliper - radial mount on front (KTM signature) */}
      <group position={[discRadius - 0.02, 0, 0.055]}>
        <mesh>
          <boxGeometry args={[isRear ? 0.035 : 0.055, isRear ? 0.04 : 0.065, 0.032]} />
          <meshStandardMaterial color={isRear ? '#333' : '#222'} roughness={0.5} metalness={0.5} />
        </mesh>
        {/* Caliper pistons detail */}
        {!isRear && (
          <>
            <mesh position={[-0.015, 0.02, 0.017]}>
              <cylinderGeometry args={[0.005, 0.005, 0.005, 6]} />
              <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
            </mesh>
            <mesh position={[0.015, 0.02, 0.017]}>
              <cylinderGeometry args={[0.005, 0.005, 0.005, 6]} />
              <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
            </mesh>
          </>
        )}
      </group>

      {/* Valve stem */}
      <mesh position={[0, rimRadius - 0.01, 0.025]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.02, 6]} />
        <meshStandardMaterial color="#666" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  )
}
