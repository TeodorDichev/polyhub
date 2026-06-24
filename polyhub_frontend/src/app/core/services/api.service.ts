import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import type {
  CreateProgramRequest,
  ElectionDetailsResponse,
  ElectionPageResponse,
  ElectionResponse,
  ElectionWithProgramResponse,
  LoggedPartyAdmin,
  LoginRequest,
  PartyDetailsResponse,
  PartyPageResponse,
  PartyResponse,
  PolicySummary,
  ProgramDetailsResponse,
  ProgramResponse,
  ProgramSuggestion,
  RegisterRequest,
  SubmitPartyRequest
} from '../models';

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
      withCredentials: true
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.base}/auth/logout`, {}, {
      withCredentials: true
    });
  }

  me(): Observable<LoggedPartyAdmin> {
    return this.http.get<LoggedPartyAdmin>(`${this.base}/auth/me`, {
      withCredentials: true
    });
  }

  getElections(): Observable<ElectionResponse[]> {
    return this.http.get<ElectionResponse[]>(`${this.base}/elections`, {
      withCredentials: true
    });
  }

  getElectionById(id: number): Observable<ElectionDetailsResponse> {
    return this.http.get<ElectionDetailsResponse>(`${this.base}/elections/${id}`, {
      withCredentials: true
    });
  }

  getProgramDetails(id: number): Observable<ProgramDetailsResponse> {
    return this.http.get<ProgramDetailsResponse>(`${this.base}/programs/details/${id}`, {
      withCredentials: true
    });
  }

  getParties(
    page: number,
    size: number,
    search: string
  ): Observable<PartyPageResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('search', search);

    return this.http.get<PartyPageResponse>(`${this.base}/parties`, {
      params,
      withCredentials: true
    });
  }

  getPartyDetails(id: number): Observable<PartyDetailsResponse> {
    return this.http.get<PartyDetailsResponse>(`${this.base}/parties/details/${id}`, {
      withCredentials: true
    });
  }

    submitParty(data: SubmitPartyRequest): Observable<PartyResponse> {
    return this.http.post<PartyResponse>(`${this.base}/party-admin/parties/submit`, data, {
      withCredentials: true
    });
  }

  getMyParty(): Observable<PartyResponse> {
    return this.http.get<PartyResponse>(`${this.base}/party-admin/parties/my`, {
      withCredentials: true
    });
  }

  resubmitParty(data: SubmitPartyRequest): Observable<PartyResponse> {
    return this.http.put<PartyResponse>(`${this.base}/party-admin/parties/resubmit`, data, {
      withCredentials: true
    });
  }

  getElectionsWithProgramStatus(): Observable<ElectionWithProgramResponse[]> {
    return this.http.get<ElectionWithProgramResponse[]>(`${this.base}/party-admin/elections`, { withCredentials: true });
  }

  // check if the two below are used anywhere and delete
  getAllPolicies(): Observable<PolicySummary[]> {
    return this.http.get<PolicySummary[]>(`${this.base}/party-admin/policies`, { withCredentials: true });
  }

  getProgramPolicies(programId: number): Observable<PolicySummary[]> {
    return this.http.get<PolicySummary[]>(`${this.base}/party-admin/programs/${programId}/policies`, { withCredentials: true });
  }

  searchPolicies(query: string): Observable<PolicySummary[]> {
    return this.http.get<PolicySummary[]>(`${this.base}/party-admin/policies/s`,
      {
        params: { query },
        withCredentials: true
      }
    );
  }

  getElectionsPage(
    page: number,
    size: number,
    search: string
  ): Observable<ElectionPageResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('search', search);

    return this.http.get<ElectionPageResponse>(`${this.base}/elections/page`, {
      params,
      withCredentials: true
    });
  }

  getProgramSuggestion(): Observable<ProgramSuggestion> {
    return this.http.get<ProgramSuggestion>(`${this.base}/party-admin/programs/suggestion`, { withCredentials: true });
  }

  getMyProgram(electionId: number): Observable<ProgramResponse> {
    return this.http.get<ProgramResponse>(`${this.base}/party-admin/programs/${electionId}`, { withCredentials: true });
  }

  saveProgram(electionId: number, data: CreateProgramRequest): Observable<ProgramResponse> {
    return this.http.put<ProgramResponse>(`${this.base}/party-admin/programs/${electionId}`, data, { withCredentials: true });
  }

  selfRateParty(data: { selfEconomicAxis: number; selfSocialAxis: number }): Observable<void> {
    return this.http.put<void>(`${this.base}/party-admin/parties/self-rating`, data, { withCredentials: true });
  }
}
