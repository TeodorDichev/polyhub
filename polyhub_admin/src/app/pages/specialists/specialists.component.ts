import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AdminUserResponse } from '../../core/models';

@Component({
  selector: 'app-specialists',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './specialists.component.html',
  styleUrl: './specialists.component.scss'
})
export class SpecialistsComponent implements OnInit {
  public specialists: AdminUserResponse[] = [];
  public error: string = '';
  public showCreateModal: boolean = false;

  public email: string = '';
  public password: string = '';
  public firstname: string = '';
  public lastname: string = '';
  public createError: string = '';
  public creating: boolean = false;

  public search: string = '';
  public page: number = 0;
  public readonly pageSize: number = 10;
  public totalPages: number = 0;
  public totalElements: number = 0;

  public selectedSpecialist: AdminUserResponse | null = null;

  constructor(private api: ApiService) {}

  public ngOnInit(): void {
    this.load();
  }

  public load(): void {
    this.api.getAllSpecialists(this.page, this.pageSize).subscribe({
      next: (response) => {
        this.specialists = response.users;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.error = '';
      },
      error: () => { this.error = 'Failed to load specialists'; }
    });
  }

  public get filteredSpecialists(): AdminUserResponse[] {
    const q = this.search.toLowerCase();
    return this.specialists.filter(s =>
      !q || `${s.firstname} ${s.lastname}`.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );
  }

  public prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.load();
    }
  }

  public nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.load();
    }
  }

  public get isFirst(): boolean { return this.page === 0; }
  public get isLast(): boolean { return this.page >= this.totalPages - 1; }

  public openCreate(): void {
    this.email = ''; this.password = '';
    this.firstname = ''; this.lastname = '';
    this.createError = '';
    this.showCreateModal = true;
  }

  public confirmCreate(): void {
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

  public openInfo(s: AdminUserResponse): void { this.selectedSpecialist = s; }
  public closeInfo(): void { this.selectedSpecialist = null; }

  public delete(id: number): void {
    if (!confirm('Delete this specialist?')) return;
    this.api.deleteSpecialist(id).subscribe({ next: () => this.load() });
  }
}
