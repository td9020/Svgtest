import React from 'react';
import * as THREE from 'three';
import { VW } from './dimensions';

function Seat({ position, isDriver = false, isRearBench = false }) {
  const seatW = isRearBench ? VW.cabinWidth - 0.15 : 0.42;
  const seatD = isRearBench ? 0.42 : 0.45;
  const seatH = 0.08;
  const backH = 0.45;
  const backAngle = -0.15;

  return (
    <group position={position}>
      {/* Seat base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[seatW, seatH, seatD]} />
        <meshStandardMaterial color={VW.seatColor} roughness={0.8} />
      </mesh>
      {/* Seat back */}
      <mesh position={[0, backH / 2 + seatH / 2, -seatD / 2 + 0.03]} rotation={[backAngle, 0, 0]}>
        <boxGeometry args={[seatW - 0.02, backH, 0.06]} />
        <meshStandardMaterial color={VW.seatColor} roughness={0.8} />
      </mesh>
      {/* Headrest */}
      {!isRearBench && (
        <mesh position={[0, backH + seatH / 2 + 0.08, -seatD / 2 - 0.02]}>
          <boxGeometry args={[0.18, 0.15, 0.05]} />
          <meshStandardMaterial color={VW.seatColor} roughness={0.8} />
        </mesh>
      )}
      {isRearBench && (
        <>
          {[-0.25, 0, 0.25].map((offset, i) => (
            <mesh key={`headrest-${i}`} position={[offset, backH + seatH / 2 + 0.08, -seatD / 2 - 0.02]}>
              <boxGeometry args={[0.15, 0.13, 0.04]} />
              <meshStandardMaterial color={VW.seatColor} roughness={0.8} />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}

function Dashboard() {
  const halfL = VW.length / 2;
  const y = VW.beltLine - 0.10;
  const z = halfL - 1.08;

  return (
    <group position={[0, y, z]}>
      {/* Main dashboard */}
      <mesh>
        <boxGeometry args={[VW.cabinWidth - 0.08, 0.22, 0.35]} />
        <meshStandardMaterial color={VW.dashColor} roughness={0.85} />
      </mesh>

      {/* Dashboard top surface */}
      <mesh position={[0, 0.12, 0.05]}>
        <boxGeometry args={[VW.cabinWidth - 0.10, 0.02, 0.30]} />
        <meshStandardMaterial color={VW.dashColor} roughness={0.7} />
      </mesh>

      {/* Instrument cluster */}
      <mesh position={[0.30, 0.06, 0.18]}>
        <boxGeometry args={[0.25, 0.12, 0.02]} />
        <meshStandardMaterial color="#000000" emissive="#001122" emissiveIntensity={0.3} />
      </mesh>

      {/* Infotainment screen */}
      <mesh position={[0, 0.06, 0.18]}>
        <boxGeometry args={[0.22, 0.14, 0.015]} />
        <meshStandardMaterial color="#111111" emissive="#001133" emissiveIntensity={0.2} metalness={0.3} roughness={0.2} />
      </mesh>

      {/* Screen bezel */}
      <mesh position={[0, 0.06, 0.185]}>
        <boxGeometry args={[0.24, 0.16, 0.005]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* AC vents */}
      {[-0.42, -0.15, 0.15, 0.42].map((x, i) => (
        <mesh key={`vent-${i}`} position={[x, 0.04, 0.18]}>
          <boxGeometry args={[0.06, 0.025, 0.01]} />
          <meshStandardMaterial color={VW.chrome} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Glove box */}
      <mesh position={[-0.32, -0.06, 0.12]}>
        <boxGeometry args={[0.30, 0.15, 0.20]} />
        <meshStandardMaterial color={VW.dashColor} roughness={0.85} />
      </mesh>
    </group>
  );
}

function SteeringWheel() {
  const halfL = VW.length / 2;
  const x = 0.30; // Driver side (left-hand drive)
  const y = VW.beltLine - 0.02;
  const z = halfL - 0.82;

  return (
    <group position={[x, y, z]} rotation={[0.42, 0, 0]}>
      {/* Steering wheel rim */}
      <mesh>
        <torusGeometry args={[0.15, 0.012, 8, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>

      {/* Spokes - 3 spoke design */}
      {[0, 2.1, 4.2].map((angle, i) => (
        <mesh key={`spoke-${i}`} position={[Math.cos(angle) * 0.075, Math.sin(angle) * 0.075, 0]} rotation={[0, 0, angle]}>
          <boxGeometry args={[0.12, 0.018, 0.015]} />
          <meshStandardMaterial color="#222222" roughness={0.6} />
        </mesh>
      ))}

      {/* Center hub / airbag cover */}
      <mesh>
        <cylinderGeometry args={[0.045, 0.045, 0.025, 16]} />
        <meshStandardMaterial color="#222222" roughness={0.7} />
      </mesh>

      {/* VW logo on steering wheel */}
      <mesh position={[0, 0, 0.014]}>
        <circleGeometry args={[0.025, 24]} />
        <meshStandardMaterial color={VW.vwBlue} side={THREE.DoubleSide} />
      </mesh>

      {/* Steering column */}
      <mesh position={[0, 0, -0.15]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 0.25, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.6} />
      </mesh>
    </group>
  );
}

function CenterConsole() {
  const halfL = VW.length / 2;

  return (
    <group position={[0, VW.groundClearance + 0.18, halfL - 1.50]}>
      {/* Console body */}
      <mesh>
        <boxGeometry args={[0.22, 0.15, 0.70]} />
        <meshStandardMaterial color={VW.dashColor} roughness={0.8} />
      </mesh>

      {/* Gear lever area */}
      <mesh position={[0, 0.08, 0.10]}>
        <boxGeometry args={[0.12, 0.02, 0.15]} />
        <meshStandardMaterial color="#333333" roughness={0.5} />
      </mesh>

      {/* Gear lever */}
      <mesh position={[0, 0.13, 0.10]}>
        <cylinderGeometry args={[0.012, 0.010, 0.08, 8]} />
        <meshStandardMaterial color="#222222" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.18, 0.10]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>

      {/* Cup holders */}
      {[-0.04, 0.04].map((x, i) => (
        <mesh key={`cup-${i}`} position={[x, 0.08, -0.12]}>
          <cylinderGeometry args={[0.035, 0.035, 0.015, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      ))}

      {/* Armrest */}
      <mesh position={[0, 0.10, -0.25]}>
        <boxGeometry args={[0.20, 0.04, 0.22]} />
        <meshStandardMaterial color={VW.seatColor} roughness={0.8} />
      </mesh>
    </group>
  );
}

function FloorCarpet() {
  return (
    <mesh position={[0, VW.groundClearance + 0.02, 0]}>
      <boxGeometry args={[VW.cabinWidth - 0.15, 0.01, 1.8]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
    </mesh>
  );
}

function Pedals() {
  const halfL = VW.length / 2;
  const x = 0.30; // Driver side
  const y = VW.groundClearance + 0.08;
  const z = halfL - 0.65;

  return (
    <group position={[x, y, z]}>
      {/* Accelerator */}
      <mesh position={[-0.06, 0, 0]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.04, 0.08, 0.005]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Brake */}
      <mesh position={[0.02, 0.02, 0]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.05, 0.08, 0.005]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Clutch (if manual) */}
      <mesh position={[0.10, 0, 0]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.04, 0.08, 0.005]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}

export default function Interior() {
  const halfL = VW.length / 2;
  const seatY = VW.groundClearance + 0.22;

  return (
    <group>
      <Dashboard />
      <SteeringWheel />
      <CenterConsole />
      <FloorCarpet />
      <Pedals />

      {/* Front seats */}
      <Seat position={[0.30, seatY, halfL - 1.55]} isDriver={true} />
      <Seat position={[-0.30, seatY, halfL - 1.55]} />

      {/* Rear bench */}
      <Seat position={[0, seatY - 0.02, halfL - 2.35]} isRearBench={true} />
    </group>
  );
}
