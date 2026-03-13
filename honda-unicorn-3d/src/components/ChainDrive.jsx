import { useMemo } from 'react'
import * as THREE from 'three'

// Animated chain drive system
// Front sprocket at engine output, rear sprocket at rear wheel
// Chain links connect them with animated motion

export default function ChainDrive({ position = [0, 0, 0], wheelAngle = 0, chainOffset = 0 }) {
  const frontSprocketPos = [0.375, 0.18, 0.075]  // engine output shaft
  const rearSprocketPos = [0, 0.3185, 0.075]     // rear wheel

  const CHAIN_LINKS = 40
  const frontR = 0.022
  const rearR = 0.055

  // Calculate chain path points
  const chainPath = useMemo(() => {
    const fx = frontSprocketPos[0], fy = frontSprocketPos[1]
    const rx = rearSprocketPos[0], ry = rearSprocketPos[1]
    const points = []
    // Top run (front to rear sprocket)
    for (let i = 0; i <= 15; i++) {
      const t = i / 15
      points.push(new THREE.Vector3(
        fx + (rx - fx) * t,
        fy + (ry - fy) * t + Math.sin(t * Math.PI) * 0.005,
        0
      ))
    }
    // Around rear sprocket (bottom half)
    for (let i = 0; i <= 8; i++) {
      const a = -Math.PI * 0.3 + (i / 8) * Math.PI * 1.6
      points.push(new THREE.Vector3(
        rx + Math.cos(a) * rearR,
        ry + Math.sin(a) * rearR,
        0
      ))
    }
    // Bottom run (rear back to front)
    for (let i = 0; i <= 15; i++) {
      const t = i / 15
      points.push(new THREE.Vector3(
        rx + (fx - rx) * t,
        ry - rearR * 0.8 + (fy - frontR - ry + rearR * 0.8) * t - Math.sin(t * Math.PI) * 0.008,
        0
      ))
    }
    return points
  }, [])

  return (
    <group position={position}>
      {/* Front sprocket (engine output) */}
      <group position={frontSprocketPos} rotation={[Math.PI / 2, wheelAngle * 2.5, 0]}>
        <mesh>
          <cylinderGeometry args={[frontR, frontR, 0.008, 16]} />
          <meshStandardMaterial color="#666" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Teeth */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * frontR, 0, Math.sin(a) * frontR]}>
              <boxGeometry args={[0.003, 0.006, 0.004]} />
              <meshStandardMaterial color="#777" roughness={0.3} metalness={0.7} />
            </mesh>
          )
        })}
      </group>

      {/* Rear sprocket (already exists in TailSection but we add visual teeth) */}
      <group position={rearSprocketPos} rotation={[Math.PI / 2, wheelAngle, 0]}>
        {/* Sprocket teeth ring */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * rearR, 0, Math.sin(a) * rearR]}>
              <boxGeometry args={[0.004, 0.006, 0.005]} />
              <meshStandardMaterial color="#666" roughness={0.35} metalness={0.65} />
            </mesh>
          )
        })}
      </group>

      {/* Chain links */}
      {Array.from({ length: CHAIN_LINKS }).map((_, i) => {
        const t = ((i / CHAIN_LINKS) + chainOffset * 0.1) % 1.0
        const idx = t * (chainPath.length - 1)
        const i0 = Math.floor(idx) % chainPath.length
        const i1 = (i0 + 1) % chainPath.length
        const frac = idx - Math.floor(idx)
        const p = chainPath[i0].clone().lerp(chainPath[i1], frac)

        // Direction for rotation
        const next = chainPath[i1]
        const angle = Math.atan2(next.y - p.y, next.x - p.x)

        return (
          <group key={i} position={[p.x, p.y, frontSprocketPos[2]]}>
            {/* Outer plate */}
            <mesh rotation={[0, 0, angle]}>
              <boxGeometry args={[0.006, 0.004, 0.003]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#555' : '#444'} roughness={0.5} metalness={0.5} />
            </mesh>
            {/* Pin */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.001, 0.001, 0.005, 4]} />
              <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
            </mesh>
          </group>
        )
      })}

      {/* Chain guard (upper) */}
      <mesh position={[0.19, 0.26, 0.075]}>
        <boxGeometry args={[0.25, 0.003, 0.018]} />
        <meshStandardMaterial color="#222" roughness={0.6} metalness={0.3} />
      </mesh>
    </group>
  )
}
