export const environment = {
  production: true,
  domain: "https://app.kunsten-at.dk",
  notifications: {
    firebase: {
      projectId: "kunsten-at",
      messagingSenderId: "",
      androidAppId: "",
      iosAppId: "",
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
      logTokenInDevelopment: false
    }
  }
};
