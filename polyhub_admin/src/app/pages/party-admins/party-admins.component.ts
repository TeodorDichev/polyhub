import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AdminUserResponse } from '../../core/models';

@Component({
  selector: 'app-party-admins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './party-admins.component.html',
  styleUrl: './party-admins.component.scss'
})
export class PartyAdminsComponent implements OnInit {
  public users: AdminUserResponse[] = [];
  public error: string = '';
  public selectedUser: AdminUserResponse | null = null;

  public search: string = '';
  public filterStatus: string = '';
  public page: number = 0;
  public readonly pageSize: number = 10;
  public totalPages: number = 0;
  public totalElements: number = 0;

  constructor(private api: ApiService) {}

  public ngOnInit(): void {
    this.load();
  }

  public load(): void {
    this.api.getAllPartyAdmins(this.page, this.pageSize).subscribe({
      next: (response) => {
        this.users = response.users;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.error = '';
      },
      error: () => { this.error = 'Failed to load party admins'; }
    });
  }

  public get filteredUsers(): AdminUserResponse[] {
    const q = this.search.toLowerCase();
    return this.users.filter(u =>
      (!q || `${u.firstname} ${u.lastname}`.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (!this.filterStatus ||
        (this.filterStatus === 'suspended' ? !!u.suspendedOn : !u.suspendedOn))
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

  public suspend(id: number): void {
    this.api.suspendPartyAdmin(id).subscribe({ next: () => this.load() });
  }

  public unsuspend(id: number): void {
    this.api.unsuspendPartyAdmin(id).subscribe({ next: () => this.load() });
  }

  public delete(id: number): void {
    if (!confirm('Delete this party admin?')) return;
    this.api.deletePartyAdmin(id).subscribe({ next: () => this.load() });
  }

  public openInfo(user: AdminUserResponse): void { this.selectedUser = user; }
  public closeInfo(): void { this.selectedUser = null; }
}
