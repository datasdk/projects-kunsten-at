/// <reference types="@capacitor/push-notifications" />

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.kunstenat.dk',
  appName: 'Kunsten At',
  webDir: 'www/da',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: false,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      // Capacitor's LIGHT value means dark status-bar content for a light UI.
      style: 'LIGHT',
      backgroundColor: '#ffffff'
    },
    Keyboard: {
      resize: 'ionic'
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert', 'banner', 'list']
    }
  }
};

export default config;
