import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rides-list',
  imports: [CommonModule, MatTableModule],
  templateUrl: './rides-list.component.html',
  styleUrls: ['./rides-list.component.css']
})
export class RidesListComponent {
  @Input() rides: any[] = [];
  @Output() onCancelRide = new EventEmitter<number>();
  @Output() onReportDelay = new EventEmitter<number>();
  displayedColumns: string[] = ['origin', 'destination', 'departureTime', 'status', 'actions'];

  onCancel(rideId: number): void {
    this.onCancelRide.emit(rideId);
  }

  onDelay(rideId: number): void {
    this.onReportDelay.emit(rideId);
  }

}
