import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, AdminUserResponse } from '../../core/services/api.service';

@Component({
  selector: 'app-party-admins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './party-admins.component.html',
  styleUrl: './party-admins.component.scss'
})
export class PartyAdminsComponent implements OnInit {
  allUsers: AdminUserResponse[] = [];
  filteredUsers: AdminUserResponse[] = [];
  error = '';
  selectedUser: AdminUserResponse | null = null;

  // Filters
  search = '';
  filterStatus = '';
  page = 0;
  pageSize = 10;

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.getAllPartyAdmins().subscribe({
      next: (users) => { this.allUsers = users; this.applyFilters(); },
      error: () => this.error = 'Failed to load party admins'
    });
  }

  applyFilters() {
    const q = this.search.toLowerCase();
    this.filteredUsers = this.allUsers.filter(u =>
      (!q || `${u.firstname} ${u.lastname}`.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (!this.filterStatus ||
        (this.filterStatus === 'suspended' ? !!u.suspendedOn : !u.suspendedOn))
    );
    this.page = 0;
  }

  get pagedUsers() {
    return this.filteredUsers.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
  }

  get totalPages() { return Math.ceil(this.filteredUsers.length / this.pageSize); }
  prevPage() { if (this.page > 0) this.page--; }
  nextPage() { if (this.page < this.totalPages - 1) this.page++; }

  suspend(id: number) { this.api.suspendPartyAdmin(id).subscribe({ next: () => this.load() }); }
  unsuspend(id: number) { this.api.unsuspendPartyAdmin(id).subscribe({ next: () => this.load() }); }

  delete(id: number) {
    if (!confirm('Delete this party admin?')) return;
    this.api.deletePartyAdmin(id).subscribe({ next: () => this.load() });
  }

  openInfo(user: AdminUserResponse) { this.selectedUser = user; }
  closeInfo() { this.selectedUser = null; }
}
