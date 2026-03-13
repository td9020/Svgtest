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
    doorsOpen,
    hoodOpen,
    wingAngle,
    explodeFactor,
    engineReveal,
  } = store;

  const ef = explodeFactor;

  // Body transparency for engine reveal
  const bodyOpacity = engineReveal ? 0.2 : 1;

  return (
    <group>
      {/* Body shell */}
      <group position={[0, ef * 0.3, 0]}>
        <Body
          opacity={bodyOpacity}
          doorsOpen={doorsOpen}
          hoodOpen={hoodOpen}
        />
      </group>

      {/* Glass */}
      <group position={[0, ef * 0.5, 0]}>
        <Glass />
      </group>

      {/* Rear Wing (separate - it's that important!) */}
      <group position={[0, ef * 0.6, -ef * 0.3]}>
        <RearWing angle={wingAngle} />
      </group>

      {/* Front Left Wheel */}
      <group position={[D.frontAxleX, D.frontWheelY, D.frontWheelZ + ef * 0.4]}>
        <Wheel
          isFront={true}
          side="left"
          spinAngle={spinAngle}
          steerAngle={steeringAngle}
        />
      </group>

      {/* Front Right Wheel */}
      <group position={[D.frontAxleX, D.frontWheelY, -D.frontWheelZ - ef * 0.4]}>
        <Wheel
          isFront={true}
          side="right"
          spinAngle={spinAngle}
          steerAngle={steeringAngle}
        />
      </group>

      {/* Rear Left Wheel (rear spins faster in RWD) */}
      <group position={[D.rearAxleX, D.rearWheelY, D.rearWheelZ + ef * 0.5]}>
        <Wheel
          isFront={false}
          side="left"
          spinAngle={spinAngle * 1.05}
          steerAngle={0}
        />
      </group>

      {/* Rear Right Wheel */}
      <group position={[D.rearAxleX, D.rearWheelY, -D.rearWheelZ - ef * 0.5]}>
        <Wheel
          isFront={false}
          side="right"
          spinAngle={spinAngle * 1.05}
          steerAngle={0}
        />
      </group>

      {/* Headlights */}
      <group position={[ef * 0.3, 0, 0]}>
        <Headlights headlightOn={headlightsOn} />
      </group>

      {/* Tail Lights */}
      <group position={[-ef * 0.3, 0, 0]}>
        <TailLights
          brakeLightOn={brakeLights}
          turnSignalsOn={turnSignals && turnSignalPhase}
        />
      </group>

      {/* Engine - at REAR, behind rear axle */}
      <group position={[0, ef * -0.3, 0]}>
        <Engine pistonOffset={pistonOffset} />
      </group>

      {/* Interior */}
      <group position={[0, ef * 0.2, 0]}>
        <Interior />
      </group>

      {/* Exhaust - center exit */}
      <group position={[0, ef * -0.2, 0]}>
        <Exhaust />
      </group>

      {/* Suspension */}
      <group position={[0, ef * -0.15, 0]}>
        <Suspension />
      </group>
    </group>
  );
}
