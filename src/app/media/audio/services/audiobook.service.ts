import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';

export interface MediaImage {
  src?: string;
}

export interface SoundItem {
  id: number | string;
  name: string;
  description?: string;
  artist?: string;
  url: string;
  image?: MediaImage;
}

export interface SoundPlaylist {
  id: number | string;
  name: string;
  sounds: SoundItem[];
}

interface ApiResponse<T> {
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class AudiobookService {
  constructor(private api: ApiService) {}

  async getAudioPlaylist(fullAccess: boolean): Promise<SoundPlaylist | null> {
    const slug = fullAccess ? 'lydbog' : 'lydbog-ikke-medlem';
    const response = await this.api.get<ApiResponse<SoundPlaylist>>(`sounds/playlists/${slug}`);
    return response.data ?? null;
  }

  async getSounds(playlistId: string | number | null, fullAccess: boolean): Promise<SoundItem[]> {
    if (!playlistId) {
      return [];
    }

    const response = await this.api.post<ApiResponse<SoundItem[]>>(
      'sounds/sounds/search',
      {
        scopes: [
          {
            name: 'category',
            parameters: [playlistId]
          }
        ]
      },
      {
        include: 'images,data',
        limit: fullAccess ? undefined : 1
      }
    );

    return response.data ?? [];
  }
}
