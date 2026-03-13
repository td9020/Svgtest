import React, { useMemo } from 'react';
import * as THREE from 'three';
import { D } from './dimensions';
import { useCSG } from './CSGMesh';

const blackMat = new THREE.MeshStandardMaterial({
  color: '#111111',
  metalness: 0.3,
  roughness: 0.5,
});

const grilleMat = new THREE.MeshStandardMaterial({
  color: '#1a1a1a',
  metalness: 0.4,
  roughness: 0.6,
});

// 911 iconic body profile using LatheGeometry for the smooth flowing shape
function createBodyProfile() {
  const halfW = D.bodyWidth / 2;
  const halfL = D.length / 2;
  const gc = D.groundClearance;

  const shape = new THREE.Shape();

  // Bottom of car (flat underbody)
  shape.moveTo(-halfL, gc);
  shape.lineTo(halfL, gc);

  // Front bumper curves up
  shape.quadraticCurveTo(halfL + 0.05, gc + 0.15, halfL - 0.05, gc + 0.25);

  // Front hood - LOW (no engine here, it's a frunk!)
  shape.lineTo(halfL - 0.25, D.hoodHeight * 0.85);
  shape.quadraticCurveTo(halfL - 0.5, D.hoodHeight * 0.92, halfL - 0.8, D.hoodHeight);

  // Windshield base to top - steep rake
  const wsBase = halfL - D.frontOverhang - 0.2;
  shape.lineTo(wsBase, D.hoodHeight);
  shape.quadraticCurveTo(wsBase - 0.3, D.hoodHeight + 0.15, wsBase - 0.55, D.roofHeight);

  // Roof - short, flows into rear
  const roofPeak = wsBase - 0.65;
  shape.lineTo(roofPeak, D.roofHeight);

  // THE ICONIC 911 SLOPING ROOFLINE
  const rearWindowStart = roofPeak - 0.1;
  shape.quadraticCurveTo(
    rearWindowStart - 0.4, D.roofHeight - 0.05,
    -halfL + D.rearOverhang * 0.5, D.roofHeight - 0.2
  );

  // Rear deck / engine cover
  shape.quadraticCurveTo(
    -halfL + D.rearOverhang * 0.3, D.roofHeight - 0.35,
    -halfL + 0.25, D.roofHeight - 0.35
  );

  // Rear end drops down
  shape.lineTo(-halfL + 0.1, D.roofHeight - 0.45);
  shape.quadraticCurveTo(-halfL, D.roofHeight - 0.5, -halfL, gc + 0.3);

  // Rear bumper bottom
  shape.quadraticCurveTo(-halfL, gc + 0.1, -halfL + 0.05, gc);

  shape.lineTo(-halfL, gc);

  return shape;
}

