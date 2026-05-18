import { Routes } from '@angular/router';

import { HomePage } from './pages/home/home.page';


// auth

import { LoginPage } from './pages/auth/login/login.page';

import { ForgotPasswordPage } from './pages/auth/forgot-password/forgot-password.page';

import { RegisterPage } from './pages/auth/register/register.page';


// dashboard

import { DashboardPage } from './pages/dashboard/dashboard.page';

import { ProfileComponent } from './components/users/profile/profile.component';


// services
import { authGuard } from './middlewares/auth-guard';


// guards

import { authRedirectGuard } from './middlewares/auth-redirect-guard';



export const routes: Routes = [

  {
    path: '',
    component: HomePage
  },

  {
    
    path: 'auth',

    children: [

      { path: '', redirectTo: 'login', pathMatch: 'full' }, 

      { path: 'login', component: LoginPage , canActivate: [ authRedirectGuard ]},

      { path: 'register', component: RegisterPage },

      { path: 'reset', component: ForgotPasswordPage },

    ],
    
  },

  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [ authGuard ]
  },

  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ authGuard ]
  },

  

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }

];