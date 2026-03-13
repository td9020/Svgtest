import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { VW } from './dimensions';

function SpokesAlloy({ rimR, hubR }) {
  const spokes = [];
  const spokeCount = 5;
  const spokeWidth = 0.025;
  const spokeDepth = 0.02;
  const spokeLength = rimR - hubR - 0.01;

  for (let i = 0; i < spokeCount; i++) {
    const angle = (i / spokeCount) * Math.PI * 2;
    // Each spoke splits into two (10-spoke design)
    for (let j = -1; j <= 1; j += 2) {
      const subAngle = angle + (j * 0.08);
      spokes.push(
        <mesh
          key={`spoke-${i}-${j}`}
          position={[
            Math.cos(subAngle) * (hubR + spokeLength / 2),
            Math.sin(subAngle) * (hubR + spokeLength / 2),
            0
          ]}
          rotation={[0, 0, subAngle]}
        >
          <boxGeometry args={[spokeLength, spokeWidth, spokeDepth]} />
          <meshStandardMaterial color={VW.rimSilver} metalness={0.8} roughness={0.2} />
        </mesh>
      );
    }
  }
  return <group>{spokes}</group>;
}

function SteelWheelWithHubcap({ rimR, hubR }) {
  // Steel wheel: solid disc with ventilation holes, simpler rounder design
  return (
    <group>
      {/* Steel wheel disc - solid face */}
      <mesh>
        <circleGeometry args={[rimR - 0.01, 32]} />
        <meshStandardMaterial color="#888888" metalness={0.5} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Hubcap - plastic cover over the steel wheel */}
      <mesh position={[0, 0, 0.005]}>
        <circleGeometry args={[rimR - 0.015, 32]} />
        <meshStandardMaterial color="#cccccc" metalness={0.3} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Hubcap concentric rings */}
      <mesh position={[0, 0, 0.008]}>
        <ringGeometry args={[rimR * 0.65, rimR * 0.7, 32]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.4} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.008]}>
        <ringGeometry args={[rimR * 0.40, rimR * 0.45, 32]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.4} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Ventilation slots (rounded openings in hubcap) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = rimR * 0.55;
        return (
          <mesh
            key={`vent-${i}`}
            position={[Math.cos(angle) * r, Math.sin(angle) * r, 0.009]}
          >
            <circleGeometry args={[0.022, 12]} />
            <meshStandardMaterial color="#555555" metalness={0.6} roughness={0.3} side={THREE.DoubleSide} />
          </mesh>
        );
      })}

      {/* VW center emblem on hubcap */}
      <mesh position={[0, 0, 0.012]}>
        <circleGeometry args={[hubR + 0.01, 24]} />
        <meshStandardMaterial color={VW.vwBlue} side={THREE.DoubleSide} />
      </mesh>
      {/* Chrome ring around VW emblem */}
      <mesh position={[0, 0, 0.013]}>
        <ringGeometry args={[hubR + 0.008, hubR + 0.015, 24]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function BrakeDisc({ discRadius, isFront }) {
  return (
    <group>
      {/* Disc/Drum */}
      <mesh position={[0, 0, -0.01]}>
        <cylinderGeometry args={[discRadius / 2, discRadius / 2, 0.015, 32]} />
        <meshStandardMaterial
          color={isFront ? '#666666' : '#555555'}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      {/* Caliper (front only) */}
      {isFront && (
        <mesh position={[discRadius / 2 - 0.02, 0, 0.01]}>
          <boxGeometry args={[0.05, 0.06, 0.03]} />
          <meshStandardMaterial color="#222222" metalness={0.3} roughness={0.6} />
        </mesh>
      )}
    </group>
  );
}

export default function Wheel({ position = [0, 0, 0], spinAngle = 0, steerAngle = 0, isFront = false, side = 'left', spoked = false }) {
  const groupRef = useRef();
  const tireR = VW.tireRadius;
  const rimR = VW.rimRadius;
  const tireW = VW.tireWidth;
  const hubR = 0.06;
  const flipSign = side === 'right' ? -1 : 1;

  return (
    <group position={position}>
      {/* Steering rotation for front wheels */}
      <group rotation={[0, isFront ? steerAngle : 0, 0]}>
        {/* Spin rotation */}
        <group rotation={[spinAngle, 0, 0]}>
          {/* Tire */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[rimR + (tireR - rimR) / 2, (tireR - rimR) / 2, 16, 32]} />
            <meshStandardMaterial color={VW.tireDark} roughness={0.9} />
          </mesh>

          {/* Tire sidewall - outer ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[tireR, tireR, tireW, 32, 1, true]} />
            <meshStandardMaterial color={VW.tireDark} roughness={0.85} side={THREE.DoubleSide} />
          </mesh>

          {/* Rim face */}
          <mesh position={[0, 0, flipSign * 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[rimR - 0.01, rimR - 0.01, 0.01, 32]} />
            <meshStandardMaterial color={spoked ? '#888888' : VW.rimSilver} metalness={spoked ? 0.5 : 0.8} roughness={spoked ? 0.4 : 0.2} />
          </mesh>

          {/* Rim barrel */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[rimR, rimR, tireW * 0.7, 32, 1, true]} />
            <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.3} side={THREE.DoubleSide} />
          </mesh>

          {/* Wheel face: alloy spokes or steel+hubcap */}
          <group position={[0, 0, flipSign * 0.02]}>
            {spoked ? (
              <SteelWheelWithHubcap rimR={rimR - 0.02} hubR={hubR} />
            ) : (
              <SpokesAlloy rimR={rimR - 0.02} hubR={hubR} />
            )}
          </group>

          {/* Hub center with VW logo (only for alloy) */}
          {!spoked && (
            <>
              <mesh position={[0, 0, flipSign * 0.035]}>
                <cylinderGeometry args={[hubR, hubR, 0.015, 24]} />
                <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0, flipSign * 0.045]} rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.035, 24]} />
                <meshStandardMaterial color={VW.vwBlue} />
              </mesh>
            </>
          )}
        </group>

        {/* Brake (doesn't spin with wheel) */}
        <group rotation={[0, 0, Math.PI / 2]}>
          <BrakeDisc
            discRadius={isFront ? VW.frontDiscDiameter : VW.rearDrumDiameter}
            isFront={isFront}
          />
        </group>
      </group>
    </group>
  );
}
