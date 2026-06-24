import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { AuthService } from '@/auth/services/auth.service';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-settings-membership-page',
  standalone: true,
  templateUrl: './settings-membership.page.html',
  styleUrls: ['../../settings-page.shared.scss', './settings-membership.page.scss'],
  imports: [CommonModule, ...IONIC_STANDALONE_IMPORTS]
})
export class SettingsMembershipPage {
  constructor(public auth: AuthService) {}

  get isPro(): boolean {
    return this.auth.hasPlan(1);
  }
}
