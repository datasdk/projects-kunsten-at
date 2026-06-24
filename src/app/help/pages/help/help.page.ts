import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-help-page',
  standalone: true,
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
  imports: [CommonModule, ...IONIC_STANDALONE_IMPORTS]
})
export class HelpPage {
  constructor(private router: Router) {}

  goHome(): void {
    void this.router.navigateByUrl('/home/dashboard');
  }
}
