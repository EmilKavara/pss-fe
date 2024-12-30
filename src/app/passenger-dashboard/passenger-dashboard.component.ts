import { Component, OnInit } from '@angular/core';
import { RideService } from '../rides/ride.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-passenger-dashboard',
  imports: [CommonModule, FormsModule],  
  templateUrl: './passenger-dashboard.component.html',
  styleUrls: ['./passenger-dashboard.component.css']
})
export class PassengerDashboardComponent implements OnInit {
  notifications: any[] = [];
  availableRides: any[] = [];
  isLoading: boolean = false;
  filters = {
    destination: '',
    minSeats: 0,
    sortBy: ''
  };

  constructor(
    private rideService: RideService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getNotifications();
    this.fetchAvailableRides();
  }

  getNotifications(): void {
    this.http.get('http://localhost:8080/notifications').subscribe({
      next: (data: any) => (this.notifications = data),
      error: (err) => console.error('Error fetching notifications:', err),
    });
  }

  fetchAvailableRides(): void {
    this.isLoading = true;
    this.rideService.getFilteredRides(this.filters).subscribe({
      next: (data) => {
        this.availableRides = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.fetchAvailableRides();
  }

  sendRideRequest(rideId: number): void {
    this.rideService.sendRequest(rideId).subscribe({
      next: () => alert('Request sent successfully'),
      error: () => alert('Failed to send request')
    });
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
