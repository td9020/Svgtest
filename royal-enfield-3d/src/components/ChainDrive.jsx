import { useMemo } from 'react'
import * as THREE from 'three'

// Animated chain drive system for Royal Enfield Classic 350
// Front sprocket at engine output (16T), rear sprocket at rear wheel (37T)
// O-ring chain with animated motion

export default function ChainDrive({ position = [0, 0, 0], wheelAngle = 0, chainOffset = 0 }) {
  // RE Classic 350 positions - engine sprocket and rear wheel sprocket
  const frontSprocketPos = [0.42, 0.20, 0.080]   // engine output shaft (16T)
  const rearSprocketPos = [0, 0.330, 0.080]       // rear wheel axle (37T)

  const CHAIN_LINKS = 44
  const frontR = 0.025   // 16T sprocket radius
  const rearR = 0.060    // 37T sprocket radius

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
        fy + (ry - fy) * t + Math.sin(t * Math.PI) * 0.006,
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
      {/* Front sprocket (engine output - 16T) */}
      <group position={frontSprocketPos} rotation={[Math.PI / 2, wheelAngle * 2.3, 0]}>
        <mesh>
          <cylinderGeometry args={[frontR, frontR, 0.009, 16]} />
          <meshStandardMaterial color="#666" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Teeth */}
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * frontR, 0, Math.sin(a) * frontR]}>
              <boxGeometry args={[0.003, 0.007, 0.004]} />
              <meshStandardMaterial color="#777" roughness={0.3} metalness={0.7} />
            </mesh>
          )
        })}
      </group>

      {/* Rear sprocket teeth (visual addition to existing TailSection sprocket) */}
      <group position={rearSprocketPos} rotation={[Math.PI / 2, wheelAngle, 0]}>
        {Array.from({ length: 37 }).map((_, i) => {
          const a = (i / 37) * Math.PI * 2
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
              <boxGeometry args={[0.007, 0.004, 0.003]} />
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

      {/* Chain guard (upper run) */}
      <mesh position={[0.21, 0.27, 0.080]}>
        <boxGeometry args={[0.28, 0.003, 0.020]} />
        <meshStandardMaterial color="#222" roughness={0.6} metalness={0.3} />
      </mesh>
    </group>
  )
}
