// Web Audio API procedural sound engine - 100% offline and low-latency
class SoundManager {
  private ctx: AudioContext | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private motorOsc: OscillatorNode | null = null;
  private motorGain: GainNode | null = null;
  private isSoundEnabled: boolean = true;
  private sfxVol: number = 0.7;
  private ambientVol: number = 0.35;
  private isMotorPlaying: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.isSoundEnabled = enabled;
    if (!enabled) {
      this.stopAmbient();
      this.stopRoverMotor();
    } else {
      this.startAmbient();
    }
  }

  public setVolumes(sfx: number, ambient: number) {
    this.sfxVol = Math.max(0, Math.min(1, sfx));
    this.ambientVol = Math.max(0, Math.min(1, ambient));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(this.ambientVol * 0.15, this.ctx.currentTime, 0.1);
    }
  }

  // Cinematic ambient space drone
  public startAmbient() {
    if (!this.isSoundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.ambientOsc) return;

      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110.5, this.ctx.currentTime); // Slight detune

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(this.ambientVol * 0.15, this.ctx.currentTime + 3);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc2.start();

      this.ambientOsc = osc;
      this.ambientGain = gain;
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  public stopAmbient() {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          this.ambientOsc?.stop();
          this.ambientOsc?.disconnect();
          this.ambientOsc = null;
          this.ambientGain = null;
        }, 500);
      } catch {
        this.ambientOsc = null;
        this.ambientGain = null;
      }
    }
  }

  // Button interaction sound (futuristic cyber tap)
  public playClick() {
    if (!this.isSoundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(this.sfxVol * 0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {}
  }

  // Telemetry ping
  public playTelemetryPing() {
    if (!this.isSoundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      gain.gain.setValueAtTime(this.sfxVol * 0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {}
  }

  // Mission complete / Achievement fanfare
  public playAchievementFanfare() {
    if (!this.isSoundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [440, 554.37, 659.25, 880]; // A major chord arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        const startTime = this.ctx!.currentTime + idx * 0.1;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(this.sfxVol * 0.22, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.55);
      });
    } catch {}
  }

  // Rover motor simulation sound
  public updateRoverMotor(isMoving: boolean, speedNormalized: number) {
    if (!this.isSoundEnabled) {
      this.stopRoverMotor();
      return;
    }
    try {
      this.initContext();
      if (!this.ctx) return;

      if (!isMoving) {
        this.stopRoverMotor();
        return;
      }

      if (!this.isMotorPlaying || !this.motorOsc) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, this.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(280, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(this.sfxVol * 0.12, this.ctx.currentTime + 0.15);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        this.motorOsc = osc;
        this.motorGain = gain;
        this.isMotorPlaying = true;
      }

      if (this.motorOsc && this.ctx) {
        const targetFreq = 70 + speedNormalized * 110;
        this.motorOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
      }
    } catch {}
  }

  public stopRoverMotor() {
    if (this.motorGain && this.ctx && this.isMotorPlaying) {
      try {
        this.motorGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
        setTimeout(() => {
          this.motorOsc?.stop();
          this.motorOsc?.disconnect();
          this.motorOsc = null;
          this.motorGain = null;
          this.isMotorPlaying = false;
        }, 120);
      } catch {
        this.motorOsc = null;
        this.motorGain = null;
        this.isMotorPlaying = false;
      }
    }
  }

  // Scientific sample scanner sound
  public playScanner() {
    if (!this.isSoundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1800, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(this.sfxVol * 0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.42);
    } catch {}
  }
}

export const soundManager = new SoundManager();

