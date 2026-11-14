import React, { useState, useEffect, useCallback } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Screen, UserProfile, ExplorationMission, Achievement, ScienceExperiment, AppSettings, RoverTelemetry, MartianLocation } from './types';
import { storageService } from './services/storage';
import { soundManager } from './services/audio';

// UI Components
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { SplashScreen } from './components/splash/SplashScreen';
import { HomeScreen } from './components/home/HomeScreen';
import { MarsGlobe } from './components/globe/MarsGlobe';
import { RoverSimulator } from './components/rover/RoverSimulator';
import { MissionControl } from './components/mission-control/MissionControl';
import { ScienceLab } from './components/laboratory/ScienceLab';
import { VirtualExperiments } from './components/laboratory/VirtualExperiments';
import { MissionsScreen } from './components/missions/MissionsScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { SettingsModal } from './components/settings/SettingsModal';

export const App: React.FC = () => {
  // State Initialization from Persistent Local Storage
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());
  const [showSplash, setShowSplash] = useState<boolean>(() => !settings.skipIntro);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getProfile());
  const [missions, setMissions] = useState<ExplorationMission[]>(() => storageService.getMissions());
  const [achievements, setAchievements] = useState<Achievement[]>(() => storageService.getAchievements());
  const [experiments, setExperiments] = useState<ScienceExperiment[]>(() => storageService.getExperiments());
  const [telemetry, setTelemetry] = useState<RoverTelemetry>(() => storageService.getRoverTelemetry());

  // Active Modals & Transitions
  const [activeExperiment, setActiveExperiment] = useState<ScienceExperiment | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [selectedRoverLocation, setSelectedRoverLocation] = useState<MartianLocation | null>(null);

  // Synchronize Audio Preferences
  useEffect(() => {
    soundManager.setSoundEnabled(settings.soundEnabled);
    soundManager.setVolumes(settings.sfxVolume, settings.ambientVolume);
  }, [settings]);

  // Handle Android Hardware Back Button
  useEffect(() => {
    let removeListener: (() => void) | undefined;
    try {
      const sub = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (activeExperiment) {
          setActiveExperiment(null);
        } else if (isSettingsOpen) {
          setIsSettingsOpen(false);
        } else if (currentScreen !== 'home') {
          setCurrentScreen('home');
        } else {
          CapacitorApp.exitApp();
        }
      });
      removeListener = () => {
        sub.then((s) => s.remove()).catch(() => {});
      };
    } catch {
      // Browser fallback
    }

    return () => {
      removeListener?.();
    };
  }, [activeExperiment, isSettingsOpen, currentScreen]);

  // Persist State Updates
  useEffect(() => {
    storageService.saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    storageService.saveMissions(missions);
  }, [missions]);

  useEffect(() => {
    storageService.saveAchievements(achievements);
  }, [achievements]);

  useEffect(() => {
    storageService.saveExperiments(experiments);
  }, [experiments]);

  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    storageService.saveRoverTelemetry(telemetry);
  }, [telemetry]);

  // Helper: Unlock an Achievement
  const unlockAchievement = useCallback((achievementId: string) => {
    setAchievements((prev) =>
      prev.map((a) => {
        if (a.id === achievementId && !a.unlocked) {
          soundManager.playAchievementFanfare();
          // Add XP reward
          setProfile((p) => ({
            ...p,
            xp: p.xp + a.xpReward,
            unlockedAchievementIds: [...p.unlockedAchievementIds, a.id]
          }));
          return { ...a, unlocked: true, unlockedAt: 'Sol 342' };
        }
        return a;
      })
    );
  }, []);

  // Update Rover Traveled Distance & Mission Checkpoints
  const handleRoverDistanceUpdate = useCallback((distanceM: number) => {
    setTelemetry((prev) => ({
      ...prev,
      distanceTraveledM: Math.floor(distanceM)
    }));

    setProfile((prev) => ({
      ...prev,
      totalDistanceTraveledM: Math.floor(prev.totalDistanceTraveledM + 0.1)
    }));

    // Check achievement: Rover Commander
    if (distanceM > 100) {
      unlockAchievement('rover-commander');
    }

    // Check mission objective: Mission 06
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === 'mission-06') {
          const updatedObjs = m.objectives.map((obj) => {
            if (obj.id === 'obj-6-1') {
              const cur = Math.min(150, Math.floor(distanceM));
              return { ...obj, current: cur, completed: cur >= 150 };
            }
            return obj;
          });
          const allDone = updatedObjs.every((o) => o.completed);
          return { ...m, objectives: updatedObjs, completed: allDone };
        }
        return m;
      })
    );
  }, [unlockAchievement]);

  // Handle Rover Events (sample drilled, camera toggled)
  const handleRoverMissionEvent = useCallback((type: string, value: number | string) => {
    if (type === 'sample_drilled') {
      // Update Mission 04
      setMissions((prev) =>
        prev.map((m) => {
          if (m.id === 'mission-04') {
            const updatedObjs = m.objectives.map((obj) => {
              if (obj.id === 'obj-4-1' || obj.id === 'obj-4-2') {
                return { ...obj, current: 1, completed: true };
              }
              return obj;
            });
            return { ...m, objectives: updatedObjs };
          }
          return m;
        })
      );
    } else if (type === 'camera_toggle') {
      // Update Mission 06
      setMissions((prev) =>
        prev.map((m) => {
          if (m.id === 'mission-06') {
            const updatedObjs = m.objectives.map((obj) => {
              if (obj.id === 'obj-6-2') {
                return { ...obj, current: 1, completed: true };
              }
              return obj;
            });
            return { ...m, objectives: updatedObjs };
          }
          return m;
        })
      );
    }
  }, []);

  // Location Transition: Globe -> Rover Simulator
  const handleExploreLocationFromGlobe = (loc: MartianLocation) => {
    setSelectedRoverLocation(loc);
    setCurrentScreen('rover');
    unlockAchievement('crater-explorer');

    // Update Profile Visited Sectors
    setProfile((prev) => ({
      ...prev,
      locationsVisitedCount: Math.min(6, prev.locationsVisitedCount + 1),
      explorationPoints: prev.explorationPoints + 150
    }));

    // Update Mission 01 & 02 checkpoints
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === 'mission-01') {
          const objs = m.objectives.map((o) => (o.id === 'obj-1-2' ? { ...o, current: 1, completed: true } : o));
          return { ...m, objectives: objs, completed: objs.every((x) => x.completed) };
        }
        if (m.id === 'mission-02' && loc.id === 'olympus-mons') {
          const objs = m.objectives.map((o) => ({ ...o, current: 1, completed: true }));
          return { ...m, objectives: objs, completed: true };
        }
        return m;
      })
    );
  };

  // Complete a Science Experiment
  const handleCompleteExperiment = (expId: string) => {
    setExperiments((prev) =>
      prev.map((e) => (e.id === expId ? { ...e, completed: true } : e))
    );

    const nextCompletedCount = experiments.filter((e) => e.completed || e.id === expId).length;

    setProfile((prev) => ({
      ...prev,
      experimentsCompletedCount: nextCompletedCount,
      xp: prev.xp + 200,
      explorationPoints: prev.explorationPoints + 100
    }));

    if (nextCompletedCount >= 3) {
      unlockAchievement('martian-scientist');
    }
    if (nextCompletedCount >= 5) {
      unlockAchievement('master-explorer');
    }

    // Check Mission 03 & 04 & 07 objectives
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === 'mission-07') {
          const objs = m.objectives.map((o) => {
            if (o.id === 'obj-7-3') {
              return { ...o, current: nextCompletedCount, completed: nextCompletedCount >= 5 };
            }
            if (expId === 'exp-gravity' && o.id === 'obj-7-1') return { ...o, current: 1, completed: true };
            if (expId === 'exp-temp' && o.id === 'obj-7-2') return { ...o, current: 1, completed: true };
            return o;
          });
          return { ...m, objectives: objs, completed: objs.every((x) => x.completed) };
        }
        return m;
      })
    );
  };

  // Reset Progress Handler
  const handleResetProgress = () => {
    storageService.resetAllProgress();
    setProfile(storageService.getProfile());
    setMissions(storageService.getMissions());
    setAchievements(storageService.getAchievements());
    setExperiments(storageService.getExperiments());
    setTelemetry(storageService.getRoverTelemetry());
    setIsSettingsOpen(false);
    setCurrentScreen('home');
  };

  // Render Splash Screen
  if (showSplash) {
    return <SplashScreen onStart={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-mars-deep text-mars-white overflow-hidden relative">
      {/* Top Application Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => {
          const next = !settings.soundEnabled;
          soundManager.setSoundEnabled(next);
          setSettings((s) => ({ ...s, soundEnabled: next }));
        }}
      />

      {/* Main Screen Content Viewport */}
      <main className="flex-1 relative overflow-hidden">
        {currentScreen === 'home' && (
          <HomeScreen
            profile={profile}
            missions={missions}
            achievements={achievements}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}

        {currentScreen === 'explore' && (
          <MarsGlobe
            onExploreLocation={handleExploreLocationFromGlobe}
            onBackToHome={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'rover' && (
          <RoverSimulator
            initialLocation={selectedRoverLocation}
            onDistanceUpdated={handleRoverDistanceUpdate}
            onMissionEvent={handleRoverMissionEvent}
          />
        )}

        {currentScreen === 'mission-control' && (
          <MissionControl
            telemetry={telemetry}
            completedMissionsCount={missions.filter((m) => m.completed).length}
            totalMissionsCount={missions.length}
            onNavigateToRover={() => setCurrentScreen('rover')}
            onNavigateToGlobe={() => setCurrentScreen('explore')}
          />
        )}

        {currentScreen === 'laboratory' && (
          <ScienceLab
            experiments={experiments}
            onOpenExperiment={(exp) => setActiveExperiment(exp)}
          />
        )}

        {currentScreen === 'missions' && (
          <MissionsScreen
            missions={missions}
            onSelectMission={() => {}}
            onLaunchMissionActivity={(m) => {
              if (m.category === 'rover') setCurrentScreen('rover');
              else if (m.category === 'science') setCurrentScreen('laboratory');
              else setCurrentScreen('explore');
            }}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            profile={profile}
            achievements={achievements}
            onUpdateProfile={(p) => setProfile(p)}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
      />

      {/* Virtual Experiment Interactive Modal */}
      {activeExperiment && (
        <VirtualExperiments
          experiment={activeExperiment}
          onClose={() => setActiveExperiment(null)}
          onComplete={handleCompleteExperiment}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={(s) => setSettings(s)}
          onClose={() => setIsSettingsOpen(false)}
          onResetProgress={handleResetProgress}
        />
      )}
    </div>
  );
};

