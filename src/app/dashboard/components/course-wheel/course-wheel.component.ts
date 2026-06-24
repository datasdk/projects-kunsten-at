import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Router } from '@angular/router';

import { WheelCourse } from '../../interfaces/wheel-course.interface';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'app-course-wheel',
  standalone: true,
  templateUrl: './course-wheel.component.html',
  styleUrls: ['./course-wheel.component.scss'],
  imports: [CommonModule, ...IONIC_STANDALONE_IMPORTS]
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
  private pointerId: number | null = null;
  private lastTickIndex = this.indexAtPointer(this.rotation);
  private blinkTimer?: number;
  private snapTimer?: number;
  private openTimer?: number;

  constructor(private router: Router) {}

  onPointerDown(event: PointerEvent): void {
    if (this.snapping) {
      return;
    }

    const element = event.currentTarget as HTMLElement;
    this.dragging = true;
    this.blinking = false;
    this.moved = false;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startAngle = this.pointerAngle(event, element);
    this.startRotation = this.rotation;
    this.pointerId = event.pointerId;
    element.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.dragging || this.snapping || event.pointerId !== this.pointerId) {
      return;
    }

    const element = event.currentTarget as HTMLElement;
    const distance = Math.hypot(event.clientX - this.startX, event.clientY - this.startY);
    this.moved = this.moved || distance > 8;

    if (!this.moved) {
      return;
    }

    this.rotation = this.startRotation + this.pointerAngle(event, element) - this.startAngle;
    this.playTickIfNeeded();
    event.preventDefault();
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.dragging || this.snapping || event.pointerId !== this.pointerId) {
      return;
    }

    const element = event.currentTarget as HTMLElement;
    this.dragging = false;
    this.pointerId = null;
    if (element.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }

    const index = this.moved ? this.indexAtPointer(this.rotation) : this.indexAtEvent(event, element);

    if (this.moved) {
      this.snapToIndex(index);
      this.blinkSelection(index);
    }

    this.vibrateRelease();
    this.blinkAndOpen(index);
    event.preventDefault();
  }

  reset(): void {
    this.dragging = false;
    this.snapping = false;
    this.blinking = false;
    this.selectedIndex = null;
    this.moved = false;
    this.pointerId = null;
    this.rotation = 0;
    this.lastTickIndex = this.indexAtPointer(this.rotation);

    if (this.blinkTimer) {
      window.clearTimeout(this.blinkTimer);
      this.blinkTimer = undefined;
    }

    if (this.snapTimer) {
      window.clearTimeout(this.snapTimer);
      this.snapTimer = undefined;
    }

    if (this.openTimer) {
      window.clearTimeout(this.openTimer);
      this.openTimer = undefined;
    }
  }

  ngOnDestroy(): void {
    this.reset();
  }

  private blinkAndOpen(index: number): void {
    this.selectedIndex = index;
    this.snapping = true;
    this.startBlink();

    if (this.openTimer) {
      window.clearTimeout(this.openTimer);
    }

    this.openTimer = window.setTimeout(() => {
      this.openTimer = undefined;
      this.openCourse(index);
    }, 900);
  }

  private openCourse(index: number): void {
    const course = this.courses[index];

    if (!course) {
      this.snapping = false;
      return;
    }

    void this.router.navigate(['/videos'], {
      queryParams: {
        category_id: course.id,
        index: 0
      }
    });
  }

  private blinkSelection(index: number): void {
    this.selectedIndex = index;
    this.startBlink();
  }

  private snapToIndex(index: number): void {
    this.selectedIndex = index;
    this.snapping = true;
    this.rotation = this.nearestRotationForIndex(index, this.rotation);
    this.lastTickIndex = index;

    if (this.snapTimer) {
      window.clearTimeout(this.snapTimer);
    }

    this.snapTimer = window.setTimeout(() => {
      this.snapping = false;
      this.snapTimer = undefined;
    }, 190);
  }

  private startBlink(): void {
    if (this.blinkTimer) {
      window.clearTimeout(this.blinkTimer);
      this.blinkTimer = undefined;
    }

    this.blinking = false;
    this.blinkTimer = window.setTimeout(() => {
      this.blinking = true;
    }, 120);
  }

  private playTickIfNeeded(): void {
    const index = this.indexAtPointer(this.rotation);

    if (index === this.lastTickIndex) {
      return;
    }

    this.lastTickIndex = index;
    this.vibrateTick();
  }

  private indexAtPointer(rotation: number): number {
    const normalized = ((rotation % 360) + 360) % 360;
    const topAngleOnImage = (360 - normalized) % 360;
    return Math.floor(topAngleOnImage / 90);
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

  private nearestRotationForIndex(index: number, currentRotation: number): number {
    const target = (360 - (index * 90 + 45)) % 360;
    const offset = this.shortestAngleDelta(currentRotation, target);
    return currentRotation + offset;
  }

  private shortestAngleDelta(from: number, to: number): number {
    return ((to - from + 540) % 360) - 180;
  }

  private vibrateTick(): void {
    navigator.vibrate?.([8, 24, 8]);
    void Haptics.impact({ style: ImpactStyle.Light })
      .then(() => window.setTimeout(() => {
        void Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
      }, 36))
      .catch(() => undefined);
  }

  private vibrateRelease(): void {
    navigator.vibrate?.(32);
    void Haptics.impact({ style: ImpactStyle.Medium }).catch(() => undefined);
  }
}
