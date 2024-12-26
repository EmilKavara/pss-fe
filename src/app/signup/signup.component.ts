import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // For ngIf
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  signupSuccess = false;
  errorMessage = '';
  generatedUsername = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['passenger', Validators.required],
    });
  }

  onSignup() {
    if (this.signupForm.valid) {
      const signupData = this.signupForm.value;
      const username = this.generateUsername(signupData.fullName);
      this.generatedUsername = username;
  
      const requestData = { ...signupData, username };
      this.authService.signup(requestData).subscribe({
        next: () => {
          this.signupSuccess = true; 
          //this.goToLogin();
        },
        error: (err) => {
          console.error('Signup failed:', err);
          this.errorMessage = 'Signup failed. Please try again.';
        },
      });
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }
  

  generateUsername(fullName: string): string {
    return fullName
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  }

  goToLogin() {
    this.router.navigate(['/login']); 
  }
}
