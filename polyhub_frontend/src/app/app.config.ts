import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { ApiService } from './core/services/api.service';
import { AuthService } from './core/services/auth.service';

function initSession(api: ApiService, auth: AuthService) {
  return () => new Promise<void>((resolve) => {
    api.me().subscribe({
      next: (user) => { 
        if (user.role !== 'PARTY_ADMIN') {
          auth.clearUser();
          auth.loading.set(false);
          resolve();
          return;
        }
        auth.setUser(user);
        api.getMyParty().subscribe({
          next: (party) => { auth.setPartyStatus(party.status); auth.loading.set(false); resolve(); },
          error: () => { auth.setPartyStatus(null); auth.loading.set(false); resolve(); }
        }); },
      error: () => { auth.clearUser(); resolve(); }
    });
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: (api: ApiService, auth: AuthService) => initSession(api, auth),
      deps: [ApiService, AuthService],
      multi: true
    }
  ]
};