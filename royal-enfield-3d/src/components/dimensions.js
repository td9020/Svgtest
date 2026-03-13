// Royal Enfield Classic 350 - Real specifications
// All values in meters (1 unit = 1 meter)
// Sources: Royal Enfield official specs

export const SPECS = {
  // Overall dimensions
  overallLength: 2.160,
  overallWidth: 0.785,
  overallHeight: 1.090,
  wheelbase: 1.390,
  seatHeight: 0.805,
  groundClearance: 0.170,
  kerbWeight: 195, // kg

  // Wheels - DIFFERENT front and rear!
  frontRimDiameter: 0.4826,   // 19 inches in meters
  frontRimRadius: 0.2413,
  rearRimDiameter: 0.4572,    // 18 inches in meters
  rearRimRadius: 0.2286,

  // Tires
  frontTireWidth: 0.100,      // 100/90-19
  frontTireOD: 0.678,
  frontTireRadius: 0.339,
  rearTireWidth: 0.120,       // 120/80-18
  rearTireOD: 0.660,
  rearTireRadius: 0.330,

  // Brakes
  frontDiscDiameter: 0.300,   // 300mm front disc
  rearDrumDiameter: 0.153,    // 153mm rear drum

  // Engine - 349cc single cylinder, air-cooled
  bore: 0.072,                // 72mm
  stroke: 0.0858,             // 85.8mm (long stroke)
  engineWidth: 0.32,
  engineHeight: 0.30,

  // Fuel tank - 13 litres, iconic teardrop
  fuelCapacity: 13,
  tankLength: 0.50,
  tankWidth: 0.34,
  tankHeight: 0.24,

  // Frame
  frameType: 'single-downtube-cradle',
  frontSuspension: 'telescopic-fork-41mm',
  rearSuspension: 'twin-shock',

  // Fork
  forkTubeDiameter: 0.041,    // 41mm

  // Rear shocks
  rearShockLength: 0.340,     // 340mm twin shocks

  // Headlight
  headlightDiameter: 0.178,   // 7-inch = 177.8mm
}

// Derived positions based on wheelbase and ground clearance
// Rear axle is our origin reference point (x=0)
export const POS = {
  // Axle positions (y = axle height above ground)
  rearAxle: { x: 0, y: 0.330 },            // rear tire radius above ground
  frontAxle: { x: 1.390, y: 0.339 },       // wheelbase apart, front tire radius

  // Ground level
  ground: 0,

  // Scale factor
  scale: 1.0,
}
