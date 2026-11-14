import React, { useState } from 'react';
import { Award, CheckCircle2, ChevronRight, Compass, ShieldAlert, Sparkles, Trophy } from 'lucide-react';
import { ExplorationMission } from '../../types';
import { soundManager } from '../../services/audio';

interface MissionsScreenProps {
  missions: ExplorationMission[];
  onSelectMission: (mission: ExplorationMission) => void;
  onLaunchMissionActivity: (mission: ExplorationMission) => void;
}

export const MissionsScreen: React.FC<MissionsScreenProps> = ({
  missions,
  onSelectMission,
  onLaunchMissionActivity
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [expandedMissionId, setExpandedMissionId] = useState<string | null>(missions[0]?.id || null);

  const completedCount = missions.filter((m) => m.completed).length;

  const filteredMissions = missions.filter((m) => {
    if (activeFilter === 'pending') return !m.completed;
    if (activeFilter === 'completed') return m.completed;
    return true;
  });

  return (
    <div className="w-full h-full flex flex-col bg-mars-deep text-mars-white overflow-y-auto pb-24 p-4 select-none">
      {/* Top Banner */}
      <div className="flex items-center justify-between py-2 border-b border-mars-orange/20 mb-4">
        <div>
          <h2 className="font-orbitron font-bold text-sm tracking-wider text-mars-white">
            EXPLORATION MISSIONS
          </h2>
          <p className="text-[10px] font-mono text-mars-silver">
            Planetary Directives &bull; Command Roster
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl glass-panel border border-mars-gold/40 text-mars-gold font-orbitron text-xs font-bold">
          <Trophy className="w-4 h-4" />
          <span>{completedCount} / {missions.length} DONE</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4">
        {(['all', 'pending', 'completed'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => {
              soundManager.playClick();
              setActiveFilter(filter);
            }}
            className={`flex-1 py-1.5 text-xs font-orbitron font-semibold uppercase rounded-xl border transition-all ${
              activeFilter === filter
                ? 'bg-mars-orange text-white border-mars-orange glow-orange'
                : 'glass-panel text-mars-silver border-white/10'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Mission Cards List */}
      <div className="space-y-3">
        {filteredMissions.map((mission) => {
          const isExpanded = expandedMissionId === mission.id;
          return (
            <div
              key={mission.id}
              className={`glass-card rounded-2xl border transition-all overflow-hidden ${
                mission.completed
                  ? 'border-mars-green/50'
                  : isExpanded
                  ? 'border-mars-orange/60 shadow-lg'
                  : 'border-white/10 hover:border-mars-orange/40'
              }`}
            >
              {/* Mission Card Header */}
              <div
                onClick={() => {
                  soundManager.playClick();
                  setExpandedMissionId(isExpanded ? null : mission.id);
                }}
                className="p-4 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-orbitron font-bold text-sm border ${
                      mission.completed
                        ? 'bg-mars-green/20 border-mars-green text-mars-green'
                        : 'bg-mars-secondary border-mars-orange/40 text-mars-orange'
                    }`}
                  >
                    {mission.completed ? <CheckCircle2 className="w-5 h-5" /> : mission.number}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-mars-silver uppercase">
                        {mission.codename}
                      </span>
                      <span className="text-[10px] font-mono text-mars-gold">+{mission.rewardXp} XP</span>
                    </div>
                    <h3 className="font-orbitron text-sm font-bold text-mars-white mt-0.5">
                      {mission.title}
                    </h3>
                  </div>
                </div>

                <ChevronRight
                  className={`w-5 h-5 text-mars-silver transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
              </div>

              {/* Expanded Details Body */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-3 text-xs animate-in slide-in-from-top-2">
                  {/* Briefing */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-mars-silver block mb-1">
                      MISSION BRIEFING:
                    </span>
                    <p className="text-mars-white/90 leading-relaxed bg-black/20 p-2.5 rounded-xl border border-white/5">
                      {mission.briefing}
                    </p>
                  </div>

                  {/* Objectives Checkpoints */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-mars-silver block mb-1">
                      OBJECTIVES CHECKLIST:
                    </span>
                    <div className="space-y-1.5">
                      {mission.objectives.map((obj) => (
                        <div
                          key={obj.id}
                          className="flex items-center justify-between p-2 rounded-xl glass-panel border border-white/5"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                obj.completed ? 'bg-mars-green' : 'bg-mars-orange animate-pulse'
                              }`}
                            />
                            <span className={obj.completed ? 'text-mars-silver line-through' : 'text-mars-white'}>
                              {obj.description}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-mars-gold">
                            {obj.current} / {obj.target} {obj.unit || ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Launch Mission Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        soundManager.playAchievementFanfare();
                        onLaunchMissionActivity(mission);
                      }}
                      className="w-full py-2.5 rounded-xl font-orbitron font-bold text-xs uppercase bg-gradient-to-r from-mars-red to-mars-orange text-white glow-orange active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <span>DEPLOY TO MISSION ZONE</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

