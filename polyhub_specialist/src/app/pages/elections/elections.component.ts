import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ElectionResponse, CreateElectionRequest, ElectionResultsRequest, PartyResultEntry } from '../../core/models';
import { ElectionPartyResult } from '../../core/models/party.models';

@Component({
  selector: 'app-elections',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './elections.component.html',
  styleUrl: './elections.component.scss'
})
export class ElectionsComponent implements OnInit {
  public elections: ElectionResponse[] = [];
  public error: string = '';

  public search: string = '';
  public filterType: string = '';
  public filterStatus: string = '';
  public page: number = 0;
  public readonly pageSize: number = 10;
  public totalPages: number = 0;
  public totalElements: number = 0;

  public readonly types: string[] = ['PARLIAMENTARY', 'PRESIDENTIAL', 'MAYORAL', 'MUNICIPAL_COUNCIL'];
  public readonly statuses: string[] = ['UPCOMING', 'ONGOING', 'FINISHED'];

  public showModal: boolean = false;
  public editing: ElectionResponse | null = null;
  public name: string = '';
  public electionDate: string = '';
  public type: string = '';
  public description: string = '';
  public modalError: string = '';
  public saving: boolean = false;
  public confirmDeleteId: number | null = null;

  public showResultsModal: boolean = false;
  public resultsElectionId: number | null = null;
  public resultsParties: ElectionPartyResult[] = [];
  public resultsEntries: { partyId: number; partyName: string; votesCount: string; votePercentage: string }[] = [];
  public resultsError: string = '';
  public resultsSaving: boolean = false;

  constructor(private api: ApiService, private router: Router) {}

  public ngOnInit(): void { this.load(); }

  public load(): void {
    this.api.getElections(this.page, this.pageSize, this.search).subscribe({
      next: (response) => {
        this.elections = response.elections;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.error = '';
      },
      error: () => { this.error = 'Failed to load elections'; }
    });
  }

  public get filteredElections(): ElectionResponse[] {
    return this.elections.filter(e =>
      (!this.filterType || e.type === this.filterType) &&
      (!this.filterStatus || e.status?.toUpperCase() === this.filterStatus)
    );
  }

  public onSearchChange(): void {
    this.page = 0;
    this.load();
  }

  public prevPage(): void {
    if (this.page > 0) { this.page--; this.load(); }
  }

  public nextPage(): void {
    if (this.page < this.totalPages - 1) { this.page++; this.load(); }
  }

  public get isFirst(): boolean { return this.page === 0; }
  public get isLast(): boolean { return this.page >= this.totalPages - 1; }

  public isPast(election: ElectionResponse): boolean {
    return new Date(election.electionDate) < new Date(new Date().toDateString());
  }

  public isResultDay(election: ElectionResponse): boolean {
    const electionDate = new Date(election.electionDate);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return electionDate.toDateString() === yesterday.toDateString();
  }

  public viewDetails(id: number): void {
    this.router.navigate(['/elections', id]);
  }

  public openCreate(): void {
    this.editing = null;
    this.name = ''; this.electionDate = ''; this.type = ''; this.description = '';
    this.modalError = '';
    this.showModal = true;
  }

  public openEdit(election: ElectionResponse): void {
    this.editing = election;
    this.name = election.name;
    this.electionDate = election.electionDate;
    this.type = election.type as string;
    this.description = election.description ?? '';
    this.modalError = '';
    this.showModal = true;
  }

  public closeModal(): void { this.showModal = false; this.editing = null; }

  public save(): void {
    this.modalError = '';
    this.saving = true;
    const request: CreateElectionRequest = {
      name: this.name,
      electionDate: this.electionDate,
      type: this.type,
      description: this.description || undefined
    };
    const call = this.editing
      ? this.api.updateElection(this.editing.id, request)
      : this.api.createElection(request);
    call.subscribe({
      next: () => { this.saving = false; this.showModal = false; this.load(); },
      error: (err) => { this.saving = false; this.modalError = err.error?.message || 'Failed to save election'; }
    });
  }

  public startDelete(id: number): void { this.confirmDeleteId = id; }
  public confirmDelete(): void {
    if (this.confirmDeleteId === null) return;
    this.api.deleteElection(this.confirmDeleteId).subscribe({
      next: () => { this.confirmDeleteId = null; this.load(); }
    });
  }
  public cancelDelete(): void { this.confirmDeleteId = null; }

  public openResults(election: ElectionResponse): void {
    this.resultsElectionId = election.id;
    this.resultsError = '';
    this.resultsSaving = false;
    this.api.getElectionById(election.id).subscribe({
      next: (details) => {
        this.resultsEntries = details.parties.map(p => ({
          partyId: p.partyId,
          partyName: p.partyName,
          votesCount: p.votesCount != null ? String(p.votesCount) : '',
          votePercentage: p.votePercentage != null ? String(p.votePercentage) : ''
        }));
        this.showResultsModal = true;
      },
      error: () => { this.resultsError = 'Failed to load election details'; }
    });
  }

  public closeResults(): void { this.showResultsModal = false; this.resultsElectionId = null; }

  public saveResults(): void {
    this.resultsSaving = true;
    this.resultsError = '';
    const request: ElectionResultsRequest = {
      results: this.resultsEntries.map(e => ({
        partyId: e.partyId,
        votesCount: e.votesCount ? Number(e.votesCount) : undefined,
        votePercentage: e.votePercentage ? Number(e.votePercentage) : undefined
      } as PartyResultEntry))
    };
    this.api.setElectionResults(this.resultsElectionId!, request).subscribe({
      next: () => { this.resultsSaving = false; this.showResultsModal = false; this.load(); },
      error: (err) => { this.resultsSaving = false; this.resultsError = err.error?.message || 'Failed to save results'; }
    });
  }
}
