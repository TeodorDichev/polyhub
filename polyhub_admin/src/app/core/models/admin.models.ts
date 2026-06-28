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

export interface AdminUserPageResponse {
  users: AdminUserResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface AdminPartyPageResponse {
  parties: AdminPartyResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
