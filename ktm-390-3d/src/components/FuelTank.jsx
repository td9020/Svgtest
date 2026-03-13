import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { SPECS } from './dimensions'
import { useMultiCSG } from './CSGMesh'

// KTM 390 Duke: 13.4-litre fuel tank
// Sharp, angular design - NOT smooth/rounded like Honda
// Orange (#FF6600) with black side panels
// Aggressive forward-leaning shape

const KTM_ORANGE = '#FF6600'

export default function FuelTank({ position = [0, 0, 0] }) {
  const group = useRef()

  // Angular tank shape using ExtrudeGeometry for sharp KTM look
  const tankGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    const halfL = SPECS.tankLength / 2
    const halfH = SPECS.tankHeight / 2

    // Angular side profile - aggressive forward lean
    shape.moveTo(halfL + 0.02, -halfH * 0.3)      // front bottom - extended
    shape.lineTo(halfL + 0.04, halfH * 0.5)        // front top - sharp
    shape.lineTo(halfL - 0.02, halfH)               // front peak
    shape.lineTo(0, halfH + 0.01)                    // top center
    shape.lineTo(-halfL + 0.05, halfH * 0.7)        // rear top
    shape.lineTo(-halfL, halfH * 0.2)                // rear upper
    shape.lineTo(-halfL + 0.02, -halfH * 0.4)       // rear bottom
    shape.lineTo(0, -halfH * 0.5)                    // bottom center
    shape.lineTo(halfL + 0.02, -halfH * 0.3)        // back to start

    const extrudeSettings = {
      steps: 1,
      depth: SPECS.tankWidth * 0.75,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.03,
      bevelSegments: 4,
    }
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  const kneeCutout = useMemo(() => new THREE.BoxGeometry(0.14, 0.55, 0.09), [])
  const fillerHole = useMemo(() => new THREE.CylinderGeometry(0.022, 0.022, 0.08, 16), [])

  const tankCSG = useMultiCSG(tankGeometry, [
    // Left knee cutout
    {
      geometry: kneeCutout,
      transform: { position: [0, 0, -0.01] },
      type: 'subtract',
    },
    // Right knee cutout
    {
      geometry: kneeCutout,
      transform: { position: [0, 0, SPECS.tankWidth * 0.75 + 0.01] },
      type: 'subtract',
    },
    // Fuel filler hole
    {
      geometry: fillerHole,
      transform: { position: [0.02, SPECS.tankHeight / 2 + 0.01, SPECS.tankWidth * 0.375] },
      type: 'subtract',
    },
  ])

  return (
    <group ref={group} position={position} rotation={[0, 0, 0.08]}>
      {/* Tank body (CSG: with knee cutouts and filler hole) */}
      <mesh geometry={tankCSG} position={[0, 0, -SPECS.tankWidth * 0.375]}>
        <meshStandardMaterial
          color={KTM_ORANGE}
          roughness={0.1}
          metalness={0.5}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
        />
      </mesh>

      {/* Black side panels - KTM signature angular */}
      {/* Left panel */}
      <mesh position={[-0.03, 0, -SPECS.tankWidth * 0.38]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.22, SPECS.tankHeight * 0.55, 0.005]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Right panel */}
      <mesh position={[-0.03, 0, SPECS.tankWidth * 0.38]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.22, SPECS.tankHeight * 0.55, 0.005]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Tank shroud extensions - forward */}
      <mesh position={[SPECS.tankLength / 2 + 0.02, -0.02, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.06, SPECS.tankHeight * 0.4, SPECS.tankWidth * 0.6]} />
        <meshStandardMaterial color={KTM_ORANGE} roughness={0.12} metalness={0.45} />
      </mesh>

      {/* Fuel cap */}
      <mesh position={[0.02, SPECS.tankHeight / 2 + 0.025, 0]}>
        <cylinderGeometry args={[0.024, 0.024, 0.014, 16]} />
        <meshStandardMaterial color="#222" roughness={0.35} metalness={0.55} />
      </mesh>
      {/* Cap detail ring */}
      <mesh position={[0.02, SPECS.tankHeight / 2 + 0.034, 0]}>
        <cylinderGeometry args={[0.020, 0.020, 0.006, 16]} />
        <meshStandardMaterial color="#333" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Knee grip pads - rubber */}
      <mesh position={[0, -0.02, SPECS.tankWidth * 0.36]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.1, 0.06, 0.008]} />
        <meshStandardMaterial color="#111" roughness={0.95} metalness={0.02} />
      </mesh>
      <mesh position={[0, -0.02, -SPECS.tankWidth * 0.36]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.1, 0.06, 0.008]} />
        <meshStandardMaterial color="#111" roughness={0.95} metalness={0.02} />
      </mesh>

      {/* Angular crease line - top (KTM character line) */}
      <mesh position={[0, SPECS.tankHeight / 2 + 0.01, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[SPECS.tankLength * 0.8, 0.003, SPECS.tankWidth * 0.3]} />
        <meshStandardMaterial color="#CC5500" roughness={0.15} metalness={0.5} />
      </mesh>
    </group>
  )
}
