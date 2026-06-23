import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, PartyForRatingResponse } from '../../core/services/api.service';
import { PoliticalPlaneComponent, PoliticalPoint } from '../../shared/political-plane/political-plane.component';

@Component({
  selector: 'app-parties',
  standalone: true,
  imports: [CommonModule, FormsModule, PoliticalPlaneComponent],
  templateUrl: './parties.component.html',
  styleUrl: './parties.component.scss'
})
export class PartiesComponent implements OnInit {
  allParties: PartyForRatingResponse[] = [];
  filteredParties: PartyForRatingResponse[] = [];
  error = '';

  // Filters
  search = '';
  filterRated = '';
  page = 0;
  pageSize = 10;

  // Info modal
  infoParty: PartyForRatingResponse | null = null;

  // Rate modal
  ratingParty: PartyForRatingResponse | null = null;
  hasReadParty = false;
  ratingPoint: PoliticalPoint = { x: 0, y: 0 };
  ratingError = '';
  saving = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.getPartiesForRating().subscribe({
      next: (parties) => { this.allParties = parties; this.applyFilters(); },
      error: () => this.error = 'Failed to load parties'
    });
  }

  applyFilters() {
    const q = this.search.toLowerCase();
    this.filteredParties = this.allParties.filter(p =>
      (!q || p.name.toLowerCase().includes(q) || (p.motto ?? '').toLowerCase().includes(q)) &&
      (!this.filterRated || (this.filterRated === 'rated' ? p.rated : !p.rated))
    );
    this.page = 0;
  }

  get pagedParties() {
    return this.filteredParties.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
  }

  get totalPages() { return Math.ceil(this.filteredParties.length / this.pageSize); }
  prevPage() { if (this.page > 0) this.page--; }
  nextPage() { if (this.page < this.totalPages - 1) this.page++; }

  viewDetails(id: number) { this.router.navigate(['/parties', id]); }

  openInfo(party: PartyForRatingResponse) { this.infoParty = party; }
  closeInfo() { this.infoParty = null; }

  openRate(party: PartyForRatingResponse) {
    this.ratingParty = party;
    this.hasReadParty = false;
    this.ratingPoint = { x: party.specEconomicAxis ?? 0, y: party.specSocialAxis ?? 0 };
    this.ratingError = '';
  }

  closeRate() { this.ratingParty = null; }
  confirmRead() { this.hasReadParty = true; }

  saveRating() {
    if (!this.ratingParty) return;
    this.ratingError = '';
    this.saving = true;
    this.api.rateParty(this.ratingParty.id, {
      specEconomicAxis: this.ratingPoint.x,
      specSocialAxis: this.ratingPoint.y
    }).subscribe({
      next: () => { this.saving = false; this.ratingParty = null; this.load(); },
      error: (err) => { this.saving = false; this.ratingError = err.error?.message || 'Failed to save rating'; }
    });
  }
}
