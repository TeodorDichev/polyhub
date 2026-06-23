import {
  PolicySummary,
  ProgramPolicyDetailsResponse
} from './policy.models';

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
