import React, { useState } from 'react';
import { ScienceExperiment } from '../../types';
import { soundManager } from '../../services/audio';
import { X, CheckCircle2, Play, RotateCcw, ArrowRight, ShieldCheck } from 'lucide-react';

interface VirtualExperimentsProps {
  experiment: ScienceExperiment;
  onClose: () => void;
  onComplete: (expId: string) => void;
}

export const VirtualExperiments: React.FC<VirtualExperimentsProps> = ({
  experiment,
  onClose,
  onComplete
}) => {
  const [step, setStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [expCompleted, setExpCompleted] = useState<boolean>(experiment.completed);

  // Exp 1: Soil State
  const [selectedSoilType, setSelectedSoilType] = useState<string>('Jezero Clay Delta');
  // Exp 2: Temperature State
  const [selectedLocation, setSelectedLocation] = useState<'Equator' | 'Mid' | 'Poles'>('Equator');
  const [tempCycle, setTempCycle] = useState<'Day' | 'Night'>('Day');
  // Exp 3: Gravity Drop State
  const [dropHeight] = useState<number>(10);
  const [dropTriggered, setDropTriggered] = useState<boolean>(false);
  const [earthTime, setEarthTime] = useState<number>(0);
  const [marsTime, setMarsTime] = useState<number>(0);
  // Exp 4: Rock State
  const [selectedRock, setSelectedRock] = useState<string>('Volcanic Tholeiitic Basalt');
  // Exp 5: Water/Ice State
  const [sublimationPressure, setSublimationPressure] = useState<number>(6.1);
  const [chamberTemp, setChamberTemp] = useState<number>(-20);

  // Complete action
  const handleFinish = () => {
    soundManager.playAchievementFanfare();
    setExpCompleted(true);
    onComplete(experiment.id);
  };

  // Run Gravity Drop Simulation
  const runGravityDrop = () => {
    soundManager.playClick();
    setDropTriggered(true);
    setIsProcessing(true);

    // Earth: t = sqrt(2h / g) = sqrt(20 / 9.8) = ~1.43s
    // Mars: t = sqrt(20 / 3.72) = ~2.32s
    setTimeout(() => {
      setEarthTime(1.43);
      setMarsTime(2.32);
      setIsProcessing(false);
      soundManager.playTelemetryPing();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none animate-in fade-in">
      <div className="w-full max-w-lg glass-card rounded-3xl border border-mars-orange/40 max-h-[90vh] overflow-y-auto p-5 relative">
        {/* Modal Top Bar */}
        <div className="flex items-start justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase bg-mars-orange/20 border border-mars-orange/40 text-mars-orange px-2 py-0.5 rounded">
              VIRTUAL EXPERIMENT #{experiment.number}
            </span>
            <h3 className="font-orbitron text-lg font-bold text-mars-white mt-1">
              {experiment.title}
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

        {/* Objective */}
        <div className="my-3 glass-panel p-3 rounded-xl border border-white/5 text-xs">
          <span className="text-[10px] font-mono text-mars-gold block uppercase">SCIENTIFIC OBJECTIVE</span>
          <p className="text-mars-silver mt-0.5">{experiment.objective}</p>
        </div>

        {/* INTERACTIVE WORKBENCH PER EXPERIMENT */}
        <div className="my-4">
          {/* EXPERIMENT 1: SOIL ANALYSIS */}
          {experiment.id === 'exp-soil' && (
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-mars-silver block uppercase">SELECT CORE SAMPLE:</span>
              <div className="grid grid-cols-2 gap-2">
                {['Jezero Clay Delta', 'Gale Basaltic Dust', 'Elysium Volcanic Ash', 'Olympus Mons Scarp'].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedSoilType(s);
                    }}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                      selectedSoilType === s
                        ? 'bg-mars-orange text-white border-mars-orange glow-orange font-bold'
                        : 'glass-panel text-mars-silver border-white/10'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Spectrometer Results */}
              <div className="glass-panel p-3 rounded-xl border border-white/10 space-y-2 mt-3">
                <span className="font-orbitron text-xs font-bold text-mars-gold block">
                  APXS SPECTROMETRY BREAKDOWN
                </span>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-mars-silver">Iron(III) Oxide (Fe₂O₃):</span>
                    <span className="text-mars-orange font-bold">18.4% (Rust Pigment)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mars-silver">Silicon Dioxide (SiO₂):</span>
                    <span className="text-mars-white font-bold">44.8% (Silicates)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mars-silver">Perchlorates (ClO₄⁻):</span>
                    <span className="text-mars-red font-bold">0.8% (Toxic Oxidizer)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mars-silver">Hydrated Clay Minerals:</span>
                    <span className="text-mars-green font-bold">Detected (Smectite)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EXPERIMENT 2: TEMPERATURE ANALYSIS */}
          {experiment.id === 'exp-temp' && (
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-mars-silver block uppercase">SELECT LOCATION & CYCLE:</span>
              <div className="flex gap-2">
                {(['Equator', 'Mid', 'Poles'] as const).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedLocation(loc);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono border transition-all ${
                      selectedLocation === loc
                        ? 'bg-mars-orange text-white border-mars-orange glow-orange'
                        : 'glass-panel text-mars-silver border-white/10'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                {(['Day', 'Night'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      soundManager.playClick();
                      setTempCycle(c);
                    }}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                      tempCycle === c
                        ? 'bg-mars-red text-white border-mars-red font-bold'
                        : 'glass-panel text-mars-silver border-white/10'
                    }`}
                  >
                    {c} Solar Phase
                  </button>
                ))}
              </div>

              {/* Thermal Calculation Card */}
              <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] font-mono text-mars-silver block">SIMULATED SURFACE TEMPERATURE</span>
                <span className="font-orbitron text-2xl font-bold text-mars-white my-1 block">
                  {selectedLocation === 'Equator'
                    ? tempCycle === 'Day' ? '+20°C (+68°F)' : '-73°C (-99°F)'
                    : selectedLocation === 'Mid'
                    ? tempCycle === 'Day' ? '-5°C (+23°F)' : '-88°C (-126°F)'
                    : tempCycle === 'Day' ? '-60°C (-76°F)' : '-125°C (-193°F)'}
                </span>
                <span className="text-xs text-mars-silver block">
                  Diurnal Swing: ~93°C delta due to near-vacuum 6.1 mbar atmosphere.
                </span>
              </div>
            </div>
          )}

          {/* EXPERIMENT 3: GRAVITY DROP TEST */}
          {experiment.id === 'exp-gravity' && (
            <div className="space-y-3">
              <div className="glass-panel p-3 rounded-xl border border-white/10 text-xs">
                <span className="font-mono text-[10px] text-mars-silver uppercase block">DROP CHAMBER SETUP:</span>
                <p className="text-mars-white mt-1">Height: <span className="font-bold text-mars-gold">{dropHeight}.0 meters</span> (Vacuum Gate)</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="glass-panel p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] font-mono text-mars-silver block">EARTH (1.0 G = 9.80 m/s²)</span>
                  <span className="font-orbitron text-lg font-bold text-mars-white my-1 block">
                    {earthTime ? `${earthTime}s` : '--'}
                  </span>
                  <span className="text-[10px] text-mars-silver font-mono">Formula: √(2h/g)</span>
                </div>
                <div className="glass-panel p-3 rounded-xl border border-mars-orange/30">
                  <span className="text-[10px] font-mono text-mars-orange block">MARS (0.38 G = 3.72 m/s²)</span>
                  <span className="font-orbitron text-lg font-bold text-mars-orange my-1 block">
                    {marsTime ? `${marsTime}s` : '--'}
                  </span>
                  <span className="text-[10px] text-mars-silver font-mono">+62% longer fall time</span>
                </div>
              </div>

              <button
                onClick={runGravityDrop}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl font-orbitron font-bold text-xs uppercase bg-mars-orange text-white glow-orange active:scale-95 transition-all"
              >
                {isProcessing ? 'CALIBRATING LASER GATES...' : 'TRIGGER SIMULTANEOUS DROP'}
              </button>
            </div>
          )}

          {/* EXPERIMENT 4: ROCK CLASSIFICATION */}
          {experiment.id === 'exp-rocks' && (
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-mars-silver block uppercase">SELECT PETROLOGIC SPECIMEN:</span>
              <div className="space-y-2">
                {[
                  { name: 'Volcanic Tholeiitic Basalt', desc: 'Fine-grained extrusive igneous rock from Tharsis eruptions.' },
                  { name: 'Sedimentary Mudstone', desc: 'Clay and silt deposited in Gale Crater lacustrine paleolake.' },
                  { name: 'Polymict Impact Breccia', desc: 'Fused shock-melt fragments from Noachian asteroid bombardment.' }
                ].map((r) => (
                  <button
                    key={r.name}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedRock(r.name);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left border text-xs transition-all ${
                      selectedRock === r.name
                        ? 'bg-mars-orange text-white border-mars-orange glow-orange'
                        : 'glass-panel text-mars-silver border-white/10'
                    }`}
                  >
                    <span className="font-orbitron font-bold block">{r.name}</span>
                    <span className="text-[11px] opacity-80">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* EXPERIMENT 5: WATER & ICE SUBLIMATION */}
          {experiment.id === 'exp-water' && (
            <div className="space-y-3">
              <div className="glass-panel p-3 rounded-xl border border-white/10">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-mars-silver">CHAMBER PRESSURE:</span>
                  <span className="text-mars-gold font-bold">{sublimationPressure} mbar</span>
                </div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-mars-silver">ICE TEMPERATURE:</span>
                  <span className="text-mars-white font-bold">{chamberTemp}°C</span>
                </div>
              </div>

              <div className="glass-card p-3 rounded-xl border border-mars-green/30 text-xs text-mars-silver space-y-1">
                <span className="font-orbitron font-bold text-mars-green block">THERMODYNAMIC OBSERVATION:</span>
                <p>
                  At 6.1 mbar, solid H₂O ice warms directly into gaseous water vapor (sublimation). Liquid water requires high local atmospheric pressure or dissolved salts to remain stable on Mars.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Scientific Explanation Summary */}
        <div className="glass-panel p-3 rounded-xl border border-mars-orange/20 text-xs my-3">
          <span className="text-[10px] font-mono text-mars-orange uppercase font-bold block mb-1">
            SCIENTIFIC SUMMARY & PEER REVIEW:
          </span>
          <p className="text-mars-silver leading-relaxed">
            {experiment.scientificExplanation}
          </p>
        </div>

        {/* Action Button: Complete Experiment */}
        <div className="pt-2">
          {expCompleted ? (
            <div className="w-full py-3 rounded-xl bg-mars-green/20 border border-mars-green/50 text-mars-green font-orbitron font-bold text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>EXPERIMENT LOGGED IN SCIENTIFIC ARCHIVE</span>
            </div>
          ) : (
            <button
              onClick={handleFinish}
              className="w-full py-3 rounded-xl font-orbitron font-bold text-xs uppercase bg-gradient-to-r from-mars-red to-mars-orange text-white glow-orange active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>SUBMIT RESULTS & RECORD DATA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

