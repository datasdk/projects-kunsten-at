import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@/auth/services/auth.service';
import { SoundPlaylist } from '../../interfaces/sound-playlist.interface';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-audio-list',
  standalone: true,
  templateUrl: './audio-list.component.html',
  styleUrls: ['./audio-list.component.scss'],
  imports: [CommonModule, ...IONIC_STANDALONE_IMPORTS]
})
export class AudioListComponent implements OnChanges {
  @Input() playlist: SoundPlaylist | null = null;
  @Input() loading = true;
  @Input() error: string | null = null;
  @Input() showAccessNotice = false;
  @Input() accessNoticeText = '';
  @Input() showLoginLink = false;
  @Output() closeAccessNotice = new EventEmitter<void>();

  imageLoaded: Record<string, boolean> = {};

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['playlist']) {
      return;
    }

    const nextMap: Record<string, boolean> = {};
    this.playlist?.sounds?.forEach((sound, index) => {
      nextMap[this.itemKey(index)] = false;
    });
    this.imageLoaded = nextMap;
  }

  onImageLoaded(index: number): void {
    this.imageLoaded[this.itemKey(index)] = true;
  }

  isImageLoaded(index: number): boolean {
    return !!this.imageLoaded[this.itemKey(index)];
  }

  openSound(index: number): void {
    void this.router.navigate(['/audiobook/player'], {
      queryParams: {
        id: this.playlist?.id,
        index
      }
    });
  }

  async login(): Promise<void> {
    await this.auth.setLoginRedirect('/home/audiobook');
    await this.router.navigateByUrl('/auth/login');
  }

  private itemKey(index: number): string {
    return `audio-${index}`;
  }
}
