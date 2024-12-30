import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './user.service';
import { CommonModule } from '@angular/common'; 
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
  isEditing = false; 

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

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getUserProfile().subscribe({
      next: (userData) => {
        this.user = userData;
        this.user.role = this.formatRole(this.user.role); 
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

  formatRole(role: string): string {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  startEditing(): void {
    this.isEditing = true;
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.userService.updateUserProfile(this.profileForm.value).subscribe({
        next: () => {
          this.isEditing = false;
          this.loadUserProfile();
          alert('Profile updated successfully!');
        },
        error: () => {
          this.errorMessage = 'Error updating profile. Please try again.';
        }
      });
    }
  }

  manageVehicles(): void {
    if (this.user.role === 'Driver') {
      this.router.navigate(['/manage-vehicles']);
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.profileForm.patchValue({
      fullName: this.user.fullName,
      email: this.user.email
    });
  }
}