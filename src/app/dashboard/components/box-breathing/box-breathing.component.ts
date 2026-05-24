import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';

type BreathingState = 'stopped' | 'playing';

@Component({
  selector: 'app-box-breathing',
  standalone: true,
  templateUrl: './box-breathing.component.html',
  styleUrls: ['./box-breathing.component.scss'],
  imports: [CommonModule, IonicModule]
})
export class BoxBreathingComponent implements OnDestroy {
  progress = 0;
  state: BreathingState = 'stopped';
  error = false;

  readonly perimeter = 360;
  readonly audioSrc = 'https://media.kunsten-at.dk/lyd/boxbreathing/box-breathing.mp3';

  private readonly cycleDurationMs = 16000;
  private audio?: HTMLAudioElement;
  private animationFrame?: number;

  get isPlaying(): boolean {
    return this.state === 'playing';
  }

  get dashOffset(): number {
    return this.perimeter * (1 - this.progress);
  }

  get phase(): string {
    const step = Math.floor(this.progress * 4);
    return ['Træk ind', 'Hold', 'Pust ud', 'Hold'][Math.min(step, 3)];
  }

  get primaryIcon(): string {
    return this.isPlaying ? 'stop' : 'play';
  }

  get primaryLabel(): string {
    return this.isPlaying ? 'Stop' : 'Afspil';
  }

  toggle(): void {
    if (this.isPlaying) {
      this.stop();
      return;
    }

    const audio = this.getAudio();
    this.error = false;
    this.state = 'playing';
    this.tick();

    audio.play().catch((error) => {
      console.error('Box breathing audio failed', error);
      this.error = true;
      this.stop();
    });
  }

  stop(): void {
    this.state = 'stopped';
    this.progress = 0;

    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
  }

  ngOnDestroy(): void {
    this.stop();

    if (this.audio) {
      this.audio.src = '';
      this.audio.load();
      this.audio = undefined;
    }
  }

  private getAudio(): HTMLAudioElement {
    if (this.audio) {
      return this.audio;
    }

    this.audio = new Audio(this.audioSrc);
    this.audio.preload = 'auto';
    this.audio.loop = true;
    this.audio.addEventListener('ended', () => {
      this.progress = 0;
    });

    return this.audio;
  }

  private tick(): void {
    if (!this.audio || !this.isPlaying) {
      return;
    }

    const elapsedMs = (this.audio.currentTime * 1000) % this.cycleDurationMs;
    this.progress = elapsedMs / this.cycleDurationMs;
    this.animationFrame = requestAnimationFrame(() => this.tick());
  }
}
