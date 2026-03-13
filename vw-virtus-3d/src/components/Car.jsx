import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useAnimationStore from '../store/animationStore';
import { VW, WHEELS } from './dimensions';
import Body from './Body';
import Glass from './Glass';
import Headlights from './Headlights';
import TailLights from './TailLights';
import Interior from './Interior';
import Engine from './Engine';
import Exhaust from './Exhaust';
import Suspension from './Suspension';
import Wheel from './Wheel';
import Cables from './Cables';

function lerp(a, b, t) {
  return a + (b - a) * Math.min(t, 1);
}

export default function Car() {
  const store = useAnimationStore();
  const spinRef = useRef(0);
  const steerRef = useRef(0);
  const doorRef = useRef(0);
  const hoodRef = useRef(0);
  const trunkRef = useRef(0);
  const pistonRef = useRef(0);
  const explodeRef = useRef(0);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05); // Cap delta for stability

    // Wheel spin
    if (store.wheelSpin) {
      spinRef.current += d * store.wheelSpeed;
    }
    store.setSpinAngle(spinRef.current);

    // Steering sweep
    const steerTarget = store.steeringSweep ? Math.sin(Date.now() * 0.002) * 0.5 : 0;
    steerRef.current = lerp(steerRef.current, steerTarget, d * 5);
    store.setSteerAngle(steerRef.current);

    // Door animation
    const doorTarget = store.doorsOpen ? 0.85 : 0;
    doorRef.current = lerp(doorRef.current, doorTarget, d * 3);
    store.setDoorAngle(doorRef.current);

    // Hood animation
    const hoodTarget = store.hoodOpen ? 0.75 : 0;
    hoodRef.current = lerp(hoodRef.current, hoodTarget, d * 3);
    store.setHoodAngle(hoodRef.current);

    // Trunk animation
    const trunkTarget = store.trunkOpen ? 0.85 : 0;
    trunkRef.current = lerp(trunkRef.current, trunkTarget, d * 3);
    store.setTrunkAngle(trunkRef.current);

    // Piston animation (tied to wheel spin)
    if (store.wheelSpin) {
      pistonRef.current += d * store.wheelSpeed * 3;
    }
    store.setPistonOffset(pistonRef.current);

    // Exploded view
    const explodeTarget = store.explodedView ? 1.0 : 0;
    explodeRef.current = lerp(explodeRef.current, explodeTarget, d * 2);
    store.setExplodeOffset(explodeRef.current);

    // Tick for turn signal blink
    store.tick(d);
  });

  const eOff = store.explodeOffset;
  const doorAngles = {
    fl: store.doorAngle,
    fr: store.doorAngle,
    rl: store.doorAngle * 0.85,
    rr: store.doorAngle * 0.85,
  };

  const handlePartClick = (part) => {
    store.selectPart(part);
  };

  return (
    <group>
      {/* Body shell */}
      <group position={[0, eOff * 0.3, 0]}>
        <Body
          hoodAngle={store.hoodAngle}
          trunkAngle={store.trunkAngle}
          doorAngles={doorAngles}
          paintColor={store.paintColor}
          onPartClick={handlePartClick}
        />
      </group>

      {/* Glass */}
      <group position={[0, eOff * 0.6, 0]}>
        <Glass />
      </group>

      {/* Interior */}
      <group position={[0, eOff * 0.1, 0]}>
        <Interior />
      </group>

      {/* Headlights */}
      <group position={[0, eOff * 0.2, eOff * 0.3]}
        onClick={(e) => { e.stopPropagation(); handlePartClick('headlights'); }}>
        <Headlights headlightOn={store.headlightsOn} />
      </group>

      {/* Tail lights */}
      <group position={[0, eOff * 0.2, -eOff * 0.3]}>
        <TailLights
          brakeLightOn={store.brakeLights}
          turnSignalsOn={store.turnSignalBlink}
        />
      </group>

      {/* Engine */}
      <group position={[0, eOff * 0.5, eOff * 0.5]}
        onClick={(e) => { e.stopPropagation(); handlePartClick('engine'); }}>
        <Engine pistonOffset={store.pistonOffset} />
      </group>

      {/* Cables (under-hood wiring) */}
      {store.showCables && (
        <group position={[0, eOff * 0.5, eOff * 0.5]}>
          <Cables />
        </group>
      )}

      {/* Exhaust */}
      <group position={[eOff * 0.3, -eOff * 0.2, 0]}
        onClick={(e) => { e.stopPropagation(); handlePartClick('exhaust'); }}>
        <Exhaust />
      </group>

      {/* Suspension */}
      <group position={[0, -eOff * 0.2, 0]}
        onClick={(e) => { e.stopPropagation(); handlePartClick('suspension'); }}>
        <Suspension />
      </group>

      {/* Wheels */}
      {WHEELS.map((w) => (
        <group
          key={w.name}
          position={[
            w.pos[0] + (w.side === 'left' ? eOff * 0.4 : -eOff * 0.4),
            w.pos[1] - eOff * 0.1,
            w.pos[2] + (w.isFront ? eOff * 0.2 : -eOff * 0.2),
          ]}
          onClick={(e) => { e.stopPropagation(); handlePartClick(w.isFront ? 'frontWheel' : 'rearWheel'); }}
        >
          <Wheel
            spinAngle={store.spinAngle}
            steerAngle={w.isFront ? store.steerAngle : 0}
            isFront={w.isFront}
            side={w.side}
            spoked={store.spokedWheels}
          />
        </group>
      ))}
    </group>
  );
}
