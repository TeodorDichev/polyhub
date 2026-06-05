import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <h2 style="color: var(--gold); margin-bottom: 1.5rem;">Party Admin Dashboard</h2>
    <router-outlet />
  `
})
export class DashboardComponent {}