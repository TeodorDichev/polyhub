import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, ElectionResponse } from '../../core/services/api.service';
import {
  getElectionStatusLabel,
  getElectionTypeLabel
} from '../../shared/utils/display-labels';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  elections: ElectionResponse[] = [];
  loading = false;
  error = '';
  readonly getStatusLabel = getElectionStatusLabel;
  readonly getTypeLabel = getElectionTypeLabel;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadElections();
  }

  loadElections() {
    this.loading = true;
    this.error = '';

    this.api.getElectionsPage(0, 5, '').subscribe({
      next: (response) => {
        this.elections = response.elections;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load elections.';
        this.loading = false;
      }
    });
  }
}
