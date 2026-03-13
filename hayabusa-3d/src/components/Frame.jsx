import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { SPECS, POS } from './dimensions'

// Suzuki Hayabusa GSX1300R: Twin-spar aluminum frame
// Wheelbase: 1480mm
// Wide, flat beams (not tubular like Unicorn)
// Natural aluminum / silver color
// Braced aluminum swingarm with linkage rear suspension

function Spar({ points, width = 0.040, height = 0.020, color = '#b0b0b0' }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(...p))
    )
    // Rectangular cross-section via extrude along curve
    const shape = new THREE.Shape()
    shape.moveTo(-width / 2, -height / 2)
    shape.lineTo(width / 2, -height / 2)
    shape.lineTo(width / 2, height / 2)
    shape.lineTo(-width / 2, height / 2)
    shape.closePath()

    return new THREE.ExtrudeGeometry(shape, {
      steps: 32,
      extrudePath: curve,
      bevelEnabled: false,
    })
  }, [points, width, height])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.25} metalness={0.75} />
    </mesh>
  )
}

function Tube({ points, radius = 0.014, color = '#b0b0b0', tubularSegments = 32, radialSegments = 8 }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(...p))
    )
    return new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false)
  }, [points, radius, tubularSegments, radialSegments])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.25} metalness={0.75} />
    </mesh>
  )
}

