import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { routes } from './app.routes';
import { AlertPopupComponent } from './pages/alert-popup/alert-popup.component'; // Import AlertPopupComponent

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    HttpClientModule, // Add HttpClientModule here
    AlertPopupComponent, // Register AlertPopupComponent here
  ]
};
