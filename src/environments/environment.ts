// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  domain: "https://app.kunsten-at.dk",
  notifications: {
    firebase: {
      projectId: "kunsten-at-dev",
      messagingSenderId: "000000000000",
      androidAppId: "1:000000000000:android:0000000000000000000000",
      iosAppId: "1:000000000000:ios:0000000000000000000000",
      androidPackageName: "dk.kunstenat.app",
      iosBundleId: "dk.kunstenat.app",
      keysDirectory: "src/app/notifications/firebase-keys",
      androidGoogleServicesFile: "android/app/google-services.json",
      iosGoogleServiceInfoFile: "ios/App/App/GoogleService-Info.plist"
    },
    push: {
      defaultChannelId: "kunsten_at_default",
      defaultChannelName: "Kunsten At",
      defaultChannelDescription: "Påmindelser og beskeder fra Kunsten At",
      tokenRegistrationEndpoint: "firebase/devices",
      tokenStorageKey: "push_token",
      subscribedStorageKey: "subscribedToNotifications",
      logTokenInDevelopment: true
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
