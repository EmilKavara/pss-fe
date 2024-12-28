import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes'; 
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';  // Import components
import { provideAnimations } from '@angular/platform-browser/animations'; 

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),  // Provide routing
    provideHttpClient(),    // Provide HTTP client
    provideAnimations(),
  ]
})
  .catch(err => console.error(err));
