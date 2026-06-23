import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ApiService,
  ElectionWithProgramResponse,
  ElectionDetailsResponse,
  ProgramResponse,
  PolicySummary
} from '../../core/services/api.service';

import {
  PoliticalPlaneComponent,
  PoliticalPoint
} from '../../shared/political-plane-v2/political-plane.component';

@Component({
  selector: 'app-elections',
  standalone: true,
  imports: [CommonModule, FormsModule, PoliticalPlaneComponent],
  templateUrl: './elections.component.html',
  styleUrl: './elections.component.scss'
})
export class ElectionsComponent implements OnInit {

  elections: ElectionWithProgramResponse[] = [];
  error = '';

  // info modal
  infoElection: ElectionDetailsResponse | null = null;
  infoLoading = false;

  // program modal
  programModalElection: ElectionWithProgramResponse | null = null;
  programMode: 'view' | 'edit' = 'view';

  loadedProgram: ProgramResponse | null = null;

  selectedPolicyIds: Set<number> = new Set();
  selectedPolicies: PolicySummary[] = [];

  policySearch = '';
  searchResults: PolicySummary[] = [];

  title = '';
  content = '';
  selfPoint: PoliticalPoint = { x: 0, y: 0 };

  programError = '';
  saving = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.getElectionsWithProgramStatus().subscribe({
      next: elections => this.elections = elections,
      error: () => this.error = 'Failed to load elections'
    });
  }

  openInfo(election: ElectionWithProgramResponse): void {
    this.infoLoading = true;
    this.infoElection = null;

    this.api.getElectionById(election.id).subscribe({
      next: details => {
        this.infoElection = details;
        this.infoLoading = false;
      },
      error: () => {
        this.infoLoading = false;
      }
    });
  }

  closeInfo(): void {
    this.infoElection = null;
  }

  openProgram(election: ElectionWithProgramResponse): void {

    this.programModalElection = election;
    this.programError = '';

    this.policySearch = '';
    this.searchResults = [];

    this.selectedPolicies = [];
    this.selectedPolicyIds = new Set();

    this.programMode =
      election.hasProgram || !election.editable
        ? 'view'
        : 'edit';

    if (election.hasProgram) {

      this.api.getMyProgram(election.id).subscribe({
        next: program => {

          this.loadedProgram = program;

          this.title = program.title;
          this.content = program.content;

          this.selfPoint = {
            x: program.selfEconomicAxis ?? 0,
            y: program.selfSocialAxis ?? 0
          };

          this.selectedPolicies = [...program.policies];

          this.selectedPolicyIds =
            new Set(program.policies.map(p => p.id));
        }
      });

    } else {

      this.loadedProgram = null;

      this.title = '';
      this.content = '';

      this.selfPoint = {
        x: 0,
        y: 0
      };
    }
  }

  closeProgram(): void {

    this.programModalElection = null;
    this.loadedProgram = null;

    this.policySearch = '';
    this.searchResults = [];

    this.selectedPolicies = [];
    this.selectedPolicyIds = new Set();

    this.programError = '';
  }

  switchToEdit(): void {

    if (this.isReadOnly()) {
      return;
    }

    this.programMode = 'edit';
  }

  isReadOnly(): boolean {
    return !this.programModalElection?.editable;
  }

  searchPolicies(): void {

    const q = this.policySearch.trim();

    if (q.length < 2) {
      this.searchResults = [];
      return;
    }

    this.api.searchPolicies(q).subscribe({
      next: policies => {

        const selectedIds =
          new Set(this.selectedPolicies.map(p => p.id));

        this.searchResults = policies.filter(
          p => !selectedIds.has(p.id)
        );
      }
    });
  }

  addPolicy(policy: PolicySummary): void {

    if (this.isReadOnly()) {
      return;
    }

    const exists =
      this.selectedPolicies.some(p => p.id === policy.id);

    if (exists) {
      return;
    }

    this.selectedPolicies.push(policy);

    this.selectedPolicyIds.add(policy.id);

    this.policySearch = '';
    this.searchResults = [];
  }

  removePolicy(id: number): void {

    if (this.isReadOnly()) {
      return;
    }

    this.selectedPolicies =
      this.selectedPolicies.filter(p => p.id !== id);

    this.selectedPolicyIds.delete(id);
  }

  useTemplate(): void {

    this.api.getProgramSuggestion().subscribe({
      next: suggestion => {

        this.title = suggestion.title;
        this.content = suggestion.content;

        this.selfPoint = {
          x: suggestion.selfEconomicAxis ?? 0,
          y: suggestion.selfSocialAxis ?? 0
        };

        // if backend returns full policies
        if ('policies' in suggestion) {

          this.selectedPolicies = [...suggestion.policies];

          this.selectedPolicyIds =
            new Set(suggestion.policies.map(p => p.id));
        }

        this.programError = '';
      },
      error: () => {
        this.programError =
          'No previous program found to use as template';
      }
    });
  }

  saveProgram(): void {

    if (!this.programModalElection) {
      return;
    }

    this.programError = '';
    this.saving = true;

    this.api.saveProgram(
      this.programModalElection.id,
      {
        title: this.title,
        content: this.content,
        selfEconomicAxis: this.selfPoint.x,
        selfSocialAxis: this.selfPoint.y,
        policyIds: Array.from(this.selectedPolicyIds)
      }
    ).subscribe({
      next: () => {

        this.saving = false;

        this.closeProgram();

        this.load();
      },
      error: err => {

        this.saving = false;

        this.programError =
          err.error?.message ?? 'Failed to save program';
      }
    });
  }
}