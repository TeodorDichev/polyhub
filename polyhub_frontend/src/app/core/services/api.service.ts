import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PartyProgramSummaryResponse {
  id: number;
  title: string;

  selfEconomicAxis?: number | null;
  selfSocialAxis?: number | null;
  specEconomicAxis?: number | null;
  specSocialAxis?: number | null;

  createdAt?: string | null;
  lastEditAt?: string | null;

  electionId: number;
  electionName: string;
  electionDate: string;
}

export interface PartyElectionParticipationResponse {
  electionId: number;
  electionName: string;
  electionDate: string;
  electionType: string;
  electionStatus: 'FINISHED' | 'RUNNING' | 'UPCOMING';

  votesCount?: number | null;
  votePercentage?: number | null;

  programId?: number | null;
  programTitle?: string | null;
}

export interface PartyDetailsResponse {
  id: number;
  name: string;
  description: string;
  motto?: string | null;
  logoUrl?: string | null;
  foundedOn?: string | null;
  createdAt?: string | null;

  selfEconomicAxis?: number | null;
  selfSocialAxis?: number | null;
  specEconomicAxis?: number | null;
  specSocialAxis?: number | null;

  programs: PartyProgramSummaryResponse[];
  participations: PartyElectionParticipationResponse[];
}

export interface ElectionResponse {
  id: number;
  name: string;
  electionDate: string;
  description: string;
  type: string;
  status: 'FINISHED' | 'RUNNING' | 'UPCOMING';
  winnerPartyName?: string | null;
  winnerVotePercentage?: number | null;
}

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

export interface SubmitPartyRequest {
  name: string;
  description: string;
  motto?: string;
  logoUrl?: string;
  foundedOn?: string;
}

export interface PartyResponse {
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

export interface ElectionPartyResultResponse {
  partyId: number;
  partyName: string;
  partyDescription: string;
  partyMotto?: string | null;

  partySelfEconomicAxis?: number | null;
  partySelfSocialAxis?: number | null;
  partySpecEconomicAxis?: number | null;
  partySpecSocialAxis?: number | null;

  votesCount?: number | null;
  votePercentage?: number | null;

  programId?: number | null;
  programTitle?: string | null;

  programSelfEconomicAxis?: number | null;
  programSelfSocialAxis?: number | null;
  programSpecEconomicAxis?: number | null;
  programSpecSocialAxis?: number | null;
}

export interface ElectionDetailsResponse {
  id: number;
  name: string;
  electionDate: string;
  description: string;
  type: string;
  status: 'FINISHED' | 'RUNNING' | 'UPCOMING';
  winnerPartyName?: string | null;
  winnerVotePercentage?: number | null;
  parties: ElectionPartyResultResponse[];
}

export interface ProgramPolicyDetailsResponse {
  id: number;
  name: string;
  slug: string;
  politicalPosition?: string | null;
  specEconomicAxis?: number | null;
  specSocialAxis?: number | null;
}

export interface ProgramDetailsResponse {
  id: number;
  title: string;
  content: string;

  selfEconomicAxis?: number | null;
  selfSocialAxis?: number | null;
  specEconomicAxis?: number | null;
  specSocialAxis?: number | null;

  createdAt?: string | null;
  lastEditAt?: string | null;

  electionId: number;
  electionName: string;
  electionDate: string;

  partyId: number;
  partyName: string;
  partyDescription: string;
  partyMotto?: string | null;

  policies: ProgramPolicyDetailsResponse[];
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

  getPartyDetails(id: number): Observable<PartyDetailsResponse> {
    return this.http.get<PartyDetailsResponse>(`${this.base}/parties/details/${id}`, {
      withCredentials: true
    });
  }

  submitParty(data: SubmitPartyRequest): Observable<PartyResponse> {
    return this.http.post<PartyResponse>(`${this.base}/parties/submit`, data, {
        withCredentials: true
    });
  }

  getMyParty(): Observable<PartyResponse> {
    return this.http.get<PartyResponse>(`${this.base}/parties/my`, {
        withCredentials: true
    });
  }

  getProgramDetails(id: number): Observable<ProgramDetailsResponse> {
    return this.http.get<ProgramDetailsResponse>(`${this.base}/programs/details/${id}`, {
      withCredentials: true
    });
  }

  getMe(): Observable<LoggedPartyAdmin> {
    return this.http.get<LoggedPartyAdmin>(`${this.base}/party-admin/me`, {
      withCredentials: true
    });
  }

  me(): Observable<LoggedPartyAdmin> {
    return this.http.get<LoggedPartyAdmin>(`${this.base}/auth/me`, {
      withCredentials: true
    });
  }

  resubmitParty(data: SubmitPartyRequest): Observable<PartyResponse> {
    return this.http.put<PartyResponse>(`${this.base}/parties/resubmit`, data, {
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
}
