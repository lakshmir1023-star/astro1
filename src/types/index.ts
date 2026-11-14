export type Screen = 'home' | 'explore' | 'rover' | 'missions' | 'profile' | 'laboratory' | 'mission-control';

export interface MartianLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  elevationKm: number;
  type: 'volcano' | 'canyon' | 'crater' | 'plain' | 'ice-cap';
  tagline: string;
  description: string;
  scientificSignificance: string;
  interestingFacts: string[];
  imageUrl: string;
  coordinatesDisplay: string;
  diameterKm?: number;
  depthKm?: number;
}

export interface RoverTelemetry {
  speedKmh: number;
  distanceTraveledM: number;
  batteryPercent: number;
  currentLocationName: string;
  latitude: number;
  longitude: number;
  elevationM: number;
  terrainType: 'Regolith Plain' | 'Basaltic Rocks' | 'Impact Crater Rim' | 'Dune Field' | 'Ancient Riverbed';
  missionStatus: 'Exploring' | 'Idle' | 'Analyzing Sample' | 'Low Power';
  explorationTimeSec: number;
  signalDelaySec: number;
  solarInputWatts: number;
  motorTempC: number;
}

export interface MissionObjective {
  id: string;
  description: string;
  current: number;
  target: number;
  unit?: string;
  completed: boolean;
}

export interface ExplorationMission {
  id: string;
  number: string;
  title: string;
  codename: string;
  category: 'exploration' | 'geology' | 'rover' | 'science';
  briefing: string;
  startingLocation: string;
  instructions: string[];
  objectives: MissionObjective[];
  completed: boolean;
  rewardXp: number;
  rewardBadgeId: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'exploration' | 'rover' | 'science' | 'mastery';
  xpReward: number;
}

export interface UserProfile {
  explorerName: string;
  avatarId: string;
  rankTitle: string;
  xp: number;
  explorationPoints: number;
  completedMissionsCount: number;
  totalDistanceTraveledM: number;
  experimentsCompletedCount: number;
  locationsVisitedCount: number;
  unlockedAchievementIds: string[];
}

export interface ScienceExperiment {
  id: string;
  number: number;
  title: string;
  objective: string;
  instructions: string[];
  scientificExplanation: string;
  category: 'Soil' | 'Temperature' | 'Gravity' | 'Rocks' | 'Water';
  completed: boolean;
  rewardXp: number;
}

export interface AppSettings {
  soundEnabled: boolean;
  sfxVolume: number;
  ambientVolume: number;
  graphicsQuality: 'low' | 'medium' | 'high';
  cameraSensitivity: number;
  skipIntro: boolean;
  firstTimeLaunch: boolean;
}

