import { Model } from "@tailflow/laravel-orion/lib/model";


type Address = {
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


export class Users extends Model<
  {
    id: number;
    first_name: string;
    last_name: string;
    middle_name?: string;

    email: string;
    email_verified: boolean;

    username: string;
    uid: string;

    active: number;
    type: string;

    phone?: string;
    image?: string;

    online?: any;
    lastLogin?: any;

    created_at?: string | null;
    updated_at?: string | null;

    address: Address; 
  },
  {}, 
  {
    address: Address; 
  }
> {


  public $resource(): string {
    return 'users';
  }

  protected override $keyName: string = 'id';


}
