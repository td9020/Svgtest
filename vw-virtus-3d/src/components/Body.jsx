import React, { useMemo } from 'react';
import * as THREE from 'three';
import { VW, AXLE_Z } from './dimensions';

function createBodyShape() {
  const shape = new THREE.Shape();
  const L = VW.length;
  const H = VW.height;
  const gc = VW.groundClearance;

  // Side profile of the car (z = front-to-back, y = bottom-to-top)
  // Starting from bottom-front, going clockwise
  const halfL = L / 2;

  // Profile points (z, y) - car centered at origin
  // z positive = front, z negative = rear
  const frontBumperZ = halfL;
  const rearBumperZ = -halfL;
  const frontAxleZ = AXLE_Z.front;
  const rearAxleZ = AXLE_Z.rear;

  // Bottom line
  shape.moveTo(rearBumperZ, gc);
  shape.lineTo(frontBumperZ, gc);

  // Front bumper up
  shape.lineTo(frontBumperZ, gc + 0.25);
  // Hood
  shape.lineTo(frontBumperZ - 0.08, VW.hoodHeight);
  shape.lineTo(frontBumperZ - 0.65, VW.hoodHeight + 0.05);

  // A-pillar (windshield base to roof)
  shape.lineTo(frontBumperZ - 1.05, VW.roofHeight);

  // Roof line
  shape.lineTo(rearBumperZ + 1.55, VW.roofHeight);

  // C-pillar (roof to trunk)
  shape.lineTo(rearBumperZ + 0.95, VW.roofHeight - 0.15);
  shape.lineTo(rearBumperZ + 0.55, VW.trunkHeight + 0.05);

  // Trunk
  shape.lineTo(rearBumperZ + 0.10, VW.trunkHeight);

  // Rear down
  shape.lineTo(rearBumperZ, VW.trunkHeight - 0.05);
  shape.lineTo(rearBumperZ, gc);

  return shape;
}

