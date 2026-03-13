import { useRef } from 'react'
import * as THREE from 'three'
import { SPECS } from './dimensions'

// Suzuki Hayabusa GSX1300R:
// Both wheels: 17-inch alloy rims (431.8mm diameter)
// Front: 120/70-17, OD ~620mm → radius 310mm
// Rear: 190/50-17, OD ~632mm → radius 316mm (very wide!)
// Front: DUAL 320mm disc brakes, Brembo 4-piston radial calipers
// Rear: 260mm single disc
// 6-spoke alloy wheels

const SPOKE_COUNT = 6

export default function Wheel({
  position = [0, 0, 0],
  isRear = false,
  spinAngle = 0,
}) {
  const group = useRef()

  const rimRadius = SPECS.rimRadius                       // 0.2159m
  const tireRadius = isRear ? SPECS.rearTireRadius : SPECS.frontTireRadius
  const tireWidth = isRear ? SPECS.rearTireWidth : SPECS.frontTireWidth
  const tubeRadius = (tireRadius - rimRadius) / 2 + tireWidth / 6
  const tireMidRadius = rimRadius + tubeRadius
  const hubRadius = isRear ? 0.045 : 0.040
  const discRadius = isRear
    ? SPECS.rearDiscDiameter / 2    // 0.130m
    : SPECS.frontDiscDiameter / 2   // 0.160m

  return (
    <group ref={group} position={position} rotation={[0, 0, spinAngle]}>
      {/* Tire - wider for rear */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[tireMidRadius, tubeRadius, 24, 48]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.92} metalness={0.03} />
      </mesh>

      {/* Rim - outer bead */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[rimRadius, 0.012, 16, 48]} />
        <meshStandardMaterial color="#b0b0b0" roughness={0.12} metalness={0.88} />
      </mesh>

      {/* Rim - inner bead */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[rimRadius - 0.025, 0.009, 12, 48]} />
        <meshStandardMaterial color="#b0b0b0" roughness={0.15} metalness={0.85} />
      </mesh>

      {/* Hub - wider on Hayabusa */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[hubRadius, hubRadius, isRear ? 0.08 : 0.065, 24]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Hub flanges */}
      {[-0.03, 0.03].map((z, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, z, 0]}>
          <cylinderGeometry args={[hubRadius + 0.008, hubRadius + 0.008, 0.008, 24]} />
          <meshStandardMaterial color="#999" roughness={0.25} metalness={0.75} />
        </mesh>
      ))}

      {/* Axle */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, isRear ? 0.12 : 0.10, 12]} />
        <meshStandardMaterial color="#555" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* 6-spoke alloy wheel design */}
      {Array.from({ length: SPOKE_COUNT }).map((_, i) => {
        const angle = (i / SPOKE_COUNT) * Math.PI * 2
        const innerR = hubRadius + 0.005
        const outerR = rimRadius - 0.015
        const midR = (innerR + outerR) / 2
        const ix = Math.cos(angle) * innerR
        const iy = Math.sin(angle) * innerR
        const ox = Math.cos(angle) * outerR
        const oy = Math.sin(angle) * outerR
        const mx = (ix + ox) / 2
        const my = (iy + oy) / 2
        const len = Math.sqrt((ox - ix) ** 2 + (oy - iy) ** 2)
        const rot = Math.atan2(oy - iy, ox - ix)

        return (
          <group key={i}>
            {/* Wide flat spoke (alloy style) */}
            <mesh position={[mx, my, 0]} rotation={[0, 0, rot]}>
              <boxGeometry args={[len, 0.022, 0.012]} />
              <meshStandardMaterial color="#c0c0c0" roughness={0.15} metalness={0.85} />
            </mesh>
            {/* Spoke taper detail */}
            <mesh position={[mx, my, 0]} rotation={[0, 0, rot]}>
              <boxGeometry args={[len * 0.6, 0.016, 0.014]} />
              <meshStandardMaterial color="#d0d0d0" roughness={0.12} metalness={0.88} />
            </mesh>
          </group>
        )
      })}

      {/* === FRONT WHEEL: DUAL DISC BRAKES === */}
      {!isRear && (
        <>
          {/* Left disc rotor (320mm) */}
          <mesh position={[0, 0, -0.035]}>
            <ringGeometry args={[hubRadius + 0.010, discRadius, 48]} />
            <meshStandardMaterial color="#aaa" roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
          </mesh>
          {/* Left disc ventilation holes */}
          {Array.from({ length: 20 }).map((_, i) => {
            const a = (i / 20) * Math.PI * 2
            const r = discRadius * 0.72
            return (
              <mesh key={`lh-${i}`} position={[Math.cos(a) * r, Math.sin(a) * r, -0.036]}>
                <circleGeometry args={[0.006, 6]} />
                <meshStandardMaterial color="#666" side={THREE.DoubleSide} />
              </mesh>
            )
          })}

          {/* Right disc rotor (320mm) */}
          <mesh position={[0, 0, 0.035]}>
            <ringGeometry args={[hubRadius + 0.010, discRadius, 48]} />
            <meshStandardMaterial color="#aaa" roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
          </mesh>
          {/* Right disc ventilation holes */}
          {Array.from({ length: 20 }).map((_, i) => {
            const a = (i / 20) * Math.PI * 2
            const r = discRadius * 0.72
            return (
              <mesh key={`rh-${i}`} position={[Math.cos(a) * r, Math.sin(a) * r, 0.036]}>
                <circleGeometry args={[0.006, 6]} />
                <meshStandardMaterial color="#666" side={THREE.DoubleSide} />
              </mesh>
            )
          })}

          {/* Left Brembo radial caliper */}
          <group position={[discRadius - 0.02, 0, -0.055]}>
            <mesh>
              <boxGeometry args={[0.050, 0.060, 0.035]} />
              <meshStandardMaterial color="#222" roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Brembo logo area */}
            <mesh position={[0, 0, -0.018]}>
              <boxGeometry args={[0.040, 0.050, 0.003]} />
              <meshStandardMaterial color="#cc0000" roughness={0.3} metalness={0.4} />
            </mesh>
            {/* Brake pads visible */}
            <mesh position={[0, 0, 0.016]}>
              <boxGeometry args={[0.035, 0.045, 0.004]} />
              <meshStandardMaterial color="#8B7355" roughness={0.8} metalness={0.1} />
            </mesh>
            {/* Caliper bolts */}
            {[-0.018, 0.018].map((y, j) => (
              <mesh key={j} position={[-0.022, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 0.005, 6]} />
                <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
              </mesh>
            ))}
          </group>

          {/* Right Brembo radial caliper */}
          <group position={[discRadius - 0.02, 0, 0.055]}>
            <mesh>
              <boxGeometry args={[0.050, 0.060, 0.035]} />
              <meshStandardMaterial color="#222" roughness={0.4} metalness={0.6} />
            </mesh>
            <mesh position={[0, 0, 0.018]}>
              <boxGeometry args={[0.040, 0.050, 0.003]} />
              <meshStandardMaterial color="#cc0000" roughness={0.3} metalness={0.4} />
            </mesh>
            <mesh position={[0, 0, -0.016]}>
              <boxGeometry args={[0.035, 0.045, 0.004]} />
              <meshStandardMaterial color="#8B7355" roughness={0.8} metalness={0.1} />
            </mesh>
            {[-0.018, 0.018].map((y, j) => (
              <mesh key={j} position={[0.022, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 0.005, 6]} />
                <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
              </mesh>
            ))}
          </group>
        </>
      )}

      {/* === REAR WHEEL: SINGLE DISC BRAKE === */}
      {isRear && (
        <>
          {/* Rear disc (260mm) */}
          <mesh position={[0, 0, 0.042]}>
            <ringGeometry args={[hubRadius + 0.008, discRadius, 48]} />
            <meshStandardMaterial color="#aaa" roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
          </mesh>
          {/* Rear disc ventilation holes */}
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2
            const r = discRadius * 0.72
            return (
              <mesh key={`rrh-${i}`} position={[Math.cos(a) * r, Math.sin(a) * r, 0.043]}>
                <circleGeometry args={[0.005, 6]} />
                <meshStandardMaterial color="#666" side={THREE.DoubleSide} />
              </mesh>
            )
          })}
          {/* Rear caliper */}
          <group position={[discRadius - 0.015, -0.02, 0.06]}>
            <mesh>
              <boxGeometry args={[0.040, 0.045, 0.030]} />
              <meshStandardMaterial color="#333" roughness={0.5} metalness={0.5} />
            </mesh>
          </group>

          {/* Rear sprocket */}
          <group position={[0, 0, 0.055]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.065, 0.065, 0.008, 32]} />
              <meshStandardMaterial color="#555" roughness={0.35} metalness={0.65} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.065, 0.004, 6, 44]} />
              <meshStandardMaterial color="#666" roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Sprocket lightening holes */}
            {Array.from({ length: 6 }).map((_, i) => {
              const a = (i / 6) * Math.PI * 2
              const r = 0.042
              return (
                <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, 0.058]} rotation={[Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[0.010, 8]} />
                  <meshStandardMaterial color="#333" side={THREE.DoubleSide} />
                </mesh>
              )
            })}
          </group>
        </>
      )}
    </group>
  )
}
