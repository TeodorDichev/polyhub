import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ProgramDetailsResponse } from '../../core/models';
import {
  PoliticalMarker,
  PoliticalPlaneComponent
} from '../../shared/political-plane/political-plane.component';
import { getPoliticalPositionLabel } from '../../shared/utils/display-labels';

@Component({
  selector: 'app-program-details',
  standalone: true,
  imports: [CommonModule, RouterLink, PoliticalPlaneComponent],
  templateUrl: './program-details.component.html',
  styleUrl: './program-details.component.scss'
})
export class ProgramDetailsComponent implements OnInit {
  program?: ProgramDetailsResponse;

  programMarkers: PoliticalMarker[] = [];
  policyMarkers: PoliticalMarker[] = [];

  loading = false;
  error = '';
  readonly getPositionLabel = getPoliticalPositionLabel;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private location: Location
  ) {}

  goBack() { this.location.back(); }

  ngOnInit() {
    this.loadProgram();
  }

  loadProgram() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = 'Invalid program id.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.api.getProgramDetails(id).subscribe({
      next: (program) => {
        this.program = program;
        this.programMarkers = this.buildProgramMarkers(program);
        this.policyMarkers = this.buildPolicyMarkers(program);
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load program details.';
        this.loading = false;
      }
    });
  }

  private buildProgramMarkers(program: ProgramDetailsResponse): PoliticalMarker[] {
    const markers: PoliticalMarker[] = [];

    if (this.hasCoordinates(program.selfEconomicAxis, program.selfSocialAxis)) {
      markers.push({
        x: program.selfEconomicAxis!,
        y: program.selfSocialAxis!,
        label: 'Self-assessment'
      });
    }

    if (this.hasCoordinates(program.specEconomicAxis, program.specSocialAxis)) {
      markers.push({
        x: program.specEconomicAxis!,
        y: program.specSocialAxis!,
        label: 'Specialist'
      });
    }

    return markers;
  }

  private buildPolicyMarkers(program: ProgramDetailsResponse): PoliticalMarker[] {
    return program.policies
      .filter(policy => this.hasCoordinates(policy.specEconomicAxis, policy.specSocialAxis))
      .map(policy => ({
        x: policy.specEconomicAxis!,
        y: policy.specSocialAxis!,
        label: policy.name
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
