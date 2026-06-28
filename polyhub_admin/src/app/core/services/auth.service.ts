import { Injectable, signal } from '@angular/core';

export interface AdminUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  public readonly currentUser = signal<AdminUser | null>(null);

  public isLoggedIn(): boolean { return this.currentUser() !== null; }
  public setUser(user: AdminUser): void { this.currentUser.set(user); }
  public clearUser(): void { this.currentUser.set(null); }
}
