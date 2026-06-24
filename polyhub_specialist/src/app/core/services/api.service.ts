import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LoginRequest,
  SpecialistUser,
  ElectionResponse,
  ElectionDetailsResponse,
  CreateElectionRequest,
  PolicySummary,
  CreatePolicyRequest,
  PartyForRatingResponse,
  PartyRatingRequest,
  PartyDetailsResponse,
  ProgramForRatingResponse,
  ProgramRatingRequest,
  ProgramDetailsResponse,
} from '../models';


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

  updatePolicy(id: number, data: CreatePolicyRequest): Observable<PolicySummary> {
    return this.http.put<PolicySummary>(`${this.base}/specialist/policies/${id}`, data, { withCredentials: true });
  }

  deletePolicy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/specialist/policies/${id}`, { withCredentials: true });
  }

  getElectionById(id: number): Observable<ElectionDetailsResponse> {
    return this.http.get<ElectionDetailsResponse>(`${this.base}/specialist/elections/${id}`, { withCredentials: true });
  }

  getPartyDetails(id: number): Observable<PartyDetailsResponse> {
    return this.http.get<PartyDetailsResponse>(`${this.base}/parties/details/${id}`, { withCredentials: true });
  }

  getProgramDetails(id: number): Observable<ProgramDetailsResponse> {
    return this.http.get<ProgramDetailsResponse>(`${this.base}/programs/details/${id}`, { withCredentials: true });
  }

  getPartiesForRating(): Observable<PartyForRatingResponse[]> {
    return this.http.get<PartyForRatingResponse[]>(`${this.base}/specialist/parties`, { withCredentials: true });
  }

  rateParty(id: number, data: PartyRatingRequest): Observable<PartyForRatingResponse> {
    return this.http.put<PartyForRatingResponse>(`${this.base}/specialist/parties/${id}/rate`, data, { withCredentials: true });
  }

  getProgramsForRating(): Observable<ProgramForRatingResponse[]> {
    return this.http.get<ProgramForRatingResponse[]>(`${this.base}/specialist/programs`, { withCredentials: true });
  }

  getProgramForRating(id: number): Observable<ProgramForRatingResponse> {
    return this.http.get<ProgramForRatingResponse>(`${this.base}/specialist/programs/${id}`, { withCredentials: true });
  }

  rateProgram(id: number, data: ProgramRatingRequest): Observable<ProgramForRatingResponse> {
    return this.http.put<ProgramForRatingResponse>(`${this.base}/specialist/programs/${id}/rate`, data, { withCredentials: true });
  }
}