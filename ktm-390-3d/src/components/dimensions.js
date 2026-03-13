// KTM 390 Duke - Real specifications
// All values in meters (1 unit = 1 meter)
// Sources: KTM official specs, BikeWale, BikeDekho

export const SPECS = {
  // Overall dimensions
  overallLength: 2.149,
  overallWidth: 0.830,
  overallHeight: 1.075,
  wheelbase: 1.367,
  seatHeight: 0.830,
  groundClearance: 0.172,
  kerbWeight: 163, // kg

  // Wheels - both 17 inch
  rimDiameter: 0.4318, // 17 inches in meters
  rimRadius: 0.2159,

  // Tires
  frontTireWidth: 0.110,  // 110/70-17
  frontTireOD: 0.594,
  frontTireRadius: 0.297,
  rearTireWidth: 0.150,   // 150/60-17
  rearTireOD: 0.618,
  rearTireRadius: 0.309,

  // Brakes
  frontDiscDiameter: 0.320,  // 320mm front disc
  rearDiscDiameter: 0.230,   // 230mm rear disc

  // Engine - 373.2cc single cylinder, liquid-cooled
  bore: 0.089,      // 89mm
  stroke: 0.060,    // 60mm
  engineWidth: 0.32,  // estimated
  engineHeight: 0.30, // estimated

  // Fuel tank
  fuelCapacity: 13.4, // litres
  tankLength: 0.48,   // estimated
  tankWidth: 0.32,    // estimated
  tankHeight: 0.24,   // estimated

  // Frame
  frameType: 'trellis',
  frontSuspension: 'usd-fork',  // upside-down, WP 43mm
  rearSuspension: 'monoshock',
  forkDiameter: 0.043,  // 43mm USD forks

  // Radiator
  radiatorWidth: 0.22,
  radiatorHeight: 0.20,
}

// Derived positions based on wheelbase and ground clearance
// Rear axle is our origin reference point (x=0)
export const POS = {
  // Axle positions (y = axle height above ground)
  rearAxle: { x: 0, y: 0.309 },           // rear tire radius above ground
  frontAxle: { x: 1.367, y: 0.297 },      // wheelbase apart, front tire radius

  // Ground level
  ground: 0,

  // Scale factor
  scale: 1.0,
}
