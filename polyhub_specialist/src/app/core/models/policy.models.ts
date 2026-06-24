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
