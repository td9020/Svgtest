import React, { useMemo } from 'react';
import * as THREE from 'three';
import { D } from './dimensions';
import { useCSG } from './CSGMesh';

// Center-lock single nut (Porsche signature)
function CenterLock() {
  return (
    <group>
      {/* Center hub */}
      <mesh>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 6]} />
        <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Porsche crest circle */}
      <mesh position={[0, 0.016, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.005, 32]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Brake caliper
function BrakeCaliper({ size, side }) {
  const flip = side === 'left' ? 1 : -1;
  return (
    <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, flip * 0.02]}>
      {/* Caliper body - yellow for PCCB */}
      <mesh position={[size * 0.3, 0, 0]}>
        <boxGeometry args={[size * 0.35, 0.06, 0.08]} />
        <meshStandardMaterial color="#FFD700" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* PORSCHE text pad */}
      <mesh position={[size * 0.3, 0, flip * 0.041]}>
        <boxGeometry args={[size * 0.25, 0.04, 0.002]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </group>
  );
}

// Brake disc with CSG holes
function BrakeDisc({ diameter, thickness }) {
  const radius = diameter / 2;
  const discGeo = useCSG(
    {
      geometry: new THREE.CylinderGeometry(radius, radius, thickness, 48),
      material: new THREE.MeshStandardMaterial({
        color: '#555555',
        metalness: 0.7,
        roughness: 0.3,
      }),
    },
    [
      // Center hole
      {
        geometry: new THREE.CylinderGeometry(radius * 0.25, radius * 0.25, thickness + 0.01, 32),
      },
      // Ventilation holes ring
      ...Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const r = radius * 0.65;
        return {
          geometry: new THREE.CylinderGeometry(0.008, 0.008, thickness + 0.01, 8),
          position: [Math.cos(angle) * r, 0, Math.sin(angle) * r],
        };
      }),
    ]
  );

  return (
    <mesh geometry={discGeo} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.3} />
    </mesh>
  );
}

// 10-spoke forged alloy wheel (default)
function ForgedRim({ rimRadius, tireWidth }) {
  const spokeCount = 10;
  const hubRadius = rimRadius * 0.2;
  const rimWidth = tireWidth * 0.75;

  return (
    <group>
      {/* Outer rim barrel */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[rimRadius * 0.92, 0.015, 12, 48]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Inner rim lip */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[rimRadius * 0.85, 0.008, 8, 48]} />
        <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Hub */}
      <mesh>
        <cylinderGeometry args={[hubRadius, hubRadius, rimWidth * 0.3, 32]} />
        <meshStandardMaterial color="#999999" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Spokes - multi-spoke design */}
      {Array.from({ length: spokeCount }, (_, i) => {
        const angle = (i / spokeCount) * Math.PI * 2;
        const spokeLen = rimRadius * 0.72;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * spokeLen * 0.5,
              0,
              Math.sin(angle) * spokeLen * 0.5,
            ]}
            rotation={[0, -angle + Math.PI / 2, 0]}
          >
            <boxGeometry args={[spokeLen, 0.012, 0.025]} />
            <meshStandardMaterial color="#AAAAAA" metalness={0.9} roughness={0.1} />
          </mesh>
        );
      })}
      {/* Center lock */}
      <CenterLock />
    </group>
  );
}

// Classic 5-spoke Fuchs-style wheel (wider spokes, more organic)
function FuchsRim({ rimRadius, tireWidth }) {
  const spokeCount = 5;
  const hubRadius = rimRadius * 0.22;
  const rimWidth = tireWidth * 0.75;

  return (
    <group>
      {/* Outer rim barrel - polished lip */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[rimRadius * 0.92, 0.018, 12, 48]} />
        <meshStandardMaterial color="#E0E0E0" metalness={0.95} roughness={0.03} />
      </mesh>
      {/* Inner rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[rimRadius * 0.84, 0.010, 8, 48]} />
        <meshStandardMaterial color="#888888" metalness={0.85} roughness={0.1} />
      </mesh>
      {/* Hub - larger for Fuchs */}
      <mesh>
        <cylinderGeometry args={[hubRadius, hubRadius, rimWidth * 0.35, 32]} />
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Fuchs-style wide spokes - organic clover-leaf shape */}
      {Array.from({ length: spokeCount }, (_, i) => {
        const angle = (i / spokeCount) * Math.PI * 2;
        const spokeLen = rimRadius * 0.70;
        return (
          <group key={i}>
            {/* Main wide spoke */}
            <mesh
              position={[
                Math.cos(angle) * spokeLen * 0.45,
                0.003,
                Math.sin(angle) * spokeLen * 0.45,
              ]}
              rotation={[0, -angle + Math.PI / 2, 0]}
            >
              <boxGeometry args={[spokeLen, 0.015, 0.065]} />
              <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.3} />
            </mesh>
            {/* Spoke taper at outer end */}
            <mesh
              position={[
                Math.cos(angle) * spokeLen * 0.8,
                0.003,
                Math.sin(angle) * spokeLen * 0.8,
              ]}
              rotation={[0, -angle + Math.PI / 2, 0]}
            >
              <boxGeometry args={[spokeLen * 0.25, 0.014, 0.045]} />
              <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.3} />
            </mesh>
            {/* Polished highlight edge on spoke */}
            <mesh
              position={[
                Math.cos(angle) * spokeLen * 0.45,
                0.012,
                Math.sin(angle) * spokeLen * 0.45,
              ]}
              rotation={[0, -angle + Math.PI / 2, 0]}
            >
              <boxGeometry args={[spokeLen * 0.9, 0.003, 0.055]} />
              <meshStandardMaterial color="#CCCCCC" metalness={0.9} roughness={0.05} />
            </mesh>
          </group>
        );
      })}
      {/* Fuchs-style openings between spokes - anodized black */}
      <mesh position={[0, -0.002, 0]}>
        <cylinderGeometry args={[rimRadius * 0.82, rimRadius * 0.82, 0.008, 48]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Center lock */}
      <CenterLock />
    </group>
  );
}

// Tire
function Tire({ outerRadius, innerRadius, width }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[(outerRadius + innerRadius) / 2, (outerRadius - innerRadius) / 2, 24, 48]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.0} />
    </mesh>
  );
}

export default function Wheel({ isFront = true, side = 'left', spinAngle = 0, steerAngle = 0, spoked = false }) {
  const tire = isFront ? D.frontTire : D.rearTire;
  const brake = isFront ? D.frontBrake : D.rearBrake;
  const rimRadius = tire.rimDiameter / 2;
  const tireOuterR = tire.outerDiameter / 2;
  const tireInnerR = rimRadius;

  const flipY = side === 'left' ? 0 : Math.PI;

  return (
    <group rotation={[0, steerAngle, 0]}>
      <group rotation={[spinAngle, flipY, 0]}>
        {/* Tire */}
        <Tire outerRadius={tireOuterR} innerRadius={tireInnerR} width={tire.width} />
        {/* Rim - forged or Fuchs */}
        {spoked ? (
          <FuchsRim rimRadius={rimRadius} tireWidth={tire.width} />
        ) : (
          <ForgedRim rimRadius={rimRadius} tireWidth={tire.width} />
        )}
      </group>
      {/* Brake disc (doesn't spin with wheel visually for simplicity) */}
      <BrakeDisc diameter={brake.diameter} thickness={brake.thickness} />
      {/* Brake caliper */}
      <BrakeCaliper size={brake.diameter} side={side} />
    </group>
  );
}
