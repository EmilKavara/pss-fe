import { Component, Input, Output, EventEmitter,  OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { RequestDTO } from '../rides.model';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.css'],
  imports: [CommonModule, MatTableModule]
})
export class RequestsListComponent implements OnInit, OnDestroy {
  @Input() requests: RequestDTO[] = [];
  @Output() onHandleRequest = new EventEmitter<{ requestId: number, isAccepted: boolean }>();

  constructor(
      private renderer: Renderer2
    ){}

  displayedColumns: string[] = ['user', 'status', 'actions'];

  acceptRequest(requestId: number) {
    this.onHandleRequest.emit({ requestId, isAccepted: true });
  }

  rejectRequest(requestId: number) {
    this.onHandleRequest.emit({ requestId, isAccepted: false });
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'request-list-body');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'request-list-body');
  }
}
