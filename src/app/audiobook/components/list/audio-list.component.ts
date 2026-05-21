import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoadingComponent } from '@/core/loading/loading.component';
import { SoundPlaylist } from '../../services/audiobook.service';

@Component({
  selector: 'app-audio-list',
  standalone: true,
  templateUrl: './audio-list.component.html',
  styleUrls: ['./audio-list.component.scss'],
  imports: [CommonModule, IonicModule, RouterLink, LoadingComponent]
})
export class AudioListComponent {
  @Input() playlist: SoundPlaylist | null = null;
  @Input() loading = true;
  @Input() error: string | null = null;
  @Input() showAccessNotice = false;
  @Input() accessNoticeText = '';
  @Input() showLoginLink = false;
  @Output() closeAccessNotice = new EventEmitter<void>();
}
