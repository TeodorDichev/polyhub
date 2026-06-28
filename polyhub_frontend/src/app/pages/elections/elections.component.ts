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

  public allElections: ElectionWithProgramResponse[] = [];
  public filteredElections: ElectionWithProgramResponse[] = [];
  public error: string = '';

  public search: string = '';
  public filterStatus: string = '';
  public page: number = 0;
  public readonly pageSize: number = 10;

  constructor(private api: ApiService, private router: Router) {}

  public ngOnInit(): void { this.load(); }

  public load(): void {
    this.api.getElectionsWithProgramStatus().subscribe({
      next: elections => { this.allElections = elections; this.applyFilters(); },
      error: () => this.error = 'Failed to load elections'
    });
  }

  public applyFilters(): void {
    const q = this.search.toLowerCase();
    this.filteredElections = this.allElections.filter(e =>
      (!q || e.name.toLowerCase().includes(q)) &&
      (!this.filterStatus || e.status === this.filterStatus)
    );
    this.page = 0;
  }

  public get pagedElections(): ElectionWithProgramResponse[] {
    return this.filteredElections.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
  }

  public get totalPages(): number { return Math.ceil(this.filteredElections.length / this.pageSize); }
  public prevPage(): void { if (this.page > 0) this.page--; }
  public nextPage(): void { if (this.page < this.totalPages - 1) this.page++; }

  public goToInfo(election: ElectionWithProgramResponse): void {
    this.router.navigate(['/elections', election.id]);
  }

  public goToProgram(election: ElectionWithProgramResponse): void {
    if (election.programId) {
      this.router.navigate(['/programs', election.programId]);
    }
  }

  public goToEdit(election: ElectionWithProgramResponse): void {
    this.router.navigate(['/dashboard/edit-program', election.id]);
  }
}
