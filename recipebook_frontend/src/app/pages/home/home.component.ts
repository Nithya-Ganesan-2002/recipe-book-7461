import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AppHeaderComponent, RecipeCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private _all = signal<Recipe[]>([]);
  q = signal<string>('');
  favoritesOnly = signal<boolean>(false);
  tag = signal<string>('');
  sort = signal<'newest' | 'oldest' | 'title'>('newest');

  tags = signal<string[]>([]);

  recipes = computed(() =>
    this.recipeService.list({
      q: this.q(),
      tag: this.tag(),
      favoritesOnly: this.favoritesOnly(),
      sort: this.sort(),
    })
  );

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.refresh();
  }

  private refresh(): void {
    this._all.set(this.recipeService.list());
    this.tags.set(this.recipeService.getAllTags());
  }

  onHeaderSearchChange(ev: { q: string; favoritesOnly: boolean }) {
    this.q.set(ev.q);
    this.favoritesOnly.set(ev.favoritesOnly);
  }

  onSelectTag(value: string) {
    this.tag.set(value);
  }

  onToggleFavorite(id: string) {
    this.recipeService.toggleFavorite(id);
    this.refresh();
  }

  onDelete(id: string) {
    const ok = typeof globalThis !== 'undefined' &&
      typeof (globalThis as any).confirm === 'function'
      ? (globalThis as any).confirm('Delete this recipe? This cannot be undone.')
      : true;
    if (ok) {
      this.recipeService.remove(id);
      this.refresh();
    }
  }
}
