import { Component, OnInit } from '@angular/core';
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
export class DashboardComponent implements OnInit {
  showModal = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    if (this.authService.hasNoParty()) {
      this.showModal = true;
    }
  }

  onModalClosed() {
    this.showModal = false;
  }

  onPartySubmitted() {
    this.showModal = false;
  }
}