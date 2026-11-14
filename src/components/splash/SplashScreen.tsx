import React, { useEffect, useState } from 'react';
import { Rocket, FastForward } from 'lucide-react';
import { soundManager } from '../../services/audio';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  const [stage, setStage] = useState<number>(1); // 1: stars, 2: planet, 3: logo, 4: tagline & button

  useEffect(() => {
    soundManager.startAmbient();

    const t1 = setTimeout(() => setStage(2), 700);
    const t2 = setTimeout(() => setStage(3), 1600);
    const t3 = setTimeout(() => setStage(4), 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleStart = () => {
    soundManager.playAchievementFanfare();
    onStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-mars-deep p-6 overflow-hidden select-none">
      {/* Dynamic Starfield Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="stars-layer absolute inset-0 opacity-70 animate-pulse-slow">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-mars-white"
              style={{
                top: `${(i * 37) % 100}%`,
                left: `${(i * 61) % 100}%`,
                width: `${(i % 3) + 1}px`,
                height: `${(i % 3) + 1}px`,
                opacity: 0.3 + ((i % 5) * 0.15)
              }}
            />
          ))}
        </div>
        {/* Subtle red nebula gradient in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-mars-red/15 blur-[90px] pointer-events-none" />
      </div>

      {/* Top controls: Skip Intro */}
      <div className="w-full flex justify-end z-10 pt-2 safe-top">
        <button
          onClick={() => {
            soundManager.playClick();
            onStart();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mars-secondary/70 border border-white/10 text-xs text-mars-silver hover:text-mars-orange transition-all active:scale-95"
        >
          <span>Skip Intro</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Stage: Animated Mars & Logo Reveal */}
      <div className="flex flex-col items-center justify-center my-auto z-10 text-center max-w-sm">
        {/* 3D Animated CSS/Canvas Mars Planet */}
        <div
          className={`relative w-44 h-44 sm:w-52 sm:h-52 mb-6 rounded-full transition-all duration-1000 transform ${
            stage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          {/* Outer Atmospheric Rim Glow */}
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-mars-orange/30 to-mars-red/40 blur-lg animate-pulse-slow" />

          {/* Mars Sphere */}
          <div
            className="w-full h-full rounded-full relative overflow-hidden shadow-[inset_-25px_-25px_50px_rgba(0,0,0,0.9),inset_10px_10px_30px_rgba(255,113,57,0.4)]"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #FF7139 0%, #B64232 45%, #662215 80%, #1a0805 100%)'
            }}
          >
            {/* Crater & canyon texture overlays */}
            <div className="absolute top-1/4 left-1/3 w-16 h-8 rounded-full border border-black/30 bg-black/15 blur-[1px] rotate-12" />
            <div className="absolute top-1/2 right-1/4 w-24 h-12 rounded-full border border-black/20 bg-black/20 blur-[2px] -rotate-6" />
            <div className="absolute bottom-1/4 left-1/4 w-12 h-12 rounded-full border border-black/30 bg-black/25 blur-[1px]" />
            {/* Polar Ice Cap */}
            <div className="absolute -top-1 left-1/3 w-14 h-4 rounded-full bg-white/70 blur-[1px]" />
          </div>
        </div>

        {/* Logo Reveal */}
        <div
          className={`transition-all duration-1000 transform ${
            stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-mars-red/20 border border-mars-red/40 text-[11px] font-mono text-mars-orange mb-2">
            SIMULATION CLEARANCE VERIFIED
          </div>
          <h1 className="font-orbitron text-4xl sm:text-5xl font-extrabold tracking-wider text-mars-white drop-shadow-[0_0_20px_rgba(255,113,57,0.5)]">
            ASTRO<span className="text-mars-orange">QUEST</span>
          </h1>
        </div>

        {/* Tagline */}
        <p
          className={`font-orbitron text-xs sm:text-sm tracking-widest text-mars-gold uppercase mt-2 mb-8 transition-all duration-1000 transform ${
            stage >= 4 ? 'opacity-100 translate-y-0 text-glow-gold' : 'opacity-0 translate-y-4'
          }`}
        >
          EXPLORE BEYOND EARTH.
        </p>

        {/* START YOUR MISSION Button */}
        <div
          className={`w-full transition-all duration-1000 transform ${
            stage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <button
            onClick={handleStart}
            className="w-full group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-orbitron font-bold text-sm tracking-wider uppercase text-white bg-gradient-to-r from-mars-red via-mars-orange to-mars-red bg-size-200 shadow-[0_0_25px_rgba(255,113,57,0.5)] hover:shadow-[0_0_35px_rgba(255,113,57,0.8)] active:scale-95 transition-all overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Rocket className="w-5 h-5 text-white animate-bounce" />
            <span>START YOUR MISSION</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center z-10 pb-4 safe-bottom">
        <p className="text-[11px] text-mars-silver/60 font-mono">
          NASA / JPL / ESA SIMULATION ARCHIVE &bull; v1.0.0
        </p>
      </div>
    </div>
  );
};

