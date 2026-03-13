import * as THREE from 'three'
import { useMemo } from 'react'

// Cable and wire routing for KTM 390 Duke
// Clutch cable, throttle cable, brake line, speedometer, electrical harness
// Uses tube geometry following curved paths

function CableTube({ points, radius = 0.002, color = '#222' }) {
  const curve = useMemo(() => {
    const vectors = points.map(p => new THREE.Vector3(...p))
    return new THREE.CatmullRomCurve3(vectors)
  }, [points])

  return (
    <mesh>
      <tubeGeometry args={[curve, 20, radius, 6, false]} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.3} />
    </mesh>
  )
}

export default function Cables({ position = [0, 0, 0], steeringAngle = 0 }) {
  // KTM 390 Duke: wheelbase = 1.367m
  const wb = 1.367

  // Slight lateral offset based on steering for cable flex
  const steerFlex = steeringAngle * 0.02

  return (
    <group position={position}>
      {/* Clutch cable - left clip-on lever to engine */}
      <CableTube
        points={[
          [wb - 0.04, 0.76, -0.22],             // lever mount (clip-on)
          [wb - 0.10, 0.68, -0.18 + steerFlex],  // down from handlebar
          [wb - 0.20, 0.56, -0.12],              // along frame
          [wb * 0.45, 0.42, -0.08],              // curve toward engine
          [wb * 0.38, 0.34, -0.06],              // engine clutch actuator
        ]}
        radius={0.0025}
        color="#1a1a1a"
      />

      {/* Throttle cable - right grip to throttle body */}
      <CableTube
        points={[
          [wb - 0.04, 0.76, 0.22],               // throttle grip
          [wb - 0.10, 0.68, 0.18 + steerFlex],   // down from clip-on
          [wb - 0.18, 0.54, 0.12],               // along frame
          [wb * 0.42, 0.40, 0.08],               // toward throttle body
          [wb * 0.38, 0.36, 0.05],               // throttle body inlet
        ]}
        radius={0.002}
        color="#1a1a1a"
      />

      {/* Front brake line - right lever to front caliper (braided steel) */}
      <CableTube
        points={[
          [wb - 0.04, 0.76, 0.18],               // brake lever master cylinder
          [wb - 0.08, 0.66, 0.10 + steerFlex],   // down fork
          [wb - 0.12, 0.50, 0.08],               // along USD fork leg
          [wb - 0.14, 0.38, 0.065],              // toward caliper
          [wb - 0.14, 0.30, 0.06],               // front caliper
        ]}
        radius={0.002}
        color="#333"
      />

      {/* Speedometer cable - front wheel to TFT cluster */}
      <CableTube
        points={[
          [wb, 0.30, -0.04],                     // front hub
          [wb - 0.06, 0.40, -0.05],              // up fork
          [wb - 0.04, 0.52, -0.03],              // toward cluster
          [wb - 0.02, 0.72, -0.02],              // TFT instrument cluster
        ]}
        radius={0.0015}
        color="#444"
      />

      {/* Rear brake line (hydraulic) */}
      <CableTube
        points={[
          [wb * 0.29, 0.26, 0.13],               // rear brake pedal area
          [wb * 0.15, 0.24, 0.10],               // along frame
          [0.05, 0.31, 0.08],                    // to rear caliper
        ]}
        radius={0.002}
        color="#555"
      />

      {/* Electrical harness - main loom */}
      <CableTube
        points={[
          [wb - 0.08, 0.70, 0],                  // headlight area
          [wb * 0.6, 0.78, 0],                   // along backbone
          [wb * 0.4, 0.68, 0.03],                // past tank
          [wb * 0.2, 0.58, 0.04],                // to tail
          [0.02, 0.48, 0.03],                    // tail section
        ]}
        radius={0.004}
        color="#1a1a1a"
      />
    </group>
  )
}
