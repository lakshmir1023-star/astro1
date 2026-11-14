import React from 'react';
import { Home, Compass, Gauge, Award, User } from 'lucide-react';
import { Screen } from '../../types';
import { soundManager } from '../../services/audio';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const tabs = [
    { id: 'home' as Screen, label: 'Home', icon: Home },
    { id: 'explore' as Screen, label: 'Explore', icon: Compass },
    { id: 'rover' as Screen, label: 'Rover', icon: Gauge },
    { id: 'missions' as Screen, label: 'Missions', icon: Award },
    { id: 'profile' as Screen, label: 'Profile', icon: User }
  ];

  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-40 bg-mars-deep/90 backdrop-blur-md border-t border-mars-orange/20 px-2 py-1">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                onNavigate(tab.id);
              }}
              className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'text-mars-orange scale-105'
                  : 'text-mars-silver/70 hover:text-mars-white active:scale-95'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-1 rounded-full bg-mars-orange glow-orange animate-pulse" />
              )}
              <Icon className={`w-5 h-5 mb-0.5 transition-transform ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,113,57,0.8)]' : ''}`} />
              <span className={`text-[10px] font-medium tracking-tight ${isActive ? 'font-semibold text-mars-white' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

