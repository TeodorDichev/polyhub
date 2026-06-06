import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest { email: string; password: string; }
export interface AdminUser { id: number; email: string; firstname: string; lastname: string; role: string; }

export interface AdminPartyResponse {
  id: number;
  name: string;
  description: string;
  motto?: string;
  logoUrl?: string;
  foundedOn?: string;
  status: string;
  rejectionComment?: string;
  createdAt: string;
  createdByEmail: string;
}

export interface AdminUserResponse {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  createdAt: string;
  deletedAt?: string;
  suspendedOn?: string;
}

export interface CreateSpecialistRequest {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<AdminUser> {
    return this.http.post<AdminUser>(`${this.base}/auth/login`, data, { withCredentials: true });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.base}/auth/logout`, {}, { withCredentials: true });
  }

  me(): Observable<AdminUser> {
    return this.http.get<AdminUser>(`${this.base}/auth/me`, { withCredentials: true });
  }

  // Party Requests
  getAllParties(): Observable<AdminPartyResponse[]> {
    return this.http.get<AdminPartyResponse[]>(`${this.base}/admin/parties`, { withCredentials: true });
  }

  approveParty(id: number): Observable<AdminPartyResponse> {
    return this.http.put<AdminPartyResponse>(`${this.base}/admin/parties/${id}/approve`, {}, { withCredentials: true });
  }

  rejectParty(id: number, comment?: string): Observable<AdminPartyResponse> {
    return this.http.put<AdminPartyResponse>(`${this.base}/admin/parties/${id}/reject`, { comment }, { withCredentials: true });
  }

  deleteParty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/admin/parties/${id}`, { withCredentials: true });
  }

  // Party Admins
  getAllPartyAdmins(): Observable<AdminUserResponse[]> {
    return this.http.get<AdminUserResponse[]>(`${this.base}/admin/party-admins`, { withCredentials: true });
  }

  suspendPartyAdmin(id: number): Observable<AdminUserResponse> {
    return this.http.put<AdminUserResponse>(`${this.base}/admin/party-admins/${id}/suspend`, {}, { withCredentials: true });
  }

  unsuspendPartyAdmin(id: number): Observable<AdminUserResponse> {
    return this.http.put<AdminUserResponse>(`${this.base}/admin/party-admins/${id}/unsuspend`, {}, { withCredentials: true });
  }

  deletePartyAdmin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/admin/party-admins/${id}`, { withCredentials: true });
  }

  // Specialists
  getAllSpecialists(): Observable<AdminUserResponse[]> {
    return this.http.get<AdminUserResponse[]>(`${this.base}/admin/specialists`, { withCredentials: true });
  }

  createSpecialist(data: CreateSpecialistRequest): Observable<AdminUserResponse> {
    return this.http.post<AdminUserResponse>(`${this.base}/admin/specialists`, data, { withCredentials: true });
  }

  deleteSpecialist(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/admin/specialists/${id}`, { withCredentials: true });
  }
}