import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AuthEffects } from './store/auth.effects';
import { authFeatureKey, authReducer } from './store/auth.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(JwtModule.forRoot({
        config: {
            tokenGetter: () => localStorage.getItem('token'),
            allowedDomains: [environment.domain, environment.backend]
        }
    })),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    { provide: JwtHelperService },
    provideStore(),
    provideState({ name: authFeatureKey, reducer: authReducer }),
    provideEffects(AuthEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
};
