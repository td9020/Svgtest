// Porsche 911 GT3 (992) Real Dimensions - All in meters
// Source: Official Porsche specs

export const D = {
  // Overall dimensions
  length: 4.573,
  width: 1.852,
  widthMirrors: 2.027,
  height: 1.279,
  wheelbase: 2.457,
  groundClearance: 0.100,

  // Track widths
  frontTrack: 1.588,
  rearTrack: 1.566,

  // Weight
  kerbWeight: 1435, // kg

  // Tires - STAGGERED setup
  frontTire: {
    width: 0.255,       // 255mm
    aspectRatio: 0.35,  // 35%
    rimDiameter: 0.508, // 20 inch
    outerDiameter: 0.668,
    sidewall: 0.255 * 0.35, // ~89mm
    radius: 0.668 / 2,
  },
  rearTire: {
    width: 0.315,       // 315mm
    aspectRatio: 0.30,  // 30%
    rimDiameter: 0.5334, // 21 inch
    outerDiameter: 0.710,
    sidewall: 0.315 * 0.30, // ~94.5mm
    radius: 0.710 / 2,
  },

  // Brakes - PCCB Carbon Ceramic
  frontBrake: {
    diameter: 0.408,  // 408mm
    thickness: 0.036,
  },
  rearBrake: {
    diameter: 0.380,  // 380mm
    thickness: 0.034,
  },

  // Engine - 4.0L Flat-6
  engine: {
    displacement: 4.0,   // litres
    cylinders: 6,
    bore: 0.102,         // 102mm
    stroke: 0.0815,      // 81.5mm
    layout: 'flat-6',    // horizontally opposed boxer
    position: 'rear',    // behind rear axle
  },

  // Fuel tank
  fuelTankLitres: 64,

  // Body proportions (derived/estimated for modeling)
  bodyWidth: 1.852,
  frontOverhang: (4.573 - 2.457) * 0.38, // ~0.804m
  rearOverhang: (4.573 - 2.457) * 0.62,  // ~1.312m
  rearHaunchWidth: 1.92, // rear fenders are wider

  // Roof height from ground
  roofHeight: 1.279,
  hoodHeight: 0.85,      // front hood is low (no engine!)
  beltlineHeight: 1.00,

  // Rear wing
  wingSpan: 1.60,
  wingChord: 0.28,
  wingHeight: 1.35, // top of wing from ground
  wingMountHeight: 0.20, // mount length

  // Wheel positions (center of wheel from car center)
  get frontAxleX() { return this.wheelbase / 2; },
  get rearAxleX() { return -this.wheelbase / 2; },
  get frontWheelZ() { return this.frontTrack / 2; },
  get rearWheelZ() { return this.rearTrack / 2; },
  get frontWheelY() { return this.frontTire.radius; },
  get rearWheelY() { return this.rearTire.radius; },
};

export default D;
