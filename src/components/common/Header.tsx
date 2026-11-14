import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Settings as SettingsIcon, Signal, Battery, Radio } from 'lucide-react';
import { soundManager } from '../../services/audio';

interface HeaderProps {
  onOpenSettings: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  soundEnabled,
  onToggleSound
}) => {
  const [missionTime, setMissionTime] = useState<string>('00:00:00');
  const [batteryLevel] = useState<number>(94);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
      const hours = String(Math.floor(elapsedSec / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((elapsedSec % 3600) / 60)).padStart(2, '0');
      const seconds = String(elapsedSec % 60).padStart(2, '0');
      setMissionTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="safe-top w-full px-4 py-2 flex items-center justify-between glass-panel-subtle border-b border-mars-orange/20 z-40">
      {/* Brand & Mission Status */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-mars-red to-mars-orange p-[1.5px] glow-orange">
          <div className="w-full h-full rounded-full bg-mars-deep flex items-center justify-center">
            <Radio className="w-4 h-4 text-mars-orange animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-orbitron font-bold text-sm tracking-wider text-mars-white">
              ASTRO<span className="text-mars-orange">QUEST</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-mars-red/30 border border-mars-red/50 text-mars-orange font-mono">
              SOL 342
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-mars-silver font-mono">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-mars-green animate-ping inline-block"></span>
              MET {missionTime}
            </span>
          </div>
        </div>
      </div>

      {/* Telemetry quick icons & Controls */}
      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-mars-silver bg-mars-secondary/80 px-2 py-1 rounded border border-white/5">
          <Signal className="w-3.5 h-3.5 text-mars-green" />
          <span>742s DELAY</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-mars-silver bg-mars-secondary/80 px-2 py-1 rounded border border-white/5">
          <Battery className="w-3.5 h-3.5 text-mars-gold" />
          <span>{batteryLevel}%</span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => {
            soundManager.playClick();
            onToggleSound();
          }}
          className="p-1.5 rounded-lg bg-mars-nebula/80 hover:bg-mars-nebula text-mars-silver hover:text-mars-orange transition-colors border border-white/10 active:scale-95"
          title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-mars-orange" />
          ) : (
            <VolumeX className="w-4 h-4 text-mars-silver/60" />
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenSettings();
          }}
          className="p-1.5 rounded-lg bg-mars-nebula/80 hover:bg-mars-nebula text-mars-silver hover:text-mars-white transition-colors border border-white/10 active:scale-95"
          title="Settings"
          aria-label="Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

