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
import { MessageService } from 'primeng/api';
import { AuthEffects } from './store/auth.effects';
import { authFeatureKey, authReducer } from './store/auth.reducer';
import { tokenInterceptor } from './shared/token.interceptor';
import { ModelEffects } from './store/model.effects';
import { modelFeatureKey, modelReducer } from './store/model.reducer';
import { taskFeatureKey, taskReducer } from './store/task.reducer';
import { TaskEffects } from './store/task.effects';
import { ToastEffects } from './store/toast.effects';

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
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideStore(),
    provideAnimations(),
    provideState({ name: authFeatureKey, reducer: authReducer }),
    provideState({ name: modelFeatureKey, reducer: modelReducer }),
    provideState({ name: taskFeatureKey, reducer: taskReducer }),
    provideEffects(AuthEffects, ModelEffects, TaskEffects, ToastEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
};
