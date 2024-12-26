import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './user.service';
import { CommonModule } from '@angular/common';  // For ngIf
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  profileForm: FormGroup;
  isLoading = false;
  errorMessage: string = '';
  isEditing = false; // Toggle for edit mode

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required], 
    });
    
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  // Load user profile data
  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getUserProfile().subscribe({
      next: (userData) => {
        this.user = userData;
        this.user.role = this.formatRole(this.user.role); // Format the role
        this.profileForm.patchValue({
          fullName: this.user.fullName,
          email: this.user.email
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load user profile';
        this.isLoading = false;
      }
    });
  }

  // Format role to capitalize the first letter
  formatRole(role: string): string {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  // Enable edit mode
  startEditing(): void {
    this.isEditing = true;
  }

  // Submit updated profile
  onSubmit(): void {
    if (this.profileForm.valid) {
      this.userService.updateUserProfile(this.profileForm.value).subscribe({
        next: () => {
          this.isEditing = false;
          this.loadUserProfile(); // Reload updated profile
          alert('Profile updated successfully!');
        },
        error: () => {
          this.errorMessage = 'Error updating profile. Please try again.';
        }
      });
    }
  }

  // Navigate to manage vehicles if user is a driver
  manageVehicles(): void {
    if (this.user.role === 'Driver') {
      this.router.navigate(['/manage-vehicles']);
    }
  }

  // Close the edit mode without saving
  cancelEditing(): void {
    this.isEditing = false;
    this.profileForm.patchValue({
      fullName: this.user.fullName,
      email: this.user.email
    });
  }
}