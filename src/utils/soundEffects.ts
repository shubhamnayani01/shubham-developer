// AudioManager - completely silent / zero voice & zero audio output
class AudioManager {
  public isMuted: boolean = true;

  public toggleMute(): boolean {
    this.isMuted = true;
    return true;
  }

  public startAmbientDrone() {
    // Zero audio
  }

  public stopAmbientDrone() {
    // Zero audio
  }

  public playClick(_freq = 800) {
    // Zero audio
  }

  public playChime() {
    // Zero audio
  }

  public playHoverTone() {
    // Zero audio
  }

  public playHover() {
    // Zero audio
  }
}

export const soundFx = new AudioManager();


