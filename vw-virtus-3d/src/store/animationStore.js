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
  spokedWheels: false,    // false=alloy, true=steel/hubcap style
  nightMode: false,
  povCamera: false,       // driver POV
  showCables: false,      // show under-hood wiring

  // Selection & customization
  selectedPart: null,
  paintColor: '#001E50',  // VW blue default
  turnSignalBlink: false,

  // Internal animation values (updated by useFrame)
  spinAngle: 0,
  steerAngle: 0,
  doorAngle: 0,
  hoodAngle: 0,
  trunkAngle: 0,
  pistonOffset: 0,
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
  toggleSpokedWheels: () => set((s) => ({ spokedWheels: !s.spokedWheels })),
  toggleNightMode: () => set((s) => ({ nightMode: !s.nightMode })),
  togglePovCamera: () => set((s) => ({ povCamera: !s.povCamera })),
  toggleShowCables: () => set((s) => ({ showCables: !s.showCables })),
  setWheelSpeed: (speed) => set({ wheelSpeed: speed }),
  setPaintColor: (color) => set({ paintColor: color }),
  selectPart: (part) => set((s) => ({ selectedPart: s.selectedPart === part ? null : part })),

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

  // Tick - called from useFrame
  tick: (delta) => {
    const s = get();
    // Turn signal blink
    if (s.turnSignals) {
      set({ turnSignalBlink: Math.sin(Date.now() * 0.01) > 0 });
    } else if (s.turnSignalBlink) {
      set({ turnSignalBlink: false });
    }
  },
}));

export default useAnimationStore;
