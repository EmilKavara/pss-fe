import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { VehicleDTO } from './vehicle.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private baseUrl = 'http://localhost:8080/vehicles';

  constructor(private http: HttpClient, private authService: AuthService) {}

  addVehicle(vehicleData: any): Observable<any> {
    const token = this.authService.getToken();  
    
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        });

    return this.http.post(`${this.baseUrl}`, vehicleData, { headers });
  }

  getVehicles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getVehiclesByDriver(): Observable<VehicleDTO[]> {
    const token = this.authService.getToken();  
    
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
    return this.http.get<VehicleDTO[]>(`${this.baseUrl}/driver/vehicles`,{headers});
  }


  deleteVehicle(vehicleId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${vehicleId}`);
  }


  getMaxSeats(vehicleId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${vehicleId}/seats`);
  }

  updateVehicle(vehicleId: number, vehicleData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${vehicleId}`, vehicleData);
  }
  
}

