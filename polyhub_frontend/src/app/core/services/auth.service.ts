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
  public readonly currentUser = signal<LoggedUser | null>(null);
  public readonly partyStatus = signal<string | null>(null);
  public readonly loading = signal<boolean>(true);

  public isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  public setUser(user: LoggedUser): void {
    this.currentUser.set(user);
  }

  public clearUser(): void {
    this.currentUser.set(null);
    this.partyStatus.set(null);
  }

  public setPartyStatus(status: string | null): void {
    this.partyStatus.set(status);
  }

  public hasNoParty(): boolean {
    return this.partyStatus() === null;
  }

  public hasApprovedParty(): boolean {
    return this.partyStatus() === 'APPROVED';
  }
}
