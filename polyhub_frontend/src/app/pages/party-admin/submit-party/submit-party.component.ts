import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SubmitPartyModalComponent } from '../sumbit-party-modal/submit-party-modal.component';

@Component({
  selector: 'app-submit-party',
  standalone: true,
  imports: [CommonModule, SubmitPartyModalComponent],
  templateUrl: './submit-party.component.html',
  styleUrl: './submit-party.component.scss'
})
export class SubmitPartyComponent implements OnInit {
  public showModal: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  public ngOnInit(): void {
    const status = this.authService.partyStatus();
    if (status === 'APPROVED' || status === 'PENDING') {
      this.router.navigate(['/dashboard']);
    }
  }

  public onModalClosed(): void {
    this.router.navigate(['/dashboard']);
  }

  public onPartySubmitted(): void {
    this.router.navigate(['/dashboard']);
  }
}