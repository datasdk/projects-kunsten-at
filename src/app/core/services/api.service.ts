import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { NativeStorageService } from './native-storage.service';

export type ApiParams = Record<string, string | number | boolean | null | undefined>;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = `${environment.domain.replace(/\/+$/, '')}/api`;

  constructor(
    private http: HttpClient,
    private storage: NativeStorageService
  ) {}

  async get<T>(path: string, params: ApiParams = {}): Promise<T> {
    return firstValueFrom(
      this.http.get<T>(this.url(path), {
        headers: await this.headers(),
        params: this.params(params)
      })
    );
  }

  async post<T>(path: string, body: unknown = {}, params: ApiParams = {}): Promise<T> {
    return firstValueFrom(
      this.http.post<T>(this.url(path), body, {
        headers: await this.headers(),
        params: this.params(params)
      })
    );
  }

  private url(path: string): string {
    return `${this.baseUrl}/${path.replace(/^\/+/, '')}`;
  }

  private async headers(): Promise<HttpHeaders> {
    const token = await this.storage.getString('auth_token');
    let headers = new HttpHeaders({
      Accept: 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private params(values: ApiParams): HttpParams {
    let params = new HttpParams().set('lang', 'da');

    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params = params.set(key, String(value));
      }
    });

    return params;
  }
}
