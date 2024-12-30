import { Component, OnInit } from '@angular/core';
import { RideService } from '../ride.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { RequestsListComponent } from '../requests-list/requests-list.component';
import { RidesListComponent } from '../rides-list/rides-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { RideDTO } from '../rides.model';

@Component({
  selector: 'app-rides-page',
  imports: [
    CommonModule,
    RequestsListComponent,
    RidesListComponent,
    MatTabsModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './rides-page.component.html',
  styleUrls: ['./rides-page.component.css']
})
export class RidesPageComponent implements OnInit {
  allRides: RideDTO[] = []; 
  activeRides: RideDTO[] = []; 
  finishedRides: RideDTO[] = []; 
  requests: any[] = []; 
  isLoading: boolean = false;

  constructor(private rideService: RideService) {}

  ngOnInit(): void {
    this.loadRides();
  }

  loadRides(): void {
    this.rideService.getRides('ALL').subscribe({
      next: (data) => (this.allRides = data),
      error: (err) => console.error('Error loading all rides:', err),
    });

    this.rideService.getRides('ACTIVE').subscribe({
      next: (data) => (this.activeRides = data),
      error: (err) => console.error('Error loading active rides:', err),
    });

    this.rideService.getRides('FINISHED').subscribe({
      next: (data) => (this.finishedRides = data),
      error: (err) => console.error('Error loading finished rides:', err),
    });

    this.rideService.getRequests().subscribe({
      next: (data) => (this.requests = data),
      error: (err) => console.error('Error loading requests:', err),
    });
  }

  handleRequest(event: { requestId: number, isAccepted: boolean }): void {
    console.log('Handling request:', event);
    this.isLoading = true;
  
    if (event.requestId === undefined || event.requestId === null) {
      console.error('Invalid requestId:', event.requestId);
      this.isLoading = false; 
      return;
    }
  
    this.rideService.handleRequest(event.requestId, event.isAccepted).subscribe({
      next: () => {
        this.requests = this.requests.filter(request => request.requestId !== event.requestId);
        this.loadRides(); 
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error handling request:', err);
      },
      complete: () => (this.isLoading = false),
    });
  }
  
  cancelRide(rideId: number): void {
    this.isLoading = true;  
    
    this.rideService.cancelRide(rideId).subscribe({
      next: () => {
        this.loadRides();  
      },
      error: (err) => {
        console.error('Error canceling ride:', err);
        this.isLoading = false; 
      },
      complete: () => {
        this.isLoading = false;  
      }
    });
  }
  
  reportDelay(rideId: number, newDepartureTime: string): void {
    this.isLoading = true;  // Show the spinner
    
    const delayRequest = { newDepartureTime };
    this.rideService.reportDelay(rideId, delayRequest).subscribe({
      next: () => {
        this.loadRides();  // Reload the rides after reporting the delay
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error reporting delay:', err);
      },
      complete: () => {
        this.isLoading = false;  // Hide the spinner when the request completes
      }
    });
  }
  
  
  openDelayDialog(rideId: number): void {
    const delayMinutes = prompt('Enter delay in minutes:');
    if (delayMinutes) {
      const newDepartureTime = new Date();
      newDepartureTime.setMinutes(newDepartureTime.getMinutes() + parseInt(delayMinutes, 10));
      this.reportDelay(rideId, newDepartureTime.toISOString());
    }
  }
  
}
