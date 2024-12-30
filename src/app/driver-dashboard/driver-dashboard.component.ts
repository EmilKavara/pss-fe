import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-driver-dashboard',
  templateUrl: './driver-dashboard.component.html',
  imports: [CommonModule, FormsModule], 
  styleUrls: ['./driver-dashboard.component.css'],
})
export class DriverDashboardComponent implements OnInit {
  driver: any = {}; 
  notifications: any[] = []; 

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.getDriverProfile();
    this.getNotifications();
  }

  getDriverProfile(): void {
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`, 
    });

    this.http.get('http://localhost:8080/users/profile', { headers }).subscribe({
      next: (data: any) => {
        this.driver = data; 
      },
      error: (err) => console.error('Error fetching driver profile:', err),
    });
  }
  
  

  getNotifications(): void {
    this.http.get('http://localhost:8080/notifications').subscribe({
      next: (data: any) => (this.notifications = data),
      error: (err) => console.error('Error fetching notifications:', err),
    });
  }

  navigateTo(page: string): void {
    this.router.navigate([`/${page}`]);
  }

  logout(): void {
    console.log('Logging out...');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
