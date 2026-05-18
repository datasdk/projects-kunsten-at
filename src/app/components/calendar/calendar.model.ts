import { Model } from "@tailflow/laravel-orion/lib/model";
import { BelongsTo } from "@tailflow/laravel-orion/lib/drivers/default/relations/BelongsTo";

/**
 * User relation (fra user_id relation)
 */
type User = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
};

/**
 * Calendar data payload (JSON cast field)
 */
type CalendarData = Record<string, any>;

/**
 * Calendar model attributes (fra Laravel model)
 */
type Calendar = {
  id: number;

  type: string;
  title: string | Record<string, string>; // translatable
  description?: string | Record<string, string>;
  color?: string;

  active: number;

  user_id: number;

  data?: CalendarData;

  link?: string;
  slug?: string | Record<string, string>;

  created_at?: string | null;
  updated_at?: string | null;
};

export class Calendar extends Model<
  Calendar,
  {},
  {
    user: User; // belongsTo relation
    available: any; // alwaysIncludes fra controller (ukendt struktur)
  }
> {
  public $resource(): string {
    return "calendars";
  }

  protected override $keyName: string = "id";

  /**
   * relation: user_id -> User
   */
  public user(): BelongsTo<User> {
    return new BelongsTo({} as any, this);
  }
}