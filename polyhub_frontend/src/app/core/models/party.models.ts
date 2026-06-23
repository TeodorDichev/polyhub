import { ElectionStatus } from './common.models';

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
  electionStatus: ElectionStatus;

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
