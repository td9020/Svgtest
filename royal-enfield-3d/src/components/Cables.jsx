import * as THREE from 'three'
import { useMemo } from 'react'

// Cable and wire routing for Royal Enfield Classic 350
// Clutch cable, throttle cable, brake line, speedometer cable, electrical harness
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
  // All cable paths approximate - running from controls to endpoints
  // Coordinates relative to motorcycle origin (rear axle at 0,0,0)
  const wb = 1.390  // RE Classic 350 wheelbase

  // Slight lateral offset based on steering for cable flex
  const steerFlex = steeringAngle * 0.02

  return (
    <group position={position}>
      {/* Clutch cable - left handlebar lever to engine */}
      <CableTube
        points={[
          [wb + 0.01, 0.82, -0.24],              // lever mount
          [wb - 0.05, 0.75, -0.20 + steerFlex],  // down from handlebar
          [wb - 0.18, 0.62, -0.14],               // along frame
          [wb * 0.5, 0.48, -0.09],                // curve toward engine
          [wb * 0.38, 0.38, -0.07],               // engine clutch actuator
        ]}
        radius={0.0025}
        color="#1a1a1a"
      />

      {/* Throttle cable - right grip to carburetor */}
      <CableTube
        points={[
          [wb + 0.01, 0.82, 0.24],                // throttle grip
          [wb - 0.05, 0.75, 0.20 + steerFlex],    // down from handlebar
          [wb - 0.14, 0.60, 0.14],                 // along frame
          [wb * 0.45, 0.44, 0.09],                 // toward carb
          [wb * 0.40, 0.38, 0.06],                 // carburetor inlet
        ]}
        radius={0.002}
        color="#1a1a1a"
      />

      {/* Front brake line - right lever to front caliper */}
      <CableTube
        points={[
          [wb + 0.01, 0.82, 0.20],                // brake lever master cylinder
          [wb - 0.02, 0.72, 0.12 + steerFlex],    // down fork
          [wb - 0.06, 0.58, 0.09],                 // along fork leg
          [wb - 0.09, 0.42, 0.070],                // toward caliper
          [wb - 0.09, 0.34, 0.065],                // front caliper
        ]}
        radius={0.002}
        color="#333"
      />

      {/* Speedometer cable - front wheel to instrument */}
      <CableTube
        points={[
          [wb, 0.34, -0.05],                      // front hub
          [wb - 0.06, 0.44, -0.06],               // up fork
          [wb - 0.03, 0.58, -0.04],               // toward cluster
          [wb + 0.02, 0.80, -0.03],               // instrument cluster
        ]}
        radius={0.0015}
        color="#444"
      />

      {/* Rear brake rod (solid) */}
      <CableTube
        points={[
          [wb * 0.30, 0.27, 0.13],                // rear brake pedal
          [wb * 0.18, 0.25, 0.11],                 // along frame
          [0.06, 0.33, 0.09],                      // to rear drum actuator
        ]}
        radius={0.003}
        color="#555"
      />

      {/* Electrical harness - main loom */}
      <CableTube
        points={[
          [wb - 0.06, 0.78, 0],                   // headlight area
          [wb * 0.6, 0.84, 0],                     // along backbone
          [wb * 0.4, 0.76, 0.04],                  // past tank
          [wb * 0.2, 0.64, 0.05],                  // to tail
          [0.02, 0.52, 0.04],                      // tail section
        ]}
        radius={0.004}
        color="#1a1a1a"
      />
    </group>
  )
}
