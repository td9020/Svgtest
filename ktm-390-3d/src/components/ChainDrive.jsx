import { useMemo } from 'react'
import * as THREE from 'three'

// Animated chain drive system for KTM 390 Duke
// Front sprocket at engine output, rear sprocket at rear wheel
// Chain links connect them with animated motion
// KTM 390: 14T front / 45T rear, X-ring chain

export default function ChainDrive({ position = [0, 0, 0], wheelAngle = 0, chainOffset = 0 }) {
  // KTM 390 positions based on dimensions.js
  // Engine at wb*0.38 = 0.52, front sprocket slightly lower
  // Rear sprocket at rear wheel (x=0)
  const frontSprocketPos = [0.40, 0.20, 0.08]   // engine output shaft
  const rearSprocketPos = [0, 0.309, 0.08]       // rear wheel axle

  const CHAIN_LINKS = 40
  const frontR = 0.024   // 14T front sprocket
  const rearR = 0.055    // 45T rear sprocket

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
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * frontR, 0, Math.sin(a) * frontR]}>
              <boxGeometry args={[0.003, 0.006, 0.004]} />
              <meshStandardMaterial color="#777" roughness={0.3} metalness={0.7} />
            </mesh>
          )
        })}
      </group>

      {/* Rear sprocket (visual teeth) */}
      <group position={rearSprocketPos} rotation={[Math.PI / 2, wheelAngle, 0]}>
        {/* Sprocket teeth ring */}
        {Array.from({ length: 28 }).map((_, i) => {
          const a = (i / 28) * Math.PI * 2
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
      <mesh position={[0.20, 0.27, 0.08]}>
        <boxGeometry args={[0.26, 0.003, 0.018]} />
        <meshStandardMaterial color="#222" roughness={0.6} metalness={0.3} />
      </mesh>
    </group>
  )
}
