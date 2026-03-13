import { create } from 'zustand'

// Central animation state store
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

  // === Actions ===
  toggle: (key) => set((s) => ({ [key]: !s[key] })),
  setSpeed: (key, value) => set({ [key]: value }),

  // Called from useFrame - updates all animated values
  tick: (delta) => {
    const s = get()

    // Wheel rotation
    if (s.wheelSpin) {
      set({ wheelAngle: s.wheelAngle + delta * 4 * s.wheelSpeed })
    }

    // Engine piston (sinusoidal reciprocation)
    if (s.engineRunning) {
      const freq = 12 * s.engineRPM // cycles per second
      set({
        pistonOffset: Math.sin(Date.now() * 0.001 * freq * Math.PI * 2) * 0.025,
      })
    } else {
      if (s.pistonOffset !== 0) set({ pistonOffset: 0 })
    }

    // Suspension bounce
    if (s.suspensionBounce) {
      set({
        forkCompression: Math.sin(Date.now() * 0.003) * 0.015 + Math.sin(Date.now() * 0.0071) * 0.008,
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
        steeringAngle: Math.sin(Date.now() * 0.001) * 0.4, // +/- ~23 degrees
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
  },
}))

export default useAnimationStore
