import { Injectable, signal } from '@angular/core';

export interface LoggedUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<LoggedUser | null>(null);
  partyStatus = signal<string | null>(null); // null = no party yet
  loading = signal<boolean>(true);

  isLoggedIn() {
    return this.currentUser() !== null;
  }

  setUser(user: LoggedUser) {
    this.currentUser.set(user);
  }

  clearUser() {
    this.currentUser.set(null);
    this.partyStatus.set(null);
  }

  setPartyStatus(status: string | null) {
    this.partyStatus.set(status);
  }

  hasNoParty() {
    return this.partyStatus() === null;
  }

  hasApprovedParty() {
    return this.partyStatus() === 'APPROVED';
  }
}
