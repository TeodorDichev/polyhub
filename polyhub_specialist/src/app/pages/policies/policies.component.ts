import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

import { ApiService, PolicySummary, CreatePolicyRequest } from '../../core/services/api.service';
import { PoliticalPlaneComponent } from '../../shared/political-plane/political-plane.component'

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PoliticalPlaneComponent],
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.scss'
})
export class PoliciesComponent implements OnInit {

  policies: PolicySummary[] = [];
  error = '';

  showModal = false;

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

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.getPolicies().subscribe({
      next: (data) => this.policies = data,
      error: () => this.error = 'Failed to load policies'
    });
  }

  openCreate(): void {

    this.name = '';
    this.slug = '';

    this.form.setValue({
      policyPosition: { x: 0, y: 0 }
    });

    this.modalError = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

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

    const call = this.api.createPolicy(request);

    call.subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.modalError = err.error?.message || 'Failed to save policy';
      }
    });
  }

  startDelete(id: number): void {
    this.confirmDeleteId = id;
  }

  confirmDelete(): void {
    if (!this.confirmDeleteId) return;

    this.api.deletePolicy(this.confirmDeleteId).subscribe({
      next: () => {
        this.confirmDeleteId = null;
        this.load();
      }
    });
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }
}