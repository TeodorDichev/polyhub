import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, ProgramForRatingResponse } from '../../core/services/api.service';
import { PoliticalPlaneComponent, PoliticalPoint } from '../../shared/political-plane/political-plane.component';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, FormsModule, PoliticalPlaneComponent],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss'
})
export class ProgramsComponent implements OnInit {
  programs: ProgramForRatingResponse[] = [];
  error = '';

  // detail/rate modal state
  selectedProgram: ProgramForRatingResponse | null = null;
  hasReadProgram = false;
  ratingPoint: PoliticalPoint = { x: 0, y: 0 };
  ratingError = '';
  saving = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getProgramsForRating().subscribe({
      next: (programs) => this.programs = programs,
      error: () => this.error = 'Failed to load programs'
    });
  }

  openDetail(program: ProgramForRatingResponse) {
    this.selectedProgram = program;
    this.hasReadProgram = false;
    this.ratingPoint = {
      x: program.specEconomicAxis ?? 0,
      y: program.specSocialAxis ?? 0
    };
    this.ratingError = '';
  }

  closeDetail() {
    this.selectedProgram = null;
  }

  confirmRead() {
    this.hasReadProgram = true;
  }

  saveRating() {
    if (!this.selectedProgram) return;
    this.ratingError = '';
    this.saving = true;

    this.api.rateProgram(this.selectedProgram.programId, {
      specEconomicAxis: this.ratingPoint.x,
      specSocialAxis: this.ratingPoint.y
    }).subscribe({
      next: () => {
        this.saving = false;
        this.selectedProgram = null;
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.ratingError = err.error?.message || 'Failed to save rating';
      }
    });
  }
}