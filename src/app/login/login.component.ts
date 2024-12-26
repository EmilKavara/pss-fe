import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // For ngIf
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Import necessary modules
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
        // Ensure the role is fetched from localStorage after login
        const role = this.authService.getRole();
        console.log('Role:', role);

        // Check role and navigate accordingly
        if (role === 'DRIVER') {
          // Check if the driver already has a vehicle
          this.authService.getDriverVehicle().subscribe({
            next: (vehicle) => {
              if (vehicle) {
                // If driver has a vehicle, navigate to driver dashboard
                this.router.navigate(['/driver-dashboard']);
              } else {
                // If no vehicle, navigate to add vehicle page
                this.router.navigate(['/add-vehicle']);
              }
            },
            error: (err) => {
              console.error('Error fetching vehicle:', err);
              this.router.navigate(['/add-vehicle']); // If error, navigate to add vehicle
            },
          });
        } else if (role === 'Passenger') {
          this.router.navigate(['/dashboard']);  // Navigate to passenger dashboard
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
