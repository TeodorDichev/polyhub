import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ProgramForRatingResponse } from '../../core/models';
import { PoliticalPlaneComponent, PoliticalPoint } from '../../shared/political-plane/political-plane.component';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, FormsModule, PoliticalPlaneComponent],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss'
})
export class ProgramsComponent implements OnInit {
  allPrograms: ProgramForRatingResponse[] = [];
  filteredPrograms: ProgramForRatingResponse[] = [];
  error = '';

  // Filters
  search = '';
  filterRated = '';
  page = 0;
  pageSize = 10;

  // Detail/rate modal
  selectedProgram: ProgramForRatingResponse | null = null;
  hasReadProgram = false;
  ratingPoint: PoliticalPoint = { x: 0, y: 0 };
  ratingError = '';
  saving = false;

  // Tooltip state
  hoveredPolicyId: number | null = null;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.getProgramsForRating().subscribe({
      next: (programs) => { this.allPrograms = programs; this.applyFilters(); },
      error: () => this.error = 'Failed to load programs'
    });
  }

  applyFilters() {
    const q = this.search.toLowerCase();
    this.filteredPrograms = this.allPrograms.filter(p =>
      (!q || p.title.toLowerCase().includes(q) || p.partyName.toLowerCase().includes(q) || p.electionName.toLowerCase().includes(q)) &&
      (!this.filterRated || (this.filterRated === 'rated' ? p.rated : !p.rated))
    );
    this.page = 0;
  }

  get pagedPrograms() {
    return this.filteredPrograms.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
  }

  get totalPages() { return Math.ceil(this.filteredPrograms.length / this.pageSize); }
  prevPage() { if (this.page > 0) this.page--; }
  nextPage() { if (this.page < this.totalPages - 1) this.page++; }

  viewDetails(id: number) { this.router.navigate(['/programs', id]); }

  openDetail(program: ProgramForRatingResponse) {
    this.selectedProgram = program;
    this.hasReadProgram = false;
    this.ratingPoint = { x: program.specEconomicAxis ?? 0, y: program.specSocialAxis ?? 0 };
    this.ratingError = '';
  }

  closeDetail() { this.selectedProgram = null; }
  confirmRead() { this.hasReadProgram = true; }

  saveRating() {
    if (!this.selectedProgram) return;
    this.ratingError = '';
    this.saving = true;
    this.api.rateProgram(this.selectedProgram.programId, {
      specEconomicAxis: this.ratingPoint.x,
      specSocialAxis: this.ratingPoint.y
    }).subscribe({
      next: () => { this.saving = false; this.selectedProgram = null; this.load(); },
      error: (err) => { this.saving = false; this.ratingError = err.error?.message || 'Failed to save rating'; }
    });
  }
}
