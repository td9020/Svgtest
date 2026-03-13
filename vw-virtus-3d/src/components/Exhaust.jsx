import React from 'react';
import * as THREE from 'three';
import { VW } from './dimensions';

function ExhaustPipe() {
  const halfL = VW.length / 2;
  const y = VW.groundClearance - 0.05;

  // Exhaust routing: engine -> under car -> muffler -> tip
  const points = [
    new THREE.Vector3(0.08, y + 0.03, halfL - 0.60),  // Engine exit
    new THREE.Vector3(0.10, y, halfL - 0.80),
    new THREE.Vector3(0.12, y, halfL - 1.50),
    new THREE.Vector3(0.15, y, 0),                      // Mid section
    new THREE.Vector3(0.20, y, -halfL + 1.20),
    new THREE.Vector3(0.25, y, -halfL + 0.60),          // Before muffler
    new THREE.Vector3(0.30, y, -halfL + 0.25),          // After muffler
    new THREE.Vector3(0.32, y + 0.01, -halfL + 0.05),   // Exit
  ];

  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.018, 8, false);

  return (
    <mesh geometry={tubeGeo}>
      <meshStandardMaterial color="#555555" metalness={0.6} roughness={0.4} />
    </mesh>
  );
}

function CatalyticConverter() {
  const halfL = VW.length / 2;
  const y = VW.groundClearance - 0.05;

  return (
    <group position={[0.12, y, halfL - 1.20]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 0.20, 12]} />
        <meshStandardMaterial color="#666666" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Heat shield */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.050, 0.050, 0.18, 12, 1, true]} />
        <meshStandardMaterial color="#777777" metalness={0.3} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Muffler() {
  const halfL = VW.length / 2;
  const y = VW.groundClearance - 0.05;

  return (
    <group position={[0.25, y, -halfL + 0.50]}>
      {/* Main muffler body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.35, 12]} />
        <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* End caps */}
      <mesh position={[0, 0, -0.175]}>
        <circleGeometry args={[0.06, 12]} />
        <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.175]}>
        <circleGeometry args={[0.06, 12]} />
        <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function ExhaustTip() {
  const halfL = VW.length / 2;
  const y = VW.groundClearance - 0.03;

  return (
    <group position={[0.32, y, -halfL + 0.02]}>
      {/* Chrome tip */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.025, 0.06, 16]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Inner dark */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.04, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
    </group>
  );
}

function HeatShields() {
  const halfL = VW.length / 2;
  const y = VW.groundClearance - 0.02;

  return (
    <group>
      {/* Shields along exhaust path */}
      <mesh position={[0.14, y - 0.01, 0.20]}>
        <boxGeometry args={[0.10, 0.003, 0.30]} />
        <meshStandardMaterial color="#888888" metalness={0.4} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.20, y - 0.01, -halfL + 0.90]}>
        <boxGeometry args={[0.10, 0.003, 0.25]} />
        <meshStandardMaterial color="#888888" metalness={0.4} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function Exhaust() {
  return (
    <group>
      <ExhaustPipe />
      <CatalyticConverter />
      <Muffler />
      <ExhaustTip />
      <HeatShields />
    </group>
  );
}
