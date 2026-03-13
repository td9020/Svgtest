import * as THREE from 'three'
import { useMemo } from 'react'

// Cable and wire routing - clutch cable, throttle cable, brake line
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
  // All cable paths are approximate - running from controls to their endpoints
  // Coordinates relative to motorcycle origin (rear axle at 0,0,0)
  const wb = 1.338

  // Slight lateral offset based on steering for cable flex
  const steerFlex = steeringAngle * 0.02

  return (
    <group position={position}>
      {/* Clutch cable - left handlebar lever to engine */}
      <CableTube
        points={[
          [wb + 0.01, 0.79, -0.22],            // lever mount
          [wb - 0.05, 0.72, -0.18 + steerFlex], // down from handlebar
          [wb - 0.15, 0.60, -0.12],             // along frame
          [wb * 0.5, 0.45, -0.08],              // curve toward engine
          [wb * 0.38, 0.38, -0.06],             // engine clutch actuator
        ]}
        radius={0.0025}
        color="#1a1a1a"
      />

      {/* Throttle cable - right grip to carburetor */}
      <CableTube
        points={[
          [wb + 0.01, 0.79, 0.22],              // throttle grip
          [wb - 0.05, 0.72, 0.18 + steerFlex],  // down from handlebar
          [wb - 0.12, 0.58, 0.12],              // along frame
          [wb * 0.45, 0.42, 0.08],              // toward carb
          [wb * 0.40, 0.36, 0.05],              // carburetor inlet
        ]}
        radius={0.002}
        color="#1a1a1a"
      />

      {/* Front brake line - right lever to front caliper */}
      <CableTube
        points={[
          [wb + 0.01, 0.79, 0.18],              // brake lever master cylinder
          [wb - 0.02, 0.70, 0.10 + steerFlex],  // down fork
          [wb - 0.05, 0.55, 0.08],              // along fork leg
          [wb - 0.08, 0.40, 0.065],             // toward caliper
          [wb - 0.08, 0.32, 0.06],              // front caliper
        ]}
        radius={0.002}
        color="#333"
      />

      {/* Speedometer cable - front wheel to instrument */}
      <CableTube
        points={[
          [wb, 0.31, -0.04],                    // front hub
          [wb - 0.05, 0.40, -0.05],             // up fork
          [wb - 0.02, 0.55, -0.03],             // toward cluster
          [wb + 0.02, 0.78, -0.02],             // instrument cluster
        ]}
        radius={0.0015}
        color="#444"
      />

      {/* Rear brake rod (solid) */}
      <CableTube
        points={[
          [wb * 0.28, 0.25, 0.12],              // rear brake pedal
          [wb * 0.15, 0.23, 0.10],              // along frame
          [0.05, 0.30, 0.08],                   // to rear drum actuator
        ]}
        radius={0.003}
        color="#555"
      />

      {/* Electrical harness - main loom */}
      <CableTube
        points={[
          [wb - 0.05, 0.75, 0],                 // headlight area
          [wb * 0.6, 0.80, 0],                  // along backbone
          [wb * 0.4, 0.72, 0.03],               // past tank
          [wb * 0.2, 0.62, 0.04],               // to tail
          [0.02, 0.50, 0.03],                   // tail section
        ]}
        radius={0.004}
        color="#1a1a1a"
      />
    </group>
  )
}
