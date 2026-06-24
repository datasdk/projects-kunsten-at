import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ApiService } from '@services/api.service';
import { LoadingComponent } from '@/ui/loading/loading.component';
import { TermsResponse } from '../../interfaces/terms-response.interface';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-terms-page',
  standalone: true,
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
  imports: [CommonModule, ...IONIC_STANDALONE_IMPORTS, LoadingComponent]
})
export class TermsPage implements OnInit {
  loading = true;
  content = '';
  error: string | null = null;

  constructor(private api: ApiService) {}

  async ngOnInit(): Promise<void> {
    try {
      const response = await this.api.get<TermsResponse>('shop/terms/terms');
      this.content = response.data?.content ?? '';
    } catch (error) {
      console.error(error);
      this.error = 'Betingelser kunne ikke hentes lige nu.';
    } finally {
      this.loading = false;
    }
  }
}
