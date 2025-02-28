import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlannedRide } from '../rides/rides.model';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-driver-dashboard',
  templateUrl: './driver-dashboard.component.html',
  imports: [CommonModule, FormsModule, NotificationsComponent,BaseChartDirective],
  styleUrls: ['./driver-dashboard.component.css'],
})
export class DriverDashboardComponent implements OnInit, OnDestroy {
  driver: any = {};
  vehicle: any;
  notifications: any[] = [];
  plannedRides: any[] = [];
  userId: number | null = null;

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: string[] = ['October', 'November', 'December', 'January'];
  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      {
        data: [0, 0, 0, 0], 
        label: 'Rides per Month',
        backgroundColor: '#42A5F5',
        hoverBackgroundColor: '#1E88E5'
      }
    ]
  };

  constructor(private router: Router, private http: HttpClient, private authService: AuthService, private renderer: Renderer2) {Chart.register(...registerables);}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'driver-dashboard-body');
    this.getDriverProfile();
  }

  getDriverProfile(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });

    this.http.get('http://localhost:8080/users/profile', { headers }).subscribe({
      next: (data: any) => {
        this.driver = data;
        this.userId = data.userId;
        if (this.userId) {
          this.getNotifications();
          this.getPlannedRides();
          this.getVehicleInfo();
          this.loadRideStatistics();
        } else {
          console.error('User ID is null or undefined');
        }
      },
      error: (err) => console.error('Error fetching driver profile:', err),
    });
  }

  getNotifications(): void {
    if (this.userId) {
      const url = `http://localhost:8080/notifications/user/${this.userId}`;
      this.http.get(url).subscribe({
        next: (data: any) => (this.notifications = data),
        error: (err) => console.error('Error fetching notifications:', err),
      });
    }
  }

  logout(): void {
    console.log('Logging out...');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(page: string): void {
    this.router.navigate([`/${page}`]);
  }

  getPlannedRides(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });
  
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
  
    const startDate = today.toISOString().split('T')[0]; // Format: yyyy-MM-dd
const endDate = nextWeek.toISOString().split('T')[0];
  
    this.http
      .get<PlannedRide[]>(`http://localhost:8080/rides/driver/${this.userId}/planned-rides?startDate=${startDate}&endDate=${endDate}`, { headers })
      .subscribe({
        next: (rides: PlannedRide[]) => {
          this.plannedRides = rides; 
        },
        error: (err) => console.error('Error fetching planned rides:', err),
      });
  }
  
  getVehicleInfo(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });
  
    this.http.get(`http://localhost:8080/vehicles/driver`, { headers }).subscribe({
      next: (vehicleData: any) => {
        this.vehicle = vehicleData;  
      },
      error: (err) => console.error('Error fetching vehicle data:', err),
    });
  }

  loadRideStatistics(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });

    this.http.get<any[]>(`http://localhost:8080/rides/driver/${this.userId}/ride-stats`, { headers }).subscribe({
      next: (rideStats) => {
        this.updateRideStatistics(rideStats);
      },
      error: (err) => console.error('Error fetching ride statistics:', err),
    });
  }

  updateRideStatistics(rideStats: any[]): void {
    console.log('Raw rideStats data:', rideStats);
  
    const months = ['OCTOBER', 'NOVEMBER', 'DECEMBER', 'JANUARY']; 
    
    const rideCounts = new Map<string, number>();
    months.forEach(month => {
      rideCounts.set(month, 0);  
    });
  
    rideStats.forEach(stat => {
      console.log('Processing stat:', stat);
      const monthLabel = stat.timePeriod.toUpperCase(); 
      if (months.includes(monthLabel)) {
        const currentCount = rideCounts.get(monthLabel) || 0;
        rideCounts.set(monthLabel, currentCount + stat.rideCount);
      }
    });
  
    console.log('Updated ride counts:', rideCounts);
  
    this.barChartLabels = months; 
    this.barChartData.datasets[0].data = months.map(month => rideCounts.get(month) || 0);
  
    console.log('Final chart data:', this.barChartData.datasets[0].data);  
  }
  
  
  
  

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'driver-dashboard-body');
  }
    
  
}
