import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { SPECS } from './dimensions'

// KTM 390 Duke: Liquid-cooled engine
// Side-mounted radiator with protective guard
// Coolant hoses to engine
// Fan behind radiator

export default function Radiator({ position = [0, 0, 0] }) {
  const group = useRef()

  const radW = SPECS.radiatorWidth   // 0.22m
  const radH = SPECS.radiatorHeight  // 0.20m

  return (
    <group ref={group} position={position}>
      {/* Radiator core */}
      <mesh>
        <boxGeometry args={[0.03, radH, radW]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Radiator fins (horizontal lines) */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[0.016, -radH / 2 + 0.01 + i * (radH / 20), 0]}>
          <boxGeometry args={[0.002, 0.003, radW - 0.02]} />
          <meshStandardMaterial color="#333" roughness={0.4} metalness={0.6} />
        </mesh>
      ))}

      {/* Radiator side tanks - left */}
      <mesh position={[0, 0, -radW / 2 - 0.008]}>
        <boxGeometry args={[0.035, radH - 0.02, 0.015]} />
        <meshStandardMaterial color="#222" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Radiator side tanks - right */}
      <mesh position={[0, 0, radW / 2 + 0.008]}>
        <boxGeometry args={[0.035, radH - 0.02, 0.015]} />
        <meshStandardMaterial color="#222" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Upper hose inlet */}
      <mesh position={[0, radH / 2 - 0.02, radW / 2 + 0.015]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.010, 0.010, 0.02, 8]} />
        <meshStandardMaterial color="#111" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Lower hose outlet */}
      <mesh position={[0, -radH / 2 + 0.02, radW / 2 + 0.015]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.010, 0.010, 0.02, 8]} />
        <meshStandardMaterial color="#111" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Coolant hose - upper (to engine) */}
      {useMemo(() => {
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, radH / 2 - 0.02, radW / 2 + 0.025),
          new THREE.Vector3(-0.03, radH / 2, radW / 2 + 0.04),
          new THREE.Vector3(-0.06, radH / 2 - 0.02, radW / 2 + 0.02),
        ])
        return (
          <mesh geometry={new THREE.TubeGeometry(curve, 12, 0.008, 8, false)}>
            <meshStandardMaterial color="#111" roughness={0.8} metalness={0.1} />
          </mesh>
        )
      }, [radH, radW])}

      {/* Coolant hose - lower (from engine) */}
      {useMemo(() => {
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, -radH / 2 + 0.02, radW / 2 + 0.025),
          new THREE.Vector3(-0.04, -radH / 2 + 0.01, radW / 2 + 0.04),
          new THREE.Vector3(-0.08, -radH / 2 + 0.02, radW / 2 + 0.02),
        ])
        return (
          <mesh geometry={new THREE.TubeGeometry(curve, 12, 0.008, 8, false)}>
            <meshStandardMaterial color="#111" roughness={0.8} metalness={0.1} />
          </mesh>
        )
      }, [radH, radW])}

      {/* Radiator fan (behind) */}
      <mesh position={[-0.025, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.06, 16]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Fan blades */}
      {Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2
        return (
          <mesh key={i} position={[-0.027, Math.sin(a) * 0.035, Math.cos(a) * 0.035]} rotation={[a, Math.PI / 2, 0]}>
            <boxGeometry args={[0.04, 0.012, 0.002]} />
            <meshStandardMaterial color="#444" roughness={0.5} metalness={0.4} />
          </mesh>
        )
      })}

      {/* Protective guard - mesh/grid over radiator */}
      <mesh position={[0.02, 0, 0]}>
        <boxGeometry args={[0.003, radH - 0.01, radW - 0.01]} />
        <meshStandardMaterial
          color="#333"
          roughness={0.4}
          metalness={0.6}
          wireframe
        />
      </mesh>

      {/* Guard frame */}
      <mesh position={[0.02, 0, 0]}>
        <boxGeometry args={[0.004, radH + 0.01, radW + 0.01]} />
        <meshStandardMaterial color="#222" roughness={0.4} metalness={0.6} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}
