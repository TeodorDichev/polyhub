import { Injectable, signal } from '@angular/core';

export interface SpecialistUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<SpecialistUser | null>(null);

  isLoggedIn() { return this.currentUser() !== null; }
  setUser(user: SpecialistUser) { this.currentUser.set(user); }
  clearUser() { this.currentUser.set(null); }
}