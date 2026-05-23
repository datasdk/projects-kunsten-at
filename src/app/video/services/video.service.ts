import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';

export interface MediaImage {
  src?: string;
}

export interface VideoItem {
  id: number | string;
  name: string;
  url: string;
  tags?: string[];
}

export interface VideoPlaylist {
  id?: number | string;
  name?: string;
  videos: VideoItem[];
}

interface ApiResponse<T> {
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  constructor(private api: ApiService) {}

  async getVideos(categoryId: string | number | null, fullAccess: boolean): Promise<VideoItem[]> {
    if (!categoryId) {
      return [];
    }

    const limit = fullAccess ? undefined : 1;
    const response = await this.api.get<ApiResponse<VideoPlaylist>>(`videos/playlists/${categoryId}`, {
      'includes[0][relation]': 'videos',
      'includes[0][limit]': limit
    });

    return response.data.videos ?? [];
  }
}
