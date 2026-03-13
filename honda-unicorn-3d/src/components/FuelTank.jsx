import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { SPECS } from './dimensions'
import { useMultiCSG } from './CSGMesh'

// Honda Unicorn 150: 13-litre fuel tank
// Estimated: ~450mm long, ~300mm wide, ~220mm tall

export default function FuelTank({ position = [0, 0, 0], paintColor = '#cc0000' }) {
  const group = useRef()

  // CSG: Tank body with knee cutouts and filler hole
  const tankGeometry = useMemo(() => {
    // Base tank shape via LatheGeometry
    const points = []
    const tankHalfLength = SPECS.tankLength / 2
    const tankR = SPECS.tankWidth / 2
    const steps = 16
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const x = -tankHalfLength + t * SPECS.tankLength
      // Elliptical profile: wider in middle, tapered at ends
      const frontTaper = t < 0.2 ? t / 0.2 : 1
      const rearTaper = t > 0.8 ? (1 - t) / 0.2 : 1
      const taper = Math.min(frontTaper, rearTaper)
      const r = tankR * (0.4 + 0.6 * Math.sqrt(taper))
      points.push(new THREE.Vector2(r, x))
    }
    return new THREE.LatheGeometry(points, 32)
  }, [])

  const kneeCutout = useMemo(() => new THREE.BoxGeometry(0.12, 0.5, 0.08), [])
  const fillerHole = useMemo(() => new THREE.CylinderGeometry(0.02, 0.02, 0.06, 16), [])

  const tankCSG = useMultiCSG(tankGeometry, [
    // Left knee cutout
    {
      geometry: kneeCutout,
      transform: { position: [0, 0, -SPECS.tankWidth / 2 + 0.01] },
      type: 'subtract',
    },
    // Right knee cutout
    {
      geometry: kneeCutout,
      transform: { position: [0, 0, SPECS.tankWidth / 2 - 0.01] },
      type: 'subtract',
    },
    // Fuel filler hole
    {
      geometry: fillerHole,
      transform: { position: [SPECS.tankHeight / 2 - 0.01, -0.02, 0] },
      type: 'subtract',
    },
  ])

  return (
    <group ref={group} position={position} rotation={[0, 0, Math.PI / 2]}>
      {/* Tank body (CSG: with knee cutouts and filler hole) */}
      <mesh geometry={tankCSG} scale={[1, 1, 0.82]}>
        <meshStandardMaterial
          color={paintColor}
          roughness={0.12}
          metalness={0.45}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* White racing stripe - left */}
      <mesh position={[0.01, 0, 0.108]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.012, 0.36]} />
        <meshStandardMaterial color="#fff" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* White racing stripe - right */}
      <mesh position={[0.01, 0, -0.108]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.012, 0.36]} />
        <meshStandardMaterial color="#fff" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Honda emblem panel - left */}
      <mesh position={[0, 0.02, 0.115]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.05, 0.16]} />
        <meshStandardMaterial color="#ddd" roughness={0.15} metalness={0.7} />
      </mesh>

      {/* Honda emblem panel - right */}
      <mesh position={[0, 0.02, -0.115]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.05, 0.16]} />
        <meshStandardMaterial color="#ddd" roughness={0.15} metalness={0.7} />
      </mesh>

      {/* Fuel cap */}
      <mesh position={[SPECS.tankHeight / 2 - 0.005, -0.02, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.012, 16]} />
        <meshStandardMaterial color="#333" roughness={0.35} metalness={0.55} />
      </mesh>
      {/* Cap keyhole detail */}
      <mesh position={[SPECS.tankHeight / 2, -0.02, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.006, 16]} />
        <meshStandardMaterial color="#444" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Knee grip pads */}
      <mesh position={[0.02, -0.06, 0.12]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.035, 0.12, 0.008]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} metalness={0.02} />
      </mesh>
      <mesh position={[0.02, -0.06, -0.12]} rotation={[-0.25, 0, 0]}>
        <boxGeometry args={[0.035, 0.12, 0.008]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} metalness={0.02} />
      </mesh>

      {/* Petcock (fuel valve) - underneath */}
      <mesh position={[-0.06, 0.1, 0.06]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.025, 8]} />
        <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
      </mesh>
    </group>
  )
}
