import React from 'react';
import * as THREE from 'three';
import { D } from './dimensions';

export default function RearWing({ angle = 0.15 }) {
  const halfL = D.length / 2;
  const wingX = -halfL + 0.35;
  const wingY = D.wingHeight;
  const wingSpan = D.wingSpan;
  const wingChord = D.wingChord;

  return (
    <group position={[wingX, wingY, 0]} rotation={[0, 0, 0]}>
      {/* Main wing element - airfoil profile approximated */}
      <group rotation={[-angle, 0, 0]}>
        {/* Main plane */}
        <mesh>
          <boxGeometry args={[wingChord, 0.015, wingSpan]} />
          <meshStandardMaterial
            color="#222222"
            metalness={0.3}
            roughness={0.5}
          />
        </mesh>
        {/* Wing top surface curvature */}
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[wingChord * 0.8, 0.01, wingSpan - 0.02]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Leading edge radius */}
        <mesh position={[wingChord / 2 - 0.01, 0.005, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, wingSpan - 0.02, 12]} />
          <meshStandardMaterial color="#222222" metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Gurney flap on trailing edge */}
        <mesh position={[-wingChord / 2, -0.015, 0]}>
          <boxGeometry args={[0.005, 0.02, wingSpan - 0.04]} />
          <meshStandardMaterial color="#333333" />
        </mesh>

        {/* End plates */}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[0, -0.03, side * (wingSpan / 2)]}>
            <boxGeometry args={[wingChord * 1.3, 0.10, 0.008]} />
            <meshStandardMaterial
              color="#1a1a1a"
              metalness={0.2}
              roughness={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Swan-neck mounts (supports from ABOVE - GT3 signature) */}
      {[-1, 1].map((side) => (
        <group key={`mount${side}`}>
          {/* Vertical strut going UP from deck then curving to wing top */}
          {/* Upper horizontal part connecting to wing top surface */}
          <mesh position={[0.02, 0.01, side * wingSpan * 0.3]}>
            <boxGeometry args={[0.06, 0.015, 0.025]} />
            <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Vertical part going down to deck */}
          <mesh position={[0.02, -D.wingMountHeight / 2, side * wingSpan * 0.3]}>
            <boxGeometry args={[0.03, D.wingMountHeight, 0.02]} />
            <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Base plate on deck */}
          <mesh position={[0.02, -D.wingMountHeight, side * wingSpan * 0.3]}>
            <boxGeometry args={[0.06, 0.008, 0.04]} />
            <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Carbon fiber texture strips on wing */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh
          key={i}
          position={[0, 0.019, (i - 2) * (wingSpan / 5)]}
          rotation={[-angle, 0, 0]}
        >
          <boxGeometry args={[wingChord * 0.6, 0.002, wingSpan / 6]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.2}
            roughness={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}
