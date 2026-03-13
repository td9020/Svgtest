import React, { useMemo } from 'react';
import * as THREE from 'three';
import { VW } from './dimensions';

function Cylinder({ position, pistonOffset = 0, index }) {
  const boreR = VW.bore / 2;
  const stroke = VW.stroke;

  return (
    <group position={position}>
      {/* Cylinder block */}
      <mesh>
        <cylinderGeometry args={[boreR + 0.005, boreR + 0.005, stroke + 0.02, 16]} />
        <meshStandardMaterial color="#555555" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Piston */}
      <mesh position={[0, pistonOffset * stroke * 0.3, 0]}>
        <cylinderGeometry args={[boreR - 0.002, boreR - 0.002, 0.015, 16]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Connecting rod */}
      <mesh position={[0, pistonOffset * stroke * 0.3 - 0.03, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.05, 6]} />
        <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Spark plug */}
      <mesh position={[0, stroke / 2 + 0.015, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.025, 6]} />
        <meshStandardMaterial color="#dddddd" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

function EngineBlock({ pistonOffset = 0 }) {
  const cylCount = VW.engineCylinders;
  const spacing = VW.bore + 0.012;

  return (
    <group>
      {/* Main block */}
      <mesh>
        <boxGeometry args={[spacing * cylCount + 0.03, VW.stroke + 0.04, VW.bore * 2 + 0.04]} />
        <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Cylinders */}
      {Array.from({ length: cylCount }).map((_, i) => {
        const x = (i - (cylCount - 1) / 2) * spacing;
        const phase = (i / cylCount) * Math.PI * 2;
        const offset = Math.sin(phase + pistonOffset);
        return (
          <Cylinder
            key={`cyl-${i}`}
            position={[x, 0.01, 0]}
            pistonOffset={offset}
            index={i}
          />
        );
      })}

      {/* Cylinder head / valve cover */}
      <mesh position={[0, (VW.stroke + 0.04) / 2 + 0.015, 0]}>
        <boxGeometry args={[spacing * cylCount + 0.02, 0.03, VW.bore * 2 + 0.03]} />
        <meshStandardMaterial color="#333333" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* VW / TSI label on valve cover */}
      <mesh position={[0, (VW.stroke + 0.04) / 2 + 0.032, 0.04]}>
        <boxGeometry args={[0.06, 0.003, 0.02]} />
        <meshStandardMaterial color={VW.chrome} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Oil pan */}
      <mesh position={[0, -(VW.stroke + 0.04) / 2 - 0.015, 0]}>
        <boxGeometry args={[spacing * cylCount - 0.01, 0.03, VW.bore * 2 + 0.01]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Turbocharger() {
  return (
    <group>
      {/* Turbine housing */}
      <mesh>
        <cylinderGeometry args={[0.035, 0.030, 0.04, 12]} />
        <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Compressor housing */}
      <mesh position={[0, 0, 0.04]}>
        <cylinderGeometry args={[0.030, 0.035, 0.035, 12]} />
        <meshStandardMaterial color="#555555" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Wastegate actuator */}
      <mesh position={[0.03, 0.02, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.03, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.6} />
      </mesh>
      {/* Inlet pipe */}
      <mesh position={[-0.04, 0, 0.02]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />
        <meshStandardMaterial color="#666666" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Intercooler() {
  return (
    <group>
      {/* Core */}
      <mesh>
        <boxGeometry args={[0.30, 0.08, 0.04]} />
        <meshStandardMaterial color="#888888" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Fins (simplified) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`fin-${i}`} position={[(i - 3.5) * 0.035, 0, 0]}>
          <boxGeometry args={[0.002, 0.075, 0.038]} />
          <meshStandardMaterial color="#999999" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {/* End tanks */}
      <mesh position={[-0.16, 0, 0]}>
        <boxGeometry args={[0.02, 0.07, 0.035]} />
        <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.16, 0, 0]}>
        <boxGeometry args={[0.02, 0.07, 0.035]} />
        <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Battery() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.18, 0.14, 0.12]} />
        <meshStandardMaterial color="#222222" roughness={0.9} />
      </mesh>
      {/* Terminals */}
      <mesh position={[-0.05, 0.075, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.015, 8]} />
        <meshStandardMaterial color="#cc0000" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.05, 0.075, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.015, 8]} />
        <meshStandardMaterial color="#000000" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Label */}
      <mesh position={[0, 0.02, 0.062]}>
        <boxGeometry args={[0.10, 0.04, 0.002]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function CoolantReservoir() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.035, 0.035, 0.12, 12]} />
        <meshPhysicalMaterial
          color="#ddffdd"
          transparent
          opacity={0.5}
          roughness={0.2}
        />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.065, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.015, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.6} />
      </mesh>
    </group>
  );
}

function AirIntake() {
  return (
    <group>
      {/* Air filter box */}
      <mesh>
        <boxGeometry args={[0.16, 0.10, 0.14]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      {/* Intake pipe */}
      <mesh position={[0.10, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.08, 8]} />
        <meshStandardMaterial color="#222222" roughness={0.7} />
      </mesh>
    </group>
  );
}

export default function Engine({ pistonOffset = 0 }) {
  const halfL = VW.length / 2;
  const engineY = VW.groundClearance + 0.25;
  const engineZ = halfL - 0.45;

  return (
    <group position={[0, engineY, engineZ]}>
      {/* Engine block */}
      <group rotation={[0, Math.PI / 2, 0]}>
        <EngineBlock pistonOffset={pistonOffset} />
      </group>

      {/* Turbocharger */}
      <group position={[0.12, -0.03, -0.08]}>
        <Turbocharger />
      </group>

      {/* Intercooler (front) */}
      <group position={[0, -0.02, 0.20]}>
        <Intercooler />
      </group>

      {/* Battery */}
      <group position={[-0.30, 0.02, 0.05]}>
        <Battery />
      </group>

      {/* Coolant reservoir */}
      <group position={[0.28, 0.06, 0.05]}>
        <CoolantReservoir />
      </group>

      {/* Air intake */}
      <group position={[-0.18, 0.08, 0.10]}>
        <AirIntake />
      </group>

      {/* Radiator hoses (simplified) */}
      <mesh position={[0.15, 0.06, 0.12]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.10, 6]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>
      <mesh position={[-0.10, -0.05, 0.12]} rotation={[0.5, 0.3, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.12, 6]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>

      {/* Drive belt area */}
      <mesh position={[0, 0, 0.10]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.05, 0.004, 4, 24]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
    </group>
  );
}
