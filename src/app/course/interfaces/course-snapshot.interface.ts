import { CourseQuestion } from './course-question.interface';

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
