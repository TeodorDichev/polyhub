import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterRequest {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoggedPartyAdmin {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/auth/register`, data, {
      withCredentials: true
    });
  }

  login(data: LoginRequest): Observable<LoggedPartyAdmin> {
    return this.http.post<LoggedPartyAdmin>(`${this.base}/auth/login`, data, {
      withCredentials: true  // critical — tells browser to send/receive cookies
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.base}/auth/logout`, {}, {
      withCredentials: true
    });
  }
}