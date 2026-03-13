import React from 'react';
import { useFrame } from '@react-three/fiber';
import { D } from './dimensions';
import useAnimationStore from '../store/animationStore';

import Body from './Body';
import Wheel from './Wheel';
import RearWing from './RearWing';
import Glass from './Glass';
import Headlights from './Headlights';
import TailLights from './TailLights';
import Engine from './Engine';
import Interior from './Interior';
import Exhaust from './Exhaust';
import Suspension from './Suspension';
import Cables from './Cables';

export default function Car() {
  const store = useAnimationStore();

  useFrame((_, delta) => {
    useAnimationStore.getState().tick(delta);
  });

  const {
    spinAngle,
    steeringAngle,
    pistonOffset,
    headlightsOn,
    brakeLights,
    turnSignals,
    turnSignalPhase,
    turnSignalBlink,
    doorsOpen,
    hoodOpen,
    wingAngle,
    explodeFactor,
    engineReveal,
    spokedWheels,
    showCables,
    paintColor,
    selectPart,
  } = store;

  const ef = explodeFactor;

  // Body transparency for engine reveal
  const bodyOpacity = engineReveal ? 0.2 : 1;

  return (
    <group>
      {/* Body shell */}
      <group
        position={[0, ef * 0.3, 0]}
        onClick={(e) => { e.stopPropagation(); selectPart('body'); }}
      >
        <Body
          opacity={bodyOpacity}
          doorsOpen={doorsOpen}
          hoodOpen={hoodOpen}
          paintColor={paintColor}
        />
      </group>

      {/* Glass */}
      <group position={[0, ef * 0.5, 0]}>
        <Glass />
      </group>

      {/* Rear Wing (separate - it's that important!) */}
      <group
        position={[0, ef * 0.6, -ef * 0.3]}
        onClick={(e) => { e.stopPropagation(); selectPart('rearWing'); }}
      >
        <RearWing angle={wingAngle} />
      </group>

      {/* Front Left Wheel */}
      <group
        position={[D.frontAxleX, D.frontWheelY, D.frontWheelZ + ef * 0.4]}
        onClick={(e) => { e.stopPropagation(); selectPart('frontWheel'); }}
      >
        <Wheel
          isFront={true}
          side="left"
          spinAngle={spinAngle}
          steerAngle={steeringAngle}
          spoked={spokedWheels}
        />
      </group>

      {/* Front Right Wheel */}
      <group
        position={[D.frontAxleX, D.frontWheelY, -D.frontWheelZ - ef * 0.4]}
        onClick={(e) => { e.stopPropagation(); selectPart('frontWheel'); }}
      >
        <Wheel
          isFront={true}
          side="right"
          spinAngle={spinAngle}
          steerAngle={steeringAngle}
          spoked={spokedWheels}
        />
      </group>

      {/* Rear Left Wheel (rear spins faster in RWD) */}
      <group
        position={[D.rearAxleX, D.rearWheelY, D.rearWheelZ + ef * 0.5]}
        onClick={(e) => { e.stopPropagation(); selectPart('rearWheel'); }}
      >
        <Wheel
          isFront={false}
          side="left"
          spinAngle={spinAngle * 1.05}
          steerAngle={0}
          spoked={spokedWheels}
        />
      </group>

      {/* Rear Right Wheel */}
      <group
        position={[D.rearAxleX, D.rearWheelY, -D.rearWheelZ - ef * 0.5]}
        onClick={(e) => { e.stopPropagation(); selectPart('rearWheel'); }}
      >
        <Wheel
          isFront={false}
          side="right"
          spinAngle={spinAngle * 1.05}
          steerAngle={0}
          spoked={spokedWheels}
        />
      </group>

      {/* Headlights */}
      <group position={[ef * 0.3, 0, 0]}>
        <Headlights headlightOn={headlightsOn} />
      </group>

      {/* Tail Lights */}
      <group
        position={[-ef * 0.3, 0, 0]}
        onClick={(e) => { e.stopPropagation(); selectPart('brakes'); }}
      >
        <TailLights
          brakeLightOn={brakeLights}
          turnSignalsOn={turnSignals && turnSignalPhase}
          blinkOn={turnSignalBlink}
        />
      </group>

      {/* Engine - at REAR, behind rear axle */}
      <group
        position={[0, ef * -0.3, 0]}
        onClick={(e) => { e.stopPropagation(); selectPart('engine'); }}
      >
        <Engine pistonOffset={pistonOffset} />
      </group>

      {/* Interior */}
      <group position={[0, ef * 0.2, 0]}>
        <Interior />
      </group>

      {/* Exhaust - center exit */}
      <group
        position={[0, ef * -0.2, 0]}
        onClick={(e) => { e.stopPropagation(); selectPart('exhaust'); }}
      >
        <Exhaust />
      </group>

      {/* Suspension */}
      <group
        position={[0, ef * -0.15, 0]}
        onClick={(e) => { e.stopPropagation(); selectPart('suspension'); }}
      >
        <Suspension />
      </group>

      {/* Cables/Wiring - conditionally rendered */}
      {showCables && (
        <group>
          <Cables />
        </group>
      )}
    </group>
  );
}
