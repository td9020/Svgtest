import { useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import Wheel from './Wheel'
import Engine from './Engine'
import Frame from './Frame'
import FuelTank from './FuelTank'
import Seat from './Seat'
import Exhaust from './Exhaust'
import FrontFork from './FrontFork'
import TailSection from './TailSection'
import ChainDrive from './ChainDrive'
import Cables from './Cables'
import { SPECS, POS } from './dimensions'
import useAnimationStore from '../store/animationStore'

export default function Motorcycle({ position = [0, 0, 0] }) {
  const group = useRef()
  const kickstandRef = useRef()
  const kickstandFootRef = useRef()

  const wb = SPECS.wheelbase
  const rearAxleY = POS.rearAxle.y
  const frontAxleY = POS.frontAxle.y
  const sh = SPECS.seatHeight

  const store = useAnimationStore

  useFrame((_, delta) => {
    useAnimationStore.getState().tick(delta)

    if (kickstandRef.current) {
      const angle = useAnimationStore.getState().kickstandAngle
      kickstandRef.current.rotation.set(0.15, 0, angle)
    }
    if (kickstandFootRef.current) {
      const angle = useAnimationStore.getState().kickstandAngle
      const footX = wb * 0.3 - 0.06 - Math.sin(angle) * 0.04
      const footY = 0.01 + (0.35 - angle) * 0.08
      kickstandFootRef.current.position.set(footX, footY, 0.1)
    }
  })

  const {
    wheelAngle,
    pistonOffset,
    forkCompression,
    steeringAngle,
    explodeProgress,
    headlightOn,
    turnSignals,
    turnSignalBlink,
    spokedWheels,
    paintColor,
    showCables,
    chainAnimate,
    chainOffset,
    selectedPart,
    selectPart,
  } = useAnimationStore()

  const ex = explodeProgress
  const explodeOffsets = {
    frame:     [0, ex * 0.0, 0],
    rearWheel: [-ex * 0.3, 0, 0],
    frontWheel:[ex * 0.3, 0, 0],
    engine:    [0, -ex * 0.25, 0],
    tank:      [0, ex * 0.3, 0],
    seat:      [0, ex * 0.35, -ex * 0.1],
    exhaust:   [0, -ex * 0.15, ex * 0.3],
    frontFork: [ex * 0.2, ex * 0.15, 0],
    tail:      [-ex * 0.25, ex * 0.1, 0],
    chain:     [0, -ex * 0.1, ex * 0.15],
  }

  function addOffset(base, offset) {
    return [base[0] + offset[0], base[1] + offset[1], base[2] + offset[2]]
  }

  // Click handler for part selection/highlighting
  const handleClick = useCallback((partName) => (e) => {
    e.stopPropagation()
    selectPart(partName)
  }, [selectPart])

  // Highlight wrapper - emissive glow when selected
  const isSelected = (partName) => selectedPart === partName

  return (
    <group ref={group} position={position}>
      {/* Frame */}
      <group onClick={handleClick('frame')}>
        <Frame position={addOffset([0, 0, 0], explodeOffsets.frame)} />
        {isSelected('frame') && (
          <pointLight position={addOffset([wb * 0.4, 0.5, 0], explodeOffsets.frame)} intensity={0.5} color="#00aaff" distance={0.8} />
        )}
      </group>

      {/* Rear wheel */}
      <group onClick={handleClick('rearWheel')}>
        <Wheel
          position={addOffset([0, rearAxleY, 0], explodeOffsets.rearWheel)}
          isRear
          spinAngle={wheelAngle}
          spoked={spokedWheels}
        />
      </group>

      {/* Front wheel */}
      <group onClick={handleClick('frontWheel')}>
        <Wheel
          position={addOffset([wb, frontAxleY, 0], explodeOffsets.frontWheel)}
          hasFrontDisc
          spinAngle={wheelAngle}
          spoked={spokedWheels}
        />
      </group>

      {/* Engine */}
      <group onClick={handleClick('engine')}>
        <Engine
          position={addOffset([wb * 0.37, 0.32, 0], explodeOffsets.engine)}
          pistonOffset={pistonOffset}
        />
        {isSelected('engine') && (
          <pointLight position={addOffset([wb * 0.37, 0.32, 0], explodeOffsets.engine)} intensity={0.5} color="#ff8800" distance={0.6} />
        )}
      </group>

      {/* Fuel tank */}
      <group onClick={handleClick('fuelTank')}>
        <FuelTank
          position={addOffset([wb * 0.58, sh + 0.05, 0], explodeOffsets.tank)}
          paintColor={paintColor}
        />
      </group>

      {/* Seat */}
      <group onClick={handleClick('seat')}>
        <Seat position={addOffset([wb * 0.22, sh, 0], explodeOffsets.seat)} />
      </group>

      {/* Exhaust */}
      <group onClick={handleClick('exhaust')}>
        <Exhaust position={addOffset([0, 0, 0], explodeOffsets.exhaust)} />
      </group>

      {/* Front fork, handlebar, headlight, instruments */}
      <group onClick={handleClick('frontFork')}>
        <FrontFork
          position={addOffset([wb - 0.08, frontAxleY + 0.12, 0], explodeOffsets.frontFork)}
          forkCompression={forkCompression}
          steeringAngle={steeringAngle}
          headlightOn={headlightOn}
          turnSignalsOn={turnSignals}
          blinkOn={turnSignalBlink}
          paintColor={paintColor}
        />
      </group>

      {/* Tail section */}
      <group onClick={handleClick('tail')}>
        <TailSection
          position={addOffset([0, rearAxleY, 0], explodeOffsets.tail)}
          turnSignalsOn={turnSignals}
          headlightOn={headlightOn}
          blinkOn={turnSignalBlink}
          paintColor={paintColor}
        />
      </group>

      {/* Chain drive system */}
      <group onClick={handleClick('chain')}>
        <ChainDrive
          position={addOffset([0, 0, 0], explodeOffsets.chain)}
          wheelAngle={wheelAngle}
          chainOffset={chainOffset}
        />
      </group>

      {/* Cable routing */}
      {showCables && (
        <Cables steeringAngle={steeringAngle} />
      )}

      {/* Kickstand */}
      <mesh ref={kickstandRef} position={[wb * 0.3, 0.12, 0.08]} rotation={[0.15, 0, 0.35]}>
        <cylinderGeometry args={[0.005, 0.005, 0.22, 6]} />
        <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh ref={kickstandFootRef} position={[wb * 0.3 - 0.06, 0.01, 0.1]}>
        <boxGeometry args={[0.03, 0.004, 0.02]} />
        <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Foot pegs - rider */}
      {[-0.12, 0.12].map((z, i) => (
        <group key={i} position={[wb * 0.28, 0.25, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.04, 6]} />
            <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z > 0 ? 0.025 : -0.025]}>
            <cylinderGeometry args={[0.007, 0.007, 0.03, 8]} />
            <meshStandardMaterial color="#222" roughness={0.9} metalness={0.05} />
          </mesh>
        </group>
      ))}

      {/* Foot pegs - pillion */}
      {[-0.11, 0.11].map((z, i) => (
        <mesh key={`p-${i}`} position={[0.08, 0.32, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.035, 6]} />
          <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
        </mesh>
      ))}

      {/* Selected part info overlay light */}
      {selectedPart && (
        <pointLight
          position={[wb * 0.5, 1.0, 0]}
          intensity={0.3}
          color="#00aaff"
          distance={2}
        />
      )}
    </group>
  )
}
