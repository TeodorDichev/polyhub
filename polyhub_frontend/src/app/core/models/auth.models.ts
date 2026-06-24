export interface RegisterRequest {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoggedPartyAdmin {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}
