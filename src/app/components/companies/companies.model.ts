import { Model } from "@tailflow/laravel-orion/lib/model";
import { BelongsToMany } from "@tailflow/laravel-orion/lib/drivers/default/relations/BelongsToMany";
import { HasMany } from "@tailflow/laravel-orion/lib/drivers/default/relations/HasMany";
import { BelongsTo } from "@tailflow/laravel-orion/lib/drivers/default/relations/BelongsTo";

/**
 * Address (fra HasAddresses trait)
 */
type Address = {
  id?: number;

  street: string;
  city: string;
  post_code: string | null;
  country_id: number | null;
  state: string | null;

  is_billing: number;
  is_primary: number;
  is_public: number;
  is_shipping: number;

  lat: number | null;
  lng: number | null;
};

/**
 * Contact (fra HasContacts trait)
 */
type Contact = {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
};

/**
 * User (members/owners relation)
 */
type User = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
};

/**
 * Team (fra HasTeams trait)
 */
type Team = {
  id: number;
  name?: string;
};

/**
 * Company model (fra Laravel)
 */
type Company = {
  id: number;

  name: string;
  vat?: string | null;

  slug?: string;
  logo?: string;

  is_primary: boolean;

  country?: string;

  created_at?: string | null;
  updated_at?: string | null;
};

export class Companies extends Model<
  Company,
  {},
  {
    // includes fra controller
    addresses: Array<Address>;
    address: Address;

    contacts: Array<Contact>;
    contact: Contact;

    images: any;

    team: Team;
    owners: Array<User>;
    members: Array<User>;

    subsidiaries: Array<Company>;
  }
> {
  public $resource(): string {
    return "companies";
  }

  protected override $keyName: string = "id";

  /**
   * Main address (HasAddresses trait)
   */
  public address(): BelongsTo<Address> {
    return new BelongsTo({} as any, this);
  }

  /**
   * All addresses
   */
  public addresses(): HasMany<Address> {
    return new HasMany({} as any, this);
  }

  /**
   * contacts (HasContacts trait)
   */
  public contacts(): HasMany<Contact> {
    return new HasMany({} as any, this);
  }

  /**
   * members relation
   */
  public members(): BelongsToMany<User> {
    return new BelongsToMany({} as any, this);
  }

  /**
   * owners relation
   */
  public owners(): BelongsToMany<User> {
    return new BelongsToMany({} as any, this);
  }

  /**
   * subsidiaries (tree relation)
   */
  public subsidiaries(): HasMany<Company> {
    return new HasMany({} as any, this);
  }

  /**
   * team relation
   */
  public team(): BelongsTo<Team> {
    return new BelongsTo({} as any, this);
  }
}