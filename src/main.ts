import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes'; 
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';  
import { provideAnimations } from '@angular/platform-browser/animations'; 

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),  
    provideHttpClient(),    
    provideAnimations(),
  ]
})
  .catch(err => console.error(err));
