import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '../../core/services/api.service';
import type { ElectionWithProgramResponse } from '../../core/models';

@Component({
  selector: 'app-elections',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './elections.component.html',
  styleUrl: './elections.component.scss'
})
export class ElectionsComponent implements OnInit {

  allElections: ElectionWithProgramResponse[] = [];
  filteredElections: ElectionWithProgramResponse[] = [];
  error = '';

  search = '';
  filterStatus = '';
  page = 0;
  pageSize = 10;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.api.getElectionsWithProgramStatus().subscribe({
      next: elections => { this.allElections = elections; this.applyFilters(); },
      error: () => this.error = 'Failed to load elections'
    });
  }

  applyFilters(): void {
    const q = this.search.toLowerCase();
    this.filteredElections = this.allElections.filter(e =>
      (!q || e.name.toLowerCase().includes(q)) &&
      (!this.filterStatus || e.status === this.filterStatus)
    );
    this.page = 0;
  }

  get pagedElections(): ElectionWithProgramResponse[] {
    return this.filteredElections.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
  }

  get totalPages(): number { return Math.ceil(this.filteredElections.length / this.pageSize); }
  prevPage(): void { if (this.page > 0) this.page--; }
  nextPage(): void { if (this.page < this.totalPages - 1) this.page++; }

  goToInfo(election: ElectionWithProgramResponse): void {
    this.router.navigate(['/elections', election.id]);
  }

  goToProgram(election: ElectionWithProgramResponse): void {
    if (election.programId) {
      this.router.navigate(['/programs', election.programId]);
    }
  }

  goToEdit(election: ElectionWithProgramResponse): void {
    this.router.navigate(['/dashboard/edit-program', election.id]);
  }
}
