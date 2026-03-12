import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { SPECS, POS } from './dimensions'

// Honda Unicorn 150: Diamond tubular frame
// Wheelbase: 1338mm
// Using real axle positions as reference

function Tube({ points, radius = 0.014, color = '#2a2a2a', tubularSegments = 32, radialSegments = 8 }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(...p))
    )
    return new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false)
  }, [points, radius, tubularSegments, radialSegments])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
    </mesh>
  )
}

export default function Frame({ position = [0, 0, 0] }) {
  const group = useRef()

  // Key frame points derived from real dimensions
  // x: longitudinal (0 = rear axle, positive = forward)
  // y: vertical (0 = ground)
  const wb = SPECS.wheelbase          // 1.338
  const sh = SPECS.seatHeight         // 0.798
  const gc = SPECS.groundClearance    // 0.174
  const rearAxleY = POS.rearAxle.y    // 0.3185
  const frontAxleY = POS.frontAxle.y  // 0.309

  // Steering head: above front axle, tilted
  const steerX = wb - 0.08
  const steerTopY = 0.82
  const steerBotY = 0.62

  // Rear pivot: above rear axle
  const pivotX = 0.28
  const pivotY = 0.42

  // Frame mid-top (tank rail)
  const midTopX = wb * 0.55
  const midTopY = sh + 0.08

  return (
    <group ref={group} position={position}>
      {/* === Main backbone (top tube) === */}
      <Tube
        points={[
          [steerX, steerTopY, 0],
          [midTopX + 0.1, midTopY, 0],
          [midTopX - 0.15, midTopY - 0.02, 0],
          [pivotX + 0.15, 0.65, 0],
          [pivotX, pivotY + 0.12, 0],
        ]}
        radius={0.016}
      />

      {/* === Down tube === */}
      <Tube
        points={[
          [steerX - 0.02, steerBotY, 0],
          [wb * 0.55, 0.48, 0],
          [wb * 0.38, 0.35, 0],
          [pivotX + 0.1, 0.28, 0],
        ]}
        radius={0.015}
      />

      {/* === Left cradle tube === */}
      <Tube
        points={[
          [steerX - 0.03, steerBotY - 0.02, -0.05],
          [wb * 0.5, 0.42, -0.06],
          [wb * 0.35, 0.32, -0.06],
          [pivotX, pivotY, -0.06],
        ]}
        radius={0.011}
      />

      {/* === Right cradle tube === */}
      <Tube
        points={[
          [steerX - 0.03, steerBotY - 0.02, 0.05],
          [wb * 0.5, 0.42, 0.06],
          [wb * 0.35, 0.32, 0.06],
          [pivotX, pivotY, 0.06],
        ]}
        radius={0.011}
      />

      {/* === Rear subframe left === */}
      <Tube
        points={[
          [pivotX, pivotY + 0.1, -0.055],
          [pivotX - 0.15, sh + 0.02, -0.055],
          [pivotX - 0.35, sh, -0.055],
          [-0.10, sh - 0.05, -0.055],
        ]}
        radius={0.009}
      />

      {/* === Rear subframe right === */}
      <Tube
        points={[
          [pivotX, pivotY + 0.1, 0.055],
          [pivotX - 0.15, sh + 0.02, 0.055],
          [pivotX - 0.35, sh, 0.055],
          [-0.10, sh - 0.05, 0.055],
        ]}
        radius={0.009}
      />

      {/* === Lower subframe left === */}
      <Tube
        points={[
          [pivotX - 0.05, pivotY - 0.05, -0.055],
          [pivotX - 0.25, 0.35, -0.055],
          [-0.10, sh - 0.05, -0.055],
        ]}
        radius={0.007}
      />

      {/* === Lower subframe right === */}
      <Tube
        points={[
          [pivotX - 0.05, pivotY - 0.05, 0.055],
          [pivotX - 0.25, 0.35, 0.055],
          [-0.10, sh - 0.05, 0.055],
        ]}
        radius={0.007}
      />

      {/* === Steering head tube === */}
      <mesh position={[steerX - 0.01, (steerTopY + steerBotY) / 2, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.022, 0.022, steerTopY - steerBotY + 0.04, 12]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* === Swingarm pivot block === */}
      <mesh position={[pivotX, pivotY, 0]}>
        <boxGeometry args={[0.045, 0.055, 0.14]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* === Swingarm left === */}
      <Tube
        points={[
          [pivotX, pivotY, -0.065],
          [pivotX - 0.18, pivotY - 0.06, -0.065],
          [0.08, rearAxleY + 0.01, -0.065],
          [0, rearAxleY, -0.065],
        ]}
        radius={0.013}
      />

      {/* === Swingarm right === */}
      <Tube
        points={[
          [pivotX, pivotY, 0.065],
          [pivotX - 0.18, pivotY - 0.06, 0.065],
          [0.08, rearAxleY + 0.01, 0.065],
          [0, rearAxleY, 0.065],
        ]}
        radius={0.013}
      />

      {/* === Chain guard === */}
      <Tube
        points={[
          [pivotX - 0.05, pivotY - 0.1, 0.075],
          [0.15, 0.30, 0.075],
          [0.05, rearAxleY + 0.03, 0.075],
        ]}
        radius={0.006}
        color="#333"
      />

      {/* === Swingarm cross brace === */}
      <mesh position={[pivotX - 0.12, pivotY - 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.12, 8]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  )
}
