import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { PartyForRatingResponse } from '../../core/models';
import { PoliticalPlaneComponent, PoliticalPoint } from '../../shared/political-plane/political-plane.component';

@Component({
  selector: 'app-parties',
  standalone: true,
  imports: [CommonModule, FormsModule, PoliticalPlaneComponent],
  templateUrl: './parties.component.html',
  styleUrl: './parties.component.scss'
})
export class PartiesComponent implements OnInit {
  public parties: PartyForRatingResponse[] = [];
  public error: string = '';

  public search: string = '';
  public filterRated: string = '';
  public page: number = 0;
  public readonly pageSize: number = 10;
  public totalPages: number = 0;
  public totalElements: number = 0;

  public infoParty: PartyForRatingResponse | null = null;
  public ratingParty: PartyForRatingResponse | null = null;
  public hasReadParty: boolean = false;
  public ratingPoint: PoliticalPoint = { x: 0, y: 0 };
  public ratingError: string = '';
  public saving: boolean = false;

  constructor(private api: ApiService, private router: Router) {}

  public ngOnInit(): void { this.load(); }

  public load(): void {
    this.api.getPartiesForRating(this.page, this.pageSize).subscribe({
      next: (response) => {
        this.parties = response.parties;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.error = '';
      },
      error: () => { this.error = 'Failed to load parties'; }
    });
  }

  public get filteredParties(): PartyForRatingResponse[] {
    const q = this.search.toLowerCase();
    return this.parties.filter(p =>
      (!q || p.name.toLowerCase().includes(q) || (p.motto ?? '').toLowerCase().includes(q)) &&
      (!this.filterRated || (this.filterRated === 'rated' ? p.rated : !p.rated))
    );
  }

  public prevPage(): void {
    if (this.page > 0) { this.page--; this.load(); }
  }

  public nextPage(): void {
    if (this.page < this.totalPages - 1) { this.page++; this.load(); }
  }

  public get isFirst(): boolean { return this.page === 0; }
  public get isLast(): boolean { return this.page >= this.totalPages - 1; }

  public viewDetails(id: number): void { this.router.navigate(['/parties', id]); }

  public openInfo(party: PartyForRatingResponse): void { this.infoParty = party; }
  public closeInfo(): void { this.infoParty = null; }

  public openRate(party: PartyForRatingResponse): void {
    this.ratingParty = party;
    this.hasReadParty = false;
    this.ratingPoint = { x: party.specEconomicAxis ?? 0, y: party.specSocialAxis ?? 0 };
    this.ratingError = '';
  }

  public closeRate(): void { this.ratingParty = null; }
  public confirmRead(): void { this.hasReadParty = true; }

  public saveRating(): void {
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
