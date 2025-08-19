import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css'
})
export class AppHeaderComponent {
  query = signal<string>('');
  favoritesOnly = signal<boolean>(false);

  @Output() searchChange = new EventEmitter<{ q: string; favoritesOnly: boolean }>();

  // PUBLIC_INTERFACE
  /** Emit search criteria changes to parent */
  onCriteriaChange(): void {
    this.searchChange.emit({ q: this.query(), favoritesOnly: this.favoritesOnly() });
  }

  // PUBLIC_INTERFACE
  /** Handle search box input change */
  onSearchInput(value: string): void {
    this.query.set(value ?? '');
    this.onCriteriaChange();
  }

  // PUBLIC_INTERFACE
  /** Handle favorites toggle change */
  onFavoritesToggle(checked: boolean): void {
    this.favoritesOnly.set(!!checked);
    this.onCriteriaChange();
  }

  // PUBLIC_INTERFACE
  /** Clear search input */
  clear(): void {
    this.query.set('');
    this.onCriteriaChange();
  }
}
