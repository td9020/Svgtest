import { useMemo } from 'react'
import * as THREE from 'three'

// Animated chain drive system for Suzuki Hayabusa GSX1300R
// Front sprocket at engine output (18T), rear sprocket at rear wheel (43T)
// DID 530 chain - longer wheelbase than Unicorn, different engine position

export default function ChainDrive({ position = [0, 0, 0], wheelAngle = 0, chainOffset = 0 }) {
  // Hayabusa: engine at ~38% of 1.48m wheelbase, output shaft lower
  const frontSprocketPos = [1.480 * 0.30, 0.20, 0.08]  // engine output shaft
  const rearSprocketPos = [0, 0.316, 0.08]               // rear wheel axle

  const CHAIN_LINKS = 50  // more links for longer wheelbase
  const frontR = 0.025    // 18T front sprocket
  const rearR = 0.065     // 43T rear sprocket

  // Calculate chain path points
  const chainPath = useMemo(() => {
    const fx = frontSprocketPos[0], fy = frontSprocketPos[1]
    const rx = rearSprocketPos[0], ry = rearSprocketPos[1]
    const points = []
    // Top run (front to rear sprocket)
    for (let i = 0; i <= 18; i++) {
      const t = i / 18
      points.push(new THREE.Vector3(
        fx + (rx - fx) * t,
        fy + (ry - fy) * t + Math.sin(t * Math.PI) * 0.006,
        0
      ))
    }
    // Around rear sprocket (bottom half)
    for (let i = 0; i <= 10; i++) {
      const a = -Math.PI * 0.3 + (i / 10) * Math.PI * 1.6
      points.push(new THREE.Vector3(
        rx + Math.cos(a) * rearR,
        ry + Math.sin(a) * rearR,
        0
      ))
    }
    // Bottom run (rear back to front)
    for (let i = 0; i <= 18; i++) {
      const t = i / 18
      points.push(new THREE.Vector3(
        rx + (fx - rx) * t,
        ry - rearR * 0.8 + (fy - frontR - ry + rearR * 0.8) * t - Math.sin(t * Math.PI) * 0.010,
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
          <cylinderGeometry args={[frontR, frontR, 0.010, 16]} />
          <meshStandardMaterial color="#666" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Teeth */}
        {Array.from({ length: 18 }).map((_, i) => {
          const a = (i / 18) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * frontR, 0, Math.sin(a) * frontR]}>
              <boxGeometry args={[0.004, 0.007, 0.005]} />
              <meshStandardMaterial color="#777" roughness={0.3} metalness={0.7} />
            </mesh>
          )
        })}
      </group>

      {/* Rear sprocket teeth (visual detail) */}
      <group position={rearSprocketPos} rotation={[Math.PI / 2, wheelAngle, 0]}>
        {Array.from({ length: 43 }).map((_, i) => {
          const a = (i / 43) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * rearR, 0, Math.sin(a) * rearR]}>
              <boxGeometry args={[0.004, 0.007, 0.005]} />
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
              <boxGeometry args={[0.007, 0.005, 0.004]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#555' : '#444'} roughness={0.5} metalness={0.5} />
            </mesh>
            {/* Pin */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.0012, 0.0012, 0.006, 4]} />
              <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
            </mesh>
          </group>
        )
      })}

      {/* Chain guard (upper) */}
      <mesh position={[frontSprocketPos[0] / 2, 0.27, 0.08]}>
        <boxGeometry args={[0.30, 0.004, 0.020]} />
        <meshStandardMaterial color="#222" roughness={0.6} metalness={0.3} />
      </mesh>
    </group>
  )
}
