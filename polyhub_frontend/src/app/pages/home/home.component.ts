import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="hero">
      <h1>Welcome to <span>PolyHub</span></h1>
      <p>The political platform for transparent democratic participation.</p>
    </div>
  `,
  styles: [`
    .hero {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 60vh;
      text-align: center;
      gap: 1rem;

      h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--navy-lighter);

        span { color: var(--gold); }
      }

      p {
        color: var(--grey);
        font-size: 1.1rem;
      }
    }
  `]
})
export class HomeComponent {}