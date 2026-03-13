import React, { useMemo } from 'react';
import * as THREE from 'three';
import { D } from './dimensions';

// Cable/hose tube using CatmullRom spline
function CableTube({ points, radius = 0.004, color = '#222' }) {
  const curve = useMemo(() => {
    const vectors = points.map((p) => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(vectors);
  }, [points]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 24, radius, 6, false]} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.3} />
    </mesh>
  );
}

// Under-hood wiring/hose routing adapted for rear-engine 911
export default function Cables() {
  const engineX = D.rearAxleX - 0.25;
  const engineY = D.rearWheelY + 0.05;

  return (
    <group>
      {/* Main wiring harness - runs along spine from frunk to engine bay */}
      <CableTube
        points={[
          [D.frontAxleX + 0.3, D.groundClearance + 0.15, 0.1],
          [D.frontAxleX, D.groundClearance + 0.18, 0.12],
          [0.5, D.groundClearance + 0.20, 0.15],
          [0, D.groundClearance + 0.18, 0.18],
          [-0.5, D.groundClearance + 0.16, 0.15],
          [engineX + 0.3, engineY - 0.10, 0.12],
          [engineX, engineY - 0.05, 0.10],
        ]}
        radius={0.006}
        color="#1a1a1a"
      />

      {/* Fuel line - from front (fuel tank is in front on 911) to rear engine */}
      <CableTube
        points={[
          [D.frontAxleX + 0.2, D.groundClearance + 0.08, -0.08],
          [D.frontAxleX - 0.2, D.groundClearance + 0.10, -0.10],
          [0.3, D.groundClearance + 0.08, -0.12],
          [-0.3, D.groundClearance + 0.08, -0.12],
          [engineX + 0.4, D.groundClearance + 0.06, -0.10],
          [engineX + 0.1, engineY - 0.08, -0.06],
          [engineX, engineY + 0.10, 0],
        ]}
        radius={0.005}
        color="#444488"
      />

      {/* Brake line front left */}
      <CableTube
        points={[
          [D.frontAxleX, D.frontWheelY + 0.15, D.frontWheelZ - 0.05],
          [D.frontAxleX - 0.15, D.frontWheelY + 0.10, D.frontWheelZ * 0.7],
          [D.frontAxleX - 0.20, D.groundClearance + 0.15, D.frontWheelZ * 0.4],
          [D.frontAxleX - 0.25, D.groundClearance + 0.12, 0.08],
        ]}
        radius={0.003}
        color="#333333"
      />

      {/* Brake line front right */}
      <CableTube
        points={[
          [D.frontAxleX, D.frontWheelY + 0.15, -D.frontWheelZ + 0.05],
          [D.frontAxleX - 0.15, D.frontWheelY + 0.10, -D.frontWheelZ * 0.7],
          [D.frontAxleX - 0.20, D.groundClearance + 0.15, -D.frontWheelZ * 0.4],
          [D.frontAxleX - 0.25, D.groundClearance + 0.12, -0.08],
        ]}
        radius={0.003}
        color="#333333"
      />

      {/* Brake line rear (shorter, near engine) */}
      <CableTube
        points={[
          [D.rearAxleX, D.rearWheelY + 0.12, D.rearWheelZ - 0.05],
          [D.rearAxleX + 0.05, D.rearWheelY + 0.08, D.rearWheelZ * 0.6],
          [engineX + 0.15, engineY - 0.10, 0.10],
        ]}
        radius={0.003}
        color="#333333"
      />

      {/* Coolant hose - engine to front radiators (911 GT3 has side-mounted radiators) */}
      <CableTube
        points={[
          [engineX + 0.15, engineY + 0.05, 0.28],
          [engineX + 0.30, engineY, 0.30],
          [-0.2, D.groundClearance + 0.12, 0.35],
          [0.3, D.groundClearance + 0.15, D.bodyWidth / 2 - 0.10],
          [D.frontAxleX - 0.2, D.groundClearance + 0.18, D.bodyWidth / 2 - 0.08],
        ]}
        radius={0.008}
        color="#2a4444"
      />

      {/* Coolant hose - return line other side */}
      <CableTube
        points={[
          [engineX + 0.15, engineY + 0.05, -0.28],
          [engineX + 0.30, engineY, -0.30],
          [-0.2, D.groundClearance + 0.12, -0.35],
          [0.3, D.groundClearance + 0.15, -D.bodyWidth / 2 + 0.10],
          [D.frontAxleX - 0.2, D.groundClearance + 0.18, -D.bodyWidth / 2 + 0.08],
        ]}
        radius={0.008}
        color="#2a4444"
      />

      {/* Throttle cable to ITBs */}
      <CableTube
        points={[
          [0.6, D.groundClearance + 0.30, 0.30],
          [0.2, D.groundClearance + 0.25, 0.25],
          [-0.3, D.groundClearance + 0.15, 0.20],
          [engineX + 0.2, engineY + 0.12, 0.10],
          [engineX, engineY + 0.14, 0],
        ]}
        radius={0.003}
        color="#1a1a1a"
      />

      {/* Oil cooler lines */}
      <CableTube
        points={[
          [engineX + 0.20, engineY - 0.12, 0.18],
          [engineX + 0.35, engineY - 0.15, 0.22],
          [engineX + 0.50, engineY - 0.10, 0.25],
          [engineX + 0.50, engineY + 0.05, 0.20],
        ]}
        radius={0.005}
        color="#553322"
      />
    </group>
  );
}
