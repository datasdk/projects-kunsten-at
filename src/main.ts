/// <reference types="@angular/localize" />

import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

window.addEventListener('error', (event) => {
  console.error('[app] Unhandled window error', event.error ?? event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[app] Unhandled promise rejection', event.reason);
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({ animated: true })),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient()
  ],
}).catch((error) => {
  console.error('[app] Angular bootstrap failed', error);
});
