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
  public parties: AdminPartyResponse[] = [];
  public error: string = '';
  public rejectingId: number | null = null;
  public rejectComment: string = '';
  public selectedParty: AdminPartyResponse | null = null;

  public search: string = '';
  public filterStatus: string = '';
  public page: number = 0;
  public readonly pageSize: number = 10;
  public totalPages: number = 0;
  public totalElements: number = 0;
  public readonly statuses: string[] = ['PENDING', 'APPROVED', 'REJECTED'];

  constructor(private api: ApiService) {}

  public ngOnInit(): void {
    this.load();
  }

  public load(): void {
    this.api.getAllParties(this.page, this.pageSize).subscribe({
      next: (response) => {
        this.parties = response.parties;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.error = '';
      },
      error: () => { this.error = 'Failed to load parties'; }
    });
  }

  public get filteredParties(): AdminPartyResponse[] {
    const q = this.search.toLowerCase();
    return this.parties.filter(p =>
      (!q || p.name.toLowerCase().includes(q) || p.createdByEmail.toLowerCase().includes(q)) &&
      (!this.filterStatus || p.status === this.filterStatus)
    );
  }

  public prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.load();
    }
  }

  public nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.load();
    }
  }

  public get isFirst(): boolean { return this.page === 0; }
  public get isLast(): boolean { return this.page >= this.totalPages - 1; }

  public approve(id: number): void {
    this.api.approveParty(id).subscribe({ next: () => this.load() });
  }

  public startReject(id: number): void { this.rejectingId = id; this.rejectComment = ''; }

  public confirmReject(): void {
    if (this.rejectingId === null) return;
    this.api.rejectParty(this.rejectingId, this.rejectComment).subscribe({
      next: () => { this.rejectingId = null; this.load(); }
    });
  }

  public cancelReject(): void { this.rejectingId = null; this.rejectComment = ''; }

  public delete(id: number): void {
    if (!confirm('Are you sure you want to delete this party?')) return;
    this.api.deleteParty(id).subscribe({ next: () => this.load() });
  }

  public openInfo(party: AdminPartyResponse): void { this.selectedParty = party; }
  public closeInfo(): void { this.selectedParty = null; }
}
