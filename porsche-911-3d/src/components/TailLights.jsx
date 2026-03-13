import React from 'react';
import { D } from './dimensions';

export default function TailLights({ brakeLightOn = false, turnSignalsOn = false }) {
  const halfL = D.length / 2;
  const y = D.roofHeight - 0.50;
  const x = -halfL + 0.03;

  const brakeColor = brakeLightOn ? '#FF0000' : '#660000';
  const brakeEmissive = brakeLightOn ? '#FF0000' : '#220000';
  const brakeIntensity = brakeLightOn ? 2.0 : 0.15;

  const turnColor = turnSignalsOn ? '#FF8800' : '#664400';
  const turnEmissive = turnSignalsOn ? '#FF8800' : '#221100';
  const turnIntensity = turnSignalsOn ? 1.5 : 0.1;

  return (
    <group>
      {/* Full-width LED light bar (992 signature) */}
      <mesh position={[x, y, 0]}>
        <boxGeometry args={[0.02, 0.025, D.bodyWidth * 0.75]} />
        <meshStandardMaterial
          color={brakeColor}
          emissive={brakeEmissive}
          emissiveIntensity={brakeIntensity}
        />
      </mesh>

      {/* Left and right tail light clusters */}
      {[1, -1].map((side) => {
        const z = side * 0.55;
        return (
          <group key={side} position={[x, y, z]}>
            {/* Main tail light housing */}
            <mesh>
              <boxGeometry args={[0.06, 0.06, 0.22]} />
              <meshStandardMaterial color="#330000" metalness={0.2} roughness={0.4} />
            </mesh>

            {/* 3D LED inner elements - horizontal bars */}
            {[0.015, -0.015].map((dy, i) => (
              <mesh key={i} position={[0.025, dy, 0]}>
                <boxGeometry args={[0.008, 0.01, 0.18]} />
                <meshStandardMaterial
                  color={brakeColor}
                  emissive={brakeEmissive}
                  emissiveIntensity={brakeIntensity}
                />
              </mesh>
            ))}

            {/* LED dots pattern */}
            {Array.from({ length: 6 }, (_, i) => (
              <mesh
                key={i}
                position={[0.03, 0, (i - 2.5) * 0.03]}
              >
                <sphereGeometry args={[0.006, 8, 8]} />
                <meshStandardMaterial
                  color={brakeColor}
                  emissive={brakeEmissive}
                  emissiveIntensity={brakeIntensity * 1.5}
                />
              </mesh>
            ))}

            {/* Turn signal (outer edge) */}
            <mesh position={[0.025, -0.025, side * 0.1]}>
              <boxGeometry args={[0.008, 0.015, 0.04]} />
              <meshStandardMaterial
                color={turnColor}
                emissive={turnEmissive}
                emissiveIntensity={turnIntensity}
              />
            </mesh>

            {/* Smoke lens cover */}
            <mesh position={[0.032, 0, 0]}>
              <boxGeometry args={[0.003, 0.055, 0.21]} />
              <meshPhysicalMaterial
                color="#441111"
                transparent
                opacity={0.5}
                metalness={0.1}
                roughness={0.1}
              />
            </mesh>

            {/* Brake light glow */}
            {brakeLightOn && (
              <pointLight
                position={[-0.1, 0, 0]}
                color="#FF0000"
                intensity={1.5}
                distance={3}
                decay={2}
              />
            )}
          </group>
        );
      })}

      {/* PORSCHE lettering between lights */}
      <group position={[x + 0.005, y - 0.04, 0]}>
        {/* Simple text representation with blocks */}
        {['P', 'O', 'R', 'S', 'C', 'H', 'E'].map((_, i) => (
          <mesh key={i} position={[0, 0, (i - 3) * 0.045]}>
            <boxGeometry args={[0.005, 0.018, 0.03]} />
            <meshStandardMaterial
              color="#DDDDDD"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Reverse lights */}
      {[1, -1].map((side) => (
        <mesh key={`rev${side}`} position={[x, y - 0.045, side * 0.35]}>
          <boxGeometry args={[0.015, 0.015, 0.05]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#333333" emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
}
