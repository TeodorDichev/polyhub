import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, ElectionWithProgramResponse } from '../../../core/services/api.service';

@Component({
  selector: 'app-party-programs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss'
})
export class PartyProgramsComponent implements OnInit {
  allPrograms: ElectionWithProgramResponse[] = [];
  filteredPrograms: ElectionWithProgramResponse[] = [];
  error = '';

  search = '';
  filterStatus = '';
  page = 0;
  pageSize = 10;


  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.getElectionsWithProgramStatus().subscribe({
      next: (elections) => {
        this.allPrograms = elections.filter(e => e.hasProgram);
        this.applyFilters();
      },
      error: () => this.error = 'Failed to load programs'
    });
  }

  applyFilters() {
    const q = this.search.toLowerCase();
    this.filteredPrograms = this.allPrograms.filter(e =>
      (!q || e.name.toLowerCase().includes(q)) &&
      (!this.filterStatus || e.status === this.filterStatus)
    );
    this.page = 0;
  }

  get pagedPrograms() {
    return this.filteredPrograms.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
  }

  get totalPages() { return Math.ceil(this.filteredPrograms.length / this.pageSize); }
  prevPage() { if (this.page > 0) this.page--; }
  nextPage() { if (this.page < this.totalPages - 1) this.page++; }

  viewProgram(election: ElectionWithProgramResponse) {
    if (election.programId) {
      this.router.navigate(['/programs', election.programId]);
    }
  }

  goToEdit(election: ElectionWithProgramResponse) {
    this.router.navigate(['/dashboard/edit-program', election.id]);
  }
}
