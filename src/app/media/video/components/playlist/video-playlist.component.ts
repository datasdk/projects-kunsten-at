import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoadingComponent } from '@/ui/loading/loading.component';
import { VideoItem } from '../../interfaces/video-item.interface';
import { VideoPlayerComponent } from '../player/video-player.component';

@Component({
  selector: 'app-video-playlist',
  standalone: true,
  templateUrl: './video-playlist.component.html',
  styleUrls: ['./video-playlist.component.scss'],
  imports: [CommonModule, IonicModule, RouterLink, LoadingComponent, VideoPlayerComponent]
})
export class VideoPlaylistComponent implements OnChanges, OnDestroy {
  @Input() videos: VideoItem[] = [];
  @Input() current = 0;
  @Input() loading = true;
  @Input() error: string | null = null;
  @Input() showAccessNotice = false;
  @Input() accessNoticeText = '';
  @Input() showLoginLink = false;
  @Input() canStartCourse = false;
  @Input() canFinishTask = false;
  @Output() currentChange = new EventEmitter<number>();
  @Output() closeAccessNotice = new EventEmitter<void>();
  @Output() startCourseRequested = new EventEmitter<void>();
  @Output() finishTaskRequested = new EventEmitter<void>();
  @ViewChild('track') track?: ElementRef<HTMLElement>;
  @ViewChildren(VideoPlayerComponent) players?: QueryList<VideoPlayerComponent>;

  private scrollTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['current'] || changes['videos']) {
      queueMicrotask(() => this.scrollToCurrent(false));
    }
  }

  ngOnDestroy(): void {
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
  }

  get currentVideo(): VideoItem | null {
    return this.videos[this.current] ?? null;
  }

  goTo(index: number, smooth = true): void {
    if (!this.track?.nativeElement || !this.videos.length) {
      return;
    }

    const next = Math.max(0, Math.min(index, this.videos.length - 1));
    this.players?.get(this.current)?.stop();
    this.currentChange.emit(next);
    this.track.nativeElement.scrollTo({
      left: this.track.nativeElement.clientWidth * next,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }

  onTrackScroll(event: Event): void {
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }

    this.scrollTimer = setTimeout(() => {
      const target = event.target as HTMLElement;
      const next = Math.round(target.scrollLeft / target.clientWidth);

      if (next !== this.current) {
        this.players?.get(this.current)?.stop();
        this.currentChange.emit(next);
      }
    }, 80);
  }

  private scrollToCurrent(smooth: boolean): void {
    if (!this.track?.nativeElement || !this.videos.length) {
      return;
    }

    this.track.nativeElement.scrollTo({
      left: this.track.nativeElement.clientWidth * this.current,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }
}
