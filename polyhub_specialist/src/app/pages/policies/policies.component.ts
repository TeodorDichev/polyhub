import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

import { ApiService, PolicySummary, CreatePolicyRequest } from '../../core/services/api.service';
import { PoliticalPlaneComponent } from '../../shared/political-plane/political-plane.component';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PoliticalPlaneComponent],
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.scss'
})
export class PoliciesComponent implements OnInit {
  allPolicies: PolicySummary[] = [];
  filteredPolicies: PolicySummary[] = [];
  error = '';

  // Filters
  search = '';
  filterPosition = '';
  page = 0;
  pageSize = 10;

  readonly positions = [
    { value: 'LEFT_LIBERAL',       label: 'Left-Liberal' },
    { value: 'LEFT_CONSERVATIVE',  label: 'Left-Conservative' },
    { value: 'RIGHT_LIBERAL',      label: 'Right-Liberal' },
    { value: 'RIGHT_CONSERVATIVE', label: 'Right-Conservative' },
  ];

  // Modal state
  showModal = false;
  editing: PolicySummary | null = null;
  name = '';
  slug = '';
  modalError = '';
  saving = false;
  confirmDeleteId: number | null = null;

  form = new FormGroup({
    policyPosition: new FormControl<{ x: number; y: number }>(
      { x: 0, y: 0 },
      { nonNullable: true }
    )
  });

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.api.getPolicies().subscribe({
      next: (data) => { this.allPolicies = data; this.applyFilters(); },
      error: () => this.error = 'Failed to load policies'
    });
  }

  applyFilters() {
    const q = this.search.toLowerCase();
    this.filteredPolicies = this.allPolicies.filter(p =>
      (!q || p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)) &&
      (!this.filterPosition || p.politicalPosition === this.filterPosition)
    );
    this.page = 0;
  }

  get pagedPolicies() {
    return this.filteredPolicies.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
  }

  get totalPages() { return Math.ceil(this.filteredPolicies.length / this.pageSize); }
  prevPage() { if (this.page > 0) this.page--; }
  nextPage() { if (this.page < this.totalPages - 1) this.page++; }

  openCreate(): void {
    this.editing = null;
    this.name = '';
    this.slug = '';
    this.form.setValue({ policyPosition: { x: 0, y: 0 } });
    this.modalError = '';
    this.showModal = true;
  }

  openEdit(policy: PolicySummary): void {
    this.editing = policy;
    this.name = policy.name;
    this.slug = policy.slug;
    this.form.setValue({ policyPosition: { x: 0, y: 0 } });
    this.modalError = '';
    this.showModal = true;
  }

  closeModal(): void { this.showModal = false; this.editing = null; }

  save(): void {
    this.modalError = '';
    this.saving = true;
    const position = this.form.value.policyPosition;
    const request: CreatePolicyRequest = {
      name: this.name,
      slug: this.slug,
      specEconomicAxis: position?.x ?? 0,
      specSocialAxis: position?.y ?? 0
    };
    const call = this.editing
      ? this.api.updatePolicy(this.editing.id, request)
      : this.api.createPolicy(request);
    call.subscribe({
      next: () => { this.saving = false; this.showModal = false; this.load(); },
      error: (err) => { this.saving = false; this.modalError = err.error?.message || 'Failed to save policy'; }
    });
  }

  startDelete(id: number): void { this.confirmDeleteId = id; }

  confirmDelete(): void {
    if (!this.confirmDeleteId) return;
    this.api.deletePolicy(this.confirmDeleteId).subscribe({
      next: () => { this.confirmDeleteId = null; this.load(); }
    });
  }

  cancelDelete(): void { this.confirmDeleteId = null; }
}
