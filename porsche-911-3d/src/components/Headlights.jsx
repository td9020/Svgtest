import React from 'react';
import { D } from './dimensions';

export default function Headlights({ headlightOn = false }) {
  const halfL = D.length / 2;
  const y = D.hoodHeight - 0.05;
  const intensity = headlightOn ? 2.5 : 0;
  const ledColor = headlightOn ? '#FFFFFF' : '#AABBCC';
  const drlColor = headlightOn ? '#FFFFFF' : '#99AABB';

  return (
    <group>
      {[1, -1].map((side) => {
        const z = side * 0.55;
        return (
          <group key={side} position={[halfL - 0.12, y, z]}>
            {/* Headlight housing */}
            <mesh>
              <boxGeometry args={[0.12, 0.08, 0.18]} />
              <meshStandardMaterial
                color="#222222"
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>

            {/* Headlight lens */}
            <mesh position={[0.06, 0, 0]}>
              <boxGeometry args={[0.005, 0.07, 0.17]} />
              <meshPhysicalMaterial
                color="#DDEEFF"
                transparent
                opacity={0.4}
                metalness={0.1}
                roughness={0.05}
                transmission={0.3}
              />
            </mesh>

            {/* Quad LED signature - 4 dots (Porsche PDLS Plus) */}
            {[
              [0.055, 0.015, 0.04],
              [0.055, 0.015, -0.04],
              [0.055, -0.015, 0.04],
              [0.055, -0.015, -0.04],
            ].map((pos, i) => (
              <group key={i}>
                <mesh position={pos}>
                  <sphereGeometry args={[0.012, 12, 12]} />
                  <meshStandardMaterial
                    color={ledColor}
                    emissive={headlightOn ? '#FFFFFF' : '#000000'}
                    emissiveIntensity={headlightOn ? 1.5 : 0}
                  />
                </mesh>
              </group>
            ))}

            {/* DRL strip (daytime running light) - C-shaped */}
            <mesh position={[0.055, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.035, 0.004, 8, 16, Math.PI * 1.5]} />
              <meshStandardMaterial
                color={drlColor}
                emissive={headlightOn ? '#FFFFFF' : '#334455'}
                emissiveIntensity={headlightOn ? 0.8 : 0.15}
              />
            </mesh>

            {/* Chrome reflector inside */}
            <mesh position={[-0.02, 0, 0]}>
              <boxGeometry args={[0.01, 0.06, 0.15]} />
              <meshStandardMaterial color="#888888" metalness={0.95} roughness={0.05} />
            </mesh>

            {/* Point light when on */}
            {headlightOn && (
              <pointLight
                position={[0.15, 0, 0]}
                color="#FFFFEE"
                intensity={intensity}
                distance={8}
                decay={2}
              />
            )}
          </group>
        );
      })}
    </group>
  );
}
