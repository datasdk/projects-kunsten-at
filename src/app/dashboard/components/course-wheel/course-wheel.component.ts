import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

interface WheelCourse {
  id: number;
  title: string;
}

@Component({
  selector: 'app-course-wheel',
  standalone: true,
  templateUrl: './course-wheel.component.html',
  styleUrls: ['./course-wheel.component.scss'],
  imports: [CommonModule, IonicModule]
})
export class CourseWheelComponent implements OnDestroy {
  readonly courses: WheelCourse[] = [
    { id: 1, title: 'Meditation' },
    { id: 4, title: 'Vejrtrækning' },
    { id: 2, title: 'Udstrækning' },
    { id: 3, title: 'Den perfekte morgen' }
  ];

  rotation = 0;
  selectedIndex: number | null = null;
  dragging = false;
  snapping = false;
  blinking = false;
  private startAngle = 0;
  private startRotation = 0;
  private startX = 0;
  private startY = 0;
  private moved = false;
  private lastTickIndex = this.indexAtPointer(this.rotation);
  private navigationTimer?: number;
  private blinkTimer?: number;
  private readonly tick = new Audio('https://media.kunsten-at.dk/lyd/app/click.mp3');

  constructor(private router: Router) {
    this.tick.preload = 'auto';
  }

  onPointerDown(event: PointerEvent): void {
    if (this.snapping) {
      return;
    }

    const element = event.currentTarget as HTMLElement;
    this.dragging = true;
    this.blinking = false;
    this.selectedIndex = null;
    this.moved = false;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startAngle = this.pointerAngle(event, element);
    this.startRotation = this.rotation;
    element.setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.dragging || this.snapping) {
      return;
    }

    const element = event.currentTarget as HTMLElement;
    const distance = Math.hypot(event.clientX - this.startX, event.clientY - this.startY);
    this.moved = this.moved || distance > 8;
    this.rotation = this.startRotation + this.pointerAngle(event, element) - this.startAngle;
    this.playTickIfNeeded();
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.dragging || this.snapping) {
      return;
    }

    const element = event.currentTarget as HTMLElement;
    this.dragging = false;
    if (element.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }

    this.snapAndOpen(this.moved ? this.indexAtPointer(this.rotation) : this.indexAtEvent(event, element));
  }

  reset(): void {
    this.dragging = false;
    this.snapping = false;
    this.blinking = false;
    this.selectedIndex = null;
    this.moved = false;
    this.rotation = 0;
    this.lastTickIndex = this.indexAtPointer(this.rotation);

    if (this.navigationTimer) {
      window.clearTimeout(this.navigationTimer);
      this.navigationTimer = undefined;
    }

    if (this.blinkTimer) {
      window.clearTimeout(this.blinkTimer);
      this.blinkTimer = undefined;
    }
  }

  ngOnDestroy(): void {
    this.reset();
  }

  private snapAndOpen(index: number): void {
    this.selectedIndex = index;
    this.snapping = true;
    this.rotation = this.snapRotation(index);
    this.playClick();

    this.blinkTimer = window.setTimeout(() => {
      this.blinking = true;
    }, 120);

    this.navigationTimer = window.setTimeout(() => {
      void this.router.navigate(['/videos'], {
        queryParams: {
          category_id: this.courses[index].id,
          index: 0
        }
      });
    }, 1050);
  }

  private playTickIfNeeded(): void {
    const index = this.indexAtPointer(this.rotation);

    if (index === this.lastTickIndex) {
      return;
    }

    this.lastTickIndex = index;
    this.tick.currentTime = 0;
    void this.tick.play().catch(() => undefined);
  }

  private playClick(): void {
    this.tick.currentTime = 0;
    void this.tick.play().catch(() => undefined);
  }

  private indexAtPointer(rotation: number): number {
    const normalized = ((rotation % 360) + 360) % 360;
    const topAngleOnImage = (360 - normalized) % 360;
    return Math.floor(topAngleOnImage / 90);
  }

  private snapRotation(index: number): number {
    const currentTurns = Math.round(this.rotation / 360);
    return currentTurns * 360 - index * 90;
  }

  private pointerAngle(event: PointerEvent, element: HTMLElement): number {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    return (Math.atan2(y, x) * 180 / Math.PI + 90 + 360) % 360;
  }

  private indexAtEvent(event: PointerEvent, element: HTMLElement): number {
    const imageAngle = (this.pointerAngle(event, element) - this.rotation + 360) % 360;
    return Math.floor(imageAngle / 90);
  }
}
