// Honda CB Unicorn 150 - Real specifications
// All values in meters (1 unit = 1 meter)
// Sources: BikeWale, BikeDekho, Honda official specs

export const SPECS = {
  // Overall dimensions
  overallLength: 2.094,
  overallWidth: 0.753,
  overallHeight: 1.100,
  wheelbase: 1.338,
  seatHeight: 0.798,
  groundClearance: 0.174,
  kerbWeight: 146, // kg

  // Wheels - both 18 inch
  rimDiameter: 0.4572, // 18 inches in meters
  rimRadius: 0.2286,

  // Tires
  frontTireWidth: 0.080,  // 80/100-18
  frontTireOD: 0.618,
  frontTireRadius: 0.309,
  rearTireWidth: 0.100,   // 100/90-18
  rearTireOD: 0.637,
  rearTireRadius: 0.3185,

  // Brakes
  frontDiscDiameter: 0.240,
  rearDrumDiameter: 0.130,

  // Engine - 149.1cc single cylinder
  bore: 0.0573,
  stroke: 0.0578,
  engineWidth: 0.28,  // estimated
  engineHeight: 0.25, // estimated

  // Fuel tank
  fuelCapacity: 13, // litres
  tankLength: 0.45,  // estimated
  tankWidth: 0.30,   // estimated
  tankHeight: 0.22,  // estimated

  // Frame
  frameType: 'diamond-tubular',
  frontSuspension: 'telescopic-fork',
  rearSuspension: 'monoshock',
}

// Derived positions based on wheelbase and ground clearance
// Rear axle is our origin reference point (x=0)
export const POS = {
  // Axle positions (y = axle height above ground)
  rearAxle: { x: 0, y: 0.3185 },           // rear tire radius above ground
  frontAxle: { x: 1.338, y: 0.309 },        // wheelbase apart, front tire radius

  // Ground level
  ground: 0,

  // Scale factor - we'll work at 1:1 scale but can adjust viewing
  scale: 1.0,
}
