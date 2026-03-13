import { useRef } from 'react'
import * as THREE from 'three'
import { SPECS, POS } from './dimensions'

// Royal Enfield Classic 350: Rear section
// Classic round tail light (chrome bezel)
// Chrome rear fender (full coverage, classic)
// License plate with light
// Bullet-style round turn signals (chrome)
// Twin rear shocks handled in Frame.jsx

export default function TailSection({ position = [0, 0, 0], turnSignalsOn = false, headlightOn = true, blinkOn = false, paintColor = '#2D4A22' }) {
  const group = useRef()

  const rearTireR = SPECS.rearTireRadius

  return (
    <group ref={group} position={position}>
      {/* Chrome rear fender (full coverage, classic) */}
      <mesh position={[0, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[rearTireR + 0.018, rearTireR + 0.018, 0.12, 20, 1, true, Math.PI + 0.35, 1.7]} />
        <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} side={THREE.DoubleSide} />
      </mesh>

      {/* Fender extension (rear) */}
      <mesh position={[-0.12, rearTireR + 0.02, 0]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.15, 0.003, 0.12]} />
        <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} side={THREE.DoubleSide} />
      </mesh>

      {/* Classic round tail light (chrome bezel) */}
      <group position={[-0.08, rearTireR + 0.12, 0]}>
        {/* Chrome housing */}
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <sphereGeometry args={[0.028, 16, 16, 0, Math.PI]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
        </mesh>
        {/* Red lens */}
        <mesh position={[-0.003, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <circleGeometry args={[0.025, 16]} />
          <meshStandardMaterial
            color="#ff0000"
            roughness={0.18}
            metalness={0.08}
            emissive="#ff0000"
            emissiveIntensity={headlightOn ? 0.4 : 0.08}
            transparent
            opacity={0.90}
          />
        </mesh>
        {/* Chrome bezel ring */}
        <mesh position={[-0.002, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <ringGeometry args={[0.023, 0.030, 20]} />
          <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Rear turn signals - bullet style (chrome with amber lens) */}
      {[-0.085, 0.085].map((z, i) => (
        <group key={`rts-${i}`} position={[-0.06, rearTireR + 0.10, z]}>
          {/* Chrome stalk */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z > 0 ? 0.012 : -0.012]}>
            <cylinderGeometry args={[0.003, 0.003, 0.035, 6]} />
            <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.88} />
          </mesh>
          {/* Bullet housing (chrome) */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.010, 0.015, 4, 8]} />
            <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.88} />
          </mesh>
          {/* Amber lens */}
          <mesh position={[-0.014, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[0.009, 8]} />
            <meshStandardMaterial
              color={turnSignalsOn && blinkOn ? '#ffaa00' : '#ff8800'}
              roughness={0.3}
              emissive={turnSignalsOn && blinkOn ? '#ffaa00' : '#ff6600'}
              emissiveIntensity={turnSignalsOn && blinkOn ? 1.2 : 0.2}
            />
          </mesh>
        </group>
      ))}

      {/* License plate bracket */}
      <mesh position={[-0.10, rearTireR + 0.04, 0]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.005, 0.07, 0.045]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* License plate (white) */}
      <mesh position={[-0.12, rearTireR + 0.01, 0]} rotation={[0, Math.PI / 2, 0.35]}>
        <planeGeometry args={[0.065, 0.045]} />
        <meshStandardMaterial color="#fff" roughness={0.85} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      {/* License plate light */}
      <mesh position={[-0.09, rearTireR + 0.065, 0]}>
        <boxGeometry args={[0.015, 0.008, 0.025]} />
        <meshStandardMaterial
          color="#ffffcc"
          emissive="#ffffcc"
          emissiveIntensity={headlightOn ? 0.3 : 0}
        />
      </mesh>

      {/* Reflector */}
      <mesh position={[-0.125, rearTireR - 0.01, 0]} rotation={[0, Math.PI / 2, 0.35]}>
        <circleGeometry args={[0.014, 8]} />
        <meshStandardMaterial color="#ff3300" roughness={0.3} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Chain sprocket (rear) */}
      <group position={[0, 0, 0.080]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.060, 0.060, 0.009, 32]} />
          <meshStandardMaterial color="#555" roughness={0.35} metalness={0.65} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.060, 0.005, 6, 40]} />
          <meshStandardMaterial color="#666" roughness={0.4} metalness={0.6} />
        </mesh>
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2
          const r = 0.038
          return (
            <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, 0.083]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.009, 8]} />
              <meshStandardMaterial color="#333" side={THREE.DoubleSide} />
            </mesh>
          )
        })}
      </group>

      {/* Chain - simplified */}
      <mesh position={[0.16, -0.06, 0.083]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.34, 0.013, 0.009]} />
        <meshStandardMaterial color="#444" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0.16, -0.09, 0.083]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.34, 0.013, 0.009]} />
        <meshStandardMaterial color="#444" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Fender tip mudflap */}
      <mesh position={[-0.20, rearTireR - 0.04, 0]} rotation={[0.6, 0, 0]}>
        <boxGeometry args={[0.06, 0.04, 0.10]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.05} />
      </mesh>
    </group>
  )
}
