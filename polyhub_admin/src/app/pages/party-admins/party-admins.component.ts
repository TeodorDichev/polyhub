import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, AdminUserResponse } from '../../core/services/api.service';

@Component({
  selector: 'app-party-admins',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './party-admins.component.html',
  styleUrl: './party-admins.component.scss'
})
export class PartyAdminsComponent implements OnInit {
  users: AdminUserResponse[] = [];
  error = '';
  selectedUser: AdminUserResponse | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.getAllPartyAdmins().subscribe({
      next: (users) => this.users = users,
      error: () => this.error = 'Failed to load party admins'
    });
  }

  suspend(id: number) {
    this.api.suspendPartyAdmin(id).subscribe({ next: () => this.load() });
  }

  unsuspend(id: number) {
    this.api.unsuspendPartyAdmin(id).subscribe({ next: () => this.load() });
  }

  delete(id: number) {
    if (!confirm('Delete this party admin?')) return;
    this.api.deletePartyAdmin(id).subscribe({ next: () => this.load() });
  }

  openInfo(user: AdminUserResponse) {
    this.selectedUser = user;
  }

  closeInfo() {
    this.selectedUser = null;
  }
}