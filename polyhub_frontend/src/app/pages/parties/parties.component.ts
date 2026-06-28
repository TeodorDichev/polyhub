import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import type {
  PartyListItemResponse,
  PartyPageResponse
} from '../../core/models';

@Component({
  selector: 'app-parties',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './parties.component.html',
  styleUrl: './parties.component.scss'
})
export class PartiesComponent implements OnInit, OnDestroy {
  public parties: PartyListItemResponse[] = [];

  public searchControl = new FormControl('', { nonNullable: true });

  public page: number = 0;
  public size: number = 5;
  public totalPages: number = 0;
  public totalElements: number = 0;
  public first: boolean = true;
  public last: boolean = true;

  public loading: boolean = false;
  public error: string = '';

  public readonly pageSizeOptions: number[] = [5, 10, 15];

  private readonly destroy$ = new Subject<void>();

  constructor(private api: ApiService) {}

  public ngOnInit(): void {
    this.loadParties();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.page = 0;
        this.loadParties();
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public loadParties(): void {
    this.loading = true;
    this.error = '';

    this.api.getParties(this.page, this.size, this.searchControl.value).subscribe({
      next: (response) => {
        this.applyResponse(response);
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load parties.';
        this.loading = false;
      }
    });
  }

  public changePageSize(size: string): void {
    this.size = Number(size);
    this.page = 0;
    this.loadParties();
  }

  public goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages || page === this.page) {
      return;
    }

    this.page = page;
    this.loadParties();
  }

  public goToPreviousPage(): void {
    if (!this.first) {
      this.goToPage(this.page - 1);
    }
  }

  public goToNextPage(): void {
    if (!this.last) {
      this.goToPage(this.page + 1);
    }
  }

  public get pageNumbers(): number[] {
    if (this.totalPages <= 0) {
      return [];
    }

    const maxVisiblePages = 5;
    const half = Math.floor(maxVisiblePages / 2);

    let start = Math.max(0, this.page - half);
    let end = Math.min(this.totalPages - 1, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(0, end - maxVisiblePages + 1);
    }

    const pages: number[] = [];

    for (let index = start; index <= end; index++) {
      pages.push(index);
    }

    return pages;
  }

  private applyResponse(response: PartyPageResponse) {
    this.parties = response.parties;
    this.page = response.page;
    this.size = response.size;
    this.totalPages = response.totalPages;
    this.totalElements = response.totalElements;
    this.first = response.first;
    this.last = response.last;
  }
}
