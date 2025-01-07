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
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

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
  activeTabIndex: number = 0;
  private timeZone = 'Europe/Sarajevo';

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
        const rideToCancel = this.activeRides.find(ride => ride.id === rideId);
      
      if (rideToCancel) {
        this.finishedRides.push({
          ...rideToCancel,
          status: 'Cancelled',
          id: rideToCancel.id! 
        });
      }

      this.activeRides = this.activeRides.filter(ride => ride.id !== rideId);

      this.isLoading = false;
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
    this.isLoading = true;

    const delayRequest = { newDepartureTime };
    this.rideService.reportDelay(rideId, delayRequest).subscribe({
      next: () => {
        const ride = this.activeRides.find(r => r.id === rideId);
        if (ride) {
          const localTime = fromZonedTime(new Date(newDepartureTime), this.timeZone); 
          ride.departureTime = localTime.toISOString(); 
          console.log('Updated departure time:', localTime);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error reporting delay:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  
  openDelayDialog(rideId: number): void {
    const delayMinutes = prompt('Enter delay in minutes:');
    if (delayMinutes) {
      const currentLocalTime = new Date();
      const newDepartureTime = new Date(currentLocalTime);
      newDepartureTime.setMinutes(currentLocalTime.getMinutes() + parseInt(delayMinutes, 10));

      const newUtcDepartureTime = toZonedTime(newDepartureTime, this.timeZone); 

      this.reportDelay(rideId, newUtcDepartureTime.toISOString());
    }
  }
  

  onTabChange(event: any) {
    this.activeTabIndex = event.index; 
  }
  
}
