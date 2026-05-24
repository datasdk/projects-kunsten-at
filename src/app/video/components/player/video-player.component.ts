import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { VimeoService } from '../../services/vimeo.service';

@Component({
  selector: 'app-video-player',
  standalone: true,
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  imports: [CommonModule, IonicModule]
})
export class VideoPlayerComponent implements OnChanges {
  @Input({ required: true }) url = '';
  @Input() active = false;
  @ViewChild('player') player?: ElementRef<HTMLIFrameElement>;

  safeUrl: SafeResourceUrl | null = null;
  loading = true;
  isReady = false;
  isPlaying = false;

  constructor(
    private sanitizer: DomSanitizer,
    private vimeo: VimeoService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['url']) {
      this.loading = true;
      this.isReady = false;
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.vimeo.buildEmbedUrl(this.url));
    }

    if (changes['active'] && !this.active) {
      this.stop();
    }
  }

  onLoad(): void {
    this.isReady = true;
    window.setTimeout(() => {
      this.loading = false;
    }, 350);
  }

  togglePlay(): void {
    if (this.loading) {
      return;
    }

    if (this.isPlaying) {
      this.pause();
      return;
    }

    this.play();
  }

  play(): void {
    this.vimeo.post(this.player?.nativeElement, { method: 'play' });
    this.isPlaying = true;
  }

  pause(): void {
    this.vimeo.post(this.player?.nativeElement, { method: 'pause' });
    this.isPlaying = false;
  }

  stop(): void {
    this.vimeo.post(this.player?.nativeElement, { method: 'pause' });
    this.vimeo.post(this.player?.nativeElement, { method: 'setCurrentTime', value: 0 });
    this.isPlaying = false;
  }
}
