import React, { useState } from 'react';
import { 
  User, Award, Trophy, Compass, FlaskConical, RotateCcw, 
  Check, Edit3, ShieldAlert, Rocket, Globe, Zap 
} from 'lucide-react';
import { UserProfile, Achievement } from '../../types';
import { soundManager } from '../../services/audio';

interface ProfileScreenProps {
  profile: UserProfile;
  achievements: Achievement[];
  onUpdateProfile: (profile: UserProfile) => void;
  onResetProgress: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  achievements,
  onUpdateProfile,
  onResetProgress
}) => {
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(profile.explorerName);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const saveName = () => {
    if (tempName.trim()) {
      soundManager.playClick();
      onUpdateProfile({ ...profile, explorerName: tempName.trim() });
    }
    setIsEditingName(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-mars-deep text-mars-white overflow-y-auto pb-24 p-4 select-none">
      {/* Profile Header Card */}
      <div className="glass-card p-5 rounded-3xl border border-mars-orange/30 mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-mars-orange/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-mars-red to-mars-orange p-0.5 glow-orange">
              <div className="w-full h-full rounded-2xl bg-mars-secondary flex items-center justify-center">
                <Rocket className="w-8 h-8 text-mars-orange" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-mars-gold text-black font-orbitron font-bold text-[9px]">
              LVL {Math.floor(profile.xp / 300) + 1}
            </div>
          </div>

          {/* Name & Title */}
          <div className="flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-mars-secondary border border-mars-orange/50 rounded-lg px-2 py-1 text-sm text-mars-white font-orbitron focus:outline-none w-full"
                  maxLength={24}
                  autoFocus
                />
                <button
                  onClick={saveName}
                  className="p-1 rounded-lg bg-mars-orange text-white"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="font-orbitron text-base font-bold text-mars-white">
                  {profile.explorerName}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-mars-silver hover:text-mars-orange"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-xs font-mono text-mars-gold mt-0.5">{profile.rankTitle}</p>
            <p className="text-[10px] font-mono text-mars-silver mt-1">
              Deep Space Astronaut ID: AQ-{Math.abs(profile.xp * 7 % 9999).toString().padStart(4, '0')}
            </p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-4 pt-3 border-t border-white/5">
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-mars-silver">EXPEDITION XP</span>
            <span className="text-mars-gold font-bold">{profile.xp} / {(Math.floor(profile.xp / 300) + 1) * 300} XP</span>
          </div>
          <div className="w-full h-2 rounded-full bg-mars-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-mars-red to-mars-gold rounded-full transition-all duration-500"
              style={{ width: `${(profile.xp % 300) / 3}%` }}
            />
          </div>
        </div>
      </div>

      {/* Explorer Career Stats Grid */}
      <h3 className="font-orbitron text-xs font-bold text-mars-silver uppercase tracking-wider mb-2">
        CAREER STATISTICS
      </h3>
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        <div className="glass-panel p-3 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 text-mars-silver mb-1">
            <Trophy className="w-4 h-4 text-mars-gold" />
            <span className="text-[10px] font-mono uppercase">COMPLETED MISSIONS</span>
          </div>
          <span className="font-orbitron font-bold text-lg text-mars-white">
            {profile.completedMissionsCount}
          </span>
        </div>

        <div className="glass-panel p-3 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 text-mars-silver mb-1">
            <Compass className="w-4 h-4 text-mars-orange" />
            <span className="text-[10px] font-mono uppercase">ROVER DISTANCE</span>
          </div>
          <span className="font-orbitron font-bold text-lg text-mars-white">
            {profile.totalDistanceTraveledM} m
          </span>
        </div>

        <div className="glass-panel p-3 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 text-mars-silver mb-1">
            <FlaskConical className="w-4 h-4 text-mars-green" />
            <span className="text-[10px] font-mono uppercase">EXPERIMENTS RUN</span>
          </div>
          <span className="font-orbitron font-bold text-lg text-mars-white">
            {profile.experimentsCompletedCount}
          </span>
        </div>

        <div className="glass-panel p-3 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 text-mars-silver mb-1">
            <Globe className="w-4 h-4 text-nebula-blue" />
            <span className="text-[10px] font-mono uppercase">SECTORS EXPLORED</span>
          </div>
          <span className="font-orbitron font-bold text-lg text-mars-white">
            {profile.locationsVisitedCount}
          </span>
        </div>
      </div>

      {/* Achievements Showcase (Martian Gold styling) */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-orbitron text-xs font-bold text-mars-silver uppercase tracking-wider">
          MARTIAN GOLD BADGES ({unlockedCount}/{achievements.length})
        </h3>
      </div>

      <div className="space-y-2.5 mb-6">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
              ach.unlocked
                ? 'glass-card border-mars-gold/40 glow-gold'
                : 'glass-panel border-white/5 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  ach.unlocked
                    ? 'bg-gradient-to-tr from-mars-gold to-mars-orange text-black'
                    : 'bg-mars-secondary text-mars-silver'
                }`}
              >
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-orbitron text-xs font-bold text-mars-white">
                    {ach.title}
                  </h4>
                  {ach.unlocked && (
                    <span className="text-[9px] font-mono text-mars-gold uppercase font-bold">
                      UNLOCKED
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-mars-silver mt-0.5 leading-snug">
                  {ach.description}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-mars-gold">+{ach.xpReward} XP</span>
          </div>
        ))}
      </div>

      {/* Reset Progress Confirmation Dialog */}
      <div className="pt-2">
        {showResetConfirm ? (
          <div className="glass-card p-4 rounded-2xl border border-mars-red text-center space-y-3 animate-in fade-in">
            <div className="flex items-center justify-center gap-2 text-mars-red font-orbitron text-xs font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>CONFIRM MISSION DATA RESET?</span>
            </div>
            <p className="text-xs text-mars-silver">
              This will permanently delete all completed missions, telemetry odometer logs, and unlocked badges.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  soundManager.playAchievementFanfare();
                  setShowResetConfirm(false);
                  onResetProgress();
                }}
                className="flex-1 py-2 rounded-xl bg-mars-red text-white font-orbitron text-xs font-bold uppercase active:scale-95 transition-all"
              >
                CONFIRM RESET
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-xl glass-panel text-mars-silver font-orbitron text-xs font-bold uppercase active:scale-95 transition-all"
              >
                CANCEL
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              soundManager.playClick();
              setShowResetConfirm(true);
            }}
            className="w-full py-2.5 rounded-xl border border-white/10 text-mars-silver/70 hover:text-mars-red hover:border-mars-red/40 text-xs font-mono uppercase flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET EXPLORATION PROGRESS</span>
          </button>
        )}
      </div>
    </div>
  );
};

