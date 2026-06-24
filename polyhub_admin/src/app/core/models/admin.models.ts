export interface AdminPartyResponse {
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

export interface AdminUserResponse {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  createdAt: string;
  deletedAt?: string;
  suspendedOn?: string;
}

export interface CreateSpecialistRequest {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}
