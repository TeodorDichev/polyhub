import { PolicySummary } from './policy.models';

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
