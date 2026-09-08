import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { apiUrlInterceptor } from './core/interceptors/api-url.interceptor';
import { notificationInterceptor } from './core/interceptors/notificationInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiUrlInterceptor, jwtInterceptor,notificationInterceptor])),
    provideToastr(),
    provideAnimations()
  ]
};