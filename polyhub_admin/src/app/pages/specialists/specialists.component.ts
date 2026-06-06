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
  specialists: AdminUserResponse[] = [];
  error = '';
  showCreateModal = false;

  email = '';
  password = '';
  firstname = '';
  lastname = '';
  createError = '';
  creating = false;

  selectedSpecialist: AdminUserResponse | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.getAllSpecialists().subscribe({
      next: (s) => this.specialists = s,
      error: () => this.error = 'Failed to load specialists'
    });
  }

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
      email: this.email,
      password: this.password,
      firstname: this.firstname,
      lastname: this.lastname
    }).subscribe({
      next: () => {
        this.creating = false;
        this.showCreateModal = false;
        this.load();
      },
      error: (err) => {
        this.creating = false;
        this.createError = err.error?.message || 'The server did not respond';
      }
    });
  }

  openInfo(s: AdminUserResponse) {
    this.selectedSpecialist = s;
  }

  closeInfo() {
    this.selectedSpecialist = null;
  }

  delete(id: number) {
    if (!confirm('Delete this specialist?')) return;
    this.api.deleteSpecialist(id).subscribe({ next: () => this.load() });
  }
}