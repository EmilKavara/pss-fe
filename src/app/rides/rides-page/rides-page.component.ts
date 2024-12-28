import { Component, OnInit } from '@angular/core';
import { RideService } from '../ride.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { RequestsListComponent } from '../requests-list/requests-list.component';
import { RidesListComponent } from '../rides-list/rides-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { RideDTO } from './RideStatusDTO';

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
  allRides: RideDTO[] = []; // Skladišti sve vožnje
  activeRides: RideDTO[] = []; // Skladišti aktivne vožnje
  finishedRides: RideDTO[] = []; // Skladišti završene vožnje
  requests: any[] = []; // Skladišti korisničke zahteve

  constructor(private rideService: RideService) {}

  ngOnInit(): void {
    this.loadRides();
  }

  // Učitavanje podataka za sve tabove
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

  // Upravljanje zahtevima
  handleRequest(event: { requestId: number, isAccepted: boolean }): void {
    console.log('Handling request:', event);
  
    if (event.requestId === undefined || event.requestId === null) {
      console.error('Invalid requestId:', event.requestId);
      return;
    }
  
    this.rideService.handleRequest(event.requestId, event.isAccepted).subscribe({
      next: () => {
        // Filter out the handled request from the requests list
        this.requests = this.requests.filter(request => request.requestId !== event.requestId);
        this.loadRides(); // Reload the rides data to reflect the changes
      },
      error: (err) => console.error('Error handling request:', err),
    });
  }
  

  cancelRide(rideId: number): void {
    this.rideService.cancelRide(rideId).subscribe(() => this.loadRides());
  }
  
  openDelayDialog(rideId: number): void {
    const delayMinutes = prompt('Enter delay in minutes:');
    if (delayMinutes) {
      const newDepartureTime = new Date();
      newDepartureTime.setMinutes(newDepartureTime.getMinutes() + parseInt(delayMinutes, 10));
      this.reportDelay(rideId, newDepartureTime.toISOString());
    }
  }
  
  reportDelay(rideId: number, newDepartureTime: string): void {
    const delayRequest = { newDepartureTime };
    this.rideService.reportDelay(rideId, delayRequest).subscribe(() => this.loadRides());
  }
  
  
  
}
