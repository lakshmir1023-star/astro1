import React from 'react';
import { X, Volume2, VolumeX, Sliders, Monitor, RotateCcw, Info, ShieldCheck } from 'lucide-react';
import { AppSettings } from '../../types';
import { soundManager } from '../../services/audio';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClose: () => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onResetProgress
}) => {
  const toggleSound = () => {
    const next = !settings.soundEnabled;
    soundManager.setSoundEnabled(next);
    onUpdateSettings({ ...settings, soundEnabled: next });
  };

  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundManager.setVolumes(val, settings.ambientVolume);
    onUpdateSettings({ ...settings, sfxVolume: val });
  };

  const handleAmbientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundManager.setVolumes(settings.sfxVolume, val);
    onUpdateSettings({ ...settings, ambientVolume: val });
  };

  const handleQualityChange = (q: 'low' | 'medium' | 'high') => {
    soundManager.playClick();
    onUpdateSettings({ ...settings, graphicsQuality: q });
  };

  const handleToggleSkipIntro = () => {
    soundManager.playClick();
    onUpdateSettings({ ...settings, skipIntro: !settings.skipIntro });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none animate-in fade-in">
      <div className="w-full max-w-md glass-card rounded-3xl border border-mars-orange/40 max-h-[90vh] overflow-y-auto p-5 relative">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-mars-orange" />
            <h3 className="font-orbitron text-base font-bold text-mars-white">
              SIMULATION SETTINGS
            </h3>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1 rounded-full bg-white/5 hover:bg-white/15 text-mars-silver hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Controls */}
        <div className="space-y-3 mb-5">
          <h4 className="text-[10px] font-mono uppercase text-mars-gold tracking-wider">
            AUDIO & SOUND SYNTHESIS
          </h4>

          <div className="glass-panel p-3 rounded-2xl border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-mars-white font-medium">Master Audio & Sound FX</span>
              <button
                onClick={toggleSound}
                className={`p-2 rounded-xl transition-all ${
                  settings.soundEnabled ? 'bg-mars-orange text-white glow-orange' : 'bg-mars-secondary text-mars-silver'
                }`}
              >
                {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {settings.soundEnabled && (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-mars-silver">
                    <span>Sound Effects Volume</span>
                    <span>{Math.round(settings.sfxVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.sfxVolume}
                    onChange={handleSfxChange}
                    className="w-full accent-mars-orange"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-mars-silver">
                    <span>Cosmic Ambient Drone</span>
                    <span>{Math.round(settings.ambientVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.ambientVolume}
                    onChange={handleAmbientChange}
                    className="w-full accent-mars-orange"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Graphics Performance Preset */}
        <div className="space-y-3 mb-5">
          <h4 className="text-[10px] font-mono uppercase text-mars-gold tracking-wider">
            GRAPHICS & PERFORMANCE
          </h4>

          <div className="glass-panel p-3 rounded-2xl border border-white/5 space-y-2">
            <span className="text-xs text-mars-white font-medium block">WebGL Simulation Detail</span>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => handleQualityChange(q)}
                  className={`py-2 rounded-xl text-xs font-mono uppercase border transition-all ${
                    settings.graphicsQuality === q
                      ? 'bg-mars-orange text-white border-mars-orange glow-orange font-bold'
                      : 'glass-panel text-mars-silver border-white/10'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-mars-silver mt-1">
              Low quality reduces shadow cascades and dust particle count for optimal Android battery endurance.
            </p>
          </div>
        </div>

        {/* Gameplay Preferences */}
        <div className="space-y-3 mb-5">
          <h4 className="text-[10px] font-mono uppercase text-mars-gold tracking-wider">
            PREFERENCES
          </h4>

          <div className="glass-panel p-3 rounded-2xl border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs text-mars-white font-medium block">Skip Intro on App Launch</span>
              <span className="text-[10px] text-mars-silver">Open straight to Home Dashboard</span>
            </div>
            <input
              type="checkbox"
              checked={settings.skipIntro}
              onChange={handleToggleSkipIntro}
              className="w-4 h-4 accent-mars-orange rounded"
            />
          </div>
        </div>

        {/* About ASTROQUEST */}
        <div className="glass-panel p-3.5 rounded-2xl border border-white/5 space-y-1 text-xs mb-4">
          <div className="flex items-center gap-1.5 text-mars-orange font-orbitron font-bold">
            <Info className="w-3.5 h-3.5" />
            <span>ASTROQUEST – MARS EXPLORATION SIMULATOR</span>
          </div>
          <p className="text-mars-silver">
            Developed for Google Antigravity &bull; Package: com.astroquest.marsimulator
          </p>
          <div className="flex items-center justify-between text-[10px] font-mono text-mars-silver/70 pt-1">
            <span>Version: 1.0.0 (Release-Ready)</span>
            <span>Target: Android APK</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="w-full py-2.5 rounded-xl font-orbitron font-bold text-xs uppercase bg-mars-orange text-white glow-orange active:scale-95 transition-all"
        >
          SAVE & CLOSE
        </button>
      </div>
    </div>
  );
};

