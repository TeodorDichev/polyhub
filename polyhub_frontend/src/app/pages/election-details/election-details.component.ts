import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import type { ElectionDetailsResponse } from '../../core/models';
import { PoliticalPlaneComponent, PoliticalMarker } from '../../shared/political-plane/political-plane.component';
import {
  getElectionStatusLabel,
  getElectionTypeLabel
} from '../../shared/utils/display-labels';


@Component({
  selector: 'app-election-details',
  standalone: true,
  imports: [CommonModule, RouterLink, PoliticalPlaneComponent],
  templateUrl: './election-details.component.html',
  styleUrl: './election-details.component.scss'
})
export class ElectionDetailsComponent implements OnInit {
  public election?: ElectionDetailsResponse;
  public partyMarkers: PoliticalMarker[] = [];

  public loading: boolean = false;
  public error: string = '';
  public readonly getStatusLabel = getElectionStatusLabel;
  public readonly getTypeLabel = getElectionTypeLabel;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private location: Location
  ) {}

  public goBack(): void { this.location.back(); }

  public ngOnInit(): void {
    this.loadElection();
  }

  public loadElection(): void {
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

  public hasResult(): boolean {
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
