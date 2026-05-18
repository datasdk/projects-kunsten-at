import { Model } from "@tailflow/laravel-orion/lib/model";
import { BelongsToMany } from "@tailflow/laravel-orion/lib/drivers/default/relations/BelongsToMany";

/**
 * Category type (fra setCategories relation i backend)
 */
type Category = {
  id: number;
  name?: string;
  type?: string;
};

/**
 * Tag attributes (fra Laravel model)
 */
type Tag = {
  id: number;

  name: string | Record<string, string>; // pga translatable
  description?: string | Record<string, string>;

  slug?: string;
  type?: string;

  created_at?: string | null;
  updated_at?: string | null;
};

export class Tags extends Model<
  Tag,
  {},
  {
    categories: Array<Category>; // includes fra controller
  }
> {
  public $resource(): string {
    return "tags";
  }

  protected override $keyName: string = "id";

  /**
   * categories relation (fra trait Categories)
   */
  public categories(): BelongsToMany<Category> {
    return new BelongsToMany({} as any, this);
  }
}