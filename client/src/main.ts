import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './routes';
import { AppComponent } from './app/app.component';
import { roleHeaderInterceptor } from './app/core/role.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([roleHeaderInterceptor])),
    provideAnimations()
  ]
}).catch(console.error);
