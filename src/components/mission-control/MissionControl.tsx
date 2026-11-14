import React, { useState, useEffect } from 'react';
import { 
  Radio, Activity, Battery, Compass, Clock, ShieldCheck, 
  Wifi, AlertCircle, RefreshCw, Layers, Cpu, Database 
} from 'lucide-react';
import { RoverTelemetry } from '../../types';
import { soundManager } from '../../services/audio';

interface MissionControlProps {
  telemetry: RoverTelemetry;
  completedMissionsCount: number;
  totalMissionsCount: number;
  onNavigateToRover: () => void;
  onNavigateToGlobe: () => void;
}

export const MissionControl: React.FC<MissionControlProps> = ({
  telemetry,
  completedMissionsCount,
  totalMissionsCount,
  onNavigateToRover,
  onNavigateToGlobe
}) => {
  const [pulseData, setPulseData] = useState<number[]>([42, 45, 48, 47, 52, 50, 56, 53, 58, 62, 60, 65]);
  const [activeTab, setActiveTab] = useState<'telemetry' | 'systems' | 'uplink'>('telemetry');

  // Animated telemetry feed simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseData((prev) => {
        const nextVal = Math.min(100, Math.max(20, prev[prev.length - 1] + (Math.random() * 12 - 6)));
        return [...prev.slice(1), Math.round(nextVal)];
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const completionPct = Math.round((completedMissionsCount / totalMissionsCount) * 100);

  return (
    <div className="w-full h-full flex flex-col bg-mars-deep text-mars-white overflow-y-auto pb-24 p-4 select-none">
      {/* Top Banner with Simulation Notice */}
      <div className="flex items-center justify-between py-2 border-b border-mars-orange/20 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-mars-green animate-ping" />
          <span className="font-orbitron font-bold text-sm tracking-wider text-mars-white">
            MISSION CONTROL CENTER
          </span>
        </div>
        <div className="px-2.5 py-0.5 rounded-full bg-mars-red/20 border border-mars-red/50 text-[10px] font-mono text-mars-orange uppercase">
          SIMULATION TELEMETRY DATA
        </div>
      </div>

      {/* Mission Identifier & Status Matrix */}
      <div className="glass-card p-4 rounded-2xl border border-mars-orange/30 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono text-mars-silver uppercase tracking-wider block">
              PRIMARY DIRECTIVE
            </span>
            <h2 className="font-orbitron text-lg font-bold text-mars-white">
              PROJECT ODYSSEY // EXPEDITION 42
            </h2>
            <p className="text-xs text-mars-silver mt-0.5">
              Deep Space Network Node: Goldstone / Canberra Relay
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-mars-green/20 border border-mars-green/40 text-mars-green text-xs font-mono font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>IN PROGRESS</span>
          </div>
        </div>

        {/* Overall Mission Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-mars-silver">EXPEDITION COMPLETION</span>
            <span className="text-mars-gold font-bold">{completionPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-mars-secondary overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-mars-red to-mars-orange rounded-full transition-all duration-500 glow-orange"
              style={{ width: `${Math.max(8, completionPct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('telemetry');
          }}
          className={`flex-1 py-2 text-xs font-orbitron font-semibold rounded-xl border transition-all ${
            activeTab === 'telemetry'
              ? 'bg-mars-orange text-white border-mars-orange glow-orange'
              : 'glass-panel text-mars-silver border-white/10'
          }`}
        >
          Telemetry
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('systems');
          }}
          className={`flex-1 py-2 text-xs font-orbitron font-semibold rounded-xl border transition-all ${
            activeTab === 'systems'
              ? 'bg-mars-orange text-white border-mars-orange glow-orange'
              : 'glass-panel text-mars-silver border-white/10'
          }`}
        >
          Vehicle Systems
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('uplink');
          }}
          className={`flex-1 py-2 text-xs font-orbitron font-semibold rounded-xl border transition-all ${
            activeTab === 'uplink'
              ? 'bg-mars-orange text-white border-mars-orange glow-orange'
              : 'glass-panel text-mars-silver border-white/10'
          }`}
        >
          Orbital Uplink
        </button>
      </div>

      {/* Tab 1: Live Telemetry & Animated Sparkline Graph */}
      {activeTab === 'telemetry' && (
        <div className="space-y-4">
          {/* Animated Power Telemetry Graph */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-mars-orange animate-pulse" />
                <span className="font-orbitron text-xs font-bold text-mars-white">
                  SOLAR ARRAY POWER DRAW (WATTS)
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-mars-gold">
                {pulseData[pulseData.length - 1] * 7} W
              </span>
            </div>

            {/* SVG Telemetry Chart */}
            <div className="w-full h-28 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF7139" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FF7139" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal reference grid lines */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                <line x1="0" y1="40" x2="300" y2="40" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />

                {/* Filled area */}
                <polygon
                  fill="url(#chartGrad)"
                  points={`0,80 ${pulseData
                    .map((val, idx) => `${(idx / (pulseData.length - 1)) * 300},${80 - (val / 100) * 70}`)
                    .join(' ')} 300,80`}
                />
                {/* Stroke line */}
                <polyline
                  fill="none"
                  stroke="#FF7139"
                  strokeWidth="2.5"
                  points={pulseData
                    .map((val, idx) => `${(idx / (pulseData.length - 1)) * 300},${80 - (val / 100) * 70}`)
                    .join(' ')}
                />
              </svg>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-mars-silver mt-1">
              <span>T-60s</span>
              <span>T-30s</span>
              <span>LIVE CURRENT</span>
            </div>
          </div>

          {/* Key Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="glass-panel p-3 rounded-2xl border border-white/5">
              <div className="flex items-center gap-1.5 text-mars-silver mb-1">
                <Compass className="w-4 h-4 text-mars-orange" />
                <span className="font-mono text-[10px] uppercase">COORDINATES</span>
              </div>
              <span className="font-orbitron font-bold text-mars-white block text-sm">
                {telemetry.latitude.toFixed(2)}°N, {telemetry.longitude.toFixed(2)}°E
              </span>
              <span className="text-[10px] font-mono text-mars-silver">Elevation: {telemetry.elevationM} m</span>
            </div>

            <div className="glass-panel p-3 rounded-2xl border border-white/5">
              <div className="flex items-center gap-1.5 text-mars-silver mb-1">
                <Battery className="w-4 h-4 text-mars-green" />
                <span className="font-mono text-[10px] uppercase">ENERGY RESERVE</span>
              </div>
              <span className="font-orbitron font-bold text-mars-green block text-sm">
                {telemetry.batteryPercent}% (MMC Li-Ion)
              </span>
              <span className="text-[10px] font-mono text-mars-silver">Thermal State: Nominal</span>
            </div>

            <div className="glass-panel p-3 rounded-2xl border border-white/5">
              <div className="flex items-center gap-1.5 text-mars-silver mb-1">
                <Clock className="w-4 h-4 text-mars-gold" />
                <span className="font-mono text-[10px] uppercase">EXPLORATION TIME</span>
              </div>
              <span className="font-orbitron font-bold text-mars-gold block text-sm">
                {telemetry.explorationTimeSec} seconds
              </span>
              <span className="text-[10px] font-mono text-mars-silver">Total Sols: Sol 342</span>
            </div>

            <div className="glass-panel p-3 rounded-2xl border border-white/5">
              <div className="flex items-center gap-1.5 text-mars-silver mb-1">
                <Wifi className="w-4 h-4 text-mars-orange" />
                <span className="font-mono text-[10px] uppercase">SIGNAL LATENCY</span>
              </div>
              <span className="font-orbitron font-bold text-mars-white block text-sm">
                {telemetry.signalDelaySec}s round-trip
              </span>
              <span className="text-[10px] font-mono text-mars-silver">Direct-To-Earth UHF</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Vehicle Systems Matrix */}
      {activeTab === 'systems' && (
        <div className="space-y-3">
          {[
            { system: 'Rocker-Bogie Chassis', status: 'ONLINE', load: 'Nominal', icon: Cpu },
            { system: 'Alpha Particle X-Ray (APXS)', status: 'STANDBY', load: 'Calibrated', icon: Database },
            { system: 'Stereo Mastcam-Z Optical Array', status: 'ACTIVE', load: '60 fps 4K', icon: Radio },
            { system: 'Regolith Percussion Drill', status: 'READY', load: 'Bits intact', icon: Layers },
            { system: 'Environmental Station (REMS)', status: 'LOGGING', load: '-24°C / 6.1 mbar', icon: Activity }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel p-3.5 rounded-2xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-mars-secondary border border-white/10 text-mars-orange">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-orbitron text-xs font-bold text-mars-white">{item.system}</h4>
                    <span className="text-[10px] font-mono text-mars-silver">{item.load}</span>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-mars-green/20 border border-mars-green/40 text-mars-green text-[10px] font-mono font-bold">
                  {item.status}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Orbital Uplink */}
      {activeTab === 'uplink' && (
        <div className="glass-card p-5 rounded-2xl border border-white/10 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-mars-orange/20 border border-mars-orange/40 flex items-center justify-center text-mars-orange glow-orange animate-pulse">
            <Radio className="w-6 h-6" />
          </div>
          <h3 className="font-orbitron text-sm font-bold text-mars-white">
            MARS RECONNAISSANCE ORBITER (MRO)
          </h3>
          <p className="text-xs text-mars-silver leading-relaxed">
            Relay pass window open for the next 28 minutes. High-resolution HIRISE stereoscopic terrain maps synchronized with current coordinates.
          </p>
          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onNavigateToRover();
              }}
              className="flex-1 py-2.5 rounded-xl font-orbitron font-bold text-xs uppercase bg-mars-orange text-white glow-orange active:scale-95 transition-all"
            >
              Resume Rover
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onNavigateToGlobe();
              }}
              className="flex-1 py-2.5 rounded-xl font-orbitron font-bold text-xs uppercase glass-panel border border-white/20 text-white active:scale-95 transition-all"
            >
              Orbital Globe
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

