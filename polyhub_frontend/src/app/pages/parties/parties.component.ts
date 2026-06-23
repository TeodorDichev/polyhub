import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import {
  ApiService,
  PartyListItemResponse,
  PartyPageResponse
} from '../../core/services/api.service';

@Component({
  selector: 'app-parties',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './parties.component.html',
  styleUrl: './parties.component.scss'
})
export class PartiesComponent implements OnInit, OnDestroy {
  parties: PartyListItemResponse[] = [];

  searchControl = new FormControl('', { nonNullable: true });

  page = 0;
  size = 5;
  totalPages = 0;
  totalElements = 0;
  first = true;
  last = true;

  loading = false;
  error = '';

  readonly pageSizeOptions = [5, 10, 15];

  private destroy$ = new Subject<void>();

  constructor(private api: ApiService) {}

  ngOnInit() {
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadParties() {
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

  changePageSize(size: string) {
    this.size = Number(size);
    this.page = 0;
    this.loadParties();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages || page === this.page) {
      return;
    }

    this.page = page;
    this.loadParties();
  }

  goToPreviousPage() {
    if (!this.first) {
      this.goToPage(this.page - 1);
    }
  }

  goToNextPage() {
    if (!this.last) {
      this.goToPage(this.page + 1);
    }
  }

  get pageNumbers(): number[] {
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
