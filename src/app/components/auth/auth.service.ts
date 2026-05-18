import { Injectable, signal } from '@angular/core';

import { Orion } from '@tailflow/laravel-orion/lib/orion';

import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

import { Preferences } from '@capacitor/preferences';


interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  rememberMe?: boolean;
}


@Injectable({
  providedIn: 'root',
})


export class AuthService {


  token = signal<string | null>(null);

  user = signal<object | null>(null);


  constructor(private http: HttpClient) {

    this.init()

  }


  async init() {


    if (await this.isLoggedin()) {


      const token = await this.getToken();


      if (token) {

        this.setAuthToken(token);

        this.token.set(token)

        this.refreshUser()

      }

    }

  }


  getBaseApiUrl(){

    return `${environment.domain}/api`;

  }


  async login(email: string, password: string, rememberMe: boolean = false) {


    const url = this.getBaseApiUrl() + "/auth/login"


    try {


      const response: any = await this.http.post(url, { email, password, rememberMe }).toPromise();


      if (response.token) {

        // Gem token i Capacitor Storage
        
        await Preferences.set({ key: 'auth_user', value: response.user });

        await Preferences.set({ key: 'auth_token', value: response.token });


        this.token.set(response.token);
          
        this.user.set(response.user);

      }


      return response;


    } catch (err) {

      console.error('Login failed', err);

      throw err;

    }

  }


  async register(data: { firstname: string; lastname: string;  email: string;  password: string }) {

    const url = this.getBaseApiUrl() + "/users";

    try {

      const response: any = await this.http.post(url, data).toPromise();
      return response;

    } catch (err) {

      console.error('Register failed', err);
      throw err;

    }
  }


  async forgotPassword(email: string, returnUrl?: string) {

    const url = this.getBaseApiUrl() + "/auth/forgot-password";

    try {

      const body: any = { email };

      if (returnUrl) {
        body.return = returnUrl;
      }

      const response: any = await this.http.post(url, body).toPromise();

      return response;

    } catch (err) {

      console.error('Forgot password failed', err);
      throw err;

    }

  }


  async logout() {


    const url = this.getBaseApiUrl() + "/auth/logout"


    try {


      const response: any = this.http.post(url, { }).toPromise();

      
      await Preferences.remove({ key: 'auth_user' });

      await Preferences.remove({ key: 'auth_token'});

      this.token.set(null);
          
      this.user.set(null);

 
      return true



    } catch (err) {

      console.error('Login failed', err);

      throw err;
    
    }


    return false

  }



  async getToken(): Promise<string | null> {

    if(this.token()){ return this.token() }

    const { value } = await Preferences.get({ key: 'auth_token' });

    this.token.set(value)

    return value;

  }


  async getUser(): Promise<object | null> {
    

    if(this.user()){ return this.user() }

    const { value } = await Preferences.get({ key: 'user' });

    if (!value) return null;

    const parsed = JSON.parse(value);

    this.user.set(parsed)

    return parsed;

  }


  async refreshUser(): Promise<string | null> {

    const token = await this.getToken();

    const url = this.getBaseApiUrl() + "/user/me";


    try {

      const response: any = await this.http.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).toPromise();

     // console.log(response.data);

      return this.user = response.data


    } catch (err) {

      console.error(err);

      return null;

    }

  }


  /**
   * Sætter Bearer token til alle fremtidige requests
   * @param token - token fra backend login
   */
  setAuthToken(token: string) {

    Orion.setToken(token);

  }


  async isLoggedin(){

    const token = await this.getToken()

    if(token) return true

    return false

  }


}
