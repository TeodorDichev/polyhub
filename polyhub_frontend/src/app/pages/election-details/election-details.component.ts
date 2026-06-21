import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService, ElectionDetailsResponse } from '../../core/services/api.service';

@Component({
  selector: 'app-election-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './election-details.component.html',
  styleUrl: './election-details.component.scss'
})
export class ElectionDetailsComponent implements OnInit {
  election?: ElectionDetailsResponse;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.loadElection();
  }

  loadElection() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = 'Invalid election id.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.api.getElectionById(id).subscribe({
      next: (election) => {
        this.election = election;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load election details.';
        this.loading = false;
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'FINISHED':
        return 'Finished';
      case 'RUNNING':
        return 'Running';
      case 'UPCOMING':
        return 'Upcoming';
      default:
        return status;
    }
  }

  getTypeLabel(type: string): string {
    return type.replaceAll('_', ' ');
  }

  hasResult(): boolean {
    return !!this.election?.winnerPartyName;
  }
}
