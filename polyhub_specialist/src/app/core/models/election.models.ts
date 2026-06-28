import { ElectionPartyResult } from './party.models';

export interface ElectionResponse {
  id: number;
  name: string;
  electionDate: string;
  description?: string;
  type: string;
  status?: string;
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

export interface PartyResultEntry {
  partyId: number;
  votesCount?: number;
  votePercentage?: number;
}

export interface ElectionResultsRequest {
  results: PartyResultEntry[];
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
