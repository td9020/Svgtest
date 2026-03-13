import { create } from 'zustand'

// Central animation state store for Suzuki Hayabusa GSX1300R
// All animation flags and parameters in one place

const useAnimationStore = create((set, get) => ({
  // === Toggle states ===
  wheelSpin: false,
  engineRunning: false,
  suspensionBounce: false,
  steeringSweep: false,
  kickstandDown: true,
  explodedView: false,
  headlightOn: true,
  turnSignals: false,
  fairingTransparent: false,

  // === NEW toggles ===
  spokedWheels: false,    // false = alloy, true = wire spokes
  nightMode: false,       // day/night lighting
  povCamera: false,       // first-person rider POV
  showCables: false,      // cable/wire routing
  chainAnimate: true,     // chain drive animation (follows wheelSpin)
  selectedPart: null,     // clicked part name for highlight

  // === Paint color ===
  paintColor: '#003DA5',  // Suzuki blue default

  // === Speed / intensity ===
  wheelSpeed: 1.0,      // multiplier (0.1 - 3.0)
  engineRPM: 1.0,       // multiplier (0.5 - 5.0)

  // === Derived values (updated per frame) ===
  wheelAngle: 0,
  pistonOffset: 0,
  forkCompression: 0,
  steeringAngle: 0,
  kickstandAngle: 0.35, // radians, down position
  explodeProgress: 0,   // 0 = assembled, 1 = fully exploded
  chainOffset: 0,       // chain link animation offset
  turnSignalBlink: false, // blink state for turn signals

  // === Actions ===
  toggle: (key) => set((s) => ({ [key]: !s[key] })),
  setSpeed: (key, value) => set({ [key]: value }),
  setPaintColor: (color) => set({ paintColor: color }),
  selectPart: (part) => set((s) => ({ selectedPart: s.selectedPart === part ? null : part })),

  // Called from useFrame - updates all animated values
  tick: (delta) => {
    const s = get()

    // Wheel rotation
    if (s.wheelSpin) {
      set({ wheelAngle: s.wheelAngle + delta * 4 * s.wheelSpeed })
    }

    // Chain offset (follows wheel)
    if (s.wheelSpin && s.chainAnimate) {
      set({ chainOffset: s.chainOffset + delta * 2 * s.wheelSpeed })
    }

    // Engine piston (sinusoidal reciprocation) - inline-4 with firing order
    if (s.engineRunning) {
      const freq = 12 * s.engineRPM // cycles per second
      set({
        pistonOffset: Math.sin(Date.now() * 0.001 * freq * Math.PI * 2) * 0.020,
      })
    } else {
      if (s.pistonOffset !== 0) set({ pistonOffset: 0 })
    }

    // Suspension bounce
    if (s.suspensionBounce) {
      set({
        forkCompression: Math.sin(Date.now() * 0.003) * 0.012 + Math.sin(Date.now() * 0.0071) * 0.006,
      })
    } else {
      if (s.forkCompression !== 0) {
        set({ forkCompression: s.forkCompression * 0.9 })
        if (Math.abs(s.forkCompression) < 0.0005) set({ forkCompression: 0 })
      }
    }

    // Steering sweep
    if (s.steeringSweep) {
      set({
        steeringAngle: Math.sin(Date.now() * 0.001) * 0.35, // +/- ~20 degrees (less than naked bikes)
      })
    } else {
      if (s.steeringAngle !== 0) {
        set({ steeringAngle: s.steeringAngle * 0.92 })
        if (Math.abs(s.steeringAngle) < 0.005) set({ steeringAngle: 0 })
      }
    }

    // Kickstand
    const targetKick = s.kickstandDown ? 0.35 : 0.0
    if (Math.abs(s.kickstandAngle - targetKick) > 0.005) {
      set({ kickstandAngle: s.kickstandAngle + (targetKick - s.kickstandAngle) * 0.08 })
    }

    // Exploded view
    const targetExplode = s.explodedView ? 1 : 0
    if (Math.abs(s.explodeProgress - targetExplode) > 0.005) {
      set({ explodeProgress: s.explodeProgress + (targetExplode - s.explodeProgress) * 0.04 })
    }

    // Turn signal blink (~1.5 Hz)
    if (s.turnSignals) {
      set({ turnSignalBlink: Math.sin(Date.now() * 0.01) > 0 })
    } else if (s.turnSignalBlink) {
      set({ turnSignalBlink: false })
    }
  },
}))

export default useAnimationStore
