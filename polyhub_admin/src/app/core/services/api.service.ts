import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LoginRequest,
  AdminUser,
  AdminPartyResponse,
  AdminUserResponse,
  CreateSpecialistRequest,
  AdminUserPageResponse,
  AdminPartyPageResponse,
} from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = 'http://localhost:8080';

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
  getAllParties(page: number = 0, size: number = 10): Observable<AdminPartyPageResponse> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<AdminPartyPageResponse>(`${this.base}/admin/parties`, { params, withCredentials: true });
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
  getAllPartyAdmins(page: number = 0, size: number = 10): Observable<AdminUserPageResponse> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<AdminUserPageResponse>(`${this.base}/admin/party-admins`, { params, withCredentials: true });
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
  getAllSpecialists(page: number = 0, size: number = 10): Observable<AdminUserPageResponse> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<AdminUserPageResponse>(`${this.base}/admin/specialists`, { params, withCredentials: true });
  }

  createSpecialist(data: CreateSpecialistRequest): Observable<AdminUserResponse> {
    return this.http.post<AdminUserResponse>(`${this.base}/admin/specialists`, data, { withCredentials: true });
  }

  deleteSpecialist(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/admin/specialists/${id}`, { withCredentials: true });
  }
}
