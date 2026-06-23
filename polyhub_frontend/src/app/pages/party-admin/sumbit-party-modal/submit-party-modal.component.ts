import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import type {
  PartyResponse,
  SubmitPartyRequest
} from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-submit-party-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './submit-party-modal.component.html',
  styleUrl: './submit-party-modal.component.scss'
})
export class SubmitPartyModalComponent implements OnInit {
  @Input() prefill: PartyResponse | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  name = '';
  description = '';
  motto = '';
  logoUrl = '';
  foundedOn = '';
  error = '';
  loading = false;
  success = false;

  constructor(private api: ApiService, private authService: AuthService) {}

  ngOnInit() {
    if (this.prefill) {
      this.name = this.prefill.name;
      this.description = this.prefill.description;
      this.motto = this.prefill.motto ?? '';
      this.logoUrl = this.prefill.logoUrl ?? '';
      this.foundedOn = this.prefill.foundedOn ?? '';
    }
  }

  isResubmit() {
    return this.prefill !== null;
  }

  onSubmit() {
    this.error = '';
    this.loading = true;

    const request: SubmitPartyRequest = {
      name: this.name,
      description: this.description,
      motto: this.motto || undefined,
      logoUrl: this.logoUrl || undefined,
      foundedOn: this.foundedOn || undefined
    };

    const call = this.isResubmit()
      ? this.api.resubmitParty(request)
      : this.api.submitParty(request);

    call.subscribe({
      next: (party) => {
        this.loading = false;
        this.success = true;
        this.authService.setPartyStatus(party.status);
        setTimeout(() => this.submitted.emit(), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'The server did not respond';
      }
    });
  }

  close() {
    this.closed.emit();
  }
}
