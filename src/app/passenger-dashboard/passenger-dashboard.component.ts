import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { RideService } from '../rides/ride.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms'; 
import { NotificationsComponent } from '../notifications/notifications.component';
import { RideDTO } from '../rides/rides.model';


@Component({
  selector: 'app-passenger-dashboard',
  imports: [CommonModule, FormsModule, NotificationsComponent],  
  templateUrl: './passenger-dashboard.component.html',
  styleUrls: ['./passenger-dashboard.component.css']
})
export class PassengerDashboardComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  availableRides: any[] = [];
  isLoading: boolean = false;
  requestedRides: Set<number> = new Set<number>();
  filters = {
    destination: '',
    minSeats: 0,
    sortBy: ''
  };
  userId: number | null = null;
  allDestinations: string[] = [];
  filteredDestinations: string[] = []; 
  bookedRides: RideDTO[] = [];


  constructor(
    private rideService: RideService,
    private router: Router,
    private http: HttpClient, 
    private authService: AuthService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'passenger-dashboard-body');
    this.fetchUserProfile();
    this.fetchAvailableRides();
    this.loadBookedRides();
  }

  fetchUserProfile(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });
    this.http.get('http://localhost:8080/users/profile', { headers }).subscribe({
      next: (profile: any) => {
        this.userId = profile.userId;
        this.getNotifications();
      },
      error: (err) => console.error('Error fetching user profile:', err),
    });
  }

  getNotifications(): void {
    if (this.userId === null) {
      console.error('User ID not available for fetching notifications.');
      return;
    }

    const url = `http://localhost:8080/notifications/user/${this.userId}`;
    this.http.get(url).subscribe({
      next: (data: any) => (this.notifications = data),
      error: (err) => console.error('Error fetching notifications:', err),
    });
  }

  fetchAvailableRides(): void {
    this.isLoading = true;
    this.rideService.getFilteredRides(this.filters).subscribe({
      next: (data) => {
        this.availableRides = data;
        this.extractUniqueDestinations();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  extractUniqueDestinations(): void {
    const destinations = this.availableRides.map(ride => ride.destination);
    this.allDestinations = Array.from(new Set(destinations));
    this.filteredDestinations = [...this.allDestinations]; 
  }

  filterDestinationOptions(): void {
    const search = this.filters.destination.toLowerCase();
    this.filteredDestinations = this.allDestinations.filter(dest =>
      dest.toLowerCase().includes(search)
    );
  }

  applyFilters(): void {
    this.applyFiltersUI();
    this.fetchAvailableRides();
  }

  sendRideRequest(rideId: number): void {
    this.rideService.sendRequest(rideId).subscribe({
      next: () => {
        alert('Request sent successfully');
        this.requestedRides.add(rideId); 
      },
      error: () => alert('Failed to send request'),
    });
  }
  

  logout(): void {
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  cancelRide(rideId: number): void {
    this.isLoading = true;
    if (this.userId === null) {
      console.error('User ID is null. Cannot cancel ride.');
      return; 
  }
    this.rideService.cancelRidePassenger(rideId, this.userId).subscribe(
      (response) => {
        this.loadBookedRides();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error cancelling ride:', error);
        this.isLoading = false;
      }
    );
  }

  loadBookedRides(): void {
    this.rideService.getBookedRides().subscribe(
      (data) => {
        this.bookedRides = data;
      },
      (error) => {
        console.error('Error loading booked rides:', error);
      }
    );
  }

  applyFiltersUI() {
    if (this.filters.minSeats < 1) {
      this.filters.minSeats = 1;  
      alert('Minimum number of seats should be at least 1');
    }
    console.log(this.filters); 
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'passenger-dashboard-body');
  }
  
  
}
