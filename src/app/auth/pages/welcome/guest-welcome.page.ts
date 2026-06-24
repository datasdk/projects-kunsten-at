import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@/auth/services/auth.service';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-guest-welcome',
  standalone: true,
  templateUrl: './guest-welcome.page.html',
  styleUrls: ['./guest-welcome.page.scss'],
  imports: [CommonModule, ...IONIC_STANDALONE_IMPORTS, RouterLink]
})
export class GuestWelcomePage {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  continueAsGuest(): void {
    this.auth.continueAsGuest();
    void this.router.navigateByUrl('/home/dashboard');
  }
}
