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
  status?: string;
}

export interface ElectionPartyResult {
  partyId: number;
  partyName: string;
  partyDescription: string;
  partyMotto?: string;
  partySelfEconomicAxis?: number;
  partySelfSocialAxis?: number;
  partySpecEconomicAxis?: number;
  partySpecSocialAxis?: number;
  votesCount?: number;
  votePercentage?: number;
  programId?: number;
  programTitle?: string;
  programSelfEconomicAxis?: number;
  programSelfSocialAxis?: number;
  programSpecEconomicAxis?: number;
  programSpecSocialAxis?: number;
}

export interface ElectionDetailsResponse {
  id: number;
  name: string;
  electionDate: string;
  description?: string;
  type: string;
  status?: string;
  winnerPartyName?: string;
  winnerVotePercentage?: number;
  parties: ElectionPartyResult[];
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

export interface PartyForRatingResponse {
  id: number;
  name: string;
  motto?: string;
  description: string;
  logoUrl?: string;
  foundedOn?: string;
  selfEconomicAxis?: number;
  selfSocialAxis?: number;
  specEconomicAxis?: number;
  specSocialAxis?: number;
  rated: boolean;
  politicalLabel?: string;
}

export interface PartyRatingRequest {
  specEconomicAxis: number;
  specSocialAxis: number;
}

export interface PolicySummary2 {
  id: number;
  name: string;
  slug: string;
  politicalPosition: string;
}

export interface ProgramForRatingResponse {
  programId: number;
  title: string;
  content: string;
  selfEconomicAxis?: number;
  selfSocialAxis?: number;
  specEconomicAxis?: number;
  specSocialAxis?: number;
  createdAt: string;
  lastEditAt?: string;
  policies: PolicySummary[];
  electionId: number;
  electionName: string;
  electionDate: string;
  partyId: number;
  partyName: string;
  partyMotto?: string;
  partyDescription: string;
  partyLogoUrl?: string;
  rated: boolean;
  electionPassed: boolean;
}

export interface ProgramRatingRequest {
  specEconomicAxis: number;
  specSocialAxis: number;
}

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
  electionStatus: string;
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
  politicalLabel?: string | null;
  programs: PartyProgramSummaryResponse[];
  participations: PartyElectionParticipationResponse[];
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