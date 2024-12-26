import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private baseUrl = 'http://localhost:8080/vehicles';

  constructor(private http: HttpClient) {}

  addVehicle(vehicleData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, vehicleData);
  }

  getVehicles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
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

