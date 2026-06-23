import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, ElectionResponse, CreateElectionRequest } from '../../core/services/api.service';

@Component({
  selector: 'app-elections',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './elections.component.html',
  styleUrl: './elections.component.scss'
})
export class ElectionsComponent implements OnInit {
  allElections: ElectionResponse[] = [];
  filteredElections: ElectionResponse[] = [];
  error = '';

  // Filters
  search = '';
  filterType = '';
  filterStatus = '';
  page = 0;
  pageSize = 10;

  types = ['PARLIAMENTARY', 'PRESIDENTIAL', 'MAYORAL', 'MUNICIPAL_COUNCIL'];
  statuses = ['UPCOMING', 'ONGOING', 'FINISHED'];

  // Modal state
  showModal = false;
  editing: ElectionResponse | null = null;
  name = '';
  electionDate = '';
  type = '';
  description = '';
  modalError = '';
  saving = false;
  confirmDeleteId: number | null = null;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.getElections().subscribe({
      next: (e) => { this.allElections = e; this.applyFilters(); },
      error: () => this.error = 'Failed to load elections'
    });
  }

  applyFilters() {
    const q = this.search.toLowerCase();
    this.filteredElections = this.allElections.filter(e =>
      (!q || e.name.toLowerCase().includes(q)) &&
      (!this.filterType || e.type === this.filterType) &&
      (!this.filterStatus || e.status?.toUpperCase() === this.filterStatus)
    );
    this.page = 0;
  }

  get pagedElections() {
    return this.filteredElections.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
  }

  get totalPages() { return Math.ceil(this.filteredElections.length / this.pageSize); }
  prevPage() { if (this.page > 0) this.page--; }
  nextPage() { if (this.page < this.totalPages - 1) this.page++; }

  isPast(election: ElectionResponse): boolean {
    return new Date(election.electionDate) < new Date(new Date().toDateString());
  }

  viewDetails(id: number) {
    this.router.navigate(['/elections', id]);
  }

  openCreate() {
    this.editing = null;
    this.name = ''; this.electionDate = ''; this.type = ''; this.description = '';
    this.modalError = '';
    this.showModal = true;
  }

  openEdit(election: ElectionResponse) {
    this.editing = election;
    this.name = election.name;
    this.electionDate = election.electionDate;
    this.type = election.type as string;
    this.description = election.description ?? '';
    this.modalError = '';
    this.showModal = true;
  }

  closeModal() { this.showModal = false; this.editing = null; }

  save() {
    this.modalError = '';
    this.saving = true;
    const request: CreateElectionRequest = {
      name: this.name,
      electionDate: this.electionDate,
      type: this.type,
      description: this.description || undefined
    };
    const call = this.editing
      ? this.api.updateElection(this.editing.id, request)
      : this.api.createElection(request);
    call.subscribe({
      next: () => { this.saving = false; this.showModal = false; this.load(); },
      error: (err) => { this.saving = false; this.modalError = err.error?.message || 'Failed to save election'; }
    });
  }

  startDelete(id: number) { this.confirmDeleteId = id; }
  confirmDelete() {
    if (this.confirmDeleteId === null) return;
    this.api.deleteElection(this.confirmDeleteId).subscribe({
      next: () => { this.confirmDeleteId = null; this.load(); }
    });
  }
  cancelDelete() { this.confirmDeleteId = null; }
}
