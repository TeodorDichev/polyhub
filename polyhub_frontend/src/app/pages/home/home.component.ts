import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import type { ElectionResponse } from '../../core/models';
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
  public elections: ElectionResponse[] = [];
  public loading: boolean = false;
  public error: string = '';
  public readonly getStatusLabel = getElectionStatusLabel;
  public readonly getTypeLabel = getElectionTypeLabel;

  constructor(private api: ApiService) {}

  public ngOnInit(): void {
    this.loadElections();
  }

  public loadElections(): void {
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
