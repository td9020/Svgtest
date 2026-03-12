import { useRef, useMemo } from 'react'
import * as THREE from 'three'

export default function FrontFork({ position = [0, 0, 0] }) {
  const group = useRef()
  const forkAngle = 0.45 // rake angle

  return (
    <group ref={group} position={position}>
      <group rotation={[0, 0, -forkAngle]}>
        {/* Left fork tube - upper (chrome) */}
        <mesh position={[0, 0.15, -0.065]}>
          <cylinderGeometry args={[0.016, 0.016, 0.3, 12]} />
          <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Left fork tube - lower (dark) */}
        <mesh position={[0, -0.12, -0.065]}>
          <cylinderGeometry args={[0.02, 0.02, 0.24, 12]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.4} />
        </mesh>

        {/* Right fork tube - upper (chrome) */}
        <mesh position={[0, 0.15, 0.065]}>
          <cylinderGeometry args={[0.016, 0.016, 0.3, 12]} />
          <meshStandardMaterial color="#ddd" roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Right fork tube - lower (dark) */}
        <mesh position={[0, -0.12, 0.065]}>
          <cylinderGeometry args={[0.02, 0.02, 0.24, 12]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.4} />
        </mesh>

        {/* Triple clamp - upper */}
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.04, 0.02, 0.18]} />
          <meshStandardMaterial color="#333" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Triple clamp - lower */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.04, 0.02, 0.16]} />
          <meshStandardMaterial color="#333" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Axle clamp at bottom */}
        <mesh position={[0, -0.24, 0]}>
          <boxGeometry args={[0.03, 0.025, 0.16]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Front fender */}
        <mesh position={[0.02, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.12, 16, 1, true, -0.8, 1.6]} />
          <meshStandardMaterial color="#cc0000" roughness={0.3} metalness={0.2} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Handlebar */}
      <group position={[0.08, 0.42, 0]}>
        {/* Main handlebar tube */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.52, 8]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.4} />
        </mesh>

        {/* Left grip */}
        <mesh position={[0, 0, -0.26]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 0.08, 12]} />
          <meshStandardMaterial color="#111" roughness={0.9} metalness={0.05} />
        </mesh>

        {/* Right grip (throttle) */}
        <mesh position={[0, 0, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 0.08, 12]} />
          <meshStandardMaterial color="#111" roughness={0.9} metalness={0.05} />
        </mesh>

        {/* Left brake lever */}
        <mesh position={[0.02, -0.01, -0.22]} rotation={[0, 0.5, 0]}>
          <boxGeometry args={[0.1, 0.008, 0.015]} />
          <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Right brake lever */}
        <mesh position={[0.02, -0.01, 0.22]} rotation={[0, -0.5, 0]}>
          <boxGeometry args={[0.1, 0.008, 0.015]} />
          <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Left mirror */}
        <group position={[0.02, 0.02, -0.24]}>
          <mesh position={[0, 0.08, -0.04]} rotation={[0.3, 0, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 0.1, 6]} />
            <meshStandardMaterial color="#333" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.14, -0.06]} rotation={[0.8, 0, 0]}>
            <sphereGeometry args={[0.03, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#222" roughness={0.5} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.145, -0.062]} rotation={[0.8, 0, 0]}>
            <circleGeometry args={[0.028, 12]} />
            <meshStandardMaterial color="#aaddff" roughness={0.05} metalness={0.9} />
          </mesh>
        </group>

        {/* Right mirror */}
        <group position={[0.02, 0.02, 0.24]}>
          <mesh position={[0, 0.08, 0.04]} rotation={[-0.3, 0, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 0.1, 6]} />
            <meshStandardMaterial color="#333" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.14, 0.06]} rotation={[-0.8, 0, 0]}>
            <sphereGeometry args={[0.03, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#222" roughness={0.5} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.145, 0.062]} rotation={[-0.8, 0, 0]}>
            <circleGeometry args={[0.028, 12]} />
            <meshStandardMaterial color="#aaddff" roughness={0.05} metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Headlight */}
      <group position={[0.2, 0.32, 0]}>
        {/* Housing */}
        <mesh>
          <sphereGeometry args={[0.06, 16, 16, 0, Math.PI]} />
          <meshStandardMaterial color="#222" roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Lens */}
        <mesh position={[0.005, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.055, 24]} />
          <meshStandardMaterial
            color="#ffffee"
            roughness={0.05}
            metalness={0.1}
            emissive="#ffffcc"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Chrome ring */}
        <mesh position={[0.003, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.05, 0.06, 24]} />
          <meshStandardMaterial color="#ccc" roughness={0.1} metalness={0.9} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Turn signals */}
      <mesh position={[0.16, 0.26, -0.1]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#ff8800" roughness={0.3} metalness={0.2} emissive="#ff6600" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.16, 0.26, 0.1]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#ff8800" roughness={0.3} metalness={0.2} emissive="#ff6600" emissiveIntensity={0.2} />
      </mesh>

      {/* Instrument cluster */}
      <group position={[0.12, 0.42, 0]}>
        {/* Speedometer */}
        <mesh rotation={[0.6, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
          <meshStandardMaterial color="#111" roughness={0.7} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.008, 0.008]} rotation={[0.6, 0, 0]}>
          <circleGeometry args={[0.032, 16]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.3} />
        </mesh>
        {/* Tachometer */}
        <mesh position={[-0.04, 0, 0.03]} rotation={[0.6, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
          <meshStandardMaterial color="#111" roughness={0.7} metalness={0.3} />
        </mesh>
      </group>
    </group>
  )
}
