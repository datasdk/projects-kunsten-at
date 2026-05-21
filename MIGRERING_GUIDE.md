# Kunsten At Ionic Angular migreringsguide

## 1. Installation

Gå til Ionic-projektet:

```bash
cd "output/ionic angular - 2026"
npm install
```

Hvis npm på Windows rammer en lokal certifikatfejl, kan installationen køres midlertidigt med:

```bash
npm --strict-ssl=false install
```

## 2. Kør projektet lokalt

Angular dev-server:

```bash
ng serve
```

Alternativt via npm-script:

```bash
npm start
```

Ionic CLI:

```bash
ionic serve
```

## 3. Build

```bash
npm run build
```

Build-output bliver lagt i `www`, som Capacitor bruger som webDir.

## 4. Konverter til native app med Capacitor

Projektet er sat op med Capacitor i `capacitor.config.ts`:

- appId: `dk.kunstenat.app`
- appName: `Kunsten At`
- webDir: `www`
- deep link scheme-forberedelse: `kunstenat://`
- native platformspakker: `@capacitor/android` og `@capacitor/ios`

Efter build køres:

```bash
npx cap sync
```

Hvis native platforme ikke findes endnu:

```bash
npx cap add android
npx cap add ios
npx cap sync
```

## 5. Kør på Android

Krav:

- Android Studio
- Android SDK
- Firebase `google-services.json` placeret i Android-projektet, når Firebase-projektet er oprettet

Kommando:

```bash
npm run build
npx cap sync android
npx cap run android
```

## 6. Kør på iOS

Krav:

- macOS med Xcode
- Apple Developer Team
- Firebase `GoogleService-Info.plist` placeret i iOS-projektet, når Firebase-projektet er oprettet

Kommando:

```bash
npm run build
npx cap sync ios
npx cap open ios
```

Kør derefter appen fra Xcode.

## 7. Splash screen og app icons

Assets ligger i projektets `assets`-mappe:

- `assets/icon.png`
- `assets/icon-only.png`
- `assets/icon-foreground.png`
- `assets/icon-background.png`
- `assets/splash.png`
- `assets/splash-dark.png`

Der er tilføjet script:

```bash
npm run assets:generate
```

Kør scriptet efter native platforme er tilføjet. Kør derefter:

```bash
npx cap sync
```

## 8. Push notifications

Projektet er klargjort med:

- `@capacitor/push-notifications`
- `@capacitor/local-notifications`
- `@capacitor/device`
- `FirebasePushService`
- `NotificationRegisterComponent`

Servicen registrerer native push-token, henter device-id via Capacitor Device og sender token til API-endpointet `firebase/devices`.

Manuel opsætning der stadig mangler:

- Opret Firebase-projekt
- Tilføj Android- og iOS-app i Firebase
- Læg `google-services.json` i Android-projektet
- Læg `GoogleService-Info.plist` i iOS-projektet
- Opsæt APNs key/certifikat i Firebase for iOS
- Kontroller backend-endpoints `firebase/devices` og `firebase/notifications`

## 9. Oprettede mapper og komponenter

Vigtig ny Angular/Ionic-struktur:

- `src/app/pages/tabs`
- `src/app/pages/home`
- `src/app/pages/media/videos`
- `src/app/pages/media/audio`
- `src/app/pages/course/start`
- `src/app/pages/course/stop`
- `src/app/pages/course/statistics`
- `src/app/pages/terms`
- `src/app/core/services`
- `src/app/features/box-breathing`
- `src/app/features/course`
- `src/app/features/home/course-wheel`
- `src/app/features/notifications`
- `src/app/media/videos/playlist`
- `src/app/media/videos/player`
- `src/app/media/videos/task-action`
- `src/app/media/audio/list`
- `src/app/media/audio/player`

Vigtige services:

- `ApiService`: HttpClient-baserede API-kald
- `NativeStorageService`: Capacitor Preferences til storage
- `FirebasePushService`: push-klargøring
- `DeepLinkService`: appUrlOpen routing
- `KeyboardService`: native keyboard class handling
- `AlertService`: Ionic AlertController som SweetAlert-erstatning
- `VimeoService`: Vimeo iframe URL og postMessage
- `CourseProgressService`: kursus, opgaver og statistik via Preferences

## 10. Hvad der mangler eller kræver manuel opsætning

Følgende kræver typisk manuel produktionstilpasning:

- Rigtige Firebase config-filer for Android og iOS
- Associated Domains på iOS og assetlinks på Android for HTTPS universal/app links
- Backend-kontrakter bør valideres mod live API for `videos/playlists`, `sounds/playlists`, `sounds/sounds/search`, `firebase/devices`, `firebase/notifications` og `shop/terms`
- Login-flow afhænger af backend-tokenformat og `/api/auth/login`
- Native Android/iOS platforme skal tilføjes og synkroniseres, hvis de ikke allerede ligger i projektet
- Push notifications skal testes på fysisk enhed
- App Store / Play Store metadata og signing er ikke en del af denne migrering

## Verificering udført

Følgende er kørt:

```bash
npm install
npm run build
npm start -- --host 127.0.0.1 --port 4200
```

Forside, side menu, bottom navigation og login-side er åbnet i browseren og renderer korrekt.
