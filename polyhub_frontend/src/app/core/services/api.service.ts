import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  politicalLabel?: string | null;

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

export interface ElectionWithProgramResponse {
  id: number;
  name: string;
  electionDate: string;
  description?: string;
  type: string;
  status: string;
  winnerPartyName?: string;
  winnerVotePercentage?: number;
  programId?: number;
  hasProgram: boolean;
  editable: boolean;
}

export interface PolicySummary {
  id: number;
  name: string;
  slug: string;
  politicalPosition: string;
}

export interface ProgramSuggestion {
  title: string;
  content: string;
  selfEconomicAxis?: number;
  selfSocialAxis?: number;
  policies: PolicySummary[];
}

export interface CreateProgramRequest {
  title: string;
  content: string;
  selfEconomicAxis?: number;
  selfSocialAxis?: number;
  policyIds: number[];
}

export interface ProgramResponse {
  id: number;
  title: string;
  content: string;
  selfEconomicAxis?: number;
  selfSocialAxis?: number;
  specEconomicAxis?: number;
  specSocialAxis?: number;
  createdAt: string;
  lastEditAt?: string;
  electionId: number;
  electionName: string;
  partyId: number;
  partyName: string;
  policies: PolicySummary[];
}

export interface PartyListItemResponse {
  id: number;
  name: string;
  description: string;
  motto?: string | null;
  logoUrl?: string | null;
  foundedOn?: string | null;
  specEconomicAxis?: number | null;
  specSocialAxis?: number | null;
  politicalLabel?: string | null;
}

export interface PartyPageResponse {
  parties: PartyListItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
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
