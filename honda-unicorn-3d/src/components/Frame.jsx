import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function Tube({ points, radius = 0.015, color = '#2a2a2a', tubularSegments = 32, radialSegments = 8 }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(...p))
    )
    return new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false)
  }, [points, radius, tubularSegments, radialSegments])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
    </mesh>
  )
}

export default function Frame({ position = [0, 0, 0] }) {
  const group = useRef()

  return (
    <group ref={group} position={position}>
      {/* Main backbone - steering head to rear pivot */}
      <Tube
        points={[
          [0.52, 0.55, 0],    // steering head top
          [0.35, 0.52, 0],    // tank area
          [0.1, 0.42, 0],     // mid frame
          [-0.1, 0.32, 0],    // rear pivot area
        ]}
        radius={0.018}
      />

      {/* Down tube - steering head to engine mount */}
      <Tube
        points={[
          [0.5, 0.5, 0],      // steering head
          [0.35, 0.35, 0],    // mid
          [0.15, 0.2, 0],     // engine top mount
          [0.0, 0.12, 0],     // engine bottom mount
        ]}
        radius={0.016}
      />

      {/* Left side main tube */}
      <Tube
        points={[
          [0.5, 0.52, -0.06],
          [0.3, 0.48, -0.06],
          [0.05, 0.38, -0.06],
          [-0.12, 0.3, -0.06],
        ]}
        radius={0.012}
      />

      {/* Right side main tube */}
      <Tube
        points={[
          [0.5, 0.52, 0.06],
          [0.3, 0.48, 0.06],
          [0.05, 0.38, 0.06],
          [-0.12, 0.3, 0.06],
        ]}
        radius={0.012}
      />

      {/* Rear subframe left */}
      <Tube
        points={[
          [-0.1, 0.32, -0.06],
          [-0.2, 0.38, -0.06],
          [-0.38, 0.4, -0.06],
          [-0.5, 0.38, -0.06],
        ]}
        radius={0.01}
      />

      {/* Rear subframe right */}
      <Tube
        points={[
          [-0.1, 0.32, 0.06],
          [-0.2, 0.38, 0.06],
          [-0.38, 0.4, 0.06],
          [-0.5, 0.38, 0.06],
        ]}
        radius={0.01}
      />

      {/* Lower subframe left */}
      <Tube
        points={[
          [-0.12, 0.3, -0.06],
          [-0.25, 0.25, -0.06],
          [-0.42, 0.28, -0.06],
          [-0.5, 0.38, -0.06],
        ]}
        radius={0.008}
      />

      {/* Lower subframe right */}
      <Tube
        points={[
          [-0.12, 0.3, 0.06],
          [-0.25, 0.25, 0.06],
          [-0.42, 0.28, 0.06],
          [-0.5, 0.38, 0.06],
        ]}
        radius={0.008}
      />

      {/* Steering head tube */}
      <mesh position={[0.52, 0.5, 0]} rotation={[0, 0, 0.35]}>
        <cylinderGeometry args={[0.025, 0.025, 0.12, 12]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Rear swingarm pivot reinforcement */}
      <mesh position={[-0.1, 0.28, 0]}>
        <boxGeometry args={[0.05, 0.06, 0.16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Swingarm left */}
      <Tube
        points={[
          [-0.1, 0.28, -0.07],
          [-0.25, 0.24, -0.07],
          [-0.45, 0.2, -0.07],
          [-0.55, 0.2, -0.07],
        ]}
        radius={0.014}
      />

      {/* Swingarm right */}
      <Tube
        points={[
          [-0.1, 0.28, 0.07],
          [-0.25, 0.24, 0.07],
          [-0.45, 0.2, 0.07],
          [-0.55, 0.2, 0.07],
        ]}
        radius={0.014}
      />

      {/* Chain guard */}
      <Tube
        points={[
          [-0.08, 0.18, 0.08],
          [-0.25, 0.16, 0.08],
          [-0.45, 0.18, 0.08],
        ]}
        radius={0.008}
        color="#333"
      />
    </group>
  )
}
