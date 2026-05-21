import { Model } from "@tailflow/laravel-orion/lib/model";
import { Category } from "./category.model";


type SoundAvailable = {
  from: string;
  to: string;
};


type SoundAttributes = {
  type: "sound";

  id: number;

  provider?: string;
  name: string;
  slug?: string;
  description?: string;
  url?: string;

  autostart?: boolean;
  active?: boolean;

  sorting?: number;

  created_at?: string;
  updated_at?: string;
};


type SoundComputed = {
  image?: string;
};


type SoundRelations = {
  categories: Category[];

  available: SoundAvailable;

  // from controller includes
  images: any;

  data: any;
};


export class Sounds extends Model<
  SoundAttributes,
  SoundComputed,
  SoundRelations
> {

  public $resource(): string {
    return "sounds";
  }

  protected override $keyName: string = "id";
}