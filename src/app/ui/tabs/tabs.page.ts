import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter } from 'rxjs';
import { AuthService } from '@/auth/services/auth.service';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-tabs',
  standalone: true,
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  imports: [CommonModule, ...IONIC_STANDALONE_IMPORTS, PageHeaderComponent]
})
export class TabsPage implements OnInit {
  currentUrl = '';

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  navigate(path: string): void {
    void this.router.navigateByUrl(path);
  }
}
