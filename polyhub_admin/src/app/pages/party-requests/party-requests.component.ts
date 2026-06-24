import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AdminPartyResponse } from '../../core/models';

@Component({
  selector: 'app-party-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './party-requests.component.html',
  styleUrl: './party-requests.component.scss'
})
export class PartyRequestsComponent implements OnInit {
  allParties: AdminPartyResponse[] = [];
  filteredParties: AdminPartyResponse[] = [];
  error = '';
  rejectingId: number | null = null;
  rejectComment = '';
  selectedParty: AdminPartyResponse | null = null;

  // Filters
  search = '';
  filterStatus = '';
  page = 0;
  pageSize = 10;
  statuses = ['PENDING', 'APPROVED', 'REJECTED'];

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.getAllParties().subscribe({
      next: (parties) => { this.allParties = parties; this.applyFilters(); },
      error: () => this.error = 'Failed to load parties'
    });
  }

  applyFilters() {
    const q = this.search.toLowerCase();
    this.filteredParties = this.allParties.filter(p =>
      (!q || p.name.toLowerCase().includes(q) || p.createdByEmail.toLowerCase().includes(q)) &&
      (!this.filterStatus || p.status === this.filterStatus)
    );
    this.page = 0;
  }

  get pagedParties() {
    return this.filteredParties.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
  }

  get totalPages() { return Math.ceil(this.filteredParties.length / this.pageSize); }
  prevPage() { if (this.page > 0) this.page--; }
  nextPage() { if (this.page < this.totalPages - 1) this.page++; }

  approve(id: number) {
    this.api.approveParty(id).subscribe({ next: () => this.load() });
  }

  startReject(id: number) { this.rejectingId = id; this.rejectComment = ''; }

  confirmReject() {
    if (this.rejectingId === null) return;
    this.api.rejectParty(this.rejectingId, this.rejectComment).subscribe({
      next: () => { this.rejectingId = null; this.load(); }
    });
  }

  cancelReject() { this.rejectingId = null; this.rejectComment = ''; }

  delete(id: number) {
    if (!confirm('Are you sure you want to delete this party?')) return;
    this.api.deleteParty(id).subscribe({ next: () => this.load() });
  }

  openInfo(party: AdminPartyResponse) { this.selectedParty = party; }
  closeInfo() { this.selectedParty = null; }
}
