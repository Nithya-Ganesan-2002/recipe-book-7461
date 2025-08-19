import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, AppHeaderComponent],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent implements OnInit {
  recipe = signal<Recipe | null>(null);

  constructor(private route: ActivatedRoute, private router: Router, private recipeService: RecipeService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const entity = this.recipeService.get(id);
      if (entity) {
        this.recipe.set(entity);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  // PUBLIC_INTERFACE
  /** Toggle favorite state for current recipe */
  toggleFavorite(): void {
    const r = this.recipe();
    if (!r) return;
    const updated = this.recipeService.toggleFavorite(r.id);
    if (updated) this.recipe.set(updated);
  }

  // PUBLIC_INTERFACE
  /** Delete current recipe and go back home */
  delete(): void {
    const r = this.recipe();
    if (!r) return;
    const ok = typeof globalThis !== 'undefined' &&
      typeof (globalThis as any).confirm === 'function' ?
      (globalThis as any).confirm('Delete this recipe? This cannot be undone.') : true;
    if (ok) {
      this.recipeService.remove(r.id);
      this.router.navigate(['/']);
    }
  }
}
