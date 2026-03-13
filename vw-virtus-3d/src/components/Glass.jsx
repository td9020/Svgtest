import React, { useMemo } from 'react';
import * as THREE from 'three';
import { VW } from './dimensions';

function WindowFrame({ points, color = VW.darkChrome }) {
  if (points.length < 2) return null;
  const curve = new THREE.CatmullRomCurve3(points, true);
  const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.008, 4, true);

  return (
    <mesh geometry={tubeGeo}>
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
    </mesh>
  );
}

function Windshield() {
  const halfL = VW.length / 2;

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const w = VW.cabinWidth / 2 - 0.03;
    s.moveTo(-w, 0);
    s.lineTo(w, 0);
    s.lineTo(w - 0.04, 0.58);
    s.lineTo(-w + 0.04, 0.58);
    s.closePath();
    return s;
  }, []);

  // Windshield positioned at A-pillar
  const baseY = VW.beltLine + 0.02;
  const baseZ = halfL - 1.02;

  return (
    <group>
      <mesh position={[0, baseY + 0.28, baseZ + 0.18]} rotation={[VW.windshieldAngle, 0, 0]}>
        <shapeGeometry args={[shape]} />
        <meshPhysicalMaterial
          color={VW.glassColor}
          transparent
          opacity={0.35}
          roughness={0.05}
          metalness={0.1}
          side={THREE.DoubleSide}
          envMapIntensity={2.0}
        />
      </mesh>
      {/* Chrome trim around windshield */}
      <mesh position={[0, baseY + 0.28, baseZ + 0.19]} rotation={[VW.windshieldAngle, 0, 0]}>
        <ringGeometry args={[0.36, 0.38, 4, 1]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.8} roughness={0.2} visible={false} />
      </mesh>
    </group>
  );
}

function RearWindow() {
  const halfL = VW.length / 2;

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const w = VW.cabinWidth / 2 - 0.05;
    s.moveTo(-w, 0);
    s.lineTo(w, 0);
    s.lineTo(w - 0.06, 0.45);
    s.lineTo(-w + 0.06, 0.45);
    s.closePath();
    return s;
  }, []);

  const baseY = VW.beltLine + 0.03;
  const baseZ = -halfL + 1.50;

  return (
    <mesh position={[0, baseY + 0.22, baseZ - 0.12]} rotation={[-VW.rearWindowAngle, 0, 0]}>
      <shapeGeometry args={[shape]} />
      <meshPhysicalMaterial
        color={VW.glassColor}
        transparent
        opacity={0.30}
        roughness={0.05}
        metalness={0.1}
        side={THREE.DoubleSide}
        envMapIntensity={2.0}
      />
    </mesh>
  );
}

function SideWindow({ side, isFront }) {
  const xSign = side === 'left' ? 1 : -1;
  const halfL = VW.length / 2;
  const halfW = VW.cabinWidth / 2 + 0.01;

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    if (isFront) {
      // Front side window (larger, with A-pillar angle)
      s.moveTo(0, 0);
      s.lineTo(0.80, 0);
      s.lineTo(0.80, 0.28);
      s.lineTo(0.15, 0.42);
      s.closePath();
    } else {
      // Rear side window (smaller, with C-pillar angle)
      s.moveTo(0, 0);
      s.lineTo(0.68, 0);
      s.lineTo(0.50, 0.30);
      s.lineTo(0, 0.28);
      s.closePath();
    }
    return s;
  }, [isFront]);

  const z = isFront ? halfL - 1.30 : halfL - 2.15;
  const y = VW.beltLine + 0.02;

  return (
    <group>
      <mesh
        position={[xSign * halfW, y, z]}
        rotation={[0, xSign > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
      >
        <shapeGeometry args={[shape]} />
        <meshPhysicalMaterial
          color={VW.glassColor}
          transparent
          opacity={0.30}
          roughness={0.05}
          metalness={0.1}
          side={THREE.DoubleSide}
          envMapIntensity={2.0}
        />
      </mesh>
      {/* Chrome window trim */}
      <mesh
        position={[xSign * (halfW + 0.003), y + 0.14, z + (isFront ? 0.40 : 0.34)]}
        rotation={[0, xSign > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
      >
        <planeGeometry args={[isFront ? 0.82 : 0.70, 0.010]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function BPillar({ side }) {
  const xSign = side === 'left' ? 1 : -1;
  const halfW = VW.cabinWidth / 2 + 0.005;
  const halfL = VW.length / 2;

  return (
    <mesh position={[xSign * halfW, VW.beltLine + 0.18, halfL - 1.82]}>
      <boxGeometry args={[0.02, 0.38, 0.04]} />
      <meshStandardMaterial color={VW.darkChrome} />
    </mesh>
  );
}

function APillar({ side }) {
  const xSign = side === 'left' ? 1 : -1;
  const halfW = VW.cabinWidth / 2;
  const halfL = VW.length / 2;

  return (
    <mesh
      position={[xSign * halfW, VW.beltLine + 0.24, halfL - 1.02]}
      rotation={[0.30, 0, xSign * 0.18]}
    >
      <boxGeometry args={[0.03, 0.50, 0.04]} />
      <meshStandardMaterial color={VW.darkChrome} />
    </mesh>
  );
}

function CPillar({ side }) {
  const xSign = side === 'left' ? 1 : -1;
  const halfW = VW.cabinWidth / 2;
  const halfL = VW.length / 2;

  return (
    <mesh
      position={[xSign * halfW, VW.beltLine + 0.22, -halfL + 1.52]}
      rotation={[-0.35, 0, xSign * -0.15]}
    >
      <boxGeometry args={[0.035, 0.46, 0.06]} />
      <meshStandardMaterial color={VW.darkChrome} />
    </mesh>
  );
}

export default function Glass() {
  return (
    <group>
      <Windshield />
      <RearWindow />

      {/* Side windows */}
      <SideWindow side="left" isFront={true} />
      <SideWindow side="right" isFront={true} />
      <SideWindow side="left" isFront={false} />
      <SideWindow side="right" isFront={false} />

      {/* Pillars */}
      <APillar side="left" />
      <APillar side="right" />
      <BPillar side="left" />
      <BPillar side="right" />
      <CPillar side="left" />
      <CPillar side="right" />
    </group>
  );
}
