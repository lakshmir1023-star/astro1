import { MartianLocation } from '../types';

export const MARS_LOCATIONS: MartianLocation[] = [
  {
    id: 'olympus-mons',
    name: 'Olympus Mons',
    lat: 18.65,
    lng: -133.8,
    elevationKm: 21.9,
    type: 'volcano',
    tagline: 'The Solar System\'s Largest Volcano',
    coordinatesDisplay: '18°39′N 133°48′W',
    diameterKm: 624,
    depthKm: 22,
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80',
    description: 'Olympus Mons is a colossal shield volcano towering approximately 22 kilometers (13.6 miles or 72,000 feet) above the Martian datum, making it nearly two and a half times the height of Mount Everest above sea level.',
    scientificSignificance: 'Formed by continuous basaltic lava flows over hundreds of millions of years in the absence of plate tectonics, Olympus Mons provides a window into the thermal evolution and deep mantle plumes of early Mars.',
    interestingFacts: [
      'The volcano covers an area roughly the size of the entire state of Arizona or the country of Italy.',
      'Its summit caldera consists of six nested collapse craters measuring 80 km across.',
      'The outer edge terminates in a dramatic basal scarp or cliff up to 8 km high.',
      'Atmospheric pressure at the peak is only 0.7 mbar—less than 12% of the average Martian surface pressure.'
    ]
  },
  {
    id: 'valles-marineris',
    name: 'Valles Marineris',
    lat: -14.0,
    lng: -59.2,
    elevationKm: -7.0,
    type: 'canyon',
    tagline: 'The Grand Canyon of Mars',
    coordinatesDisplay: '14°00′S 59°12′W',
    diameterKm: 4000,
    depthKm: 7.0,
    imageUrl: 'https://images.unsplash.com/photo-1545156521-77bd85671d30?auto=format&fit=crop&w=800&q=80',
    description: 'A vast tectonic canyon system stretching over 4,000 km across the Martian equator, covering nearly a quarter of the planet\'s circumference, with chasmata plunging over 7 km deep.',
    scientificSignificance: 'Exposes billions of years of layered Martian crustal stratigraphy, revealing ancient volcanic deposits, fault-bounded grabens, and evidence of massive catastrophic groundwater release.',
    interestingFacts: [
      'It is roughly 10 times longer, 20 times wider, and 4 times deeper than Earth\'s Grand Canyon.',
      'Morning fogs composed of water ice crystals regularly form within its deepest chasms.',
      'Named in honor of NASA\'s Mariner 9 orbiter, which discovered the system in 1971.',
      'Spectral data shows sulfate deposits that formed in acidic aqueous environments.'
    ]
  },
  {
    id: 'gale-crater',
    name: 'Gale Crater',
    lat: -5.37,
    lng: 137.81,
    elevationKm: -4.5,
    type: 'crater',
    tagline: 'Landing Site of Curiosity Rover',
    coordinatesDisplay: '5°22′S 137°49′E',
    diameterKm: 154,
    depthKm: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    description: 'A 3.5 to 3.8 billion-year-old impact crater featuring Mount Sharp (Aeolis Mons) rising 5.5 km from the crater floor, hosting stratified sedimentary rocks laid down in ancient lakebeds.',
    scientificSignificance: 'Curiosity\'s explorations confirmed that Gale Crater once hosted a persistent, habitable, neutral-pH freshwater lake system complete with carbon, hydrogen, oxygen, nitrogen, phosphorus, and sulfur.',
    interestingFacts: [
      'Home to Curiosity since its daring sky-crane landing on August 6, 2012.',
      'Mudstone samples analyzed at Yellowknife Bay revealed ancient organic molecules.',
      'Methane plumes detected here exhibit seasonal fluctuations that are still actively investigated.',
      'Sedimentary layers document the transition of Mars from wet and warm to cold and arid.'
    ]
  },
  {
    id: 'jezero-crater',
    name: 'Jezero Crater',
    lat: 18.38,
    lng: 77.58,
    elevationKm: -2.5,
    type: 'crater',
    tagline: 'Landing Site of Perseverance Rover',
    coordinatesDisplay: '18°23′N 77°35′E',
    diameterKm: 45,
    depthKm: 2.5,
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80',
    description: 'An ancient open-basin paleolake that received river sediments via a prominent fan-delta channel (Neretva Vallis) during the Noachian and early Hesperian epochs.',
    scientificSignificance: 'Prime astrobiological target for the Mars 2020 Perseverance mission to seek biosignatures of ancient microbial life and collect hermetically sealed rock cores for Mars Sample Return.',
    interestingFacts: [
      'Perseverance and the Ingenuity Mars Helicopter landed here on February 18, 2021.',
      'Ingenuity performed 72 historic powered flights in the thin Martian atmosphere in this crater.',
      'The delta deposits are rich in smectite clays that excel at preserving microscopic fossil structures.',
      'Igneous bedrock found here indicates complex magma lake intrusion before the lake flooded.'
    ]
  },
  {
    id: 'elysium-planitia',
    name: 'Elysium Planitia',
    lat: 4.5,
    lng: 135.9,
    elevationKm: -2.0,
    type: 'plain',
    tagline: 'InSight Seismic Exploration Basin',
    coordinatesDisplay: '4°30′N 135°54′E',
    diameterKm: 3000,
    depthKm: 1.0,
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    description: 'The second largest volcanic region on Mars, characterized by vast, flat basaltic lava plains, youthful cerberus fossae fracture zones, and minimal boulder clutter.',
    scientificSignificance: 'NASA\'s InSight lander placed the SEIS seismometer directly onto the ground here, detecting more than 1,300 "marsquakes" and measuring Mars\' crustal thickness, liquid iron core, and mantle velocity structure.',
    interestingFacts: [
      'The Cerberus Fossae fissures show evidence of lava flows younger than 53,000 years.',
      'Subsurface radar detected potential frozen slab-ice beneath a thin veneer of dust.',
      'InSight mapped the core radius to approximately 1,830 km.',
      'Meteorite impact seismic vibrations were detected in this region for the first time on another planet.'
    ]
  },
  {
    id: 'polar-ice-regions',
    name: 'Polar Ice Regions',
    lat: 84.5,
    lng: 0.0,
    elevationKm: 3.0,
    type: 'ice-cap',
    tagline: 'Planum Boreale & Planum Australe',
    coordinatesDisplay: '84°30′N / 85°00′S',
    diameterKm: 1000,
    depthKm: 3.0,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    description: 'Mars possesses permanent polar ice caps composed primarily of water ice, overlaid by a seasonal veneer of solid carbon dioxide (dry ice) that sublimates and deposits with the Martian seasons.',
    scientificSignificance: 'The layered ice-dust deposits (PLD) hold a pristine paleoclimate record of Mars spanning millions of years, driven by cyclical changes in orbital eccentricity and axial obliquity.',
    interestingFacts: [
      'During Martian winter, up to 30% of the entire atmospheric carbon dioxide freezes onto the caps.',
      'The northern cap holds an estimated 1.6 million cubic kilometers of ice.',
      'Geysers of CO2 gas and dark basaltic dust erupt from the southern cap during springtime thaw.',
      'Subsurface radar reflections hint at potential hypersaline subglacial liquid reservoirs.'
    ]
  }
];

