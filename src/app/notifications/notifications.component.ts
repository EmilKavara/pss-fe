import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  @Input() notifications: any[] = [];
  unreadCount: number = 0;
  showNotificationsDropdown: boolean = false;
  private apiUrl = 'http://localhost:8080/notifications';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.updateUnreadCount();
  }

  updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => n.status === 'unread').length;
  }

  toggleNotificationsDropdown(): void {
    this.showNotificationsDropdown = !this.showNotificationsDropdown;
    if (this.showNotificationsDropdown) {
      this.markAllAsRead();
    }
  }

  markAllAsRead(): void {
    const unreadNotificationIds = this.notifications
      .filter(n => n.status === 'UNREAD')
      .map(n => n.notificationId) 
  
    if (unreadNotificationIds.length === 0) {
      return; 
    }
  
    this.http.post(`${this.apiUrl}/mark-as-read`, unreadNotificationIds) 
      .subscribe({
        next: () => {
          this.notifications.forEach(notification => notification.status = 'READ');
          this.updateUnreadCount();
        },
        error: (err) => console.error('Failed to mark notifications as read:', err)
      });
  }
  
}
