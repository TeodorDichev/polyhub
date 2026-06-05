import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './core/services/api.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private api: ApiService, private authService: AuthService) {}

  ngOnInit() {
    this.api.me().subscribe({
      next: (user) => {
        this.authService.setUser(user);
        this.api.getMyParty().subscribe({
          next: (party) => this.authService.setPartyStatus(party.status),
          error: () => this.authService.setPartyStatus(null)
        });
      },
      error: () => {
        // no valid cookie — stay logged out
        this.authService.clearUser();
      }
    });
  }
}