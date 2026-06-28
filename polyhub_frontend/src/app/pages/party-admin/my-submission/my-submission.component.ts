import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import type {
  PartyResponse,
  SubmitPartyRequest
} from '../../../core/models';
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
  public party: PartyResponse | null = null;
  public error: string = '';
  public showResubmitModal: boolean = false;

  constructor(private api: ApiService, public authService: AuthService) {}

  public ngOnInit(): void {
    this.api.getMyParty().subscribe({
      next: (party) => { this.party = party; },
      error: () => { this.error = 'No submission found'; }
    });
  }

  public onResubmitClosed(): void {
    this.showResubmitModal = false;
  }

  public onResubmitted(): void {
    this.showResubmitModal = false;
    this.api.getMyParty().subscribe({
      next: (party) => {
        this.party = party;
        this.authService.setPartyStatus(party.status);
      }
    });
  }
}
