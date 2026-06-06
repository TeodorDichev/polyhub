import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, ElectionResponse, CreateElectionRequest } from '../../core/services/api.service';

@Component({
  selector: 'app-elections',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './elections.component.html',
  styleUrl: './elections.component.scss'
})
export class ElectionsComponent implements OnInit {
  elections: ElectionResponse[] = [];
  error = '';

  showModal = false;
  editing: ElectionResponse | null = null;

  name = '';
  electionDate = '';
  type = '';
  description = '';
  modalError = '';
  saving = false;

  confirmDeleteId: number | null = null;

  types = ['PARLIAMENTARY', 'PRESIDENTIAL', 'MAYORAL', 'MUNICIPAL_COUNCIL'];

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.getElections().subscribe({
      next: (e) => this.elections = e,
      error: () => this.error = 'Failed to load elections'
    });
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
    this.type = election.type;
    this.description = election.description ?? '';
    this.modalError = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editing = null;
  }

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
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.modalError = err.error?.message || 'Failed to save election';
      }
    });
  }

  startDelete(id: number) {
    this.confirmDeleteId = id;
  }

  confirmDelete() {
    if (this.confirmDeleteId === null) return;
    this.api.deleteElection(this.confirmDeleteId).subscribe({
      next: () => {
        this.confirmDeleteId = null;
        this.load();
      }
    });
  }

  cancelDelete() {
    this.confirmDeleteId = null;
  }
}