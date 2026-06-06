import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.error = '';
    this.loading = true;

    this.api.login({ email: this.email, password: this.password }).subscribe({
        next: (user) => {
        this.authService.setUser(user);
        // fetch party status after login
        this.api.getMyParty().subscribe({
            next: (party) => {
            this.authService.setPartyStatus(party.status);
            this.router.navigate(['/dashboard']);
            },
            error: () => {
            // 404 means no party yet — that's fine
            this.authService.setPartyStatus(null);
            this.router.navigate(['/dashboard']);
            }
    });
        },
    error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'The server did not respond';
        }
    });
  }
}