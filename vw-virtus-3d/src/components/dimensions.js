// Volkswagen Virtus REAL specifications (all in meters)
export const VW = {
  // Overall dimensions
  length: 4.561,
  width: 1.752,
  height: 1.487,
  wheelbase: 2.651,
  groundClearance: 0.179,

  // Overhangs
  frontOverhang: 0.880,
  rearOverhang: 1.030,

  // Track width
  trackFront: 1.510,
  trackRear: 1.505,

  // Tire: 205/55 R16
  tireOuterDiameter: 0.632,
  tireWidth: 0.205,
  rimDiameter: 0.4064, // 16 inch
  tireRadius: 0.316,
  rimRadius: 0.2032,
  tireSidewall: 0.1128, // 205 * 0.55 = 112.75mm

  // Brakes
  frontDiscDiameter: 0.276,
  rearDrumDiameter: 0.228,

  // Engine: 1.0 TSI 3-cylinder turbo
  engineCylinders: 3,
  bore: 0.0745,
  stroke: 0.0764,

  // Capacities
  fuelTankLitres: 45,
  bootCapacityLitres: 521,
  kerbWeightKg: 1164,

  // Body proportions (derived)
  bodyWidth: 1.70,   // slightly less than overall for fenders
  cabinWidth: 1.50,
  roofHeight: 1.42,  // roof top from ground
  beltLine: 0.85,    // window bottom from ground
  hoodHeight: 0.90,
  trunkHeight: 0.88,

  // Door dimensions
  doorHeight: 0.70,
  doorWidth: 0.95,
  rearDoorWidth: 0.85,

  // Window proportions
  windshieldAngle: Math.PI / 5.5, // ~33 degrees rake
  rearWindowAngle: Math.PI / 4.2,

  // VW brand colors
  candyWhite: '#F5F5F0',
  reflexSilver: '#C0C0C0',
  vwBlue: '#001E50',
  chrome: '#D4D4D4',
  darkChrome: '#2A2A2A',
  glassColor: '#1a3a5c',
  interiorGrey: '#3a3a3a',
  seatColor: '#2d2d2d',
  dashColor: '#1f1f1f',
  headlightColor: '#ffffff',
  tailLightColor: '#ff1a1a',
  turnSignalColor: '#ffaa00',
  tireDark: '#1a1a1a',
  rimSilver: '#b8b8b8',
};

// Wheel positions relative to car center (car center at origin)
export const WHEEL_POSITIONS = {
  frontLeft:  [ VW.trackFront / 2,  VW.tireRadius, VW.wheelbase / 2 - VW.frontOverhang + VW.frontOverhang],
  frontRight: [-VW.trackFront / 2,  VW.tireRadius, VW.wheelbase / 2 - VW.frontOverhang + VW.frontOverhang],
  rearLeft:   [ VW.trackRear / 2,   VW.tireRadius, -(VW.length - VW.wheelbase) / 2 + VW.frontOverhang - VW.frontOverhang],
  rearRight:  [-VW.trackRear / 2,   VW.tireRadius, -(VW.length - VW.wheelbase) / 2 + VW.frontOverhang - VW.frontOverhang],
};

// Recalculate wheel positions based on wheelbase
// Car center is at z=0, front axle at +wheelbase/2 offset from center
const carCenterZ = 0;
const frontAxleZ = VW.frontOverhang + VW.wheelbase / 2 - VW.length / 2;
const rearAxleZ = VW.frontOverhang - VW.length / 2 + 0; // rear axle relative

// Simplified: front axle at z = +wheelbase/2 * factor, rear at -wheelbase/2 * factor
export const AXLE_Z = {
  front: VW.wheelbase / 2 * 0.85,
  rear: -VW.wheelbase / 2 * 0.85,
};

export const WHEELS = [
  { name: 'frontLeft',  pos: [ VW.trackFront / 2,  VW.tireRadius, AXLE_Z.front], isFront: true, side: 'left' },
  { name: 'frontRight', pos: [-VW.trackFront / 2,  VW.tireRadius, AXLE_Z.front], isFront: true, side: 'right' },
  { name: 'rearLeft',   pos: [ VW.trackRear / 2,   VW.tireRadius, AXLE_Z.rear],  isFront: false, side: 'left' },
  { name: 'rearRight',  pos: [-VW.trackRear / 2,   VW.tireRadius, AXLE_Z.rear],  isFront: false, side: 'right' },
];
