import { AppSettings, UserProfile, ExplorationMission, Achievement, ScienceExperiment, RoverTelemetry } from '../types';
import { EXPLORATION_MISSIONS } from '../data/missions';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { SCIENCE_EXPERIMENTS } from '../data/experiments';

const STORAGE_KEYS = {
  PROFILE: 'astroquest_profile',
  MISSIONS: 'astroquest_missions',
  ACHIEVEMENTS: 'astroquest_achievements',
  EXPERIMENTS: 'astroquest_experiments',
  SETTINGS: 'astroquest_settings',
  ROVER_TELEMETRY: 'astroquest_rover_telemetry'
};

const DEFAULT_PROFILE: UserProfile = {
  explorerName: 'Commander Alex Vance',
  avatarId: 'avatar-astronaut-1',
  rankTitle: 'Mission Specialist',
  xp: 450,
  explorationPoints: 1250,
  completedMissionsCount: 1,
  totalDistanceTraveledM: 42,
  experimentsCompletedCount: 1,
  locationsVisitedCount: 2,
  unlockedAchievementIds: ['first-landing']
};

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  sfxVolume: 0.8,
  ambientVolume: 0.4,
  graphicsQuality: 'high',
  cameraSensitivity: 1.0,
  skipIntro: false,
  firstTimeLaunch: true
};

const DEFAULT_ROVER: RoverTelemetry = {
  speedKmh: 0,
  distanceTraveledM: 42,
  batteryPercent: 96,
  currentLocationName: 'Gale Crater Floor',
  latitude: -5.37,
  longitude: 137.81,
  elevationM: -4500,
  terrainType: 'Regolith Plain',
  missionStatus: 'Exploring',
  explorationTimeSec: 284,
  signalDelaySec: 742,
  solarInputWatts: 420,
  motorTempC: 18
};

export const storageService = {
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {}
  },

  getMissions(): ExplorationMission[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MISSIONS);
      return data ? JSON.parse(data) : EXPLORATION_MISSIONS;
    } catch {
      return EXPLORATION_MISSIONS;
    }
  },

  saveMissions(missions: ExplorationMission[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
    } catch {}
  },

  getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  },

  saveAchievements(achievements: Achievement[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch {}
  },

  getExperiments(): ScienceExperiment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPERIMENTS);
      return data ? JSON.parse(data) : SCIENCE_EXPERIMENTS;
    } catch {
      return SCIENCE_EXPERIMENTS;
    }
  },

  saveExperiments(experiments: ScienceExperiment[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPERIMENTS, JSON.stringify(experiments));
    } catch {}
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {}
  },

  getRoverTelemetry(): RoverTelemetry {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROVER_TELEMETRY);
      return data ? { ...DEFAULT_ROVER, ...JSON.parse(data) } : DEFAULT_ROVER;
    } catch {
      return DEFAULT_ROVER;
    }
  },

  saveRoverTelemetry(telemetry: RoverTelemetry): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ROVER_TELEMETRY, JSON.stringify(telemetry));
    } catch {}
  },

  resetAllProgress(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.MISSIONS);
      localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
      localStorage.removeItem(STORAGE_KEYS.EXPERIMENTS);
      localStorage.removeItem(STORAGE_KEYS.ROVER_TELEMETRY);
    } catch {}
  }
};

