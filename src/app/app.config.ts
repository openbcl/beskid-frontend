import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideServiceWorker } from '@angular/service-worker';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthEffects } from './store/auth.effects';
import { authFeatureKey, authReducer } from './store/auth.reducer';
import { tokenInterceptor } from './shared/token.interceptor';
import { ModelEffects } from './store/model.effects';
import { modelFeatureKey, modelReducer } from './store/model.reducer';
import { taskFeatureKey, taskReducer } from './store/task.reducer';
import { TaskEffects } from './store/task.effects';
import { ToastEffects } from './store/toast.effects';
import { UiEffects } from './store/ui.effects';
import { uiFeatureKey, uiReducer } from './store/ui.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(JwtModule.forRoot({
        config: {
            tokenGetter: () => localStorage.getItem('token'),
            allowedDomains: [environment.domain, environment.backend]
        }
    })),
    { provide: JwtHelperService },
    { provide: MessageService },
    { provide: ConfirmationService },
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideStore(),
    provideAnimations(),
    provideState({ name: authFeatureKey, reducer: authReducer }),
    provideState({ name: modelFeatureKey, reducer: modelReducer }),
    provideState({ name: taskFeatureKey, reducer: taskReducer }),
    provideState({ name: uiFeatureKey, reducer: uiReducer }),
    provideEffects(AuthEffects, ModelEffects, TaskEffects, ToastEffects, UiEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
]
};
