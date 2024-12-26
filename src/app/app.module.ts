import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { routes } from './app.routes'; // Import routes
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';  // For ngModel

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),  
    HttpClientModule,
    CommonModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
