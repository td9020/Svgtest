import React from 'react';
import * as THREE from 'three';
import { VW, AXLE_Z } from './dimensions';

function McPhersonStrut({ position, side }) {
  const xSign = side === 'left' ? 1 : -1;

  return (
    <group position={position}>
      {/* Strut tower mount */}
      <mesh position={[0, VW.tireRadius + 0.20, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.03, 8]} />
        <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Strut body (damper) */}
      <mesh position={[0, VW.tireRadius + 0.08, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.22, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Coil spring */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 * 3;
        const yOff = VW.tireRadius - 0.02 + (i / 6) * 0.24;
        return (
          <mesh key={`coil-${i}`} position={[Math.cos(angle) * 0.022, yOff, Math.sin(angle) * 0.022]}>
            <sphereGeometry args={[0.006, 6, 6]} />
            <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.3} />
          </mesh>
        );
      })}

      {/* Lower control arm */}
      <mesh position={[xSign * -0.10, VW.tireRadius - 0.10, 0]} rotation={[0, 0, xSign * 0.15]}>
        <boxGeometry args={[0.22, 0.02, 0.04]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Steering knuckle */}
      <mesh position={[0, VW.tireRadius - 0.05, 0]}>
        <boxGeometry args={[0.04, 0.08, 0.04]} />
        <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Anti-roll bar link */}
      <mesh position={[xSign * -0.04, VW.tireRadius, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.10, 6]} />
        <meshStandardMaterial color="#555555" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

function TorsionBeam({ position }) {
  return (
    <group position={position}>
      {/* Main torsion beam */}
      <mesh>
        <boxGeometry args={[VW.trackRear - 0.10, 0.04, 0.06]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Trailing arms */}
      {[-1, 1].map(s => (
        <group key={`trail-${s}`}>
          <mesh position={[s * (VW.trackRear / 2 - 0.08), 0.02, 0.25]} rotation={[0.1, 0, 0]}>
            <boxGeometry args={[0.04, 0.03, 0.55]} />
            <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
          </mesh>

          {/* Rear spring */}
          <mesh position={[s * (VW.trackRear / 2 - 0.12), 0.08, 0.15]}>
            <cylinderGeometry args={[0.025, 0.025, 0.12, 8]} />
            <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.4} />
          </mesh>

          {/* Rear damper */}
          <mesh position={[s * (VW.trackRear / 2 - 0.12), 0.08, 0.18]}>
            <cylinderGeometry args={[0.012, 0.012, 0.16, 6]} />
            <meshStandardMaterial color="#222222" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function AntiRollBar() {
  const halfTrack = VW.trackFront / 2;

  const points = [
    new THREE.Vector3(-halfTrack + 0.08, 0, 0),
    new THREE.Vector3(-halfTrack + 0.20, 0, 0.02),
    new THREE.Vector3(0, 0, 0.03),
    new THREE.Vector3(halfTrack - 0.20, 0, 0.02),
    new THREE.Vector3(halfTrack - 0.08, 0, 0),
  ];

  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeo = new THREE.TubeGeometry(curve, 16, 0.008, 6, false);

  return (
    <mesh geometry={tubeGeo} position={[0, VW.tireRadius - 0.08, AXLE_Z.front]}>
      <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.4} />
    </mesh>
  );
}

function SubFrame() {
  return (
    <group position={[0, VW.groundClearance + 0.02, AXLE_Z.front]}>
      {/* Front subframe */}
      <mesh>
        <boxGeometry args={[VW.trackFront - 0.20, 0.03, 0.40]} />
        <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Cross member */}
      <mesh position={[0, 0, 0.15]}>
        <boxGeometry args={[VW.trackFront - 0.30, 0.025, 0.04]} />
        <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function Suspension() {
  return (
    <group>
      {/* Front McPherson struts */}
      <McPhersonStrut
        position={[VW.trackFront / 2 - 0.04, 0, AXLE_Z.front]}
        side="left"
      />
      <McPhersonStrut
        position={[-VW.trackFront / 2 + 0.04, 0, AXLE_Z.front]}
        side="right"
      />

      {/* Rear torsion beam */}
      <TorsionBeam position={[0, VW.tireRadius - 0.06, AXLE_Z.rear]} />

      {/* Front anti-roll bar */}
      <AntiRollBar />

      {/* Front subframe */}
      <SubFrame />
    </group>
  );
}
