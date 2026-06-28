import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  public email: string = '';
  public password: string = '';
  public firstname: string = '';
  public lastname: string = '';
  public error: string = '';
  public loading: boolean = false;

  constructor(private api: ApiService, private router: Router) {}

  public onSubmit(): void {
    this.error = '';
    this.loading = true;

    this.api.register({
      email: this.email,
      password: this.password,
      firstname: this.firstname,
      lastname: this.lastname
    }).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'The server did not respond';
      }
    });
  }
}