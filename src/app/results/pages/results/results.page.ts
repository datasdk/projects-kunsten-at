import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import Chart from 'chart.js/auto';
import { CourseQuestion } from '@/course/interfaces/course-question.interface';
import { CourseSnapshot } from '@/course/interfaces/course-snapshot.interface';
import { CourseProgressService } from '@/course/services/course-progress.service';
import { ResultsRow } from '../../interfaces/results-row.interface';

@Component({
  selector: 'app-results-page',
  standalone: true,
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  imports: [CommonModule, IonicModule]
})
export class ResultsPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('resultsChart') resultsChart?: ElementRef<HTMLCanvasElement>;

  start: CourseSnapshot | null = null;
  stop: CourseSnapshot | null = null;
  rows: ResultsRow[] = [];
  private chart?: Chart;
  private viewReady = false;

  constructor(private progress: CourseProgressService) {}

  async ngOnInit(): Promise<void> {
    this.start = await this.progress.getStart();
    this.stop = await this.progress.getStop();
    this.rows = this.createRows(this.start?.statistics.items ?? [], this.stop?.statistics.items ?? []);
    this.scheduleChartRender();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.scheduleChartRender();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  showExample(): void {
    const labels = ['Ro i kroppen', 'Søvnkvalitet', 'Vejrtrækning', 'Angsthåndtering'];

    this.rows = labels.map((label) => {
      const before = this.random(1, 3);
      return {
        label,
        before,
        after: Math.min(5, before + this.random(1, 2))
      };
    });

    this.scheduleChartRender();
  }

  developmentLabel(delta: number): string {
    if (delta >= 4) {
      return 'Vildeste udvikling!';
    }

    if (delta >= 3) {
      return 'Fantastisk udvikling';
    }

    if (delta >= 2) {
      return 'Stor udvikling';
    }

    return 'God udvikling';
  }

  private scheduleChartRender(): void {
    window.setTimeout(() => this.renderChart(), 0);
  }

  private renderChart(): void {
    if (!this.viewReady || !this.resultsChart?.nativeElement || !this.rows.length) {
      return;
    }

    this.chart?.destroy();
    this.chart = new Chart(this.resultsChart.nativeElement, {
      type: 'bar',
      data: {
        labels: this.rows.map((row) => row.label),
        datasets: [
          {
            label: 'Før',
            data: this.rows.map((row) => row.before),
            backgroundColor: '#b76a8b',
            borderRadius: 6
          },
          {
            label: 'Efter',
            data: this.rows.map((row) => row.after),
            backgroundColor: '#5678b8',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              boxWidth: 10,
              boxHeight: 10
            }
          }
        }
      }
    });
  }

  private createRows(before: CourseQuestion[], after: CourseQuestion[]): ResultsRow[] {
    const labels = before.length ? before : after;

    return labels.map((item, index) => ({
      label: item.textShort || item.text,
      before: before[index]?.value ?? 0,
      after: after[index]?.value ?? 0
    }));
  }

  private random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
