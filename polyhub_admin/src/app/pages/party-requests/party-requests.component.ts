import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, AdminPartyResponse } from '../../core/services/api.service';

@Component({
  selector: 'app-party-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './party-requests.component.html',
  styleUrl: './party-requests.component.scss'
})
export class PartyRequestsComponent implements OnInit {
  parties: AdminPartyResponse[] = [];
  error = '';
  rejectingId: number | null = null;
  rejectComment = '';
  selectedParty: AdminPartyResponse | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getAllParties().subscribe({
      next: (parties) => this.parties = parties,
      error: () => this.error = 'Failed to load parties'
    });
  }

  approve(id: number) {
    this.api.approveParty(id).subscribe({
      next: () => this.load()
    });
  }

  startReject(id: number) {
    this.rejectingId = id;
    this.rejectComment = '';
  }

  confirmReject() {
    if (this.rejectingId === null) return;
    this.api.rejectParty(this.rejectingId, this.rejectComment).subscribe({
      next: () => {
        this.rejectingId = null;
        this.load();
      }
    });
  }

  cancelReject() {
    this.rejectingId = null;
    this.rejectComment = '';
  }

  delete(id: number) {
    if (!confirm('Are you sure you want to delete this party?')) return;
    this.api.deleteParty(id).subscribe({
      next: () => this.load()
    });
  }

  openInfo(party: AdminPartyResponse) {
    this.selectedParty = party;
  }

  closeInfo() {
    this.selectedParty = null;
  }
}