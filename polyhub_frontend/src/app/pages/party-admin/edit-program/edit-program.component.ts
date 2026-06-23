import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ApiService,
  PolicySummary,
  ProgramResponse
} from '../../../core/services/api.service';
import {
  PoliticalPlaneComponent,
  PoliticalPoint
} from '../../../shared/political-plane/political-plane.component';

@Component({
  selector: 'app-edit-program',
  standalone: true,
  imports: [CommonModule, FormsModule, PoliticalPlaneComponent],
  templateUrl: './edit-program.component.html',
  styleUrl: './edit-program.component.scss'
})
export class EditProgramComponent implements OnInit {
  electionId = 0;
  electionName = '';

  loadedProgram: ProgramResponse | null = null;
  loading = true;
  error = '';

  title = '';
  content = '';
  selfPoint: PoliticalPoint = { x: 0, y: 0 };

  selectedPolicies: PolicySummary[] = [];
  selectedPolicyIds: Set<number> = new Set();
  policySearch = '';
  searchResults: PolicySummary[] = [];

  saving = false;
  saveError = '';
  templateMsg = '';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.electionId = Number(this.route.snapshot.paramMap.get('electionId'));
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getMyProgram(this.electionId).subscribe({
      next: (program) => {
        this.loadedProgram = program;
        this.electionName = program.electionName;
        this.title = program.title;
        this.content = program.content;
        this.selfPoint = { x: program.selfEconomicAxis ?? 0, y: program.selfSocialAxis ?? 0 };
        this.selectedPolicies = [...program.policies];
        this.selectedPolicyIds = new Set(program.policies.map(p => p.id));
        this.loading = false;
      },
      error: () => {
        this.loadedProgram = null;
        this.loading = false;
      }
    });
  }

  useTemplate(): void {
    this.templateMsg = '';
    this.api.getProgramSuggestion().subscribe({
      next: (s) => {
        this.title = s.title;
        this.content = s.content;
        this.selfPoint = { x: s.selfEconomicAxis ?? 0, y: s.selfSocialAxis ?? 0 };
        this.selectedPolicies = [...s.policies];
        this.selectedPolicyIds = new Set(s.policies.map(p => p.id));
        this.templateMsg = 'Template loaded from your last program.';
      },
      error: () => {
        this.templateMsg = 'No previous program found to use as template.';
      }
    });
  }

  searchPolicies(): void {
    const q = this.policySearch.trim();
    if (q.length < 2) { this.searchResults = []; return; }
    this.api.searchPolicies(q).subscribe({
      next: (policies) => {
        this.searchResults = policies.filter(p => !this.selectedPolicyIds.has(p.id));
      }
    });
  }

  addPolicy(policy: PolicySummary): void {
    if (this.selectedPolicyIds.has(policy.id)) return;
    this.selectedPolicies.push(policy);
    this.selectedPolicyIds.add(policy.id);
    this.policySearch = '';
    this.searchResults = [];
  }

  removePolicy(id: number): void {
    this.selectedPolicies = this.selectedPolicies.filter(p => p.id !== id);
    this.selectedPolicyIds.delete(id);
  }

  save(): void {
    this.saveError = '';
    this.saving = true;
    this.api.saveProgram(this.electionId, {
      title: this.title,
      content: this.content,
      selfEconomicAxis: this.selfPoint.x,
      selfSocialAxis: this.selfPoint.y,
      policyIds: Array.from(this.selectedPolicyIds)
    }).subscribe({
      next: () => { this.saving = false; this.location.back(); },
      error: (err) => {
        this.saving = false;
        this.saveError = err.error?.message ?? 'Failed to save program.';
      }
    });
  }

  goBack(): void { this.location.back(); }
}
