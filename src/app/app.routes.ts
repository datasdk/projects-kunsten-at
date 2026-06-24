import { Routes } from '@angular/router';
import { LoginPage } from './auth/pages/login/login.page';
import { ForgotPasswordPage } from './auth/pages/forgot-password/forgot-password.page';
import { RegisterPage } from './auth/pages/register/register.page';
import { GuestWelcomePage } from './auth/pages/welcome/guest-welcome.page';
import { authRedirectGuard } from './auth/middleware/auth-redirect-guard';
import { authGuard } from './auth/middleware/auth-guard';
import { TabsPage } from './ui/tabs/tabs.page';
import { DashboardPage } from './dashboard/pages/dashboard/dashboard.page';
import { VideosPage } from './media/video/pages/videos/videos.page';
import { AudioPage } from './media/audio/pages/audio/audio.page';
import { AudioPlayerPage } from './media/audio/pages/player/audio-player.page';
import { CourseStartPage } from './course/pages/start/course-start.page';
import { CourseStopPage } from './course/pages/stop/course-stop.page';
import { CourseSuccessPage } from './course/pages/success/course-success.page';
import { ResultsPage } from './results/pages/results/results.page';
import { TermsPage } from './terms/pages/terms/terms.page';
import { SettingsMenuPage } from './settings/pages/menu/settings-menu.page';
import { SettingsProfilePage } from './settings/pages/profile/settings-profile.page';
import { SettingsPasswordPage } from './settings/pages/password/settings-password.page';
import { SettingsMembershipPage } from './settings/pages/membership/settings-membership.page';
import { SettingsNotificationsPage } from './settings/pages/notifications/settings-notifications.page';
import { SettingsCoursePage } from './settings/pages/course/settings-course.page';
import { SettingsDeleteAccountPage } from './settings/pages/delete-account/settings-delete-account.page';
import { HelpPage } from './help/pages/help/help.page';
import { ProInfoPage } from './pro/pages/info/pro-info.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    component: GuestWelcomePage,
    canActivate: [authRedirectGuard]
  },
  {
    path: 'auth',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    component: LoginPage,
    canActivate: [authRedirectGuard]
  },
  {
    path: 'auth/register',
    component: RegisterPage,
    canActivate: [authRedirectGuard]
  },
  {
    path: 'auth/reset',
    component: ForgotPasswordPage,
    canActivate: [authRedirectGuard]
  },
  {
    path: 'auth/reset-password',
    component: ForgotPasswordPage,
    canActivate: [authRedirectGuard]
  },
  {
    path: 'videos',
    component: VideosPage
  },
  {
    path: 'audiobook/player',
    component: AudioPlayerPage
  },
  {
    path: 'course/start',
    component: CourseStartPage
  },
  {
    path: 'course/stop',
    component: CourseStopPage
  },
  {
    path: 'course/success',
    component: CourseSuccessPage
  },
  {
    path: 'pro',
    component: ProInfoPage
  },
  {
    path: 'course/statistics',
    redirectTo: 'home/results',
    pathMatch: 'full'
  },
  {
    path: 'course/statestics',
    redirectTo: 'home/results',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: TabsPage,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardPage
      },
      {
        path: 'dashboard',
        component: DashboardPage
      },
      {
        path: 'results',
        component: ResultsPage
      },
      {
        path: 'audiobook',
        component: AudioPage
      },
      {
        path: 'terms',
        component: TermsPage
      },
      {
        path: 'help',
        component: HelpPage
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            component: SettingsMenuPage
          },
          {
            path: 'profile',
            component: SettingsProfilePage
          },
          {
            path: 'password',
            component: SettingsPasswordPage
          },
          {
            path: 'membership',
            component: SettingsMembershipPage
          },
          {
            path: 'notifications',
            component: SettingsNotificationsPage
          },
          {
            path: 'course',
            component: SettingsCoursePage
          },
          {
            path: 'reset-course',
            redirectTo: 'course',
            pathMatch: 'full'
          },
          {
            path: 'delete-account',
            component: SettingsDeleteAccountPage
          },
          {
            path: 'delete-user',
            redirectTo: 'delete-account',
            pathMatch: 'full'
          }
        ]
      }
    ]
  },
  {
    path: 'results',
    redirectTo: 'home/results',
    pathMatch: 'full'
  },
  {
    path: 'audiobook',
    redirectTo: 'home/audiobook',
    pathMatch: 'full'
  },
  {
    path: 'terms',
    redirectTo: 'home/terms',
    pathMatch: 'full'
  },
  {
    path: 'help',
    redirectTo: 'home/help',
    pathMatch: 'full'
  },
  {
    path: 'settings',
    redirectTo: 'home/settings',
    pathMatch: 'full'
  },
  {
    path: 'settings/profile',
    redirectTo: 'home/settings/profile',
    pathMatch: 'full'
  },
  {
    path: 'settings/password',
    redirectTo: 'home/settings/password',
    pathMatch: 'full'
  },
  {
    path: 'settings/membership',
    redirectTo: 'home/settings/membership',
    pathMatch: 'full'
  },
  {
    path: 'settings/notifications',
    redirectTo: 'home/settings/notifications',
    pathMatch: 'full'
  },
  {
    path: 'settings/course',
    redirectTo: 'home/settings/course',
    pathMatch: 'full'
  },
  {
    path: 'settings/delete-account',
    redirectTo: 'home/settings/delete-account',
    pathMatch: 'full'
  },
  {
    path: 'settings/reset-course',
    redirectTo: 'home/settings/course',
    pathMatch: 'full'
  },
  {
    path: 'settings/delete-user',
    redirectTo: 'home/settings/delete-account',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'tabs/home',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'tabs/development',
    redirectTo: 'home/results',
    pathMatch: 'full'
  },
  {
    path: 'tabs/results',
    redirectTo: 'home/results',
    pathMatch: 'full'
  },
  {
    path: 'tabs/audio',
    redirectTo: 'home/audiobook',
    pathMatch: 'full'
  },
  {
    path: 'tabs/audio/player',
    redirectTo: 'audiobook/player',
    pathMatch: 'full'
  },
  {
    path: 'tabs/videos',
    redirectTo: 'videos',
    pathMatch: 'full'
  },
  {
    path: 'tabs/terms',
    redirectTo: 'home/terms',
    pathMatch: 'full'
  },
  {
    path: 'tabs/settings',
    redirectTo: 'home/settings',
    pathMatch: 'full'
  },
  {
    path: 'tabs/course/start',
    redirectTo: 'course/start',
    pathMatch: 'full'
  },
  {
    path: 'tabs/course/stop',
    redirectTo: 'course/stop',
    pathMatch: 'full'
  },
  {
    path: 'tabs/course/success',
    redirectTo: 'course/success',
    pathMatch: 'full'
  },
  {
    path: 'videos/index',
    redirectTo: 'videos',
    pathMatch: 'full'
  },
  {
    path: 'podcast',
    redirectTo: 'home/audiobook',
    pathMatch: 'full'
  },
  {
    path: 'podcast/playlist',
    redirectTo: 'audiobook/player',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
