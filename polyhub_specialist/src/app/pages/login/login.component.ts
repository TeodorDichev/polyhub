import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public email: string = '';
  public password: string = '';
  public error: string = '';
  public loading: boolean = false;

  constructor(private api: ApiService, private authService: AuthService, private router: Router) {}

  public onSubmit(): void {
    this.error = '';
    this.loading = true;
    this.api.login({ email: this.email, password: this.password }).subscribe({
      next: (user) => {
        if (user.role !== 'POLYHUB_SPECIALIST') {
          this.api.logout().subscribe({
            next: () => this.handleAccessDenied(),
            error: () => this.handleAccessDenied()
          });
          return;
        }
        this.authService.setUser(user);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'The server did not respond';
      }
    });
  }

  private handleAccessDenied(): void {
    this.loading = false;
    this.error = 'Access denied. Specialist accounts only.';
    this.authService.clearUser();
  }
}
