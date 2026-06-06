import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { SubmitPartyModalComponent } from '../sumbit-party-modal/submit-party-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SubmitPartyModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  dismissed = false;

  constructor(public authService: AuthService) {}

  get showModal(): boolean {
    return !this.authService.loading() && this.authService.hasNoParty() && !this.dismissed;
  }

  onModalClosed() {
    this.dismissed = true;
  }

  onPartySubmitted() {
    this.dismissed = true;
  }
}