import React, { useMemo } from 'react';
import * as THREE from 'three';
import { VW } from './dimensions';

function CableRoute({ points, color = '#111111', radius = 0.006, tubularSegments = 32 }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(...p))
    );
    return new THREE.TubeGeometry(curve, tubularSegments, radius, 6, false);
  }, [points, radius, tubularSegments]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
    </mesh>
  );
}

function HoseRoute({ points, color = '#222222', radius = 0.012 }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(...p))
    );
    return new THREE.TubeGeometry(curve, 24, radius, 8, false);
  }, [points, radius]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} />
    </mesh>
  );
}

export default function Cables() {
  const halfL = VW.length / 2;
  const engineY = VW.groundClearance + 0.25;
  const engineZ = halfL - 0.45;

  // Battery position: [-0.30, 0.02, 0.05] relative to engine
  const battX = -0.30;
  const battY = engineY + 0.02;
  const battZ = engineZ + 0.05;

  // Coolant reservoir: [0.28, 0.06, 0.05] relative to engine
  const coolX = 0.28;
  const coolY = engineY + 0.06;
  const coolZ = engineZ + 0.05;

  return (
    <group>
      {/* Battery positive cable (red) - battery to starter/alternator area */}
      <CableRoute
        color="#8B0000"
        radius={0.005}
        points={[
          [battX - 0.05, battY + 0.075, battZ],
          [battX - 0.05, battY + 0.12, battZ + 0.05],
          [battX + 0.05, battY + 0.14, battZ + 0.08],
          [0, engineY + 0.12, engineZ + 0.02],
          [0.05, engineY + 0.05, engineZ - 0.04],
          [0.08, engineY - 0.02, engineZ - 0.06],
        ]}
      />

      {/* Battery negative cable (black) - battery to engine block ground */}
      <CableRoute
        color="#0a0a0a"
        radius={0.005}
        points={[
          [battX + 0.05, battY + 0.075, battZ],
          [battX + 0.10, battY + 0.10, battZ - 0.02],
          [-0.10, engineY + 0.06, engineZ - 0.05],
          [-0.05, engineY, engineZ - 0.06],
        ]}
      />

      {/* Spark plug wires - from coil pack to cylinders */}
      {[0, 1, 2].map((i) => {
        const cylX = (i - 1) * (VW.bore + 0.012);
        return (
          <CableRoute
            key={`spark-${i}`}
            color="#333399"
            radius={0.004}
            points={[
              [cylX, engineY + 0.10, engineZ + 0.06],
              [cylX + 0.02, engineY + 0.14, engineZ + 0.04],
              [0.15, engineY + 0.16, engineZ + 0.02],
              [0.18, engineY + 0.14, engineZ - 0.02],
            ]}
          />
        );
      })}

      {/* Upper radiator hose - engine to radiator (front) */}
      <HoseRoute
        color="#1a1a1a"
        radius={0.014}
        points={[
          [0.12, engineY + 0.06, engineZ + 0.08],
          [0.12, engineY + 0.10, engineZ + 0.14],
          [0.08, engineY + 0.08, engineZ + 0.22],
          [0, engineY + 0.04, engineZ + 0.28],
        ]}
      />

      {/* Lower radiator hose */}
      <HoseRoute
        color="#1a1a1a"
        radius={0.013}
        points={[
          [-0.08, engineY - 0.06, engineZ + 0.08],
          [-0.10, engineY - 0.08, engineZ + 0.14],
          [-0.06, engineY - 0.06, engineZ + 0.22],
          [0, engineY - 0.04, engineZ + 0.28],
        ]}
      />

      {/* Coolant hose - reservoir to engine */}
      <HoseRoute
        color="#2a4a2a"
        radius={0.008}
        points={[
          [coolX, coolY, coolZ],
          [coolX - 0.05, coolY + 0.04, coolZ - 0.03],
          [0.15, engineY + 0.10, engineZ],
          [0.08, engineY + 0.06, engineZ - 0.02],
        ]}
      />

      {/* Turbo boost hose - turbo to intercooler */}
      <HoseRoute
        color="#222222"
        radius={0.015}
        points={[
          [0.12, engineY - 0.03, engineZ - 0.08],
          [0.15, engineY - 0.02, engineZ - 0.02],
          [0.18, engineY + 0.02, engineZ + 0.08],
          [0.16, engineY - 0.02, engineZ + 0.18],
          [0.10, engineY - 0.02, engineZ + 0.20],
        ]}
      />

      {/* Intercooler to throttle body hose */}
      <HoseRoute
        color="#222222"
        radius={0.013}
        points={[
          [-0.10, engineY - 0.02, engineZ + 0.20],
          [-0.14, engineY + 0.02, engineZ + 0.14],
          [-0.12, engineY + 0.06, engineZ + 0.06],
          [-0.08, engineY + 0.08, engineZ],
        ]}
      />

      {/* Fuel line */}
      <CableRoute
        color="#444444"
        radius={0.004}
        points={[
          [0.08, engineY - 0.08, engineZ - 0.10],
          [0.10, engineY - 0.10, engineZ - 0.20],
          [0.12, engineY - 0.12, engineZ - 0.40],
          [0.10, VW.groundClearance + 0.05, 0],
          [0.08, VW.groundClearance + 0.04, -0.50],
        ]}
      />

      {/* Brake line (front) */}
      <CableRoute
        color="#555555"
        radius={0.003}
        points={[
          [0.05, engineY - 0.06, engineZ - 0.08],
          [0.20, engineY - 0.08, engineZ - 0.10],
          [0.40, VW.groundClearance + 0.12, engineZ - 0.20],
          [VW.trackFront / 2 - 0.05, VW.tireRadius, engineZ - 0.25],
        ]}
      />

      {/* Wiring harness along firewall */}
      <CableRoute
        color="#2a2a2a"
        radius={0.008}
        points={[
          [-0.30, engineY + 0.08, engineZ - 0.18],
          [-0.15, engineY + 0.12, engineZ - 0.18],
          [0, engineY + 0.14, engineZ - 0.18],
          [0.15, engineY + 0.12, engineZ - 0.18],
          [0.30, engineY + 0.08, engineZ - 0.18],
        ]}
      />

      {/* Throttle cable */}
      <CableRoute
        color="#666666"
        radius={0.003}
        points={[
          [0.20, engineY + 0.08, engineZ - 0.18],
          [0.18, engineY + 0.10, engineZ - 0.10],
          [0.10, engineY + 0.08, engineZ - 0.04],
          [0.05, engineY + 0.06, engineZ],
        ]}
      />
    </group>
  );
}
