import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import type { PartyDetailsResponse } from '../../core/models';
import {
  PoliticalMarker,
  PoliticalPlaneComponent
} from '../../shared/political-plane/political-plane.component';
import {
  getElectionStatusLabel,
  getElectionTypeLabel
} from '../../shared/utils/display-labels';


@Component({
  selector: 'app-party-details',
  standalone: true,
  imports: [CommonModule, RouterLink, PoliticalPlaneComponent],
  templateUrl: './party-details.component.html',
  styleUrl: './party-details.component.scss'
})
export class PartyDetailsComponent implements OnInit {
  public party?: PartyDetailsResponse;

  public partyMarkers: PoliticalMarker[] = [];
  public programMarkers: PoliticalMarker[] = [];

  public loading: boolean = false;
  public error: string = '';
  public readonly getStatusLabel = getElectionStatusLabel;
  public readonly getTypeLabel = getElectionTypeLabel;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  public ngOnInit(): void {
    this.loadParty();
  }

  public loadParty(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = 'Invalid party id.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.api.getPartyDetails(id).subscribe({
      next: (party) => {
        this.party = party;
        this.partyMarkers = this.buildPartyMarkers(party);
        this.programMarkers = this.buildProgramMarkers(party);
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load party details.';
        this.loading = false;
      }
    });
  }

  private buildPartyMarkers(party: PartyDetailsResponse): PoliticalMarker[] {
    const markers: PoliticalMarker[] = [];

    if (this.hasCoordinates(party.selfEconomicAxis, party.selfSocialAxis)) {
      markers.push({
        x: party.selfEconomicAxis!,
        y: party.selfSocialAxis!,
        label: 'Self-assessment'
      });
    }

    if (this.hasCoordinates(party.specEconomicAxis, party.specSocialAxis)) {
      markers.push({
        x: party.specEconomicAxis!,
        y: party.specSocialAxis!,
        label: 'Specialist'
      });
    }

    return markers;
  }

  private buildProgramMarkers(party: PartyDetailsResponse): PoliticalMarker[] {
    return party.programs
      .filter(program => this.hasCoordinates(program.specEconomicAxis, program.specSocialAxis))
      .map(program => ({
        x: program.specEconomicAxis!,
        y: program.specSocialAxis!,
        label: program.title
      }));
  }

  private hasCoordinates(
    x?: number | null,
    y?: number | null
  ): boolean {
    return x !== null
      && x !== undefined
      && y !== null
      && y !== undefined;
  }
}
