import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { SPECS } from './dimensions'
import { useMultiCSG } from './CSGMesh'

// Suzuki Hayabusa GSX1300R: Large 20-litre fuel tank
// Aerodynamic, smooth flowing shape integrated with bodywork
// paintColor prop replaces hardcoded Suzuki blue

export default function FuelTank({ position = [0, 0, 0], paintColor = '#003DA5' }) {
  const group = useRef()

  // CSG: Tank body with knee cutouts and filler hole
  const tankGeometry = useMemo(() => {
    const points = []
    const tankHalfLength = SPECS.tankLength / 2
    const tankR = SPECS.tankWidth / 2
    const steps = 20
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const x = -tankHalfLength + t * SPECS.tankLength
      // More aerodynamic profile - wider in middle, smooth taper
      const frontTaper = t < 0.15 ? t / 0.15 : 1
      const rearTaper = t > 0.75 ? (1 - t) / 0.25 : 1
      const taper = Math.min(frontTaper, rearTaper)
      // Slightly flatter on top (aerodynamic)
      const r = tankR * (0.45 + 0.55 * Math.sqrt(taper))
      points.push(new THREE.Vector2(r, x))
    }
    return new THREE.LatheGeometry(points, 32)
  }, [])

  const kneeCutout = useMemo(() => new THREE.BoxGeometry(0.12, 0.55, 0.10), [])
  const fillerHole = useMemo(() => new THREE.CylinderGeometry(0.022, 0.022, 0.08, 16), [])

  const tankCSG = useMultiCSG(tankGeometry, [
    // Left knee cutout
    {
      geometry: kneeCutout,
      transform: { position: [0, 0, -SPECS.tankWidth / 2 + 0.015] },
      type: 'subtract',
    },
    // Right knee cutout
    {
      geometry: kneeCutout,
      transform: { position: [0, 0, SPECS.tankWidth / 2 - 0.015] },
      type: 'subtract',
    },
    // Fuel filler hole
    {
      geometry: fillerHole,
      transform: { position: [SPECS.tankHeight / 2 - 0.01, -0.04, 0] },
      type: 'subtract',
    },
  ])

  return (
    <group ref={group} position={position} rotation={[0, 0, Math.PI / 2]}>
      {/* Tank body (CSG: with knee cutouts and filler hole) */}
      <mesh geometry={tankCSG} scale={[1, 1, 0.80]}>
        <meshStandardMaterial
          color={paintColor}
          roughness={0.10}
          metalness={0.40}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
        />
      </mesh>

      {/* Silver accent stripe - left */}
      <mesh position={[0.02, 0, 0.125]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.015, 0.40]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.15} metalness={0.8} />
      </mesh>

      {/* Silver accent stripe - right */}
      <mesh position={[0.02, 0, -0.125]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.015, 0.40]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.15} metalness={0.8} />
      </mesh>

      {/* Suzuki emblem panel - left */}
      <mesh position={[0, 0.02, 0.130]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.055, 0.18]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.12} metalness={0.75} />
      </mesh>

      {/* Suzuki emblem panel - right */}
      <mesh position={[0, 0.02, -0.130]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.055, 0.18]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.12} metalness={0.75} />
      </mesh>

      {/* Fuel cap */}
      <mesh position={[SPECS.tankHeight / 2 - 0.005, -0.04, 0]}>
        <cylinderGeometry args={[0.024, 0.024, 0.014, 16]} />
        <meshStandardMaterial color="#333" roughness={0.35} metalness={0.55} />
      </mesh>
      {/* Cap keyhole */}
      <mesh position={[SPECS.tankHeight / 2, -0.04, 0]}>
        <cylinderGeometry args={[0.020, 0.020, 0.006, 16]} />
        <meshStandardMaterial color="#444" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Knee grip pads (rubber) */}
      <mesh position={[0.02, -0.06, 0.135]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.038, 0.13, 0.008]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} metalness={0.02} />
      </mesh>
      <mesh position={[0.02, -0.06, -0.135]} rotation={[-0.25, 0, 0]}>
        <boxGeometry args={[0.038, 0.13, 0.008]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} metalness={0.02} />
      </mesh>
    </group>
  )
}
