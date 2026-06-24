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
  currentUser = signal<AdminUser | null>(null);

  isLoggedIn() { return this.currentUser() !== null; }
  setUser(user: AdminUser) { this.currentUser.set(user); }
  clearUser() { this.currentUser.set(null); }
}