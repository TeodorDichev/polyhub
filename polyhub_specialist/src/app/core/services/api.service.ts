import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest { email: string; password: string; }
export interface SpecialistUser { id: number; email: string; firstname: string; lastname: string; role: string; }

export interface ElectionResponse {
  id: number;
  name: string;
  electionDate: string;
  description?: string;
  type: string;
}

export interface CreateElectionRequest {
  name: string;
  electionDate: string;
  type: string;
  description?: string;
}

export interface PolicySummary {
  id: number;
  name: string;
  slug: string;
  politicalPosition: string;
}

export interface CreatePolicyRequest {
  name: string;
  slug: string;
  specEconomicAxis: number;
  specSocialAxis: number;
}

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

  getElections(): Observable<ElectionResponse[]> {
    return this.http.get<ElectionResponse[]>(`${this.base}/specialist/elections`, { withCredentials: true });
  }

  createElection(data: CreateElectionRequest): Observable<ElectionResponse> {
    return this.http.post<ElectionResponse>(`${this.base}/specialist/elections`, data, { withCredentials: true });
  }

  updateElection(id: number, data: CreateElectionRequest): Observable<ElectionResponse> {
    return this.http.put<ElectionResponse>(`${this.base}/specialist/elections/${id}`, data, { withCredentials: true });
  }

  deleteElection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/specialist/elections/${id}`, { withCredentials: true });
  }

  getPolicies(): Observable<PolicySummary[]> {
    return this.http.get<PolicySummary[]>(`${this.base}/specialist/policies`, { withCredentials: true });
  }

  createPolicy(data: CreatePolicyRequest): Observable<PolicySummary> {
    return this.http.post<PolicySummary>(`${this.base}/specialist/policies`, data, { withCredentials: true });
  }

  deletePolicy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/specialist/policies/${id}`, { withCredentials: true });
  }
}