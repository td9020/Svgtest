// Suzuki Hayabusa GSX1300R (3rd gen) - Real specifications
// All values in meters (1 unit = 1 meter)
// Sources: Suzuki official specs, cycle-world, motorcyclenews

export const SPECS = {
  // Overall dimensions
  overallLength: 2.180,
  overallWidth: 0.735,
  overallHeight: 1.165,
  wheelbase: 1.480,
  seatHeight: 0.800,
  groundClearance: 0.125,
  kerbWeight: 264, // kg

  // Wheels - both 17 inch
  rimDiameter: 0.4318, // 17 inches in meters
  rimRadius: 0.2159,

  // Tires
  frontTireWidth: 0.120,  // 120/70-17
  frontTireOD: 0.620,
  frontTireRadius: 0.310,
  rearTireWidth: 0.190,   // 190/50-17 (very wide!)
  rearTireOD: 0.632,
  rearTireRadius: 0.316,

  // Brakes
  frontDiscDiameter: 0.320,  // DUAL 320mm discs
  rearDiscDiameter: 0.260,   // single 260mm disc

  // Engine - 1340cc inline-4 cylinder
  bore: 0.081,       // 81mm
  stroke: 0.065,     // 65mm
  cylinders: 4,
  engineWidth: 0.42,   // wider due to inline-4
  engineHeight: 0.30,
  displacement: 1340, // cc

  // Fuel tank
  fuelCapacity: 20, // litres
  tankLength: 0.50,
  tankWidth: 0.34,
  tankHeight: 0.24,

  // Frame
  frameType: 'twin-spar-aluminum',
  frontSuspension: 'USD-fork-43mm',
  rearSuspension: 'linkage-monoshock',

  // Fork
  forkDiameter: 0.043, // 43mm USD (KYB)

  // Transmission
  gears: 6,
}

// Derived positions based on wheelbase and ground clearance
// Rear axle is our origin reference point (x=0)
export const POS = {
  // Axle positions (y = axle height above ground)
  rearAxle: { x: 0, y: 0.316 },            // rear tire radius above ground
  frontAxle: { x: 1.480, y: 0.310 },       // wheelbase apart, front tire radius

  // Ground level
  ground: 0,

  // Scale factor
  scale: 1.0,
}
