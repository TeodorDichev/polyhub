export interface PolicySummary {
  id: number;
  name: string;
  slug: string;
  politicalPosition: string;
}

export interface ProgramPolicyDetailsResponse {
  id: number;
  name: string;
  slug: string;
  politicalPosition?: string | null;
  specEconomicAxis?: number | null;
  specSocialAxis?: number | null;
}
