import { Model } from "@tailflow/laravel-orion/lib/model";

import { Plan } from "./plan.model";

import { User } from "./user.model";


type SubscriptionAttributes = {
  name: string;

  subscribable_id: number;
  subscribable_type: string;

  plan_id: number;

  description?: string;
  timezone?: string;

  payment_method?: string;
  payment_status?: string;
  paid_at?: string | null;

  trial_ends_at?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;

  auto_renew?: boolean;
  trial_auto_upgrade?: boolean;
  permanent_membership?: boolean;

  cancels_at?: string | null;
  canceled_at?: string | null;
};

type SubscriptionComputed = {
  has_trial: boolean;
  status: string;

  is_active: boolean;
  is_canceled: boolean;
  is_ended: boolean;
  is_on_trial: boolean;
  is_on_grace: boolean;
  is_canceled_not_ended: boolean;
};

type SubscriptionRelations = {
  plan: Plan;

  // polymorphic relation (kan være User eller andre models)
  subscribable: User;
};

export class Subscription extends Model<
  SubscriptionAttributes,
  SubscriptionComputed,
  SubscriptionRelations
> {
  public $resource(): string {
    return "subscriptions";
  }

  protected override $keyName: string = "id";
}