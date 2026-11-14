import { ExplorationMission } from '../types';

export const EXPLORATION_MISSIONS: ExplorationMission[] = [
  {
    id: 'mission-01',
    number: '01',
    title: 'First Contact',
    codename: 'ARES-INITIATIVE',
    category: 'exploration',
    startingLocation: 'Gale Crater Landing Zone',
    briefing: 'Welcome to Mars, Commander. Your first operational objective is to touch down safely on the Martian surface, establish primary communications telemetry with the Mars Reconnaissance Orbiter, and complete a baseline sensor calibration scan.',
    instructions: [
      'Initialize primary systems in Mission Control.',
      'Deploy the interactive Mars Globe and inspect your landing sector.',
      'Calibrate the rover telemetry sensors and record your initial position coordinates.'
    ],
    objectives: [
      { id: 'obj-1-1', description: 'Establish Mission Control link', current: 0, target: 1, completed: false },
      { id: 'obj-1-2', description: 'Inspect Mars Globe POI', current: 0, target: 1, completed: false },
      { id: 'obj-1-3', description: 'Power up rover engine systems', current: 0, target: 1, completed: false }
    ],
    completed: false,
    rewardXp: 250,
    rewardBadgeId: 'first-landing'
  },
  {
    id: 'mission-02',
    number: '02',
    title: 'Olympus Mons',
    codename: 'TITAN-ASCENT',
    category: 'exploration',
    startingLocation: 'Olympus Mons Base Plateau',
    briefing: 'Navigate orbital reconnaissance to Olympus Mons, the crown jewel of planetary shield volcanoes in our solar system. Analyze the basal scarp and observe atmospheric thinning near the summit caldera.',
    instructions: [
      'Locate Olympus Mons on the 3D Mars globe.',
      'Review the geological profile and volcanic formation history.',
      'Initiate surface survey telemetry for the 22 km elevation threshold.'
    ],
    objectives: [
      { id: 'obj-2-1', description: 'Select and inspect Olympus Mons', current: 0, target: 1, completed: false },
      { id: 'obj-2-2', description: 'Read scientific significance briefing', current: 0, target: 1, completed: false },
      { id: 'obj-2-3', description: 'Record caldera elevation telemetry', current: 0, target: 1, completed: false }
    ],
    completed: false,
    rewardXp: 350,
    rewardBadgeId: 'crater-explorer'
  },
  {
    id: 'mission-03',
    number: '03',
    title: 'Crater Investigation',
    codename: 'PALEOLAKE-SURVEY',
    category: 'geology',
    startingLocation: 'Jezero Delta Sector 4',
    briefing: 'Jezero Crater preserves an ancient river delta where mudstones and clay minerals could hold fossilized biosignatures from 3.5 billion years ago. Execute a geological scan of the delta sediments.',
    instructions: [
      'Navigate to Jezero Crater or Gale Crater on the planetary globe.',
      'Conduct a rock classification experiment in the Science Laboratory.',
      'Log sedimentary delta layered strata in Mission Control.'
    ],
    objectives: [
      { id: 'obj-3-1', description: 'Inspect Jezero or Gale Crater', current: 0, target: 1, completed: false },
      { id: 'obj-3-2', description: 'Complete Rock Classification Experiment', current: 0, target: 1, completed: false },
      { id: 'obj-3-3', description: 'Log delta stratigraphic data', current: 0, target: 1, completed: false }
    ],
    completed: false,
    rewardXp: 400,
    rewardBadgeId: 'martian-scientist'
  },
  {
    id: 'mission-04',
    number: '04',
    title: 'Soil Collection',
    codename: 'REGOLITH-HARVEST',
    category: 'science',
    startingLocation: 'Elysium Planitia Flats',
    briefing: 'Martian regolith contains iron oxides, perchlorates, and basaltic fragments. Deploy the robotic sampling arm to collect virtual soil samples and analyze elemental composition in the Virtual Lab.',
    instructions: [
      'Deploy the rover robotic sampling arm in the Simulator.',
      'Extract a regolith core sample from the Martian surface.',
      'Run the Soil Analysis Experiment in the laboratory.'
    ],
    objectives: [
      { id: 'obj-4-1', description: 'Deploy rover sampling arm drill', current: 0, target: 1, completed: false },
      { id: 'obj-4-2', description: 'Acquire regolith virtual sample', current: 0, target: 1, completed: false },
      { id: 'obj-4-3', description: 'Complete Soil Analysis experiment', current: 0, target: 1, completed: false }
    ],
    completed: false,
    rewardXp: 450,
    rewardBadgeId: 'martian-scientist'
  },
  {
    id: 'mission-05',
    number: '05',
    title: 'Water Detection',
    codename: 'CRYOSPHERE-PROBE',
    category: 'science',
    startingLocation: 'Planum Boreale Edge',
    briefing: 'Water is the cornerstone of past habitability and future crewed expeditions. Investigate the polar ice caps and ancient hydrological features using ground-penetrating radar simulations.',
    instructions: [
      'Investigate the Polar Ice Regions on the Mars Globe.',
      'Analyze the Water Discovery scientific educational module.',
      'Perform the Water & Ice Investigation virtual experiment.'
    ],
    objectives: [
      { id: 'obj-5-1', description: 'Survey Martian Polar Ice Regions', current: 0, target: 1, completed: false },
      { id: 'obj-5-2', description: 'Study Water Discovery module', current: 0, target: 1, completed: false },
      { id: 'obj-5-3', description: 'Complete Ice Investigation experiment', current: 0, target: 1, completed: false }
    ],
    completed: false,
    rewardXp: 500,
    rewardBadgeId: 'mars-pioneer'
  },
  {
    id: 'mission-06',
    number: '06',
    title: 'Rover Expedition',
    codename: 'ENDURANCE-TREK',
    category: 'rover',
    startingLocation: 'Valles Marineris Basin Rim',
    briefing: 'Put your rover piloting skills to the test. Navigate across challenging Martian terrain, steer through obstacle boulders, and accumulate at least 150 virtual meters of distance while managing vehicle battery power.',
    instructions: [
      'Engage manual driving controls in the Rover Simulator.',
      'Navigate around rocky obstacles and test both 1st and 3rd person cameras.',
      'Accumulate 150 meters of exploration distance.'
    ],
    objectives: [
      { id: 'obj-6-1', description: 'Drive rover 150 virtual meters', current: 0, target: 150, unit: 'm', completed: false },
      { id: 'obj-6-2', description: 'Toggle First-Person Cockpit Camera', current: 0, target: 1, completed: false },
      { id: 'obj-6-3', description: 'Maintain rover battery above 20%', current: 0, target: 1, completed: false }
    ],
    completed: false,
    rewardXp: 600,
    rewardBadgeId: 'rover-commander'
  },
  {
    id: 'mission-07',
    number: '07',
    title: 'Scientific Discovery',
    codename: 'APEX-LABORATORY',
    category: 'science',
    startingLocation: 'Astroquest Planetary Research Lab',
    briefing: 'Synthesize all planetary data. Complete all five interactive scientific experiments (Soil, Temperature, Gravity, Rocks, and Ice) to earn the coveted Master Explorer credentials.',
    instructions: [
      'Complete the Gravity Experiment comparing Mars to Earth.',
      'Complete the Temperature Mapping Experiment across locations.',
      'Attain 100% completion on all 5 laboratory experiments.'
    ],
    objectives: [
      { id: 'obj-7-1', description: 'Complete Gravity Drop Experiment', current: 0, target: 1, completed: false },
      { id: 'obj-7-2', description: 'Complete Temperature Mapping', current: 0, target: 1, completed: false },
      { id: 'obj-7-3', description: 'Complete all 5 Laboratory Experiments', current: 0, target: 5, completed: false }
    ],
    completed: false,
    rewardXp: 800,
    rewardBadgeId: 'master-explorer'
  }
];

