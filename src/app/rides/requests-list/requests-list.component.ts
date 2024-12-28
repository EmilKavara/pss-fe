import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { RequestDTO } from '../rides-page/RequestDTO';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.css'],
  imports: [CommonModule, MatTableModule]
})
export class RequestsListComponent {
  @Input() requests: RequestDTO[] = [];
  @Output() onHandleRequest = new EventEmitter<{ requestId: number, isAccepted: boolean }>();

  displayedColumns: string[] = ['user', 'status', 'actions'];

  acceptRequest(requestId: number) {
    this.onHandleRequest.emit({ requestId, isAccepted: true });
  }

  rejectRequest(requestId: number) {
    this.onHandleRequest.emit({ requestId, isAccepted: false });
  }
}
