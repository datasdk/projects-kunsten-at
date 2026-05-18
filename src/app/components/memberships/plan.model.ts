import { Model } from "@tailflow/laravel-orion/lib/model";
import { HasMany } from "@tailflow/laravel-orion/lib/drivers/default/relations/HasMany";

/**
 * Feature type (fra features relation)
 */
type Feature = {
  id?: number;

  slug?: string;
  name?: string;

  plan_id?: number;

  created_at?: string | null;
  updated_at?: string | null;
};

/**
 * Subscription type (fra subscriptions relation)
 */
type Subscription = {
  id: number;
  user_id?: number;
  plan_id?: number;

  status?: string;

  created_at?: string | null;
  updated_at?: string | null;
};

/**
 * Media type (image/images includes)
 */
type Media = {
  id?: number;
  url?: string;
  name?: string;
};

/**
 * Plan model (fra Laravel)
 */
type Plan = {
  id: number;

  title: string | Record<string, string>;
  description?: string | Record<string, string>;
  slug?: string | Record<string, string>;

  price: number;
  signup_fee?: number;

  active: number;
  permanent_membership?: boolean;

  currency?: string;

  has_trial?: boolean;
  trial_period?: number;
  trial_interval?: string;

  invoice_period?: number;
  invoice_interval?: string;

  grace_period?: number;
  grace_interval?: string;

  prorate_day?: number;
  prorate_period?: number;
  prorate_extend_due?: boolean;

  active_subscribers_limit?: number;

  created_at?: string | null;
  updated_at?: string | null;
};

export class Plan extends Model<
  Plan,
  {},
  {
    image: Media;
    images: Array<Media>;

    features: Array<Feature>;
    subscriptions: Array<Subscription>;
  }
> {
  public $resource(): string {
    return "plans";
  }

  protected override $keyName: string = "id";

  /**
   * features relation (hasMany)
   */
  public features(): HasMany<Feature> {
    return new HasMany({} as any, this);
  }

  /**
   * subscriptions relation (hasMany)
   */
  public subscriptions(): HasMany<Subscription> {
    return new HasMany({} as any, this);
  }
}