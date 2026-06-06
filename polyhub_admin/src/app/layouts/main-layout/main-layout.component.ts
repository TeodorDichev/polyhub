import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  sidebarOpen = false;

  constructor(public authService: AuthService, private api: ApiService, private router: Router) {}

  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }
  closeSidebar() { this.sidebarOpen = false; }

  logout() {
    this.api.logout().subscribe({
      next: () => { this.authService.clearUser(); this.router.navigate(['/login']); },
      error: () => { this.authService.clearUser(); this.router.navigate(['/login']); }
    });
  }
}