import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { SPECS } from './dimensions'
import { useMultiCSG } from './CSGMesh'

// Royal Enfield Classic 350: ICONIC teardrop-shaped fuel tank
// 13 litres, deep rounded profile
// Dark green (#2D4A22) with gold pinstripe
// Chrome fuel cap (center-mount)
// Chrome emblem panels on sides

const RE_GREEN = '#2D4A22'

export default function FuelTank({ position = [0, 0, 0] }) {
  const group = useRef()

  // CSG: Tank body with knee cutouts and filler hole
  // Teardrop shape: wider at rear, tapering at front
  const tankGeometry = useMemo(() => {
    const points = []
    const tankHalfLength = SPECS.tankLength / 2
    const tankR = SPECS.tankWidth / 2
    const steps = 20
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const x = -tankHalfLength + t * SPECS.tankLength
      // Teardrop: fuller at rear (t near 0), tapers at front (t near 1)
      const rearFullness = t < 0.15 ? t / 0.15 : 1
      const frontTaper = t > 0.6 ? Math.pow((1 - t) / 0.4, 0.7) : 1
      const taper = Math.min(rearFullness, frontTaper)
      // More rounded / deeper profile than typical
      const r = tankR * (0.45 + 0.55 * Math.sqrt(taper))
      points.push(new THREE.Vector2(r, x))
    }
    return new THREE.LatheGeometry(points, 32)
  }, [])

  const kneeCutout = useMemo(() => new THREE.BoxGeometry(0.14, 0.55, 0.09), [])
  const fillerHole = useMemo(() => new THREE.CylinderGeometry(0.022, 0.022, 0.07, 16), [])

  const tankCSG = useMultiCSG(tankGeometry, [
    // Left knee cutout
    {
      geometry: kneeCutout,
      transform: { position: [0, 0, -SPECS.tankWidth / 2 + 0.012] },
      type: 'subtract',
    },
    // Right knee cutout
    {
      geometry: kneeCutout,
      transform: { position: [0, 0, SPECS.tankWidth / 2 - 0.012] },
      type: 'subtract',
    },
    // Fuel filler hole
    {
      geometry: fillerHole,
      transform: { position: [SPECS.tankHeight / 2 - 0.01, -0.03, 0] },
      type: 'subtract',
    },
  ])

  return (
    <group ref={group} position={position} rotation={[0, 0, Math.PI / 2]}>
      {/* Tank body (CSG: with knee cutouts and filler hole) */}
      <mesh geometry={tankCSG} scale={[1, 1, 0.85]}>
        <meshStandardMaterial
          color={RE_GREEN}
          roughness={0.10}
          metalness={0.40}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
        />
      </mesh>

      {/* Chrome trim strip on top (RE signature) */}
      <mesh position={[SPECS.tankHeight / 2 - 0.015, 0, 0]}>
        <boxGeometry args={[0.008, SPECS.tankLength * 0.75, 0.012]} />
        <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
      </mesh>

      {/* Gold pinstripe - left */}
      <mesh position={[0.02, 0, 0.125]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.006, 0.38]} />
        <meshStandardMaterial color="#c8a84e" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Gold pinstripe - right */}
      <mesh position={[0.02, 0, -0.125]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.006, 0.38]} />
        <meshStandardMaterial color="#c8a84e" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Royal Enfield chrome emblem panel - left */}
      <mesh position={[0.005, 0.02, 0.132]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, 0.18]} />
        <meshStandardMaterial color="#c8a84e" roughness={0.12} metalness={0.75} />
      </mesh>

      {/* Royal Enfield chrome emblem panel - right */}
      <mesh position={[0.005, 0.02, -0.132]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, 0.18]} />
        <meshStandardMaterial color="#c8a84e" roughness={0.12} metalness={0.75} />
      </mesh>

      {/* Chrome fuel cap (center-mount) */}
      <mesh position={[SPECS.tankHeight / 2 - 0.002, -0.03, 0]}>
        <cylinderGeometry args={[0.026, 0.026, 0.015, 24]} />
        <meshStandardMaterial color="#ddd" roughness={0.08} metalness={0.92} />
      </mesh>
      {/* Cap inner detail */}
      <mesh position={[SPECS.tankHeight / 2 + 0.005, -0.03, 0]}>
        <cylinderGeometry args={[0.020, 0.020, 0.008, 24]} />
        <meshStandardMaterial color="#ccc" roughness={0.1} metalness={0.88} />
      </mesh>
      {/* Cap keyhole */}
      <mesh position={[SPECS.tankHeight / 2 + 0.010, -0.03, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.004, 8]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Knee grip pads (rubber) */}
      <mesh position={[0.025, -0.06, 0.135]} rotation={[0.28, 0, 0]}>
        <boxGeometry args={[0.040, 0.13, 0.008]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} metalness={0.02} />
      </mesh>
      <mesh position={[0.025, -0.06, -0.135]} rotation={[-0.28, 0, 0]}>
        <boxGeometry args={[0.040, 0.13, 0.008]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} metalness={0.02} />
      </mesh>

      {/* Petcock (fuel valve) - underneath */}
      <mesh position={[-0.07, 0.12, 0.07]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.007, 0.007, 0.028, 8]} />
        <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
      </mesh>
    </group>
  )
}
