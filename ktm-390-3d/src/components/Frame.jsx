import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { SPECS, POS } from './dimensions'

// KTM 390 Duke: TRELLIS FRAME - signature feature!
// Orange (#FF6600) steel trellis with triangulated lattice structure
// Bolt-on rear subframe
// Box-section aluminum swingarm

const KTM_ORANGE = '#FF6600'
const FRAME_DARK = '#2a2a2a'

function Tube({ points, radius = 0.012, color = KTM_ORANGE, tubularSegments = 32, radialSegments = 8 }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(...p))
    )
    return new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false)
  }, [points, radius, tubularSegments, radialSegments])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.65} />
    </mesh>
  )
}

// Weld joint at tube intersections - KTM trellis signature
function WeldJoint({ position, radius = 0.016, color = KTM_ORANGE }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 12, 12]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
    </mesh>
  )
}

export default function Frame({ position = [0, 0, 0] }) {
  const group = useRef()

  const wb = SPECS.wheelbase          // 1.367
  const sh = SPECS.seatHeight         // 0.830
  const gc = SPECS.groundClearance    // 0.172
  const rearAxleY = POS.rearAxle.y    // 0.309
  const frontAxleY = POS.frontAxle.y  // 0.297

  // Steering head: above front axle, tilted
  const steerX = wb - 0.08
  const steerTopY = 0.88
  const steerBotY = 0.66

  // Rear pivot: above rear axle
  const pivotX = 0.30
  const pivotY = 0.44

  // Trellis junction points
  const j1 = [steerX - 0.05, 0.82, 0.05]    // top near steering head - right
  const j1L = [steerX - 0.05, 0.82, -0.05]   // top near steering head - left
  const j2 = [wb * 0.65, sh + 0.04, 0.06]    // upper mid-frame - right
  const j2L = [wb * 0.65, sh + 0.04, -0.06]   // upper mid-frame - left
  const j3 = [wb * 0.48, sh, 0.06]           // mid-frame - right
  const j3L = [wb * 0.48, sh, -0.06]          // mid-frame - left
  const j4 = [pivotX + 0.18, 0.70, 0.06]     // lower-mid - right
  const j4L = [pivotX + 0.18, 0.70, -0.06]    // lower-mid - left
  const j5 = [pivotX + 0.05, pivotY + 0.15, 0.065] // near pivot - right
  const j5L = [pivotX + 0.05, pivotY + 0.15, -0.065] // near pivot - left

  // Lower trellis points
  const l1 = [steerX - 0.06, steerBotY, 0.05]
  const l1L = [steerX - 0.06, steerBotY, -0.05]
  const l2 = [wb * 0.55, 0.50, 0.06]
  const l2L = [wb * 0.55, 0.50, -0.06]
  const l3 = [wb * 0.40, 0.38, 0.06]
  const l3L = [wb * 0.40, 0.38, -0.06]
  const l4 = [pivotX + 0.05, pivotY, 0.065]
  const l4L = [pivotX + 0.05, pivotY, -0.065]

  const tubeR = 0.011

  return (
    <group ref={group} position={position}>
      {/* === TRELLIS FRAME - RIGHT SIDE === */}
      {/* Upper main tube - right */}
      <Tube points={[j1, j2, j3, j4, j5]} radius={tubeR} />
      {/* Lower main tube - right */}
      <Tube points={[l1, l2, l3, l4]} radius={tubeR} />

      {/* Diagonal cross tubes - right (triangulation!) */}
      <Tube points={[j2, l2]} radius={tubeR * 0.8} />
      <Tube points={[j3, l3]} radius={tubeR * 0.8} />
      <Tube points={[j4, l4]} radius={tubeR * 0.8} />
      <Tube points={[j2, l3]} radius={tubeR * 0.7} />
      <Tube points={[j3, l4]} radius={tubeR * 0.7} />

      {/* === TRELLIS FRAME - LEFT SIDE === */}
      {/* Upper main tube - left */}
      <Tube points={[j1L, j2L, j3L, j4L, j5L]} radius={tubeR} />
      {/* Lower main tube - left */}
      <Tube points={[l1L, l2L, l3L, l4L]} radius={tubeR} />

      {/* Diagonal cross tubes - left (triangulation!) */}
      <Tube points={[j2L, l2L]} radius={tubeR * 0.8} />
      <Tube points={[j3L, l3L]} radius={tubeR * 0.8} />
      <Tube points={[j4L, l4L]} radius={tubeR * 0.8} />
      <Tube points={[j2L, l3L]} radius={tubeR * 0.7} />
      <Tube points={[j3L, l4L]} radius={tubeR * 0.7} />

      {/* Cross braces - connecting left to right */}
      <Tube points={[j2, j2L]} radius={tubeR * 0.7} />
      <Tube points={[j4, j4L]} radius={tubeR * 0.7} />
      <Tube points={[l2, l2L]} radius={tubeR * 0.7} />
      <Tube points={[l4, l4L]} radius={tubeR * 0.7} />

      {/* === WELD JOINTS at intersections === */}
      <WeldJoint position={j1} />
      <WeldJoint position={j1L} />
      <WeldJoint position={j2} />
      <WeldJoint position={j2L} />
      <WeldJoint position={j3} />
      <WeldJoint position={j3L} />
      <WeldJoint position={j4} />
      <WeldJoint position={j4L} />
      <WeldJoint position={j5} />
      <WeldJoint position={j5L} />
      <WeldJoint position={l1} />
      <WeldJoint position={l1L} />
      <WeldJoint position={l2} />
      <WeldJoint position={l2L} />
      <WeldJoint position={l3} />
      <WeldJoint position={l3L} />
      <WeldJoint position={l4} />
      <WeldJoint position={l4L} />

      {/* === Steering head tube === */}
      <mesh position={[steerX - 0.01, (steerTopY + steerBotY) / 2, 0]} rotation={[0, 0, 0.28]}>
        <cylinderGeometry args={[0.024, 0.024, steerTopY - steerBotY + 0.04, 12]} />
        <meshStandardMaterial color={FRAME_DARK} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* === Swingarm pivot block === */}
      <mesh position={[pivotX, pivotY, 0]}>
        <boxGeometry args={[0.05, 0.06, 0.15]} />
        <meshStandardMaterial color={FRAME_DARK} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* === BOLT-ON REAR SUBFRAME - left === */}
      <Tube
        points={[
          [pivotX, pivotY + 0.12, -0.06],
          [pivotX - 0.12, sh + 0.02, -0.06],
          [pivotX - 0.32, sh, -0.06],
          [-0.08, sh - 0.06, -0.06],
        ]}
        radius={0.008}
        color={FRAME_DARK}
      />

      {/* === BOLT-ON REAR SUBFRAME - right === */}
      <Tube
        points={[
          [pivotX, pivotY + 0.12, 0.06],
          [pivotX - 0.12, sh + 0.02, 0.06],
          [pivotX - 0.32, sh, 0.06],
          [-0.08, sh - 0.06, 0.06],
        ]}
        radius={0.008}
        color={FRAME_DARK}
      />

      {/* Lower subframe left */}
      <Tube
        points={[
          [pivotX - 0.04, pivotY - 0.04, -0.06],
          [pivotX - 0.22, 0.38, -0.06],
          [-0.08, sh - 0.06, -0.06],
        ]}
        radius={0.006}
        color={FRAME_DARK}
      />

      {/* Lower subframe right */}
      <Tube
        points={[
          [pivotX - 0.04, pivotY - 0.04, 0.06],
          [pivotX - 0.22, 0.38, 0.06],
          [-0.08, sh - 0.06, 0.06],
        ]}
        radius={0.006}
        color={FRAME_DARK}
      />

      {/* Subframe bolt points (visible) */}
      {[
        [pivotX, pivotY + 0.12, -0.065],
        [pivotX, pivotY + 0.12, 0.065],
      ].map((pos, i) => (
        <mesh key={`sb-${i}`} position={pos} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.01, 6]} />
          <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}

      {/* === BOX-SECTION ALUMINUM SWINGARM - left === */}
      <Tube
        points={[
          [pivotX, pivotY, -0.07],
          [pivotX - 0.16, pivotY - 0.06, -0.07],
          [0.08, rearAxleY + 0.01, -0.07],
          [0, rearAxleY, -0.07],
        ]}
        radius={0.018}
        color="#444"
      />

      {/* Swingarm box section profile - left */}
      <Tube
        points={[
          [pivotX, pivotY - 0.02, -0.07],
          [pivotX - 0.16, pivotY - 0.08, -0.07],
          [0.08, rearAxleY - 0.01, -0.07],
          [0, rearAxleY - 0.01, -0.07],
        ]}
        radius={0.015}
        color="#444"
      />

      {/* === BOX-SECTION ALUMINUM SWINGARM - right === */}
      <Tube
        points={[
          [pivotX, pivotY, 0.07],
          [pivotX - 0.16, pivotY - 0.06, 0.07],
          [0.08, rearAxleY + 0.01, 0.07],
          [0, rearAxleY, 0.07],
        ]}
        radius={0.018}
        color="#444"
      />

      {/* Swingarm box section profile - right */}
      <Tube
        points={[
          [pivotX, pivotY - 0.02, 0.07],
          [pivotX - 0.16, pivotY - 0.08, 0.07],
          [0.08, rearAxleY - 0.01, 0.07],
          [0, rearAxleY - 0.01, 0.07],
        ]}
        radius={0.015}
        color="#444"
      />

      {/* Swingarm cross brace */}
      <mesh position={[pivotX - 0.10, pivotY - 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.13, 8]} />
        <meshStandardMaterial color="#444" roughness={0.35} metalness={0.65} />
      </mesh>

      {/* Chain guard */}
      <Tube
        points={[
          [pivotX - 0.04, pivotY - 0.12, 0.08],
          [0.15, 0.32, 0.08],
          [0.05, rearAxleY + 0.03, 0.08],
        ]}
        radius={0.005}
        color="#333"
      />
    </group>
  )
}
