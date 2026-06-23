import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, AdminUserResponse } from '../../core/services/api.service';

@Component({
  selector: 'app-specialists',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './specialists.component.html',
  styleUrl: './specialists.component.scss'
})
export class SpecialistsComponent implements OnInit {
  allSpecialists: AdminUserResponse[] = [];
  filteredSpecialists: AdminUserResponse[] = [];
  error = '';
  showCreateModal = false;

  email = '';
  password = '';
  firstname = '';
  lastname = '';
  createError = '';
  creating = false;

  // Filters
  search = '';
  page = 0;
  pageSize = 10;

  selectedSpecialist: AdminUserResponse | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.getAllSpecialists().subscribe({
      next: (s) => { this.allSpecialists = s; this.applyFilters(); },
      error: () => this.error = 'Failed to load specialists'
    });
  }

  applyFilters() {
    const q = this.search.toLowerCase();
    this.filteredSpecialists = this.allSpecialists.filter(s =>
      !q || `${s.firstname} ${s.lastname}`.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );
    this.page = 0;
  }

  get pagedSpecialists() {
    return this.filteredSpecialists.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
  }

  get totalPages() { return Math.ceil(this.filteredSpecialists.length / this.pageSize); }
  prevPage() { if (this.page > 0) this.page--; }
  nextPage() { if (this.page < this.totalPages - 1) this.page++; }

  openCreate() {
    this.email = ''; this.password = '';
    this.firstname = ''; this.lastname = '';
    this.createError = '';
    this.showCreateModal = true;
  }

  confirmCreate() {
    this.createError = '';
    this.creating = true;
    this.api.createSpecialist({
      email: this.email, password: this.password,
      firstname: this.firstname, lastname: this.lastname
    }).subscribe({
      next: () => { this.creating = false; this.showCreateModal = false; this.load(); },
      error: (err) => { this.creating = false; this.createError = err.error?.message || 'The server did not respond'; }
    });
  }

  openInfo(s: AdminUserResponse) { this.selectedSpecialist = s; }
  closeInfo() { this.selectedSpecialist = null; }

  delete(id: number) {
    if (!confirm('Delete this specialist?')) return;
    this.api.deleteSpecialist(id).subscribe({ next: () => this.load() });
  }
}
