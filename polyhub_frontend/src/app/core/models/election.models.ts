import { ElectionStatus } from './common.models';

export interface ElectionResponse {
  id: number;
  name: string;
  electionDate: string;
  description: string;
  type: string;
  status: ElectionStatus;
  winnerPartyName?: string | null;
  winnerVotePercentage?: number | null;
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
  status: ElectionStatus;
  winnerPartyName?: string | null;
  winnerVotePercentage?: number | null;
  parties: ElectionPartyResultResponse[];
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

export interface ElectionPageResponse {
  elections: ElectionResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
