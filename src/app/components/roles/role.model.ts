import { Model } from "@tailflow/laravel-orion/lib/model";
import { BelongsToMany } from "@tailflow/laravel-orion/lib/drivers/default/relations/BelongsToMany";

/**
 * Permission type (fra includes)
 */
type Permission = {
  id: number;
  name: string;
  guard_name: string;
  created_at?: string | null;
  updated_at?: string | null;
};

/**
 * Role attributes (fra Laravel model)
 */
type Role = {
  id: number;
  name: string;
  guard_name: string;

  created_at?: string | null;
  updated_at?: string | null;
};

export class Roles extends Model<
  Role,
  {},
  {
    permissions: Array<Permission>; // includes fra controller
  }
> {
  public $resource(): string {
    return "roles";
  }

  protected override $keyName: string = "id";

  /**
   * permissions relation (belongsToMany i Spatie)
   */
  public permissions(): BelongsToMany<Permission> {
    return new BelongsToMany({} as any, this);
  }
}