import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        const role = this.authService.getRole();

        if (role === 'DRIVER') {
          this.authService.getDriverVehicle().subscribe({
            next: (vehicle) => {
              if (vehicle) {
                this.router.navigate(['/driver-dashboard']);
              } else {
                this.router.navigate(['/add-vehicle']);
              }
            },
            error: (err) => {
              console.error('Error fetching vehicle:', err);
              this.router.navigate(['/add-vehicle']); 
            },
          });
        } else if (role === 'Passenger') {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Role not recognized. Please try again.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Invalid username or password';
      },
    });
  }
}
