import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest { email: string; password: string; }
export interface SpecialistUser { id: number; email: string; firstname: string; lastname: string; role: string; }

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<SpecialistUser> {
    return this.http.post<SpecialistUser>(`${this.base}/auth/login`, data, { withCredentials: true });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.base}/auth/logout`, {}, { withCredentials: true });
  }

  me(): Observable<SpecialistUser> {
    return this.http.get<SpecialistUser>(`${this.base}/auth/me`, { withCredentials: true });
  }
}