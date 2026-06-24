import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@/auth/services/auth.service';
import { AudioPlayerComponent } from '@/media/audio/components/player/audio-player.component';
import { SoundItem } from '../../interfaces/sound-item.interface';
import { AudiobookService } from '../../services/audiobook.service';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-audio-player-page',
  standalone: true,
  templateUrl: './audio-player.page.html',
  styleUrls: ['./audio-player.page.scss'],
  imports: [CommonModule, ...IONIC_STANDALONE_IMPORTS, AudioPlayerComponent]
})
export class AudioPlayerPage implements OnInit {
  sounds: SoundItem[] = [];
  current = 0;
  loading = true;
  error: string | null = null;
  private loadedOnce = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private audiobook: AudiobookService,
    private auth: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async ionViewWillEnter(): Promise<void> {
    if (this.loadedOnce) {
      await this.load();
    }
  }

  private async load(): Promise<void> {
    const id = this.route.snapshot.queryParamMap.get('id');
    this.current = Number(this.route.snapshot.queryParamMap.get('index') ?? 0);
    this.loading = true;
    this.error = null;
    this.sounds = [];

    try {
      this.loadedOnce = true;
      if (await this.auth.isLoggedin()) {
        await this.auth.refreshUser();
      } else {
        await this.auth.getUser();
      }
      this.sounds = await this.audiobook.getSounds(id, this.auth.hasPlan(1));
    } catch (error) {
      console.error(error);
      this.error = 'Lyden kunne ikke hentes lige nu.';
    } finally {
      this.loading = false;
    }
  }

  close(): void {
    void this.router.navigateByUrl('/home/audiobook');
  }
}
