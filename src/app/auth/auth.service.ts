import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';  
  private baseUrlVehicle = 'http://localhost:8080/vehicles';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };
  
    return this.http.post<any>(`${this.baseUrl}/login`, loginData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }).pipe(
      tap((response) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role); 
        }
      })
    );
  }
  
  getRole(): string | null {
    return localStorage.getItem('role');
  }
  

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  signup(data: { fullName: string; email: string; password: string; role: string; username: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/signup`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  getDriverVehicle(): Observable<any> {
    return this.http.get<any>(`${this.baseUrlVehicle}/driver`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      }),
    });
  }
  
  
}
