import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { RideStatusDTO, RideDTO, RequestDTO } from './rides.model';

@Injectable({
  providedIn: 'root',
})
export class RideService {
  private baseUrl = 'http://localhost:8080/rides';
  private baseUrlRP = 'http://localhost:8080/ride-passengers';

  constructor(private http: HttpClient, private authService: AuthService) {}


  createRide(rideData: any): Observable<any> {
    const token = this.authService.getToken();  

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
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get<RequestDTO[]>(`${this.baseUrlRP}/requests`,{headers});
  }

  handleRequest(requestId: number, isAccepted: boolean): Observable<void> {
    const token = this.authService.getToken();  
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    return this.http.post<void>(`${this.baseUrlRP}/requests/${requestId}/handle?isAccepted=${isAccepted}`, {}, { headers });
  }
  
  cancelRide(rideId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.baseUrl}/${rideId}/cancel`, {}, { headers });
  }
  
  reportDelay(rideId: number, delayRequest: { newDepartureTime: string }): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.baseUrl}/${rideId}/delay`, delayRequest, { headers });
  }

  getAvailableRides(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/filter?status=Active`);
  }

  sendRequest(rideId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/requests/${rideId}/handle`, { isAccepted: true });
  }

  getFilteredRides(filters: any): Observable<RideStatusDTO[]> {
    let params = new HttpParams().set('status', 'Active');

    if (filters.destination) {
      params = params.set('destination', filters.destination);
    }
    if (filters.minSeats) {
      params = params.set('minSeats', filters.minSeats.toString());
    }
    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }

    return this.http.get<RideStatusDTO[]>(`${this.baseUrl}/filter-advanced`, { params });
  }
  

}
