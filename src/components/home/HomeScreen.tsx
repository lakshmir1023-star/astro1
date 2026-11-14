import React from 'react';
import { 
  Compass, Gauge, Radio, FlaskConical, ChevronRight, 
  Sparkles, Award, Target, Zap, ArrowUpRight 
} from 'lucide-react';
import { Screen, UserProfile, ExplorationMission, Achievement } from '../../types';
import { soundManager } from '../../services/audio';

interface HomeScreenProps {
  profile: UserProfile;
  missions: ExplorationMission[];
  achievements: Achievement[];
  onNavigate: (screen: Screen) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  missions,
  achievements,
  onNavigate
}) => {
  const nextMission = missions.find((m) => !m.completed) || missions[0];
  const latestAchievement = achievements.find((a) => a.unlocked) || achievements[0];
  const completedMissions = missions.filter((m) => m.completed).length;

  return (
    <div className="w-full h-full flex flex-col bg-mars-deep text-mars-white overflow-y-auto pb-24 p-4 select-none">
      {/* Welcome Banner Card */}
      <div className="glass-card p-5 rounded-3xl border border-mars-orange/30 mb-5 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-mars-orange/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-mars-red/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="z-10">
            <span className="text-[10px] font-mono text-mars-gold uppercase tracking-wider block mb-0.5">
              PLANETARY COMMAND ACTIVE &bull; SOL 342
            </span>
            <h1 className="font-orbitron text-xl sm:text-2xl font-bold text-mars-white">
              {profile.explorerName}
            </h1>
            <p className="text-xs text-mars-silver mt-1">
              Ready for Mars exploration and scientific deployment.
            </p>
          </div>

          {/* Mini Animated Mars Preview Sphere */}
          <div
            onClick={() => {
              soundManager.playClick();
              onNavigate('explore');
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full cursor-pointer relative flex-shrink-0 glow-orange group transition-transform active:scale-95"
          >
            <div
              className="w-full h-full rounded-full overflow-hidden shadow-[inset_-8px_-8px_16px_rgba(0,0,0,0.8),inset_4px_4px_10px_rgba(255,113,57,0.5)]"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #FF7139 0%, #B64232 50%, #4a150a 100%)'
              }}
            >
              <div className="absolute top-1 left-2 w-6 h-2 rounded-full bg-white/70 blur-[1px]" />
            </div>
            <span className="absolute -bottom-2 -right-1 px-1.5 py-0.2 rounded-full bg-mars-orange text-[8px] font-mono font-bold text-white uppercase">
              3D GLOBE
            </span>
          </div>
        </div>

        {/* Quick Career XP strip */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-mars-silver">
            <Zap className="w-3.5 h-3.5 text-mars-gold" />
            <span>LEVEL {Math.floor(profile.xp / 300) + 1} {profile.rankTitle.toUpperCase()}</span>
          </div>
          <span className="text-mars-gold font-bold">{profile.xp} XP</span>
        </div>
      </div>

      {/* Primary Simulator Launchpad (4 Core Features) */}
      <div className="mb-5">
        <h2 className="font-orbitron text-xs font-bold text-mars-silver uppercase tracking-wider mb-2.5">
          SIMULATION CORE MODULES
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {/* 1. Explore Mars */}
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('explore');
            }}
            className="group glass-card p-4 rounded-2xl border border-white/10 hover:border-mars-orange/60 text-left transition-all active:scale-95 relative overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-mars-red to-mars-orange flex items-center justify-center text-white mb-3 glow-orange">
              <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            </div>
            <h3 className="font-orbitron text-sm font-bold text-mars-white group-hover:text-mars-orange transition-colors">
              Explore Mars
            </h3>
            <p className="text-[11px] text-mars-silver mt-1 leading-snug">
              Interactive 3D planetary globe with 6 prime landing sites.
            </p>
            <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 text-mars-silver group-hover:text-mars-orange transition-colors" />
          </button>

          {/* 2. Rover Simulator */}
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('rover');
            }}
            className="group glass-card p-4 rounded-2xl border border-white/10 hover:border-mars-orange/60 text-left transition-all active:scale-95 relative overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-mars-orange to-mars-gold flex items-center justify-center text-black mb-3 glow-gold">
              <Gauge className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-orbitron text-sm font-bold text-mars-white group-hover:text-mars-orange transition-colors">
              Rover Simulator
            </h3>
            <p className="text-[11px] text-mars-silver mt-1 leading-snug">
              Drive 6-wheel rover with Mastcam & sample drill.
            </p>
            <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 text-mars-silver group-hover:text-mars-orange transition-colors" />
          </button>

          {/* 3. Mission Control */}
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('mission-control');
            }}
            className="group glass-card p-4 rounded-2xl border border-white/10 hover:border-mars-orange/60 text-left transition-all active:scale-95 relative overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-nebula-blue to-mars-orange flex items-center justify-center text-white mb-3 glow-orange">
              <Radio className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-orbitron text-sm font-bold text-mars-white group-hover:text-mars-orange transition-colors">
              Mission Control
            </h3>
            <p className="text-[11px] text-mars-silver mt-1 leading-snug">
              Live telemetry charts, system health & DSN link.
            </p>
            <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 text-mars-silver group-hover:text-mars-orange transition-colors" />
          </button>

          {/* 4. Science Laboratory */}
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('laboratory');
            }}
            className="group glass-card p-4 rounded-2xl border border-white/10 hover:border-mars-orange/60 text-left transition-all active:scale-95 relative overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-mars-green to-mars-gold flex items-center justify-center text-black mb-3 glow-green">
              <FlaskConical className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-orbitron text-sm font-bold text-mars-white group-hover:text-mars-orange transition-colors">
              Science Lab
            </h3>
            <p className="text-[11px] text-mars-silver mt-1 leading-snug">
              5 educational modules & interactive experiments.
            </p>
            <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 text-mars-silver group-hover:text-mars-orange transition-colors" />
          </button>
        </div>
      </div>

      {/* Active Mission Progress Card */}
      {nextMission && (
        <div className="glass-card p-4 rounded-2xl border border-mars-orange/30 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-mars-orange bg-mars-red/20 px-2 py-0.5 rounded font-bold uppercase">
              ACTIVE DIRECTIVE &bull; MISSION {nextMission.number}
            </span>
            <span className="text-xs font-mono text-mars-gold">+{nextMission.rewardXp} XP</span>
          </div>

          <h3 className="font-orbitron text-sm font-bold text-mars-white">
            {nextMission.title}: {nextMission.codename}
          </h3>
          <p className="text-xs text-mars-silver mt-1 line-clamp-2">
            {nextMission.briefing}
          </p>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-[11px] font-mono text-mars-silver">
              Sector: {nextMission.startingLocation}
            </span>
            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('missions');
              }}
              className="flex items-center gap-1 text-xs font-orbitron font-bold text-mars-orange hover:text-white"
            >
              <span>VIEW MISSION</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Daily Exploration Challenge */}
      <div className="glass-panel p-4 rounded-2xl border border-mars-gold/30 mb-5 relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-mars-gold/20 text-mars-gold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-mars-gold uppercase font-bold">
                DAILY EXPLORATION CHALLENGE
              </span>
              <span className="text-[9px] font-mono bg-mars-secondary px-1.5 py-0.5 rounded text-mars-silver">
                RESETS 12H
              </span>
            </div>
            <h4 className="font-orbitron text-xs font-bold text-mars-white mt-1">
              Traverse 100 Virtual Meters in Jezero Crater
            </h4>
            <p className="text-[11px] text-mars-silver mt-0.5">
              Accumulate distance while operating the rover simulator under Martian gravity.
            </p>
          </div>
        </div>
      </div>

      {/* Latest Achievement Showcase */}
      {latestAchievement && (
        <div className="glass-panel p-3.5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-mars-gold to-mars-orange flex items-center justify-center text-black glow-gold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] font-mono text-mars-gold uppercase font-bold block">
                LATEST ACHIEVEMENT
              </span>
              <span className="font-orbitron text-xs font-bold text-mars-white">
                {latestAchievement.title}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('profile');
            }}
            className="text-xs font-mono text-mars-silver hover:text-mars-orange"
          >
            VIEW ALL
          </button>
        </div>
      )}
    </div>
  );
};

