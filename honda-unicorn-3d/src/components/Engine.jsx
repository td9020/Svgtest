import { useRef } from 'react'

const ENGINE_COLOR = '#3a3a3a'
const HEAD_COLOR = '#4a4a4a'
const FIN_COLOR = '#555'

export default function Engine({ position = [0, 0, 0] }) {
  const group = useRef()
  const finCount = 8

  return (
    <group ref={group} position={position}>
      {/* Main engine block / crankcase */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.28, 0.22, 0.22]} />
        <meshStandardMaterial color={ENGINE_COLOR} roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Lower crankcase */}
      <mesh position={[0, -0.13, 0]}>
        <boxGeometry args={[0.24, 0.06, 0.2]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Cylinder - angled slightly forward */}
      <group position={[0.02, 0.18, 0]} rotation={[0, 0, 0.15]}>
        <mesh>
          <cylinderGeometry args={[0.065, 0.07, 0.18, 16]} />
          <meshStandardMaterial color={HEAD_COLOR} roughness={0.45} metalness={0.65} />
        </mesh>

        {/* Cylinder head */}
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.16, 0.06, 0.16]} />
          <meshStandardMaterial color={HEAD_COLOR} roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Cooling fins */}
        {Array.from({ length: finCount }).map((_, i) => (
          <mesh key={i} position={[0, -0.06 + i * 0.025, 0]}>
            <boxGeometry args={[0.17, 0.003, 0.17]} />
            <meshStandardMaterial color={FIN_COLOR} roughness={0.4} metalness={0.6} />
          </mesh>
        ))}

        {/* Spark plug */}
        <mesh position={[0.08, 0.1, 0]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.008, 0.008, 0.06, 8]} />
          <meshStandardMaterial color="#888" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0.1, 0.13, 0]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.012, 0.012, 0.02, 8]} />
          <meshStandardMaterial color="#222" roughness={0.8} metalness={0.2} />
        </mesh>
      </group>

      {/* Clutch cover - right side */}
      <mesh position={[0, 0, 0.13]}>
        <cylinderGeometry args={[0.08, 0.08, 0.03, 24]} />
        <meshStandardMaterial color="#444" roughness={0.4} metalness={0.65} />
      </mesh>
      <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.075, 24]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.35} metalness={0.7} />
      </mesh>

      {/* Stator cover - left side */}
      <mesh position={[-0.02, -0.02, -0.13]}>
        <cylinderGeometry args={[0.07, 0.07, 0.03, 24]} />
        <meshStandardMaterial color="#444" roughness={0.4} metalness={0.65} />
      </mesh>

      {/* Oil filter */}
      <mesh position={[0.1, -0.1, 0.08]} rotation={[0.3, 0, 0.4]}>
        <cylinderGeometry args={[0.025, 0.025, 0.06, 12]} />
        <meshStandardMaterial color="#222" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Gear shift lever */}
      <mesh position={[-0.12, -0.12, -0.16]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.08, 6]} />
        <meshStandardMaterial color="#555" roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh position={[-0.12, -0.12, -0.2]}>
        <boxGeometry args={[0.04, 0.012, 0.015]} />
        <meshStandardMaterial color="#333" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Kick starter */}
      <mesh position={[-0.05, -0.08, 0.16]} rotation={[Math.PI / 2, 0, 0.3]}>
        <cylinderGeometry args={[0.006, 0.006, 0.12, 6]} />
        <meshStandardMaterial color="#555" roughness={0.5} metalness={0.5} />
      </mesh>
    </group>
  )
}
