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
  // signal() is Angular's reactive state - components automatically
  // re-render when this value changes
  currentUser = signal<LoggedUser | null>(null);

  isLoggedIn() {
    return this.currentUser() !== null;
  }

  setUser(user: LoggedUser) {
    this.currentUser.set(user);
  }

  clearUser() {
    this.currentUser.set(null);
  }
}