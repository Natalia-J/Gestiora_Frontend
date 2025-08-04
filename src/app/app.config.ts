import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { tokenInterceptorInterceptor } from './services/token-interceptor-interceptor';
import { empresaHeaderInterceptor } from './interceptors/empresa-header-interceptor';
import { loaderInterceptorInterceptor } from './interceptors/loader-interceptor-interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
        provideAnimations(),
  provideToastr(),
    provideHttpClient(withInterceptors([tokenInterceptorInterceptor, empresaHeaderInterceptor, loaderInterceptorInterceptor]))
  ]
};
