import React from 'react';
import { D } from './dimensions';

// Yellow springs (GT3 signature)
const springMat = {
  color: '#DDCC00',
  metalness: 0.4,
  roughness: 0.3,
};

const armMat = {
  color: '#555555',
  metalness: 0.7,
  roughness: 0.3,
};

function WishboneArm({ position, rotation, length = 0.3 }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[length, 0.02, 0.03]} />
      <meshStandardMaterial {...armMat} />
    </mesh>
  );
}

function SpringDamper({ position, height = 0.22 }) {
  return (
    <group position={position}>
      {/* Damper body */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, height, 12]} />
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Damper shaft */}
      <mesh position={[0, height * 0.8, 0]}>
        <cylinderGeometry args={[0.008, 0.008, height * 0.4, 8]} />
        <meshStandardMaterial color="#AAAAAA" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Spring coil (yellow!) */}
      <mesh position={[0, height * 0.4, 0]}>
        <torusGeometry args={[0.025, 0.006, 6, 24]} />
        <meshStandardMaterial {...springMat} />
      </mesh>
      <mesh position={[0, height * 0.5, 0]}>
        <torusGeometry args={[0.025, 0.006, 6, 24]} />
        <meshStandardMaterial {...springMat} />
      </mesh>
      <mesh position={[0, height * 0.6, 0]}>
        <torusGeometry args={[0.025, 0.006, 6, 24]} />
        <meshStandardMaterial {...springMat} />
      </mesh>
      <mesh position={[0, height * 0.3, 0]}>
        <torusGeometry args={[0.025, 0.006, 6, 24]} />
        <meshStandardMaterial {...springMat} />
      </mesh>
      {/* Top mount */}
      <mesh position={[0, height, 0]}>
        <cylinderGeometry args={[0.03, 0.025, 0.02, 12]} />
        <meshStandardMaterial color="#444444" metalness={0.6} />
      </mesh>
    </group>
  );
}

export default function Suspension() {
  return (
    <group>
      {/* FRONT SUSPENSION - Double wishbone */}
      {[1, -1].map((side) => {
        const z = side * D.frontWheelZ;
        const x = D.frontAxleX;
        const y = D.frontWheelY;

        return (
          <group key={`front${side}`}>
            {/* Upper wishbone */}
            <WishboneArm
              position={[x, y + 0.12, z * 0.7]}
              rotation={[0, side * 0.3, 0]}
              length={0.25}
            />
            {/* Lower wishbone */}
            <WishboneArm
              position={[x, y - 0.08, z * 0.7]}
              rotation={[0, side * 0.2, 0]}
              length={0.30}
            />
            {/* Upright / knuckle */}
            <mesh position={[x, y, z * 0.85]}>
              <boxGeometry args={[0.04, 0.18, 0.03]} />
              <meshStandardMaterial {...armMat} />
            </mesh>
            {/* Spring/Damper */}
            <SpringDamper position={[x, y - 0.05, z * 0.65]} />
            {/* Anti-roll bar segment */}
            <mesh position={[x, y - 0.10, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, D.frontTrack * 0.6, 8]} />
              <meshStandardMaterial color="#444444" metalness={0.7} />
            </mesh>
            {/* Tie rod */}
            <mesh position={[x + 0.08, y - 0.02, z * 0.75]} rotation={[0, 0, 0.1]}>
              <cylinderGeometry args={[0.006, 0.006, 0.2, 8]} />
              <meshStandardMaterial color="#666666" metalness={0.6} />
            </mesh>
          </group>
        );
      })}

      {/* REAR SUSPENSION - Multi-link */}
      {[1, -1].map((side) => {
        const z = side * D.rearWheelZ;
        const x = D.rearAxleX;
        const y = D.rearWheelY;

        return (
          <group key={`rear${side}`}>
            {/* Upper link */}
            <WishboneArm
              position={[x, y + 0.10, z * 0.7]}
              rotation={[0, side * 0.2, 0]}
              length={0.22}
            />
            {/* Lower link */}
            <WishboneArm
              position={[x, y - 0.10, z * 0.7]}
              rotation={[0, side * 0.15, 0]}
              length={0.28}
            />
            {/* Trailing arm */}
            <mesh position={[x + 0.15, y - 0.05, z * 0.8]} rotation={[0, 0, 0]}>
              <boxGeometry args={[0.30, 0.02, 0.03]} />
              <meshStandardMaterial {...armMat} />
            </mesh>
            {/* Toe link */}
            <mesh position={[x - 0.05, y - 0.08, z * 0.75]} rotation={[0, side * 0.4, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 0.15, 8]} />
              <meshStandardMaterial color="#666666" metalness={0.6} />
            </mesh>
            {/* Upright */}
            <mesh position={[x, y, z * 0.85]}>
              <boxGeometry args={[0.05, 0.20, 0.035]} />
              <meshStandardMaterial {...armMat} />
            </mesh>
            {/* Spring/Damper */}
            <SpringDamper position={[x, y - 0.05, z * 0.65]} />
            {/* Rear anti-roll bar */}
            <mesh position={[x, y - 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.009, 0.009, D.rearTrack * 0.5, 8]} />
              <meshStandardMaterial color="#444444" metalness={0.7} />
            </mesh>
          </group>
        );
      })}

      {/* Rear subframe */}
      <mesh position={[D.rearAxleX, D.rearWheelY - 0.12, 0]}>
        <boxGeometry args={[0.35, 0.03, D.rearTrack * 0.6]} />
        <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Front subframe */}
      <mesh position={[D.frontAxleX, D.frontWheelY - 0.12, 0]}>
        <boxGeometry args={[0.30, 0.03, D.frontTrack * 0.5]} />
        <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}
