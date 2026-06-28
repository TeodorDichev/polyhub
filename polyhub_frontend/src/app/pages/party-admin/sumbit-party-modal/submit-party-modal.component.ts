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
  @Input() public prefill: PartyResponse | null = null;
  @Output() public closed = new EventEmitter<void>();
  @Output() public submitted = new EventEmitter<void>();

  public name: string = '';
  public description: string = '';
  public motto: string = '';
  public logoUrl: string = '';
  public foundedOn: string = '';
  public error: string = '';
  public loading: boolean = false;
  public success: boolean = false;

  constructor(private api: ApiService, private authService: AuthService) {}

  public ngOnInit(): void {
    if (this.prefill) {
      this.name = this.prefill.name;
      this.description = this.prefill.description;
      this.motto = this.prefill.motto ?? '';
      this.logoUrl = this.prefill.logoUrl ?? '';
      this.foundedOn = this.prefill.foundedOn ?? '';
    }
  }

  public isResubmit(): boolean {
    return this.prefill !== null;
  }

  public onSubmit(): void {
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

  public close(): void {
    this.closed.emit();
  }
}
