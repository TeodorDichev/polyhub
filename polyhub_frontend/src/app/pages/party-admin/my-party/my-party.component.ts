import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import type {
  PartyResponse,
  PartyDetailsResponse
} from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import {
  PoliticalPlaneComponent,
  PoliticalPoint,
  PoliticalMarker
} from '../../../shared/political-plane/political-plane.component';

@Component({
  selector: 'app-my-party',
  standalone: true,
  imports: [CommonModule, FormsModule, PoliticalPlaneComponent],
  templateUrl: './my-party.component.html',
  styleUrl: './my-party.component.scss'
})
export class MyPartyComponent implements OnInit {
  party: PartyResponse | null = null;
  partyDetails: PartyDetailsResponse | null = null;
  loading = true;
  error = '';

  showForm = false;
  name = '';
  description = '';
  motto = '';
  logoUrl = '';
  foundedOn = '';
  formError = '';
  submitting = false;
  submitSuccess = false;

  selfPoint: PoliticalPoint = { x: 0, y: 0 };
  ratingError = '';
  ratingSaved = false;
  savingRating = false;

  partyMarkers: PoliticalMarker[] = [];

  constructor(private api: ApiService, public authService: AuthService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.error = '';
    this.api.getMyParty().subscribe({
      next: (party) => {
        this.party = party;
        this.loading = false;
        this.authService.setPartyStatus(party.status);
        if (party.status === 'APPROVED') {
          this.loadDetails(party.id);
        }
      },
      error: () => {
        this.party = null;
        this.loading = false;
        this.showForm = true;
        this.authService.setPartyStatus(null);
      }
    });
  }

  loadDetails(id: number) {
    this.api.getPartyDetails(id).subscribe({
      next: (details) => {
        this.partyDetails = details;
        this.selfPoint = {
          x: details.selfEconomicAxis ?? 0,
          y: details.selfSocialAxis ?? 0
        };
        this.partyMarkers = this.buildPartyMarkers(details);
      }
    });
  }

  private buildPartyMarkers(party: PartyDetailsResponse): PoliticalMarker[] {
    const markers: PoliticalMarker[] = [];
    if (party.selfEconomicAxis != null && party.selfSocialAxis != null) {
      markers.push({ x: party.selfEconomicAxis, y: party.selfSocialAxis, label: 'Self-assessment' });
    }
    if (party.specEconomicAxis != null && party.specSocialAxis != null) {
      markers.push({ x: party.specEconomicAxis, y: party.specSocialAxis, label: 'Specialist' });
    }
    return markers;
  }

  openForm() {
    this.name = this.party?.name ?? '';
    this.description = this.party?.description ?? '';
    this.motto = this.party?.motto ?? '';
    this.logoUrl = this.party?.logoUrl ?? '';
    this.foundedOn = this.party?.foundedOn ?? '';
    this.formError = '';
    this.submitSuccess = false;
    this.showForm = true;
  }

  cancelForm() { this.showForm = false; }

  submitForm() {
    this.formError = '';
    this.submitting = true;
    const data = {
      name: this.name,
      description: this.description,
      motto: this.motto || undefined,
      logoUrl: this.logoUrl || undefined,
      foundedOn: this.foundedOn || undefined
    };
    const call = this.party ? this.api.resubmitParty(data) : this.api.submitParty(data);
    call.subscribe({
      next: (party) => {
        this.submitting = false;
        this.submitSuccess = true;
        this.party = party;
        this.authService.setPartyStatus(party.status);
        setTimeout(() => {
          this.submitSuccess = false;
          this.showForm = false;
          this.load();
        }, 1500);
      },
      error: (err) => {
        this.submitting = false;
        this.formError = err.error?.message || 'Failed to submit. Please try again.';
      }
    });
  }

  saveRating() {
    this.ratingError = '';
    this.ratingSaved = false;
    this.savingRating = true;
    this.api.selfRateParty({ selfEconomicAxis: this.selfPoint.x, selfSocialAxis: this.selfPoint.y }).subscribe({
      next: () => {
        this.savingRating = false;
        this.ratingSaved = true;
        this.loadDetails(this.party!.id);
      },
      error: (err) => {
        this.savingRating = false;
        this.ratingError = err.error?.message || 'Failed to save rating.';
      }
    });
  }
}
