import { create } from 'zustand';

const useAnimationStore = create((set, get) => ({
  // Wheel animations
  wheelSpin: false,
  wheelSpeed: 5,
  steeringSweep: false,

  // Body animations
  doorsOpen: false,
  hoodOpen: false,
  trunkOpen: false,

  // Lights
  headlightsOn: false,
  turnSignals: false,
  brakeLights: false,

  // View modes
  explodedView: false,

  // Internal animation values (updated by useFrame)
  spinAngle: 0,
  steerAngle: 0,
  doorAngle: 0,
  hoodAngle: 0,
  trunkAngle: 0,
  pistonOffset: 0,
  turnSignalBlink: false,
  explodeOffset: 0,

  // Actions
  toggleWheelSpin: () => set((s) => ({ wheelSpin: !s.wheelSpin })),
  toggleSteeringSweep: () => set((s) => ({ steeringSweep: !s.steeringSweep })),
  toggleDoorsOpen: () => set((s) => ({ doorsOpen: !s.doorsOpen })),
  toggleHoodOpen: () => set((s) => ({ hoodOpen: !s.hoodOpen })),
  toggleTrunkOpen: () => set((s) => ({ trunkOpen: !s.trunkOpen })),
  toggleHeadlights: () => set((s) => ({ headlightsOn: !s.headlightsOn })),
  toggleTurnSignals: () => set((s) => ({ turnSignals: !s.turnSignals })),
  toggleBrakeLights: () => set((s) => ({ brakeLights: !s.brakeLights })),
  toggleExplodedView: () => set((s) => ({ explodedView: !s.explodedView })),
  setWheelSpeed: (speed) => set({ wheelSpeed: speed }),

  // Update animation values
  setSpinAngle: (v) => set({ spinAngle: v }),
  setSteerAngle: (v) => set({ steerAngle: v }),
  setDoorAngle: (v) => set({ doorAngle: v }),
  setHoodAngle: (v) => set({ hoodAngle: v }),
  setTrunkAngle: (v) => set({ trunkAngle: v }),
  setPistonOffset: (v) => set({ pistonOffset: v }),
  setTurnSignalBlink: (v) => set({ turnSignalBlink: v }),
  setExplodeOffset: (v) => set({ explodeOffset: v }),

  // Presets
  applyPreset: (preset) => {
    switch (preset) {
      case 'driving':
        set({
          wheelSpin: true,
          steeringSweep: false,
          doorsOpen: false,
          hoodOpen: false,
          trunkOpen: false,
          headlightsOn: true,
          turnSignals: false,
          brakeLights: false,
          explodedView: false,
        });
        break;
      case 'parked':
        set({
          wheelSpin: false,
          steeringSweep: false,
          doorsOpen: false,
          hoodOpen: false,
          trunkOpen: false,
          headlightsOn: false,
          turnSignals: false,
          brakeLights: false,
          explodedView: false,
        });
        break;
      case 'show':
        set({
          wheelSpin: false,
          steeringSweep: false,
          doorsOpen: true,
          hoodOpen: true,
          trunkOpen: true,
          headlightsOn: true,
          turnSignals: true,
          brakeLights: true,
          explodedView: false,
        });
        break;
      default:
        break;
    }
  },
}));

export default useAnimationStore;
