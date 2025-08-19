import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { StorageService } from './storage.service';
import { generateId, now } from '../utils';

export interface QueryParams {
  q?: string; // search text
  tag?: string; // tag filter
  favoritesOnly?: boolean; // favorite filter
  sort?: 'newest' | 'oldest' | 'title';
}

@Injectable({ providedIn: 'root' })
export class RecipeService {
  constructor(private storage: StorageService) {}

  // PUBLIC_INTERFACE
  /** Fetch all recipes applying search/filter/sort */
  list(params: QueryParams = {}): Recipe[] {
    const { q, tag, favoritesOnly, sort = 'newest' } = params;
    let items = this.storage.getAll();

    if (q && q.trim()) {
      const s = q.trim().toLowerCase();
      items = items.filter(r =>
        r.title.toLowerCase().includes(s) ||
        (r.description || '').toLowerCase().includes(s) ||
        r.ingredients.some(ing => ing.name.toLowerCase().includes(s)) ||
        r.tags.some(t => t.toLowerCase().includes(s))
      );
    }

    if (tag && tag.trim()) {
      const t = tag.trim().toLowerCase();
      items = items.filter(r => r.tags.map(x => x.toLowerCase()).includes(t));
    }

    if (favoritesOnly) {
      items = items.filter(r => r.favorite);
    }

    switch (sort) {
      case 'oldest':
        items.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'title':
        items.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        items.sort((a, b) => b.createdAt - a.createdAt);
    }

    return items;
  }

  // PUBLIC_INTERFACE
  /** Get one by id */
  get(id: string): Recipe | undefined {
    return this.storage.getById(id);
  }

  // PUBLIC_INTERFACE
  /** Create a new recipe */
  create(partial: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'favorite'> & { favorite?: boolean }): Recipe {
    const created: Recipe = {
      ...partial,
      id: generateId(),
      favorite: partial.favorite ?? false,
      createdAt: now(),
      updatedAt: now(),
    };
    this.storage.upsert(created);
    return created;
  }

  // PUBLIC_INTERFACE
  /** Update an existing recipe */
  update(id: string, update: Partial<Recipe>): Recipe | undefined {
    const existing = this.storage.getById(id);
    if (!existing) return undefined;
    const updated: Recipe = { ...existing, ...update, id: existing.id, updatedAt: now() };
    this.storage.upsert(updated);
    return updated;
  }

  // PUBLIC_INTERFACE
  /** Delete recipe by id */
  remove(id: string): boolean {
    const before = this.storage.getAll().length;
    this.storage.delete(id);
    const after = this.storage.getAll().length;
    return after < before;
  }

  // PUBLIC_INTERFACE
  /** Toggle favorite */
  toggleFavorite(id: string): Recipe | undefined {
    return this.storage.toggleFavorite(id);
  }

  // PUBLIC_INTERFACE
  /** Return all unique tags in alphabetical order */
  getAllTags(): string[] {
    const set = new Set<string>();
    for (const r of this.storage.getAll()) {
      r.tags.forEach(t => set.add(t));
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }
}
