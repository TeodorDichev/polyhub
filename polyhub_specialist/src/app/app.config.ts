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
        if (user.role !== 'POLYHUB_SPECIALIST') {
          auth.clearUser();
          resolve();
          return;
        }
        auth.setUser(user);
        resolve();
      },
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