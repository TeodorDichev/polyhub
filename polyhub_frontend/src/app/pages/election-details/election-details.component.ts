import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService, ElectionDetailsResponse } from '../../core/services/api.service';
import { PoliticalPlaneComponent, PoliticalMarker } from '../../shared/political-plane/political-plane.component';

@Component({
  selector: 'app-election-details',
  standalone: true,
  imports: [CommonModule, RouterLink, PoliticalPlaneComponent],
  templateUrl: './election-details.component.html',
  styleUrl: './election-details.component.scss'
})
export class ElectionDetailsComponent implements OnInit {
  election?: ElectionDetailsResponse;
  partyMarkers: PoliticalMarker[] = [];

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
        this.partyMarkers = this.buildPartyMarkers(election);
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

  private buildPartyMarkers(election: ElectionDetailsResponse): PoliticalMarker[] {
    return election.parties
      .filter(party => this.hasSpecialistCoordinates(party))
      .map(party => ({
        x: party.partySpecEconomicAxis!,
        y: party.partySpecSocialAxis!,
        label: party.partyName
      }));
  }

  private hasSpecialistCoordinates(party: { partySpecEconomicAxis?: number | null; partySpecSocialAxis?: number | null }): boolean {
    return party.partySpecEconomicAxis !== null
      && party.partySpecEconomicAxis !== undefined
      && party.partySpecSocialAxis !== null
      && party.partySpecSocialAxis !== undefined;
  }
}
