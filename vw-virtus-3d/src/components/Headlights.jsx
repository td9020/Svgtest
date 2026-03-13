import React from 'react';
import * as THREE from 'three';
import { VW } from './dimensions';

function HeadlightUnit({ side, headlightOn }) {
  const xSign = side === 'left' ? 1 : -1;
  const halfL = VW.length / 2;
  const halfW = VW.bodyWidth / 2;
  const y = VW.hoodHeight - 0.06;
  const z = halfL + 0.01;
  const x = xSign * (halfW - 0.18);

  const emissiveIntensity = headlightOn ? 2.0 : 0;
  const emissiveColor = headlightOn ? '#ffffff' : '#000000';

  return (
    <group position={[x, y, z]}>
      {/* Main headlight housing */}
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[0.28, 0.10, 0.08]} />
        <meshStandardMaterial color="#111111" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Headlight lens */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[0.26, 0.08, 0.005]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.5}
          roughness={0.05}
          metalness={0.1}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity * 0.3}
        />
      </mesh>

      {/* LED DRL - L shaped VW signature */}
      {/* Horizontal part */}
      <mesh position={[xSign * -0.04, -0.02, 0.015]}>
        <boxGeometry args={[0.18, 0.012, 0.005]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={headlightOn ? '#ffffff' : '#333333'}
          emissiveIntensity={headlightOn ? 1.5 : 0.1}
        />
      </mesh>
      {/* Vertical part of L */}
      <mesh position={[xSign * -0.12, 0.01, 0.015]}>
        <boxGeometry args={[0.012, 0.06, 0.005]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={headlightOn ? '#ffffff' : '#333333'}
          emissiveIntensity={headlightOn ? 1.5 : 0.1}
        />
      </mesh>

      {/* Main projector beam */}
      <mesh position={[xSign * 0.04, 0, 0.015]}>
        <circleGeometry args={[0.025, 24]} />
        <meshStandardMaterial
          color="#eeeeff"
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Chrome reflector */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[0.24, 0.06, 0.005]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Light beam (visible when on) */}
      {headlightOn && (
        <pointLight
          position={[0, 0, 0.1]}
          color="#ffffee"
          intensity={3}
          distance={5}
          decay={2}
        />
      )}
    </group>
  );
}

function FogLight({ side, headlightOn }) {
  const xSign = side === 'left' ? 1 : -1;
  const halfL = VW.length / 2;
  const x = xSign * 0.42;
  const y = VW.groundClearance + 0.14;
  const z = halfL + 0.02;

  return (
    <group position={[x, y, z]}>
      <mesh>
        <cylinderGeometry args={[0.025, 0.025, 0.015, 16]} />
        <meshStandardMaterial
          color="#dddddd"
          emissive={headlightOn ? '#ffffcc' : '#000000'}
          emissiveIntensity={headlightOn ? 0.8 : 0}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>
      {/* Chrome ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.025, 0.032, 16]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function VWFrontLogo() {
  const halfL = VW.length / 2;
  const y = VW.hoodHeight - 0.05;

  return (
    <group position={[0, y, halfL + 0.02]}>
      {/* Logo background circle */}
      <mesh>
        <circleGeometry args={[0.045, 32]} />
        <meshStandardMaterial color={VW.vwBlue} side={THREE.DoubleSide} />
      </mesh>
      {/* Chrome ring */}
      <mesh position={[0, 0, 0.002]}>
        <ringGeometry args={[0.042, 0.048, 32]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} side={THREE.DoubleSide} />
      </mesh>
      {/* Simplified V shape */}
      <mesh position={[-0.008, 0.008, 0.003]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.006, 0.04, 0.002]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.008, 0.008, 0.003]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.006, 0.04, 0.002]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* W shape */}
      <mesh position={[-0.012, -0.01, 0.003]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.006, 0.035, 0.002]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.012, -0.01, 0.003]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.006, 0.035, 0.002]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

export default function Headlights({ headlightOn = false }) {
  return (
    <group>
      <HeadlightUnit side="left" headlightOn={headlightOn} />
      <HeadlightUnit side="right" headlightOn={headlightOn} />
      <FogLight side="left" headlightOn={headlightOn} />
      <FogLight side="right" headlightOn={headlightOn} />
      <VWFrontLogo />
    </group>
  );
}
