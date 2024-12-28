import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { RideDTO } from './rides-page/RideStatusDTO';
import { RequestDTO } from './rides-page/RequestDTO';

@Injectable({
  providedIn: 'root',
})
export class RideService {
  private baseUrl = 'http://localhost:8080/rides';
  private baseUrlRP = 'http://localhost:8080/ride-passengers';

  constructor(private http: HttpClient, private authService: AuthService) {}


  createRide(rideData: any): Observable<any> {
    const token = this.authService.getToken();  // Retrieve the token from AuthService

    // Add the token to the Authorization header
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.baseUrl}/ride`, rideData, { headers });
  }

  getRides(status: string): Observable<RideDTO[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    return this.http.get<RideDTO[]>(`${this.baseUrl}/filter?status=${status}`, { headers });
  }  

  getRequests(): Observable<RequestDTO[]> {
    const token = this.authService.getToken();
    // Add the token to the Authorization header
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get<RequestDTO[]>(`${this.baseUrlRP}/requests`,{headers});
  }

  handleRequest(requestId: number, isAccepted: boolean): Observable<void> {
    const token = this.authService.getToken();  // Retrieve the token from AuthService
  
    // Add the token to the Authorization header
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    // Pass headers in the options object correctly
    return this.http.post<void>(`${this.baseUrlRP}/requests/${requestId}/handle?isAccepted=${isAccepted}`, {}, { headers });
  }
  
  cancelRide(rideId: number): Observable<any> {
    return this.http.post(`/api/rides/${rideId}/cancel`, {});
  }
  
  reportDelay(rideId: number, delayRequest: { newDepartureTime: string }): Observable<any> {
    return this.http.post(`/api/rides/${rideId}/delay`, delayRequest);
  }
  

}
