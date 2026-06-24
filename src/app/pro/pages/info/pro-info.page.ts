import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@/auth/services/auth.service';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-pro-info-page',
  standalone: true,
  templateUrl: './pro-info.page.html',
  styleUrls: ['./pro-info.page.scss'],
  imports: [CommonModule, ...IONIC_STANDALONE_IMPORTS]
})
export class ProInfoPage implements OnInit {
  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    if (await this.auth.isLoggedin()) {
      await this.auth.getUser();
    }

    if (this.isPro) {
      await this.router.navigateByUrl('/home/dashboard');
    }
  }

  get isPro(): boolean {
    return this.auth.hasPlan(1);
  }
}
