import { Injectable } from '@angular/core';
import { NativeStorageService } from '@services/native-storage.service';

export interface CourseQuestion {
  name: string;
  text: string;
  textShort: string;
  value: number;
  left: string;
  right: string;
}

export interface CourseSnapshot {
  index?: number | string | null;
  category_id?: number | string | null;
  title: string;
  days?: number | string | null;
  statistics: {
    items: CourseQuestion[];
    category?: string;
  };
}

export interface ActiveTask {
  days: number;
  startdate: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseProgressService {
  constructor(private storage: NativeStorageService) {}

  readonly questions: CourseQuestion[] = [
    {
      name: 'stress',
      text: 'Hvor rolig og afslappet føler du dig i kroppen i dagligdagen?',
      textShort: 'Ro i kroppen',
      value: 0,
      left: 'Slet ikke',
      right: 'Meget rolig'
    },
    {
      name: 'tired',
      text: 'Hvor godt sover du generelt om natten?',
      textShort: 'Søvnkvalitet',
      value: 0,
      left: 'Meget dårligt',
      right: 'Meget godt'
    },
    {
      name: 'breath',
      text: 'Hvor godt formår du at trække vejret roligt, når du er presset?',
      textShort: 'Optimal vejrtrækning',
      value: 0,
      left: 'Slet ikke',
      right: 'Meget godt'
    },
    {
      name: 'anxiety',
      text: 'Hvor godt føler du, at du håndterer angst i dagligdagen?',
      textShort: 'Angsthåndtering',
      value: 0,
      left: 'Slet ikke',
      right: 'Meget godt'
    }
  ];

  freshQuestions(): CourseQuestion[] {
    return this.questions.map((question) => ({ ...question }));
  }

  async setStart(snapshot: CourseSnapshot): Promise<void> {
    await this.storage.setObject('statistics_start', snapshot);
  }

  async setStop(snapshot: CourseSnapshot): Promise<void> {
    await this.storage.setObject('statistics_stop', snapshot);
  }

  async getStart(): Promise<CourseSnapshot | null> {
    return this.storage.getObject<CourseSnapshot>('statistics_start');
  }

  async getStop(): Promise<CourseSnapshot | null> {
    return this.storage.getObject<CourseSnapshot>('statistics_stop');
  }

  async setActiveTask(categoryId: string | number | null, index: string | number | null, task: ActiveTask): Promise<void> {
    await this.storage.setObject(this.taskKey(categoryId, index), task);
    await this.storage.setString('has-active-task', String(index ?? 0));
  }

  async getActiveTask(categoryId: string | number | null, index: string | number | null): Promise<ActiveTask | null> {
    return this.storage.getObject<ActiveTask>(this.taskKey(categoryId, index));
  }

  async hasAnyActiveTask(): Promise<boolean> {
    return (await this.storage.getString('has-active-task')) !== null;
  }

  async isTaskDoneToday(categoryId: string | number | null, index: string | number | null): Promise<boolean> {
    return (await this.storage.getString(`${this.taskKey(categoryId, index)}-done`)) === this.today();
  }

  async setTaskDone(categoryId: string | number | null, index: string | number | null, done: boolean): Promise<void> {
    const key = `${this.taskKey(categoryId, index)}-done`;

    if (done) {
      await this.storage.setString(key, this.today());
      return;
    }

    await this.storage.remove(key);
  }

  async clearCurrentCourse(): Promise<void> {
    await this.storage.remove('statistics_start');
    await this.storage.remove('has-active-task');
    await this.storage.removeByPrefix('task-');
  }

  isTaskPeriodComplete(task: ActiveTask): boolean {
    const start = new Date(task.startdate.replace(' ', 'T'));
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const dayMs = 24 * 60 * 60 * 1000;
    return Math.floor(diff / dayMs) >= task.days;
  }

  today(): string {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  taskKey(categoryId: string | number | null, index: string | number | null): string {
    return `task-${categoryId ?? 'default'}-${index ?? 0}`;
  }
}
