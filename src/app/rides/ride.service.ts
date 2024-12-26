import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RideService {
  private apiUrl = 'http://localhost:8080/rides';

  constructor(private http: HttpClient, private authService: AuthService) {}

  createRide(rideData: any): Observable<any> {
    const token = this.authService.getToken();  // Retrieve the token from AuthService

    // Add the token to the Authorization header
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/ride`, rideData, { headers });
  }
}
