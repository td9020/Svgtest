import React from 'react';
import * as THREE from 'three';
import { VW } from './dimensions';

function TailLightUnit({ side, brakeLightOn, turnSignalOn }) {
  const xSign = side === 'left' ? 1 : -1;
  const halfL = VW.length / 2;
  const halfW = VW.bodyWidth / 2;
  const y = VW.trunkHeight - 0.04;
  const z = -halfL - 0.01;
  const x = xSign * (halfW - 0.20);

  const brakeEmissive = brakeLightOn ? '#ff0000' : '#330000';
  const brakeIntensity = brakeLightOn ? 2.0 : 0.2;
  const turnEmissive = turnSignalOn ? VW.turnSignalColor : '#000000';
  const turnIntensity = turnSignalOn ? 1.5 : 0;

  return (
    <group position={[x, y, z]}>
      {/* Tail light housing */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.30, 0.08, 0.06]} />
        <meshStandardMaterial color="#1a0000" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* LED tail light bar */}
      <mesh position={[0, 0.01, -0.005]}>
        <boxGeometry args={[0.28, 0.025, 0.005]} />
        <meshStandardMaterial
          color={VW.tailLightColor}
          emissive={brakeEmissive}
          emissiveIntensity={brakeIntensity}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Brake light (upper) */}
      <mesh position={[xSign * -0.04, 0.02, -0.005]}>
        <boxGeometry args={[0.12, 0.02, 0.005]} />
        <meshStandardMaterial
          color="#ff2222"
          emissive={brakeEmissive}
          emissiveIntensity={brakeIntensity * 1.2}
        />
      </mesh>

      {/* Turn signal */}
      <mesh position={[xSign * 0.10, -0.01, -0.005]}>
        <boxGeometry args={[0.06, 0.025, 0.005]} />
        <meshStandardMaterial
          color="#ff8800"
          emissive={turnEmissive}
          emissiveIntensity={turnIntensity}
        />
      </mesh>

      {/* Reverse light */}
      <mesh position={[xSign * -0.10, -0.015, -0.005]}>
        <boxGeometry args={[0.04, 0.02, 0.005]} />
        <meshStandardMaterial color="#ffffff" emissive="#111111" emissiveIntensity={0.1} />
      </mesh>

      {/* Red lens cover */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[0.28, 0.07, 0.003]} />
        <meshPhysicalMaterial
          color="#aa0000"
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Light glow when brake on */}
      {brakeLightOn && (
        <pointLight
          position={[0, 0, -0.1]}
          color="#ff0000"
          intensity={1.5}
          distance={3}
          decay={2}
        />
      )}
    </group>
  );
}

function TailLightBar({ brakeLightOn }) {
  const halfL = VW.length / 2;
  const y = VW.trunkHeight - 0.02;

  return (
    <mesh position={[0, y, -halfL - 0.01]}>
      <boxGeometry args={[0.40, 0.015, 0.005]} />
      <meshStandardMaterial
        color="#cc0000"
        emissive={brakeLightOn ? '#ff0000' : '#220000'}
        emissiveIntensity={brakeLightOn ? 1.0 : 0.15}
      />
    </mesh>
  );
}

function HighMountBrakeLight({ brakeLightOn }) {
  const halfL = VW.length / 2;
  return (
    <mesh position={[0, VW.roofHeight - 0.15, -halfL + 1.42]}>
      <boxGeometry args={[0.20, 0.015, 0.01]} />
      <meshStandardMaterial
        color="#ff0000"
        emissive={brakeLightOn ? '#ff0000' : '#110000'}
        emissiveIntensity={brakeLightOn ? 2.0 : 0.1}
      />
    </mesh>
  );
}

function VWRearLogo() {
  const halfL = VW.length / 2;
  const y = VW.trunkHeight + 0.05;

  return (
    <group position={[0, y, -halfL - 0.02]}>
      {/* Logo background */}
      <mesh>
        <circleGeometry args={[0.040, 32]} />
        <meshStandardMaterial color={VW.vwBlue} side={THREE.DoubleSide} />
      </mesh>
      {/* Chrome ring */}
      <mesh position={[0, 0, -0.002]}>
        <ringGeometry args={[0.037, 0.043, 32]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} side={THREE.DoubleSide} />
      </mesh>
      {/* V */}
      <mesh position={[-0.007, 0.007, -0.003]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.005, 0.035, 0.002]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.007, 0.007, -0.003]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.005, 0.035, 0.002]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* W */}
      <mesh position={[-0.010, -0.008, -0.003]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.005, 0.030, 0.002]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.010, -0.008, -0.003]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.005, 0.030, 0.002]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

function LicensePlateLight() {
  const halfL = VW.length / 2;
  return (
    <mesh position={[0, VW.groundClearance + 0.28, -halfL - 0.025]}>
      <boxGeometry args={[0.06, 0.01, 0.005]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
    </mesh>
  );
}

function VirtusLettering() {
  const halfL = VW.length / 2;
  // Simplified as a chrome bar representing "VIRTUS" text
  return (
    <mesh position={[0, VW.trunkHeight - 0.10, -halfL - 0.02]}>
      <boxGeometry args={[0.18, 0.012, 0.003]} />
      <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

export default function TailLights({ brakeLightOn = false, turnSignalsOn = false }) {
  return (
    <group>
      <TailLightUnit side="left" brakeLightOn={brakeLightOn} turnSignalOn={turnSignalsOn} />
      <TailLightUnit side="right" brakeLightOn={brakeLightOn} turnSignalOn={turnSignalsOn} />
      <TailLightBar brakeLightOn={brakeLightOn} />
      <HighMountBrakeLight brakeLightOn={brakeLightOn} />
      <VWRearLogo />
      <LicensePlateLight />
      <VirtusLettering />
    </group>
  );
}
