import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-loading',
  standalone: true,
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  imports: [CommonModule, ...IONIC_STANDALONE_IMPORTS]
})
export class LoadingComponent {
  @Input() label = 'Indlæser';
  @Input() tone: 'default' | 'light' = 'default';
}