export default function Frame({ position = [0, 0, 0] }) {
  const group = useRef()

  const wb = SPECS.wheelbase          // 1.480
  const sh = SPECS.seatHeight         // 0.800
  const rearAxleY = POS.rearAxle.y    // 0.316
  const frontAxleY = POS.frontAxle.y  // 0.310

  // Steering head: above front axle, tilted
  const steerX = wb - 0.08
  const steerTopY = 0.85
  const steerBotY = 0.62

  // Swingarm pivot: above rear axle area
  const pivotX = 0.32
  const pivotY = 0.44

  // Frame mid-top (tank rail)
  const midTopX = wb * 0.55
  const midTopY = sh + 0.10

  // Spar spacing (left/right)
  const sparZ = 0.065

  return (
    <group ref={group} position={position}>
      {/* === Left twin spar === */}
      <Spar
        points={[
          [steerX - 0.02, steerTopY - 0.06, -sparZ],
          [midTopX + 0.05, midTopY - 0.02, -sparZ],
          [midTopX - 0.15, midTopY - 0.04, -sparZ],
          [pivotX + 0.10, 0.58, -sparZ],
          [pivotX, pivotY + 0.04, -sparZ],
        ]}
        width={0.045}
        height={0.022}
      />

      {/* === Right twin spar === */}
      <Spar
        points={[
          [steerX - 0.02, steerTopY - 0.06, sparZ],
          [midTopX + 0.05, midTopY - 0.02, sparZ],
          [midTopX - 0.15, midTopY - 0.04, sparZ],
          [pivotX + 0.10, 0.58, sparZ],
          [pivotX, pivotY + 0.04, sparZ],
        ]}
        width={0.045}
        height={0.022}
      />

      {/* === Cross brace behind steering head === */}
      <mesh position={[steerX - 0.06, steerTopY - 0.10, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, sparZ * 2, 8]} />
        <meshStandardMaterial color="#b0b0b0" roughness={0.25} metalness={0.75} />
      </mesh>

      {/* === Cross brace near pivot === */}
      <mesh position={[pivotX + 0.08, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.010, 0.010, sparZ * 2, 8]} />
        <meshStandardMaterial color="#b0b0b0" roughness={0.25} metalness={0.75} />
      </mesh>

      {/* === Steering head tube === */}
      <mesh position={[steerX - 0.01, (steerTopY + steerBotY) / 2, 0]} rotation={[0, 0, 0.28]}>
        <cylinderGeometry args={[0.025, 0.025, steerTopY - steerBotY + 0.04, 12]} />
        <meshStandardMaterial color="#b0b0b0" roughness={0.25} metalness={0.75} />
      </mesh>

      {/* === Rear subframe left === */}
      <Tube
        points={[
          [pivotX, pivotY + 0.06, -sparZ - 0.005],
          [pivotX - 0.15, sh + 0.04, -sparZ],
          [pivotX - 0.35, sh + 0.02, -sparZ],
          [-0.08, sh - 0.02, -sparZ],
        ]}
        radius={0.010}
      />

      {/* === Rear subframe right === */}
      <Tube
        points={[
          [pivotX, pivotY + 0.06, sparZ + 0.005],
          [pivotX - 0.15, sh + 0.04, sparZ],
          [pivotX - 0.35, sh + 0.02, sparZ],
          [-0.08, sh - 0.02, sparZ],
        ]}
        radius={0.010}
      />

      {/* === Lower subframe (both sides) === */}
      {[-1, 1].map((side, idx) => (
        <Tube
          key={idx}
          points={[
            [pivotX - 0.05, pivotY - 0.05, side * sparZ],
            [pivotX - 0.25, 0.38, side * sparZ],
            [-0.08, sh - 0.02, side * sparZ],
          ]}
          radius={0.008}
        />
      ))}

      {/* === Swingarm pivot block === */}
      <mesh position={[pivotX, pivotY, 0]}>
        <boxGeometry args={[0.050, 0.060, sparZ * 2 + 0.03]} />
        <meshStandardMaterial color="#b0b0b0" roughness={0.25} metalness={0.75} />
      </mesh>

      {/* === Swingarm left === */}
      <Spar
        points={[
          [pivotX, pivotY, -sparZ - 0.01],
          [pivotX - 0.18, pivotY - 0.05, -sparZ - 0.01],
          [0.10, rearAxleY + 0.015, -sparZ - 0.01],
          [0, rearAxleY, -sparZ - 0.01],
        ]}
        width={0.035}
        height={0.020}
      />

      {/* === Swingarm right === */}
      <Spar
        points={[
          [pivotX, pivotY, sparZ + 0.01],
          [pivotX - 0.18, pivotY - 0.05, sparZ + 0.01],
          [0.10, rearAxleY + 0.015, sparZ + 0.01],
          [0, rearAxleY, sparZ + 0.01],
        ]}
        width={0.035}
        height={0.020}
      />

      {/* === Swingarm cross brace === */}
      <mesh position={[pivotX - 0.14, pivotY - 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.010, 0.010, (sparZ + 0.01) * 2, 8]} />
        <meshStandardMaterial color="#b0b0b0" roughness={0.25} metalness={0.75} />
      </mesh>

      {/* === Chain guard === */}
      <Tube
        points={[
          [pivotX - 0.05, pivotY - 0.10, sparZ + 0.02],
          [0.15, 0.30, sparZ + 0.02],
          [0.05, rearAxleY + 0.04, sparZ + 0.02],
        ]}
        radius={0.006}
        color="#444"
      />

      {/* === Linkage-type rear suspension (monoshock) === */}
      {/* Shock body - under seat, connected via linkage */}
      <group position={[pivotX - 0.05, pivotY + 0.12, 0]}>
        {/* Main shock body */}
        <mesh rotation={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.016, 0.016, 0.20, 8]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.5} />
        </mesh>
        {/* Shock spring */}
        <mesh rotation={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.024, 0.024, 0.13, 8]} />
          <meshStandardMaterial color="#daa520" roughness={0.25} metalness={0.65} />
        </mesh>
        {/* Reservoir */}
        <mesh position={[0.025, 0.04, 0.025]} rotation={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.010, 0.010, 0.06, 8]} />
          <meshStandardMaterial color="#222" roughness={0.5} metalness={0.5} />
        </mesh>
      </group>

      {/* Linkage arms */}
      <Tube
        points={[
          [pivotX - 0.04, pivotY - 0.02, 0],
          [pivotX - 0.08, pivotY + 0.08, 0],
        ]}
        radius={0.008}
        color="#999"
      />
      <Tube
        points={[
          [pivotX - 0.08, pivotY + 0.08, 0],
          [pivotX - 0.14, pivotY - 0.02, 0],
        ]}
        radius={0.008}
        color="#999"
      />

      {/* Chain - simplified */}
      <mesh position={[0.16, rearAxleY - 0.04, sparZ + 0.02]} rotation={[0, 0, 0.12]}>
        <boxGeometry args={[0.34, 0.012, 0.008]} />
        <meshStandardMaterial color="#444" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0.16, rearAxleY - 0.07, sparZ + 0.02]} rotation={[0, 0, 0.12]}>
        <boxGeometry args={[0.34, 0.012, 0.008]} />
        <meshStandardMaterial color="#444" roughness={0.6} metalness={0.4} />
      </mesh>
    </group>
  )
}
