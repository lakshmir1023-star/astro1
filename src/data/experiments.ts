import { ScienceExperiment } from '../types';

export const SCIENCE_EXPERIMENTS: ScienceExperiment[] = [
  {
    id: 'exp-soil',
    number: 1,
    title: 'Soil Regolith Analysis',
    category: 'Soil',
    objective: 'Examine chemical, mineralogical, and oxidizer composition of Martian regolith to evaluate planetary habitability.',
    instructions: [
      'Collect a sample from the selected region.',
      'Fire the Alpha Particle X-ray Spectrometer (APXS).',
      'Analyze iron oxide (Fe2O3) concentration and identify toxic perchlorate salts.'
    ],
    scientificExplanation: 'Martian dust is predominantly fine-grained basalt enriched with oxidized iron (rust), giving Mars its distinctive reddish hue. In 2008, NASA\'s Phoenix lander detected magnesium perchlorate (ClO4-) at 0.5–1.0%, which is a powerful oxidizer that poses challenges for human life support but lowers the freezing point of water.',
    completed: false,
    rewardXp: 180
  },
  {
    id: 'exp-temp',
    number: 2,
    title: 'Thermal & Temperature Analysis',
    category: 'Temperature',
    objective: 'Measure and compare diurnal thermal extremes across various Martian latitudes and seasons.',
    instructions: [
      'Select sensor probe locations (Equator vs Mid-Latitudes vs Poles).',
      'Toggle Day / Night thermal cycle to observe diurnal fluctuations.',
      'Calculate the thermal inertia of the local surface materials.'
    ],
    scientificExplanation: 'Because Mars has an extremely thin atmosphere (average surface pressure 6.1 mbar) lacking greenhouse water vapor, heat escapes rapidly into space. Temperatures can plunge from +20°C (+68°F) at noon on the equator down to -125°C (-193°F) at the winter polar caps.',
    completed: false,
    rewardXp: 180
  },
  {
    id: 'exp-gravity',
    number: 3,
    title: 'Surface Gravity Acceleration Test',
    category: 'Gravity',
    objective: 'Demonstrate Newtonian gravitational acceleration differences between Earth (9.80 m/s²) and Mars (3.72 m/s²).',
    instructions: [
      'Release identical test mass spheres simultaneously from a height of 10.0 meters.',
      'Record time-of-flight on high-precision optical laser gates.',
      'Observe that Martian surface gravity is approximately 38% of Earth\'s gravity.'
    ],
    scientificExplanation: 'Mars has approximately 10.7% of Earth\'s mass and 53% of Earth\'s radius. Applying Newton\'s law of universal gravitation g = GM/R² yields a surface acceleration of approximately 3.72 m/s². An astronaut weighing 80 kg on Earth weighs only 30.4 kg-equivalent on Mars, allowing significantly higher jumps and larger payloads to be lifted.',
    completed: false,
    rewardXp: 200
  },
  {
    id: 'exp-rocks',
    number: 4,
    title: 'Petrologic Rock Classification',
    category: 'Rocks',
    objective: 'Classify volcanic basalt, aqueous sedimentary mudstones, and impact melt breccias found on the Martian surface.',
    instructions: [
      'Inspect microscopic imagery of sample thin-sections.',
      'Test hardness, cleavage, and vesicular texture.',
      'Differentiate igneous mantle extrusions from water-lain lacustrine deposits.'
    ],
    scientificExplanation: 'Martian rocks fall primarily into three categories: volcanic igneous rocks (tholeiitic basalt, olivine-rich cumulates), sedimentary rocks deposited in ancient lakes or dunes (smectite clays, sulfate sandstones, mudstones), and impact breccias formed by catastrophic asteroid bombardments.',
    completed: false,
    rewardXp: 180
  },
  {
    id: 'exp-water',
    number: 5,
    title: 'Subsurface Water & Ice Investigation',
    category: 'Water',
    objective: 'Investigate the phase transitions of H2O and CO2 ice under Martian atmospheric pressure (6.1 mbar) and identify subsurface reservoirs.',
    instructions: [
      'Extract a virtual cryo-core sample from the polar boundary.',
      'Apply gradual thermal heating in the low-pressure chamber.',
      'Observe the direct sublimation of ice into vapor without passing through a stable liquid phase.'
    ],
    scientificExplanation: 'At Mars\' ambient atmospheric pressure of ~6.1 mbar (very close to the triple point of water at 6.11 mbar), pure liquid water is thermodynamically unstable on the surface and either rapidly boils or freezes. Subsurface radar (SHARAD/MARSIS) confirms millions of cubic kilometers of clean water ice protected beneath insulating meters of dry regolith.',
    completed: false,
    rewardXp: 220
  }
];