function BodySide({ side, paintColor }) {
  const xSign = side === 'left' ? 1 : -1;
  const halfW = VW.bodyWidth / 2;

  const sideShape = useMemo(() => createBodyShape(), []);

  return (
    <mesh position={[xSign * halfW, 0, 0]} rotation={[0, xSign > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
      <shapeGeometry args={[sideShape]} />
      <meshStandardMaterial color={paintColor} side={THREE.DoubleSide} metalness={0.3} roughness={0.5} />
    </mesh>
  );
}

function WheelArch({ position, radius }) {
  return (
    <mesh position={position} rotation={[0, Math.PI / 2, 0]}>
      <ringGeometry args={[radius, radius + 0.04, 32, 1, 0, Math.PI]} />
      <meshStandardMaterial color={VW.darkChrome} side={THREE.DoubleSide} />
    </mesh>
  );
}

function CharacterLine({ side, paintColor }) {
  const xSign = side === 'left' ? 1 : -1;
  const halfW = VW.bodyWidth / 2 + 0.002;
  const L = VW.length;
  const halfL = L / 2;

  const points = [
    new THREE.Vector3(xSign * halfW, VW.beltLine - 0.05, halfL - 0.3),
    new THREE.Vector3(xSign * halfW, VW.beltLine - 0.03, halfL - 0.8),
    new THREE.Vector3(xSign * halfW, VW.beltLine, 0),
    new THREE.Vector3(xSign * halfW, VW.beltLine + 0.02, -halfL + 0.8),
    new THREE.Vector3(xSign * halfW, VW.beltLine + 0.01, -halfL + 0.3),
  ];

  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.004, 4, false);

  return (
    <mesh geometry={tubeGeo}>
      <meshStandardMaterial color={paintColor} metalness={0.4} roughness={0.4} />
    </mesh>
  );
}

function DoorGap({ position, height, isRear }) {
  const width = isRear ? VW.rearDoorWidth : VW.doorWidth;
  return (
    <mesh position={position} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial color="#111111" transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
}

function DoorHandle({ position, side }) {
  const xSign = side === 'left' ? 1 : -1;
  return (
    <mesh position={[position[0] + xSign * 0.005, position[1], position[2]]}>
      <boxGeometry args={[0.015, 0.02, 0.10]} />
      <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

function MainBodyShell({ paintColor }) {
  const bodyGeo = useMemo(() => {
    const shape = createBodyShape();

    const extrudeSettings = {
      depth: VW.bodyWidth,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Center it: the extrude goes along X, we need to center
    geo.rotateY(Math.PI / 2);
    geo.translate(-VW.bodyWidth / 2 - 0.02, 0, 0);

    return geo;
  }, []);

  return (
    <mesh geometry={bodyGeo}>
      <meshStandardMaterial
        color={paintColor}
        metalness={0.35}
        roughness={0.45}
        envMapIntensity={1.0}
      />
    </mesh>
  );
}

function FrontBumper({ paintColor }) {
  const halfL = VW.length / 2;
  return (
    <group>
      {/* Upper bumper */}
      <mesh position={[0, VW.groundClearance + 0.20, halfL - 0.02]}>
        <boxGeometry args={[VW.bodyWidth + 0.04, 0.18, 0.08]} />
        <meshStandardMaterial color={paintColor} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Lower bumper/air dam */}
      <mesh position={[0, VW.groundClearance + 0.06, halfL + 0.01]}>
        <boxGeometry args={[VW.bodyWidth - 0.1, 0.10, 0.06]} />
        <meshStandardMaterial color={VW.darkChrome} roughness={0.8} />
      </mesh>
      {/* Lower grille */}
      <mesh position={[0, VW.groundClearance + 0.13, halfL + 0.02]}>
        <boxGeometry args={[0.60, 0.08, 0.02]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Grille mesh pattern */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`grille-h-${i}`} position={[0, VW.groundClearance + 0.10 + i * 0.015, halfL + 0.03]}>
          <boxGeometry args={[0.55, 0.003, 0.005]} />
          <meshStandardMaterial color={VW.chrome} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function RearBumper({ paintColor }) {
  const halfL = VW.length / 2;
  return (
    <group>
      {/* Upper bumper */}
      <mesh position={[0, VW.groundClearance + 0.22, -halfL + 0.02]}>
        <boxGeometry args={[VW.bodyWidth + 0.02, 0.20, 0.08]} />
        <meshStandardMaterial color={paintColor} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Lower bumper */}
      <mesh position={[0, VW.groundClearance + 0.06, -halfL - 0.01]}>
        <boxGeometry args={[VW.bodyWidth - 0.15, 0.10, 0.04]} />
        <meshStandardMaterial color={VW.darkChrome} roughness={0.8} />
      </mesh>
      {/* Reflectors */}
      <mesh position={[-0.35, VW.groundClearance + 0.10, -halfL - 0.01]}>
        <boxGeometry args={[0.06, 0.025, 0.01]} />
        <meshStandardMaterial color="#aa0000" emissive="#330000" />
      </mesh>
      <mesh position={[0.35, VW.groundClearance + 0.10, -halfL - 0.01]}>
        <boxGeometry args={[0.06, 0.025, 0.01]} />
        <meshStandardMaterial color="#aa0000" emissive="#330000" />
      </mesh>
      {/* License plate area */}
      <mesh position={[0, VW.groundClearance + 0.20, -halfL - 0.02]}>
        <boxGeometry args={[0.36, 0.11, 0.005]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Roof({ paintColor }) {
  const halfL = VW.length / 2;
  const roofFrontZ = halfL - 1.05;
  const roofRearZ = -halfL + 1.55;
  const roofLength = roofFrontZ - roofRearZ;

  return (
    <group>
      {/* Main roof panel */}
      <mesh position={[0, VW.roofHeight + 0.01, (roofFrontZ + roofRearZ) / 2]}>
        <boxGeometry args={[VW.cabinWidth + 0.05, 0.025, roofLength + 0.1]} />
        <meshStandardMaterial color={paintColor} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Roof rails / subtle edges */}
      {[-1, 1].map(s => (
        <mesh key={`roof-edge-${s}`} position={[s * (VW.cabinWidth / 2 + 0.02), VW.roofHeight - 0.01, (roofFrontZ + roofRearZ) / 2]}>
          <boxGeometry args={[0.02, 0.03, roofLength]} />
          <meshStandardMaterial color={paintColor} metalness={0.3} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function HoodPanel({ paintColor }) {
  const halfL = VW.length / 2;
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-VW.bodyWidth / 2 + 0.05, 0);
    s.lineTo(VW.bodyWidth / 2 - 0.05, 0);
    s.lineTo(VW.bodyWidth / 2 - 0.08, 0.65);
    s.lineTo(-VW.bodyWidth / 2 + 0.08, 0.65);
    s.closePath();
    return s;
  }, []);

  return (
    <mesh position={[0, VW.hoodHeight + 0.02, halfL - 0.68]} rotation={[-Math.PI / 2 + 0.05, 0, 0]}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color={paintColor} metalness={0.35} roughness={0.4} side={THREE.DoubleSide} />
    </mesh>
  );
}

function TrunkLid({ paintColor }) {
  const halfL = VW.length / 2;
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-VW.bodyWidth / 2 + 0.08, 0);
    s.lineTo(VW.bodyWidth / 2 - 0.08, 0);
    s.lineTo(VW.bodyWidth / 2 - 0.10, 0.50);
    s.lineTo(-VW.bodyWidth / 2 + 0.10, 0.50);
    s.closePath();
    return s;
  }, []);

  return (
    <mesh position={[0, VW.trunkHeight + 0.02, -halfL + 0.55]} rotation={[-Math.PI / 2 - 0.03, 0, 0]}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color={paintColor} metalness={0.35} roughness={0.4} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Underbody() {
  return (
    <mesh position={[0, VW.groundClearance - 0.01, 0]}>
      <boxGeometry args={[VW.bodyWidth - 0.1, 0.02, VW.length - 0.3]} />
      <meshStandardMaterial color="#222222" roughness={0.9} />
    </mesh>
  );
}

function SideMirror({ side, paintColor }) {
  const xSign = side === 'left' ? 1 : -1;
  const halfW = VW.bodyWidth / 2;
  const halfL = VW.length / 2;

  return (
    <group position={[xSign * (halfW + 0.08), VW.beltLine + 0.10, halfL - 0.95]}>
      {/* Mirror arm */}
      <mesh position={[xSign * -0.03, 0, 0]}>
        <boxGeometry args={[0.06, 0.02, 0.03]} />
        <meshStandardMaterial color={paintColor} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Mirror housing */}
      <mesh>
        <boxGeometry args={[0.03, 0.06, 0.10]} />
        <meshStandardMaterial color={paintColor} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Mirror glass */}
      <mesh position={[xSign * 0.016, 0, 0]}>
        <planeGeometry args={[0.05, 0.08]} />
        <meshStandardMaterial color="#888888" metalness={0.95} roughness={0.05} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function ChromeGrilleBar() {
  const halfL = VW.length / 2;
  return (
    <group>
      {/* Main chrome bar connecting headlights */}
      <mesh position={[0, VW.hoodHeight - 0.05, halfL + 0.01]}>
        <boxGeometry args={[VW.bodyWidth - 0.15, 0.04, 0.015]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Secondary thin chrome line */}
      <mesh position={[0, VW.hoodHeight - 0.10, halfL + 0.01]}>
        <boxGeometry args={[VW.bodyWidth - 0.20, 0.015, 0.01]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

export default function Body({ hoodAngle = 0, trunkAngle = 0, doorAngles = { fl: 0, fr: 0, rl: 0, rr: 0 }, paintColor = VW.candyWhite, onPartClick }) {
  const halfL = VW.length / 2;
  const halfW = VW.bodyWidth / 2;

  return (
    <group onClick={onPartClick ? (e) => { e.stopPropagation(); onPartClick('body'); } : undefined}>
      <MainBodyShell paintColor={paintColor} />
      <FrontBumper paintColor={paintColor} />
      <RearBumper paintColor={paintColor} />
      <Roof paintColor={paintColor} />
      <ChromeGrilleBar />
      <Underbody />

      {/* Side mirrors */}
      <SideMirror side="left" paintColor={paintColor} />
      <SideMirror side="right" paintColor={paintColor} />

      {/* Character lines */}
      <CharacterLine side="left" paintColor={paintColor} />
      <CharacterLine side="right" paintColor={paintColor} />

      {/* Door handles */}
      {/* Front doors */}
      <DoorHandle position={[halfW, VW.beltLine + 0.02, halfL - 1.35]} side="left" />
      <DoorHandle position={[-halfW, VW.beltLine + 0.02, halfL - 1.35]} side="right" />
      {/* Rear doors */}
      <DoorHandle position={[halfW, VW.beltLine + 0.02, halfL - 2.20]} side="left" />
      <DoorHandle position={[-halfW, VW.beltLine + 0.02, halfL - 2.20]} side="right" />

      {/* Wheel arches */}
      <WheelArch position={[halfW + 0.01, VW.tireRadius, AXLE_Z.front]} radius={VW.tireRadius + 0.03} />
      <WheelArch position={[-halfW - 0.01, VW.tireRadius, AXLE_Z.front]} radius={VW.tireRadius + 0.03} />
      <WheelArch position={[halfW + 0.01, VW.tireRadius, AXLE_Z.rear]} radius={VW.tireRadius + 0.03} />
      <WheelArch position={[-halfW - 0.01, VW.tireRadius, AXLE_Z.rear]} radius={VW.tireRadius + 0.03} />

      {/* Animated Hood */}
      <group position={[0, VW.hoodHeight + 0.02, halfL - 0.05]} rotation={[hoodAngle, 0, 0]}
        onClick={onPartClick ? (e) => { e.stopPropagation(); onPartClick('hood'); } : undefined}>
        <group position={[0, 0, -0.63]}>
          <HoodPanel paintColor={paintColor} />
        </group>
      </group>

      {/* Animated Trunk */}
      <group position={[0, VW.trunkHeight + 0.02, -halfL + 0.10]} rotation={[-trunkAngle, 0, 0]}
        onClick={onPartClick ? (e) => { e.stopPropagation(); onPartClick('trunk'); } : undefined}>
        <group position={[0, 0, 0.45]}>
          <TrunkLid paintColor={paintColor} />
        </group>
      </group>

      {/* Door panels (animated) */}
      {/* Front Left Door */}
      <group position={[halfW, 0, halfL - 0.90]} rotation={[0, doorAngles.fl, 0]}
        onClick={onPartClick ? (e) => { e.stopPropagation(); onPartClick('doors'); } : undefined}>
        <mesh position={[0.005, VW.groundClearance + 0.35, -0.45]}>
          <boxGeometry args={[0.025, VW.doorHeight, VW.doorWidth]} />
          <meshStandardMaterial color={paintColor} metalness={0.3} roughness={0.5} />
        </mesh>
      </group>
      {/* Front Right Door */}
      <group position={[-halfW, 0, halfL - 0.90]} rotation={[0, -doorAngles.fr, 0]}>
        <mesh position={[-0.005, VW.groundClearance + 0.35, -0.45]}>
          <boxGeometry args={[0.025, VW.doorHeight, VW.doorWidth]} />
          <meshStandardMaterial color={paintColor} metalness={0.3} roughness={0.5} />
        </mesh>
      </group>
      {/* Rear Left Door */}
      <group position={[halfW, 0, halfL - 1.80]} rotation={[0, doorAngles.rl, 0]}>
        <mesh position={[0.005, VW.groundClearance + 0.35, -0.40]}>
          <boxGeometry args={[0.025, VW.doorHeight, VW.rearDoorWidth]} />
          <meshStandardMaterial color={paintColor} metalness={0.3} roughness={0.5} />
        </mesh>
      </group>
      {/* Rear Right Door */}
      <group position={[-halfW, 0, halfL - 1.80]} rotation={[0, -doorAngles.rr, 0]}>
        <mesh position={[-0.005, VW.groundClearance + 0.35, -0.40]}>
          <boxGeometry args={[0.025, VW.doorHeight, VW.rearDoorWidth]} />
          <meshStandardMaterial color={paintColor} metalness={0.3} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
