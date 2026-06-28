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
  public programs: ProgramForRatingResponse[] = [];
  public error: string = '';

  public search: string = '';
  public filterRated: string = '';
  public page: number = 0;
  public readonly pageSize: number = 10;
  public totalPages: number = 0;
  public totalElements: number = 0;

  public selectedProgram: ProgramForRatingResponse | null = null;
  public hasReadProgram: boolean = false;
  public ratingPoint: PoliticalPoint = { x: 0, y: 0 };
  public ratingError: string = '';
  public saving: boolean = false;

  public hoveredPolicyId: number | null = null;

  constructor(private api: ApiService, private router: Router) {}

  public ngOnInit(): void { this.load(); }

  public load(): void {
    this.api.getProgramsForRating(this.page, this.pageSize).subscribe({
      next: (response) => {
        this.programs = response.programs;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.error = '';
      },
      error: () => { this.error = 'Failed to load programs'; }
    });
  }

  public get filteredPrograms(): ProgramForRatingResponse[] {
    const q = this.search.toLowerCase();
    return this.programs.filter(p =>
      (!q || p.title.toLowerCase().includes(q) || p.partyName.toLowerCase().includes(q) || p.electionName.toLowerCase().includes(q)) &&
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

  public viewDetails(id: number): void { this.router.navigate(['/programs', id]); }

  public openDetail(program: ProgramForRatingResponse): void {
    this.selectedProgram = program;
    this.hasReadProgram = false;
    this.ratingPoint = { x: program.specEconomicAxis ?? 0, y: program.specSocialAxis ?? 0 };
    this.ratingError = '';
  }

  public closeDetail(): void { this.selectedProgram = null; }
  public confirmRead(): void { this.hasReadProgram = true; }

  public saveRating(): void {
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
