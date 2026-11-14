import React, { useState } from 'react';
import { 
  Atom, Globe2, Wind, Mountain, Droplet, Moon, 
  FlaskConical, CheckCircle2, ChevronRight, Play, ArrowRight 
} from 'lucide-react';
import { ScienceExperiment } from '../../types';
import { soundManager } from '../../services/audio';

interface ScienceLabProps {
  experiments: ScienceExperiment[];
  onOpenExperiment: (exp: ScienceExperiment) => void;
}

export const ScienceLab: React.FC<ScienceLabProps> = ({
  experiments,
  onOpenExperiment
}) => {
  const [activeSection, setActiveSection] = useState<'planetary' | 'atmosphere' | 'geology' | 'water' | 'moons' | 'experiments'>('planetary');

  const completedExpCount = experiments.filter((e) => e.completed).length;

  return (
    <div className="w-full h-full flex flex-col bg-mars-deep text-mars-white overflow-y-auto pb-24 p-4 select-none">
      {/* Header Banner */}
      <div className="flex items-center justify-between py-2 border-b border-mars-orange/20 mb-4">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-mars-orange" />
          <div>
            <h2 className="font-orbitron font-bold text-sm tracking-wider text-mars-white">
              MARS SCIENCE LABORATORY
            </h2>
            <p className="text-[10px] font-mono text-mars-silver">
              Planetary Science &bull; Astrobiology &bull; Geophysics
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveSection('experiments');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-orbitron font-semibold transition-all ${
            activeSection === 'experiments'
              ? 'bg-mars-orange text-white border-mars-orange glow-orange'
              : 'glass-panel text-mars-gold border-mars-gold/40'
          }`}
        >
          <Atom className="w-3.5 h-3.5" />
          <span>VIRTUAL LAB ({completedExpCount}/5)</span>
        </button>
      </div>

      {/* Horizontal Scrollable Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {[
          { id: 'planetary', label: 'Planetary Science', icon: Globe2 },
          { id: 'atmosphere', label: 'Atmosphere', icon: Wind },
          { id: 'geology', label: 'Geology', icon: Mountain },
          { id: 'water', label: 'Water Discovery', icon: Droplet },
          { id: 'moons', label: 'Martian Moons', icon: Moon },
          { id: 'experiments', label: 'Interactive Experiments', icon: FlaskConical }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundManager.playClick();
                setActiveSection(item.id as typeof activeSection);
              }}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isActive
                  ? 'bg-mars-orange text-white border-mars-orange glow-orange'
                  : 'glass-panel text-mars-silver border-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODULE A: PLANETARY SCIENCE */}
      {activeSection === 'planetary' && (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-2xl border border-white/10">
            <h3 className="font-orbitron text-sm font-bold text-mars-gold mb-1">
              PLANETARY COMPARISON & PHYSICAL CONSTANTS
            </h3>
            <p className="text-xs text-mars-silver leading-relaxed mb-4">
              Mars is the fourth planet from the Sun and the second smallest planet in the Solar System, having a diameter roughly half that of Earth.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-mars-silver block">DIAMETER / RADIUS</span>
                <span className="font-orbitron font-bold text-mars-white block text-sm">6,779 km</span>
                <span className="text-[10px] text-mars-silver">53% of Earth</span>
              </div>
              <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-mars-silver block">PLANETARY MASS</span>
                <span className="font-orbitron font-bold text-mars-white block text-sm">6.42 × 10²³ kg</span>
                <span className="text-[10px] text-mars-silver">10.7% of Earth mass</span>
              </div>
              <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-mars-silver block">SURFACE GRAVITY</span>
                <span className="font-orbitron font-bold text-mars-orange block text-sm">3.72 m/s²</span>
                <span className="text-[10px] text-mars-silver">37.9% of Earth 1G</span>
              </div>
              <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-mars-silver block">ROTATION PERIOD (SOL)</span>
                <span className="font-orbitron font-bold text-mars-white block text-sm">24h 37m 22s</span>
                <span className="text-[10px] text-mars-silver">Only 39m longer than Earth</span>
              </div>
              <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-mars-silver block">ORBITAL PERIOD</span>
                <span className="font-orbitron font-bold text-mars-white block text-sm">687 Earth Days</span>
                <span className="text-[10px] text-mars-silver">1.88 Earth tropical years</span>
              </div>
              <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-mars-silver block">AVG DISTANCE TO SUN</span>
                <span className="font-orbitron font-bold text-mars-white block text-sm">227.9M km</span>
                <span className="text-[10px] text-mars-silver">1.524 Astronomical Units (AU)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE B: ATMOSPHERE */}
      {activeSection === 'atmosphere' && (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-2xl border border-white/10">
            <h3 className="font-orbitron text-sm font-bold text-mars-orange mb-2">
              ATMOSPHERIC COMPOSITION & DYNAMICS
            </h3>
            <p className="text-xs text-mars-silver leading-relaxed mb-4">
              Mars possesses a rarefied atmosphere with an average surface pressure of only 6.1 millibars (0.088 psi)—less than 1% of Earth\'s sea level pressure.
            </p>

            {/* Gas Distribution Bars */}
            <div className="space-y-2 mb-4">
              {[
                { gas: 'Carbon Dioxide (CO₂)', pct: '95.32%', bar: 95, color: 'bg-mars-red' },
                { gas: 'Nitrogen (N₂)', pct: '2.6%', bar: 15, color: 'bg-nebula-blue' },
                { gas: 'Argon (Ar)', pct: '1.9%', bar: 12, color: 'bg-mars-gold' },
                { gas: 'Oxygen (O₂)', pct: '0.13%', bar: 4, color: 'bg-mars-green' },
                { gas: 'Water Vapor / Trace', pct: '0.05%', bar: 2, color: 'bg-mars-white' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-mars-silver">{item.gas}</span>
                    <span className="text-mars-white font-bold">{item.pct}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-mars-secondary overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.bar}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-panel p-3 rounded-xl border border-white/5 text-xs text-mars-silver space-y-1">
              <span className="font-mono text-mars-orange font-bold block">GLOBAL DUST STORMS:</span>
              <p>
                During southern summer perihelion, intense solar heating drives dust storms that can grow to envelop the entire planet for weeks, blocking over 99% of direct sunlight from reaching solar-powered landers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODULE C: GEOLOGY */}
      {activeSection === 'geology' && (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-2xl border border-white/10">
            <h3 className="font-orbitron text-sm font-bold text-mars-gold mb-2">
              MARTIAN GEOLOGY & CRUSTAL FORMATIONS
            </h3>
            <p className="text-xs text-mars-silver leading-relaxed mb-4">
              Mars is a differentiated planet featuring a metallic iron-nickel core, a silicate mantle, and an ancient crust enriched in iron, magnesium, aluminum, calcium, and potassium.
            </p>

            <div className="space-y-3">
              <div className="glass-panel p-3 rounded-xl border border-white/5">
                <h4 className="font-orbitron text-xs font-bold text-mars-white">MARTIAN CRUSTAL DICHOTOMY</h4>
                <p className="text-xs text-mars-silver mt-1">
                  A dramatic difference exists between the rugged, ancient cratered highlands of the southern hemisphere and the smooth, lower volcanic plains of the northern lowlands.
                </p>
              </div>
              <div className="glass-panel p-3 rounded-xl border border-white/5">
                <h4 className="font-orbitron text-xs font-bold text-mars-white">VOLCANIC PROVINCES (THARSIS & ELYSIUM)</h4>
                <p className="text-xs text-mars-silver mt-1">
                  The Tharsis bulge houses massive shield volcanoes that grew to immense sizes because Mars lacks active plate tectonics, allowing volcanic hot spots to erupt in the same crustal position for billions of years.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE D: WATER DISCOVERY */}
      {activeSection === 'water' && (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-2xl border border-white/10">
            <h3 className="font-orbitron text-sm font-bold text-mars-green mb-2">
              HYDROLOGICAL HISTORY & SUBSURFACE ICE
            </h3>
            <p className="text-xs text-mars-silver leading-relaxed mb-4">
              Ample geomorphological evidence confirms that liquid water once flowed extensively across early Mars, carving massive outflow channels, branching river networks, and deep lake deltas.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="glass-panel p-3 rounded-xl border border-white/5">
                <span className="font-orbitron font-bold text-mars-white block">ANCIENT OCEANS</span>
                <p className="text-mars-silver mt-1">Oceanus Borealis may have covered up to 36% of the northern hemisphere 3.8 billion years ago.</p>
              </div>
              <div className="glass-panel p-3 rounded-xl border border-white/5">
                <span className="font-orbitron font-bold text-mars-white block">POLAR RESERVOIRS</span>
                <p className="text-mars-silver mt-1">Permanent water ice caps exceed 3 km in thickness, holding enough water to submerge the planet under 35 meters.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE E: MARTIAN MOONS */}
      {activeSection === 'moons' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="glass-card p-4 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-orbitron font-bold text-sm text-mars-white">PHOBOS ("Fear")</h4>
                <span className="text-[10px] font-mono text-mars-gold bg-mars-gold/20 px-2 py-0.5 rounded">INNER MOON</span>
              </div>
              <p className="text-xs text-mars-silver leading-relaxed">
                An irregularly shaped potato-like moon with mean dimensions 26 × 22 × 18 km. It orbits just 6,000 km above Mars, completing an orbit every 7 hours 39 minutes. Tidal deceleration will cause it to break up into a ring system in ~50 million years.
              </p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-orbitron font-bold text-sm text-mars-white">DEIMOS ("Dread")</h4>
                <span className="text-[10px] font-mono text-mars-silver bg-white/10 px-2 py-0.5 rounded">OUTER MOON</span>
              </div>
              <p className="text-xs text-mars-silver leading-relaxed">
                Measuring approximately 15 × 12 × 11 km, Deimos orbits further out at 23,460 km with a 30.3-hour orbital period. Its surface is smoother due to a thick blanket of regolith that fills impact craters.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIRTUAL SCIENTIFIC EXPERIMENTS LIST */}
      {activeSection === 'experiments' && (
        <div className="space-y-3">
          <div className="glass-panel p-3 rounded-2xl border border-mars-orange/30 flex items-center justify-between">
            <span className="text-xs font-mono text-mars-silver">LAB EXPERIMENTS STATUS</span>
            <span className="font-orbitron text-xs font-bold text-mars-gold">
              {completedExpCount} / {experiments.length} COMPLETED
            </span>
          </div>

          {experiments.map((exp) => (
            <div
              key={exp.id}
              className={`glass-card p-4 rounded-2xl border transition-all ${
                exp.completed ? 'border-mars-green/50' : 'border-white/10 hover:border-mars-orange/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-mars-orange bg-mars-red/20 px-2 py-0.5 rounded">
                      EXPERIMENT 0{exp.number}
                    </span>
                    <span className="text-[10px] font-mono text-mars-silver">+{exp.rewardXp} XP</span>
                  </div>
                  <h4 className="font-orbitron text-sm font-bold text-mars-white mt-1">
                    {exp.title}
                  </h4>
                  <p className="text-xs text-mars-silver mt-1 leading-relaxed">
                    {exp.objective}
                  </p>
                </div>

                {exp.completed ? (
                  <div className="p-1 rounded-full bg-mars-green/20 text-mars-green flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>DONE</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onOpenExperiment(exp);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mars-orange text-white font-orbitron text-xs font-bold glow-orange active:scale-95 transition-all"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>START</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

