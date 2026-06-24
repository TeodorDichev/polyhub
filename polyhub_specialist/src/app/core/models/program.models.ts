import { PolicySummary } from './policy.models';

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