export default function Body({ opacity = 1, doorsOpen = false, hoodOpen = false, paintColor = '#c0c0c0' }) {
  const isTransparent = opacity < 1;

  const mainBodyGeo = useMemo(() => {
    const shape = createBodyProfile();

    const extrudeSettings = {
      steps: 1,
      depth: D.bodyWidth,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 3,
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.translate(0, 0, -D.bodyWidth / 2);
    geo.rotateX(-Math.PI / 2);

    return geo;
  }, []);

  // Create body material for CSG
  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: paintColor,
    metalness: 0.4,
    roughness: 0.25,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  }), [paintColor]);

  // Wheel arch cutouts
  const wheelArchGeo = useCSG(
    {
      geometry: mainBodyGeo,
      material: isTransparent
        ? new THREE.MeshStandardMaterial({
            color: paintColor,
            metalness: 0.4,
            roughness: 0.25,
            transparent: true,
            opacity,
          })
        : bodyMat,
    },
    [
      // Front left wheel arch
      {
        geometry: new THREE.SphereGeometry(D.frontTire.outerDiameter / 2 + 0.04, 16, 16, 0, Math.PI),
        position: [D.frontAxleX, D.frontWheelY, D.frontWheelZ],
        rotation: [0, 0, 0],
      },
      // Front right wheel arch
      {
        geometry: new THREE.SphereGeometry(D.frontTire.outerDiameter / 2 + 0.04, 16, 16, 0, Math.PI),
        position: [D.frontAxleX, D.frontWheelY, -D.frontWheelZ],
        rotation: [0, Math.PI, 0],
      },
      // Rear left wheel arch (bigger for wider tires)
      {
        geometry: new THREE.SphereGeometry(D.rearTire.outerDiameter / 2 + 0.05, 16, 16, 0, Math.PI),
        position: [D.rearAxleX, D.rearWheelY, D.rearWheelZ],
        rotation: [0, 0, 0],
      },
      // Rear right wheel arch
      {
        geometry: new THREE.SphereGeometry(D.rearTire.outerDiameter / 2 + 0.05, 16, 16, 0, Math.PI),
        position: [D.rearAxleX, D.rearWheelY, -D.rearWheelZ],
        rotation: [0, Math.PI, 0],
      },
      // Front windshield recess
      {
        geometry: new THREE.BoxGeometry(1.0, 0.6, D.bodyWidth - 0.15),
        position: [D.frontAxleX - 0.15, D.hoodHeight + 0.25, 0],
        rotation: [0.35, 0, 0],
      },
      // Rear window recess
      {
        geometry: new THREE.BoxGeometry(0.7, 0.4, D.bodyWidth - 0.2),
        position: [D.rearAxleX + 0.6, D.roofHeight - 0.15, 0],
        rotation: [-0.3, 0, 0],
      },
      // Side windows left
      {
        geometry: new THREE.BoxGeometry(1.2, 0.25, 0.1),
        position: [0.2, D.beltlineHeight + 0.12, D.bodyWidth / 2 + 0.01],
      },
      // Side windows right
      {
        geometry: new THREE.BoxGeometry(1.2, 0.25, 0.1),
        position: [0.2, D.beltlineHeight + 0.12, -D.bodyWidth / 2 - 0.01],
      },
      // Headlight recesses left
      {
        geometry: new THREE.CylinderGeometry(0.08, 0.1, 0.15, 16),
        position: [D.length / 2 - 0.15, D.hoodHeight - 0.05, 0.55],
        rotation: [0, 0, Math.PI / 2],
      },
      // Headlight recesses right
      {
        geometry: new THREE.CylinderGeometry(0.08, 0.1, 0.15, 16),
        position: [D.length / 2 - 0.15, D.hoodHeight - 0.05, -0.55],
        rotation: [0, 0, Math.PI / 2],
      },
    ]
  );

  const halfL = D.length / 2;

  return (
    <group>
      {/* Main CSG body */}
      <mesh geometry={wheelArchGeo}>
        {isTransparent ? (
          <meshStandardMaterial
            color={paintColor}
            metalness={0.4}
            roughness={0.25}
            transparent
            opacity={opacity}
          />
        ) : (
          <meshPhysicalMaterial
            color={paintColor}
            metalness={0.4}
            roughness={0.2}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        )}
      </mesh>

      {/* Rear haunches - wider fender flares */}
      <mesh position={[D.rearAxleX, D.rearWheelY + 0.15, D.rearWheelZ + 0.03]}>
        <sphereGeometry args={[0.42, 16, 12, 0, Math.PI, 0, Math.PI / 2]} />
        {isTransparent ? (
          <meshStandardMaterial color={paintColor} transparent opacity={opacity} />
        ) : (
          <meshPhysicalMaterial color={paintColor} metalness={0.4} roughness={0.2} clearcoat={1} />
        )}
      </mesh>
      <mesh position={[D.rearAxleX, D.rearWheelY + 0.15, -D.rearWheelZ - 0.03]}>
        <sphereGeometry args={[0.42, 16, 12, 0, Math.PI, 0, Math.PI / 2]} />
        {isTransparent ? (
          <meshStandardMaterial color={paintColor} transparent opacity={opacity} />
        ) : (
          <meshPhysicalMaterial color={paintColor} metalness={0.4} roughness={0.2} clearcoat={1} />
        )}
      </mesh>

      {/* Front bumper / air intake */}
      <mesh position={[halfL - 0.02, D.groundClearance + 0.12, 0]}>
        <boxGeometry args={[0.05, 0.12, D.bodyWidth * 0.85]} />
        <meshStandardMaterial color="#111111" roughness={0.7} />
      </mesh>

      {/* Front lip spoiler */}
      <mesh position={[halfL + 0.01, D.groundClearance + 0.03, 0]}>
        <boxGeometry args={[0.08, 0.02, D.bodyWidth * 0.9]} />
        <meshStandardMaterial color="#222222" roughness={0.5} />
      </mesh>

      {/* Side air intakes (behind doors, for engine cooling) */}
      {[1, -1].map((side) => (
        <group key={side}>
          <mesh position={[-0.3, D.groundClearance + 0.25, side * (D.bodyWidth / 2 + 0.01)]}>
            <boxGeometry args={[0.35, 0.12, 0.02]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
          </mesh>
          {/* Intake grille lines */}
          {Array.from({ length: 5 }, (_, i) => (
            <mesh
              key={i}
              position={[
                -0.3 + (i - 2) * 0.06,
                D.groundClearance + 0.25,
                side * (D.bodyWidth / 2 + 0.015),
              ]}
            >
              <boxGeometry args={[0.005, 0.10, 0.005]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Rear engine grille mesh */}
      <mesh position={[-halfL + 0.25, D.roofHeight - 0.42, 0]}>
        <boxGeometry args={[0.4, 0.08, D.bodyWidth * 0.6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Grille horizontal slats */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={i}
          position={[-halfL + 0.25, D.roofHeight - 0.44 + i * 0.012, 0]}
        >
          <boxGeometry args={[0.38, 0.002, D.bodyWidth * 0.58]} />
          <meshStandardMaterial color="#333333" metalness={0.5} />
        </mesh>
      ))}

      {/* Rear bumper / diffuser */}
      <mesh position={[-halfL + 0.02, D.groundClearance + 0.1, 0]}>
        <boxGeometry args={[0.06, 0.15, D.bodyWidth * 0.9]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>

      {/* PORSCHE lettering bar on rear */}
      <mesh position={[-halfL + 0.01, D.roofHeight - 0.55, 0]}>
        <boxGeometry args={[0.01, 0.03, D.bodyWidth * 0.5]} />
        <meshStandardMaterial color="#CCCCCC" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Door seam lines */}
      {[1, -1].map((side) => (
        <mesh
          key={`door${side}`}
          position={[0.4, D.groundClearance + 0.35, side * (D.bodyWidth / 2 + 0.02)]}
        >
          <boxGeometry args={[0.003, 0.55, 0.003]} />
          <meshStandardMaterial color="#444444" />
        </mesh>
      ))}

      {/* Door handle */}
      {[1, -1].map((side) => (
        <mesh
          key={`handle${side}`}
          position={[0.55, D.beltlineHeight - 0.03, side * (D.bodyWidth / 2 + 0.02)]}
        >
          <boxGeometry args={[0.1, 0.015, 0.012]} />
          {isTransparent ? (
            <meshStandardMaterial color={paintColor} transparent opacity={opacity} metalness={0.5} roughness={0.3} />
          ) : (
            <meshPhysicalMaterial color={paintColor} metalness={0.5} roughness={0.3} clearcoat={1} />
          )}
        </mesh>
      ))}

      {/* Side mirrors */}
      {[1, -1].map((side) => (
        <group key={`mirror${side}`} position={[0.8, D.beltlineHeight + 0.08, side * (D.bodyWidth / 2 + 0.08)]}>
          <mesh>
            <boxGeometry args={[0.1, 0.05, 0.06]} />
            {isTransparent ? (
              <meshStandardMaterial color={paintColor} transparent opacity={opacity} />
            ) : (
              <meshPhysicalMaterial color={paintColor} metalness={0.4} roughness={0.2} clearcoat={1} />
            )}
          </mesh>
          {/* Mirror glass */}
          <mesh position={[-0.02, 0, side * 0.031]}>
            <boxGeometry args={[0.07, 0.035, 0.002]} />
            <meshStandardMaterial color="#88AACC" metalness={0.9} roughness={0.05} />
          </mesh>
        </group>
      ))}

      {/* Frunk (front trunk) lid lines */}
      <mesh position={[halfL - 0.6, D.hoodHeight + 0.01, 0]}>
        <boxGeometry args={[0.8, 0.003, D.bodyWidth * 0.7]} />
        {isTransparent ? (
          <meshStandardMaterial color={paintColor} transparent opacity={opacity} />
        ) : (
          <meshPhysicalMaterial color={paintColor} metalness={0.3} roughness={0.3} clearcoat={0.8} />
        )}
      </mesh>
    </group>
  );
}
