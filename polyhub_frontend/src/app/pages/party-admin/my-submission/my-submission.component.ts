import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, PartyResponse, SubmitPartyRequest } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { SubmitPartyModalComponent } from '../sumbit-party-modal/submit-party-modal.component';

@Component({
  selector: 'app-my-submission',
  standalone: true,
  imports: [CommonModule, SubmitPartyModalComponent],
  templateUrl: './my-submission.component.html',
  styleUrl: './my-submission.component.scss'
})
export class MySubmissionComponent implements OnInit {
  party: PartyResponse | null = null;
  error = '';
  showResubmitModal = false;

  constructor(private api: ApiService, public authService: AuthService) {}

  ngOnInit() {
    this.api.getMyParty().subscribe({
      next: (party) => this.party = party,
      error: () => this.error = 'No submission found'
    });
  }

  onResubmitClosed() {
    this.showResubmitModal = false;
  }

  onResubmitted() {
    this.showResubmitModal = false;
    this.api.getMyParty().subscribe({
      next: (party) => {
        this.party = party;
        this.authService.setPartyStatus(party.status);
      }
    });
  }
}