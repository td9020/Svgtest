import { create } from 'zustand';

const useAnimationStore = create((set, get) => ({
  // Toggle states
  wheelSpin: false,
  steeringSweep: false,
  doorsOpen: false,
  hoodOpen: false,       // Frunk (front trunk)
  wingAdjust: false,
  headlightsOn: false,
  turnSignals: false,
  brakeLights: false,
  explodedView: false,
  engineReveal: false,

  // Continuous values
  wheelSpeed: 5,         // rad/s
  engineRPM: 3000,       // for piston animation speed
  steeringAngle: 0,      // current steering angle
  wingAngle: 0.15,       // wing angle of attack
  explodeFactor: 0,      // 0 = assembled, 1 = fully exploded

  // Derived animation values (updated each frame)
  spinAngle: 0,
  pistonOffset: 0,
  turnSignalPhase: 0,

  // Setters
  toggle: (key) => set((s) => ({ [key]: !s[key] })),
  setValue: (key, val) => set({ [key]: val }),

  // Frame update
  tick: (delta) => {
    const s = get();

    const updates = {};

    if (s.wheelSpin) {
      updates.spinAngle = s.spinAngle + s.wheelSpeed * delta;
    }

    if (s.steeringSweep) {
      updates.steeringAngle = Math.sin(Date.now() * 0.002) * 0.5;
    }

    // Piston animation tied to engine RPM
    const rpmFactor = s.engineRPM / 1000;
    updates.pistonOffset = s.pistonOffset + rpmFactor * delta * 8;

    // Turn signal blink
    if (s.turnSignals) {
      updates.turnSignalPhase = Math.sin(Date.now() * 0.008) > 0;
    }

    // Exploded view interpolation
    if (s.explodedView && s.explodeFactor < 1) {
      updates.explodeFactor = Math.min(1, s.explodeFactor + delta * 1.5);
    } else if (!s.explodedView && s.explodeFactor > 0) {
      updates.explodeFactor = Math.max(0, s.explodeFactor - delta * 1.5);
    }

    set(updates);
  },

  // Presets
  applyPreset: (preset) => {
    switch (preset) {
      case 'track':
        set({
          wheelSpin: true,
          wheelSpeed: 12,
          engineRPM: 8500,
          headlightsOn: true,
          brakeLights: false,
          wingAngle: 0.25, // more downforce
          turnSignals: false,
          explodedView: false,
          engineReveal: false,
          doorsOpen: false,
          hoodOpen: false,
        });
        break;
      case 'street':
        set({
          wheelSpin: true,
          wheelSpeed: 4,
          engineRPM: 3000,
          headlightsOn: true,
          brakeLights: false,
          wingAngle: 0.15,
          turnSignals: false,
          explodedView: false,
          engineReveal: false,
          doorsOpen: false,
          hoodOpen: false,
        });
        break;
      case 'showroom':
        set({
          wheelSpin: false,
          wheelSpeed: 0,
          engineRPM: 800,
          headlightsOn: true,
          brakeLights: false,
          wingAngle: 0.15,
          turnSignals: false,
          explodedView: false,
          engineReveal: false,
          doorsOpen: false,
          hoodOpen: false,
          spinAngle: 0,
          steeringSweep: false,
          steeringAngle: 0,
        });
        break;
      default:
        break;
    }
  },
}));

export default useAnimationStore;
