import * as THREE from 'three'
import { useMemo } from 'react'

// Cable and wire routing for Suzuki Hayabusa GSX1300R
// Uses tube geometry following curved paths
// Adjusted for Hayabusa geometry: longer wheelbase (1480mm), clip-on bars, full fairing

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
  const wb = 1.480  // Hayabusa wheelbase

  // Slight lateral offset based on steering for cable flex
  const steerFlex = steeringAngle * 0.02

  return (
    <group position={position}>
      {/* Clutch cable - left clip-on lever to engine */}
      <CableTube
        points={[
          [wb - 0.04, 0.75, -0.22],              // clip-on lever mount
          [wb - 0.12, 0.68, -0.16 + steerFlex],  // down from clip-on
          [wb - 0.25, 0.55, -0.12],               // along frame under fairing
          [wb * 0.45, 0.42, -0.08],               // curve toward engine
          [wb * 0.36, 0.36, -0.06],               // engine clutch actuator
        ]}
        radius={0.0025}
        color="#1a1a1a"
      />

      {/* Throttle cable - right grip to throttle bodies */}
      <CableTube
        points={[
          [wb - 0.04, 0.75, 0.22],                // throttle grip
          [wb - 0.12, 0.68, 0.16 + steerFlex],    // down from clip-on
          [wb - 0.22, 0.55, 0.10],                 // along frame
          [wb * 0.42, 0.40, 0.06],                 // toward throttle bodies
          [wb * 0.38, 0.35, 0.04],                 // throttle body inlet
        ]}
        radius={0.002}
        color="#1a1a1a"
      />

      {/* Front brake line - right lever to dual calipers (braided steel) */}
      <CableTube
        points={[
          [wb - 0.04, 0.75, 0.16],                // brake master cylinder
          [wb - 0.10, 0.66, 0.10 + steerFlex],    // down fork
          [wb - 0.15, 0.50, 0.08],                 // along fork leg
          [wb - 0.08, 0.38, 0.07],                 // toward caliper
          [wb - 0.08, 0.31, 0.065],                // front caliper (left disc)
        ]}
        radius={0.002}
        color="#333"
      />

      {/* Second front brake line (dual disc setup) */}
      <CableTube
        points={[
          [wb - 0.08, 0.38, 0.07],                // junction from main line
          [wb - 0.06, 0.35, -0.02],                // cross over
          [wb - 0.08, 0.31, -0.065],               // front caliper (right disc)
        ]}
        radius={0.002}
        color="#333"
      />

      {/* Rear brake line - foot pedal to rear caliper */}
      <CableTube
        points={[
          [wb * 0.30, 0.26, 0.13],                // rear brake pedal area
          [wb * 0.20, 0.24, 0.10],                 // along frame
          [wb * 0.10, 0.28, 0.08],                 // toward rear caliper
          [0.05, 0.32, 0.06],                      // rear caliper
        ]}
        radius={0.002}
        color="#333"
      />

      {/* Electrical harness - main loom (under fairing) */}
      <CableTube
        points={[
          [wb - 0.10, 0.70, 0],                   // headlight area
          [wb * 0.65, 0.75, 0],                    // along backbone
          [wb * 0.45, 0.68, 0.03],                 // past tank
          [wb * 0.25, 0.58, 0.04],                 // to tail
          [0.02, 0.48, 0.03],                      // tail section
        ]}
        radius={0.004}
        color="#1a1a1a"
      />

      {/* Coolant hoses (inline-4 is liquid cooled) */}
      <CableTube
        points={[
          [wb * 0.55, 0.35, -0.12],               // radiator outlet
          [wb * 0.48, 0.32, -0.10],                // along frame
          [wb * 0.40, 0.30, -0.08],                // to engine water pump
          [wb * 0.38, 0.28, -0.05],                // engine inlet
        ]}
        radius={0.005}
        color="#222"
      />
    </group>
  )
}
