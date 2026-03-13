import React from 'react';
import { D } from './dimensions';

export default function Interior() {
  const seatY = D.groundClearance + 0.22;
  const seatX = 0.15;

  return (
    <group>
      {/* Sport bucket seats (carbon back) */}
      {[1, -1].map((side) => (
        <group key={side} position={[seatX, seatY, side * 0.35]}>
          {/* Seat base */}
          <mesh>
            <boxGeometry args={[0.45, 0.06, 0.38]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          {/* Seat back */}
          <mesh position={[-0.15, 0.25, 0]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[0.06, 0.45, 0.36]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          {/* Carbon back shell */}
          <mesh position={[-0.18, 0.25, 0]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[0.01, 0.43, 0.34]} />
            <meshStandardMaterial color="#222222" metalness={0.3} roughness={0.5} />
          </mesh>
          {/* Headrest */}
          <mesh position={[-0.15, 0.52, 0]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[0.05, 0.12, 0.22]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          {/* Seat bolster (side support) left */}
          <mesh position={[-0.05, 0.10, 0.17]}>
            <boxGeometry args={[0.35, 0.12, 0.04]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          {/* Seat bolster right */}
          <mesh position={[-0.05, 0.10, -0.17]}>
            <boxGeometry args={[0.35, 0.12, 0.04]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          {/* GT3 logo pad */}
          <mesh position={[-0.15, 0.42, 0]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[0.005, 0.04, 0.08]} />
            <meshStandardMaterial color="#CC0000" />
          </mesh>
        </group>
      ))}

      {/* Steering wheel */}
      <group position={[0.65, seatY + 0.32, 0.35]} rotation={[0.4, 0, 0]}>
        {/* Rim */}
        <mesh>
          <torusGeometry args={[0.15, 0.015, 12, 32]} />
          <meshStandardMaterial color="#222222" roughness={0.7} />
        </mesh>
        {/* Center hub */}
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 24]} />
          <meshStandardMaterial color="#333333" metalness={0.3} roughness={0.4} />
        </mesh>
        {/* Porsche crest on hub */}
        <mesh position={[0, 0.011, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.005, 16]} />
          <meshStandardMaterial color="#AA8800" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Spokes (3) */}
        {[0, Math.PI * 0.7, -Math.PI * 0.7].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * 0.08, 0, Math.sin(angle) * 0.08]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.1, 0.015, 0.025]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        ))}
        {/* PDK shift paddles */}
        {[1, -1].map((side) => (
          <mesh key={side} position={[0, -0.01, side * 0.13]}>
            <boxGeometry args={[0.06, 0.03, 0.015]} />
            <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
        {/* GT3 marker at 12 o'clock */}
        <mesh position={[0, 0.005, 0.15]}>
          <boxGeometry args={[0.03, 0.008, 0.008]} />
          <meshStandardMaterial color="#FFFF00" />
        </mesh>
      </group>

      {/* Steering column */}
      <mesh position={[0.50, seatY + 0.20, 0.35]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.35, 12]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Dashboard */}
      <mesh position={[0.80, seatY + 0.25, 0]}>
        <boxGeometry args={[0.25, 0.15, D.bodyWidth - 0.3]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>

      {/* Instrument cluster - central tachometer (Porsche tradition) */}
      <mesh position={[0.82, seatY + 0.35, 0.35]}>
        <cylinderGeometry args={[0.08, 0.08, 0.03, 24]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Tachometer face */}
      <mesh position={[0.84, seatY + 0.35, 0.35]}>
        <circleGeometry args={[0.07, 24]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Tach needle */}
      <mesh position={[0.845, seatY + 0.35, 0.35]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.002, 0.06, 0.002]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.5} />
      </mesh>

      {/* Center console */}
      <mesh position={[0.3, seatY + 0.05, 0]}>
        <boxGeometry args={[0.6, 0.12, 0.22]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>

      {/* Drive mode selector dial */}
      <mesh position={[0.35, seatY + 0.12, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.015, 24]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Gear selector */}
      <mesh position={[0.20, seatY + 0.12, 0]}>
        <boxGeometry args={[0.06, 0.02, 0.04]} />
        <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Roll cage (GT3 option) */}
      {/* Main hoop */}
      <mesh position={[-0.15, seatY + 0.55, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.42, 0.018, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#CCCCCC" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Diagonal bars */}
      {[1, -1].map((side) => (
        <mesh
          key={side}
          position={[0.1, seatY + 0.35, side * 0.30]}
          rotation={[0, side * 0.3, 0.6]}
        >
          <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
          <meshStandardMaterial color="#CCCCCC" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Floor / carpet */}
      <mesh position={[0.3, D.groundClearance + 0.01, 0]}>
        <boxGeometry args={[1.5, 0.01, D.bodyWidth - 0.2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
      </mesh>

      {/* Pedals */}
      {[0.08, 0, -0.08].map((offset, i) => (
        <mesh key={i} position={[0.85, D.groundClearance + 0.08, 0.35 + offset]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.025, 0.05, 0.03]} />
          <meshStandardMaterial
            color={i === 0 ? '#888888' : '#666666'}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}
