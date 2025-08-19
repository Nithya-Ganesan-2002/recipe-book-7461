import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';

const STORAGE_KEY = 'recipebook.recipes.v1';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private memoryCache: Recipe[] | null = null;

  constructor() {}

  // PUBLIC_INTERFACE
  /**
   * Get all recipes from storage. Uses LocalStorage as primary, with an in-memory fallback.
   * Returns a new array instance to avoid accidental mutations.
   */
  getAll(): Recipe[] {
    try {
      const ls = (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) ? (globalThis as any).localStorage : null;
      if (ls) {
        const raw = ls.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Recipe[];
          this.memoryCache = parsed;
          return [...parsed];
        }
      }
    } catch {
      // Ignore parsing/storage errors and fallback to memory cache
    }
    if (this.memoryCache) {
      return [...this.memoryCache];
    }
    return [];
  }

  // PUBLIC_INTERFACE
  /**
   * Persist the provided recipes array to storage.
   * Overwrites the entire collection atomically.
   */
  saveAll(recipes: Recipe[]): void {
    this.memoryCache = [...recipes];
    try {
      const ls = (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) ? (globalThis as any).localStorage : null;
      if (ls) {
        ls.setItem(STORAGE_KEY, JSON.stringify(recipes));
      }
    } catch {
      // Ignore LocalStorage errors; memoryCache will retain the latest copy for session.
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Get a single recipe by id.
   */
  getById(id: string): Recipe | undefined {
    return this.getAll().find(r => r.id === id);
  }

  // PUBLIC_INTERFACE
  /**
   * Upsert a recipe (create if not exists, update if exists).
   * Returns the updated list.
   */
  upsert(recipe: Recipe): Recipe[] {
    const list = this.getAll();
    const idx = list.findIndex(r => r.id === recipe.id);
    if (idx >= 0) {
      list[idx] = { ...recipe };
    } else {
      list.unshift({ ...recipe });
    }
    this.saveAll(list);
    return list;
  }

  // PUBLIC_INTERFACE
  /**
   * Delete a recipe by id. Returns the updated list.
   */
  delete(id: string): Recipe[] {
    const list = this.getAll().filter(r => r.id !== id);
    this.saveAll(list);
    return list;
  }

  // PUBLIC_INTERFACE
  /**
   * Toggle favorite for an id. Returns the updated recipe or undefined if not found.
   */
  toggleFavorite(id: string): Recipe | undefined {
    const list = this.getAll();
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) return undefined;
    const updated = { ...list[idx], favorite: !list[idx].favorite, updatedAt: Date.now() };
    list[idx] = updated;
    this.saveAll(list);
    return updated;
  }
}
