import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { SPECS, POS } from './dimensions'

// Suzuki Hayabusa GSX1300R: FULL FAIRING
// The most important visual feature - aerodynamic full fairing
// Front fairing with dual headlights, side fairings, belly pan
// Ram-air intake ducts, tall windscreen
// "Peregrine falcon" aerodynamic flowing curves
// paintColor prop replaces hardcoded Suzuki blue

const SILVER_ACCENT = '#c0c0c0'

export default function Bodywork({ position = [0, 0, 0], fairingOpacity = 1.0, paintColor = '#003DA5' }) {
  const group = useRef()
  const wb = SPECS.wheelbase
  const sh = SPECS.seatHeight

  const isTransparent = fairingOpacity < 1.0

  // Front fairing nose shape
  const noseFairingGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    // Side profile of the front fairing nose
    shape.moveTo(0, 0)
    shape.quadraticCurveTo(0.08, 0.02, 0.12, 0.08)
    shape.quadraticCurveTo(0.15, 0.14, 0.14, 0.22)
    shape.lineTo(0.10, 0.28)
    shape.quadraticCurveTo(0.04, 0.30, 0, 0.28)
    shape.quadraticCurveTo(-0.04, 0.24, -0.04, 0.14)
    shape.quadraticCurveTo(-0.02, 0.04, 0, 0)

    return new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: 0.28,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.04,
      bevelSegments: 8,
    })
  }, [])

  // Side fairing shape
  const sideFairingGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(0.40, 0.02)
    shape.quadraticCurveTo(0.45, 0.05, 0.42, 0.15)
    shape.lineTo(0.35, 0.25)
    shape.quadraticCurveTo(0.20, 0.30, 0.05, 0.28)
    shape.lineTo(-0.05, 0.20)
    shape.quadraticCurveTo(-0.08, 0.10, 0, 0)

    return new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: 0.012,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.008,
      bevelSegments: 4,
    })
  }, [])

  return (
    <group ref={group} position={position}>
      {/* === FRONT FAIRING / NOSE === */}
      <group position={[wb - 0.12, 0.42, -0.14]}>
        <mesh geometry={noseFairingGeometry}>
          <meshStandardMaterial
            color={paintColor}
            roughness={0.10}
            metalness={0.35}
            clearcoat={1.0}
            clearcoatRoughness={0.04}
            transparent={isTransparent}
            opacity={fairingOpacity}
          />
        </mesh>
      </group>

      {/* === RAM-AIR INTAKE DUCTS (in the nose) === */}
      {/* Left intake */}
      <mesh position={[wb - 0.02, 0.48, -0.06]}>
        <boxGeometry args={[0.04, 0.03, 0.04]} />
        <meshStandardMaterial color="#111" roughness={0.8} metalness={0.2}
          transparent={isTransparent} opacity={fairingOpacity} />
      </mesh>
      {/* Right intake */}
      <mesh position={[wb - 0.02, 0.48, 0.06]}>
        <boxGeometry args={[0.04, 0.03, 0.04]} />
        <meshStandardMaterial color="#111" roughness={0.8} metalness={0.2}
          transparent={isTransparent} opacity={fairingOpacity} />
      </mesh>

      {/* === WINDSCREEN (tall, tinted) === */}
      <group position={[wb - 0.04, 0.72, 0]}>
        <mesh rotation={[-0.25, 0, 0]}>
          <planeGeometry args={[0.24, 0.22]} />
          <meshStandardMaterial
            color="#334455"
            roughness={0.02}
            metalness={0.1}
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Windscreen frame */}
        <mesh position={[0, -0.11, 0.008]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[0.25, 0.008, 0.008]} />
          <meshStandardMaterial color="#222" roughness={0.5} metalness={0.5} />
        </mesh>
      </group>

      {/* === LEFT SIDE FAIRING === */}
      <group position={[wb * 0.5 - 0.05, 0.20, -0.175]} rotation={[0, 0, -0.05]}>
        <mesh geometry={sideFairingGeometry}>
          <meshStandardMaterial
            color={paintColor}
            roughness={0.10}
            metalness={0.35}
            clearcoat={1.0}
            clearcoatRoughness={0.04}
            transparent={isTransparent}
            opacity={fairingOpacity}
          />
        </mesh>
        {/* Silver accent on left side */}
        <mesh position={[0.18, 0.13, -0.002]}>
          <planeGeometry args={[0.25, 0.06]} />
          <meshStandardMaterial color={SILVER_ACCENT} roughness={0.12} metalness={0.8}
            transparent={isTransparent} opacity={fairingOpacity} />
        </mesh>
      </group>

      {/* === RIGHT SIDE FAIRING === */}
      <group position={[wb * 0.5 - 0.05, 0.20, 0.175]} rotation={[0, Math.PI, -0.05]}>
        <mesh geometry={sideFairingGeometry}>
          <meshStandardMaterial
            color={paintColor}
            roughness={0.10}
            metalness={0.35}
            clearcoat={1.0}
            clearcoatRoughness={0.04}
            transparent={isTransparent}
            opacity={fairingOpacity}
          />
        </mesh>
        {/* Silver accent on right side */}
        <mesh position={[0.18, 0.13, -0.002]}>
          <planeGeometry args={[0.25, 0.06]} />
          <meshStandardMaterial color={SILVER_ACCENT} roughness={0.12} metalness={0.8}
            transparent={isTransparent} opacity={fairingOpacity} />
        </mesh>
      </group>

      {/* === BELLY PAN (underneath engine) === */}
      <mesh position={[wb * 0.42, 0.16, 0]}>
        <boxGeometry args={[0.30, 0.015, 0.30]} />
        <meshStandardMaterial
          color="#222"
          roughness={0.5}
          metalness={0.3}
          transparent={isTransparent}
          opacity={fairingOpacity}
        />
      </mesh>
      {/* Belly pan side lips */}
      {[-0.15, 0.15].map((z, i) => (
        <mesh key={i} position={[wb * 0.42, 0.18, z]}>
          <boxGeometry args={[0.28, 0.03, 0.012]} />
          <meshStandardMaterial color="#222" roughness={0.5} metalness={0.3}
            transparent={isTransparent} opacity={fairingOpacity} />
        </mesh>
      ))}

      {/* === UPPER FAIRING (connecting nose to tank area) === */}
      <mesh position={[wb * 0.7, 0.62, 0]}>
        <boxGeometry args={[0.18, 0.08, 0.30]} />
        <meshStandardMaterial
          color={paintColor}
          roughness={0.10}
          metalness={0.35}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
          transparent={isTransparent}
          opacity={fairingOpacity}
        />
      </mesh>

      {/* === FAIRING SIDE VENTS (behind front wheel area) === */}
      {[-0.165, 0.165].map((z, i) => (
        <group key={`vent-${i}`} position={[wb * 0.62, 0.38, z]}>
          {Array.from({ length: 3 }).map((_, j) => (
            <mesh key={j} position={[0, j * 0.018, 0]} rotation={[0, 0, -0.1]}>
              <boxGeometry args={[0.05, 0.004, 0.008]} />
              <meshStandardMaterial color="#111" roughness={0.7} metalness={0.3} />
            </mesh>
          ))}
        </group>
      ))}

      {/* === LOWER FAIRING EXTENSIONS (in front of engine) === */}
      {[-0.16, 0.16].map((z, i) => (
        <mesh key={`lower-${i}`} position={[wb * 0.58, 0.30, z]}>
          <boxGeometry args={[0.20, 0.14, 0.015]} />
          <meshStandardMaterial
            color={paintColor}
            roughness={0.12}
            metalness={0.35}
            transparent={isTransparent}
            opacity={fairingOpacity}
          />
        </mesh>
      ))}

      {/* === "HAYABUSA" text area on side (represented as a raised panel) === */}
      {[-0.178, 0.178].map((z, i) => (
        <mesh key={`name-${i}`} position={[wb * 0.45, 0.35, z]} rotation={[0, z > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
          <planeGeometry args={[0.12, 0.02]} />
          <meshStandardMaterial color={SILVER_ACCENT} roughness={0.1} metalness={0.85}
            transparent={isTransparent} opacity={fairingOpacity} />
        </mesh>
      ))}
    </group>
  )
}
