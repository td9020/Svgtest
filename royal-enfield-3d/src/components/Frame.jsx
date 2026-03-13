import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { SPECS, POS } from './dimensions'

// Royal Enfield Classic 350: Single downtube cradle frame
// Wheelbase: 1390mm
// BLACK frame color (classic RE)
// Twin rear shock absorbers
// Classic round-tube construction

const FRAME_COLOR = '#1a1a1a'

function Tube({ points, radius = 0.014, color = FRAME_COLOR, tubularSegments = 32, radialSegments = 8 }) {
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

  const wb = SPECS.wheelbase          // 1.390
  const sh = SPECS.seatHeight         // 0.805
  const rearAxleY = POS.rearAxle.y    // 0.330
  const frontAxleY = POS.frontAxle.y  // 0.339

  // Steering head
  const steerX = wb - 0.08
  const steerTopY = 0.88
  const steerBotY = 0.66

  // Rear swing pivot
  const pivotX = 0.32
  const pivotY = 0.45

  // Frame mid-top (tank rail)
  const midTopX = wb * 0.55
  const midTopY = sh + 0.08

  return (
    <group ref={group} position={position}>
      {/* === Main backbone (top tube / tank rail) === */}
      <Tube
        points={[
          [steerX, steerTopY, 0],
          [midTopX + 0.12, midTopY, 0],
          [midTopX - 0.12, midTopY - 0.02, 0],
          [pivotX + 0.18, 0.70, 0],
          [pivotX, pivotY + 0.14, 0],
        ]}
        radius={0.017}
      />

      {/* === Single downtube (classic RE) === */}
      <Tube
        points={[
          [steerX - 0.02, steerBotY, 0],
          [wb * 0.55, 0.50, 0],
          [wb * 0.40, 0.37, 0],
          [pivotX + 0.12, 0.30, 0],
        ]}
        radius={0.016}
      />

      {/* === Left cradle tube (under engine) === */}
      <Tube
        points={[
          [pivotX + 0.12, 0.30, 0],
          [pivotX + 0.05, 0.25, -0.06],
          [pivotX, pivotY - 0.02, -0.065],
        ]}
        radius={0.012}
      />

      {/* === Right cradle tube (under engine) === */}
      <Tube
        points={[
          [pivotX + 0.12, 0.30, 0],
          [pivotX + 0.05, 0.25, 0.06],
          [pivotX, pivotY - 0.02, 0.065],
        ]}
        radius={0.012}
      />

      {/* === Rear subframe left === */}
      <Tube
        points={[
          [pivotX, pivotY + 0.12, -0.06],
          [pivotX - 0.15, sh + 0.02, -0.06],
          [pivotX - 0.38, sh, -0.06],
          [-0.12, sh - 0.05, -0.06],
        ]}
        radius={0.010}
      />

      {/* === Rear subframe right === */}
      <Tube
        points={[
          [pivotX, pivotY + 0.12, 0.06],
          [pivotX - 0.15, sh + 0.02, 0.06],
          [pivotX - 0.38, sh, 0.06],
          [-0.12, sh - 0.05, 0.06],
        ]}
        radius={0.010}
      />

      {/* === Lower subframe left === */}
      <Tube
        points={[
          [pivotX - 0.05, pivotY - 0.06, -0.06],
          [pivotX - 0.28, 0.38, -0.06],
          [-0.12, sh - 0.05, -0.06],
        ]}
        radius={0.008}
      />

      {/* === Lower subframe right === */}
      <Tube
        points={[
          [pivotX - 0.05, pivotY - 0.06, 0.06],
          [pivotX - 0.28, 0.38, 0.06],
          [-0.12, sh - 0.05, 0.06],
        ]}
        radius={0.008}
      />

      {/* === Steering head tube === */}
      <mesh position={[steerX - 0.01, (steerTopY + steerBotY) / 2, 0]} rotation={[0, 0, 0.28]}>
        <cylinderGeometry args={[0.024, 0.024, steerTopY - steerBotY + 0.04, 12]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* === Swingarm pivot block === */}
      <mesh position={[pivotX, pivotY, 0]}>
        <boxGeometry args={[0.050, 0.060, 0.16]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* === Swingarm left === */}
      <Tube
        points={[
          [pivotX, pivotY, -0.070],
          [pivotX - 0.20, pivotY - 0.06, -0.070],
          [0.10, rearAxleY + 0.01, -0.070],
          [0, rearAxleY, -0.070],
        ]}
        radius={0.014}
      />

      {/* === Swingarm right === */}
      <Tube
        points={[
          [pivotX, pivotY, 0.070],
          [pivotX - 0.20, pivotY - 0.06, 0.070],
          [0.10, rearAxleY + 0.01, 0.070],
          [0, rearAxleY, 0.070],
        ]}
        radius={0.014}
      />

      {/* === Swingarm cross brace === */}
      <mesh position={[pivotX - 0.14, pivotY - 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.009, 0.009, 0.13, 8]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* === Chain guard === */}
      <Tube
        points={[
          [pivotX - 0.06, pivotY - 0.12, 0.080],
          [0.16, 0.32, 0.080],
          [0.06, rearAxleY + 0.03, 0.080],
        ]}
        radius={0.007}
        color="#333"
      />

      {/* === TWIN REAR SHOCKS (RE Classic signature - NOT monoshock) === */}
      {/* Left shock */}
      <group position={[0.10, rearAxleY + 0.07, -0.075]}>
        {/* Shock body (black) */}
        <mesh rotation={[0, 0, 0.20]}>
          <cylinderGeometry args={[0.016, 0.016, 0.26, 8]} />
          <meshStandardMaterial color="#222" roughness={0.5} metalness={0.5} />
        </mesh>
        {/* Chrome spring coil */}
        <mesh rotation={[0, 0, 0.20]}>
          <torusGeometry args={[0.024, 0.004, 6, 24]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
        </mesh>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i} position={[
            Math.sin(0.20) * (-0.10 + i * 0.022),
            Math.cos(0.20) * (-0.10 + i * 0.022),
            0
          ]} rotation={[0, 0, 0.20]}>
            <torusGeometry args={[0.024, 0.003, 6, 16]} />
            <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
          </mesh>
        ))}
        {/* Top mount eye */}
        <mesh position={[Math.sin(0.20) * 0.13, Math.cos(0.20) * 0.13, 0]}>
          <torusGeometry args={[0.008, 0.004, 6, 12]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Bottom mount eye */}
        <mesh position={[-Math.sin(0.20) * 0.13, -Math.cos(0.20) * 0.13, 0]}>
          <torusGeometry args={[0.008, 0.004, 6, 12]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* Right shock */}
      <group position={[0.10, rearAxleY + 0.07, 0.075]}>
        <mesh rotation={[0, 0, 0.20]}>
          <cylinderGeometry args={[0.016, 0.016, 0.26, 8]} />
          <meshStandardMaterial color="#222" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh rotation={[0, 0, 0.20]}>
          <torusGeometry args={[0.024, 0.004, 6, 24]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
        </mesh>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i} position={[
            Math.sin(0.20) * (-0.10 + i * 0.022),
            Math.cos(0.20) * (-0.10 + i * 0.022),
            0
          ]} rotation={[0, 0, 0.20]}>
            <torusGeometry args={[0.024, 0.003, 6, 16]} />
            <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
          </mesh>
        ))}
        <mesh position={[Math.sin(0.20) * 0.13, Math.cos(0.20) * 0.13, 0]}>
          <torusGeometry args={[0.008, 0.004, 6, 12]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[-Math.sin(0.20) * 0.13, -Math.cos(0.20) * 0.13, 0]}>
          <torusGeometry args={[0.008, 0.004, 6, 12]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* === Rear subframe cross braces === */}
      <mesh position={[pivotX - 0.20, sh - 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.11, 6]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[-0.05, sh - 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.11, 6]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  )
}
