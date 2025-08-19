import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { Recipe, Ingredient, InstructionStep, Difficulty } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AppHeaderComponent],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.css'
})
export class RecipeFormComponent implements OnInit {
  editMode = signal<boolean>(false);
  recipeId = signal<string | null>(null);

  title = signal<string>('');
  description = signal<string>('');
  imageUrl = signal<string>('');
  prepMinutes = signal<number | null>(null);
  cookMinutes = signal<number | null>(null);
  servings = signal<number | null>(null);
  difficulty = signal<Difficulty | ''>('');
  tags = signal<string>('');

  ingredients = signal<Ingredient[]>([{ name: '', amount: '' }]);
  instructions = signal<InstructionStep[]>([{ step: 1, text: '' }]);

  constructor(private route: ActivatedRoute, private router: Router, private recipeService: RecipeService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const existing = this.recipeService.get(id);
      if (existing) {
        this.editMode.set(true);
        this.recipeId.set(existing.id);
        this.title.set(existing.title);
        this.description.set(existing.description || '');
        this.imageUrl.set(existing.imageUrl || '');
        this.prepMinutes.set(existing.prepMinutes ?? null);
        this.cookMinutes.set(existing.cookMinutes ?? null);
        this.servings.set(existing.servings ?? null);
        this.difficulty.set(existing.difficulty || '');
        this.ingredients.set(existing.ingredients.length ? existing.ingredients : [{ name: '', amount: '' }]);
        this.instructions.set(existing.instructions.length ? existing.instructions : [{ step: 1, text: '' }]);
        this.tags.set(existing.tags.join(', '));
      }
    }
  }

  // PUBLIC_INTERFACE
  /** Add a new empty ingredient row */
  addIngredient(): void {
    this.ingredients.set([...this.ingredients(), { name: '', amount: '' }]);
  }

  // PUBLIC_INTERFACE
  /** Remove ingredient at index */
  removeIngredient(i: number): void {
    this.ingredients.set(this.ingredients().filter((_, idx) => idx !== i));
  }

  // PUBLIC_INTERFACE
  /** Add a new empty instruction step at the end */
  addInstruction(): void {
    const next = this.instructions().length + 1;
    this.instructions.set([...this.instructions(), { step: next, text: '' }]);
  }

  // PUBLIC_INTERFACE
  /** Remove instruction at index and re-number steps */
  removeInstruction(i: number): void {
    const arr = this.instructions().filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, step: idx + 1 }));
    this.instructions.set(arr);
  }

  // PUBLIC_INTERFACE
  /** Update a single ingredient field */
  updateIngredient(i: number, partial: Partial<Ingredient>): void {
    const arr = this.ingredients().slice();
    arr[i] = { ...arr[i], ...partial };
    this.ingredients.set(arr);
  }

  // PUBLIC_INTERFACE
  /** Update a single instruction field */
  updateInstruction(i: number, partial: Partial<InstructionStep>): void {
    const arr = this.instructions().slice();
    arr[i] = { ...arr[i], ...partial };
    this.instructions.set(arr);
  }

  // PUBLIC_INTERFACE
  /** Handle image file upload and convert to data URL for local persistence */
  onImageSelected(event: any): void {
    const input = event?.target as any;
    if (!input || !input.files || !input.files[0]) return;
    const file = input.files[0];
    const ReaderCtor = (typeof globalThis !== 'undefined' ? (globalThis as any).FileReader : null);
    if (!ReaderCtor) {
      return;
    }
    const reader = new ReaderCtor();
    reader.onload = () => {
      this.imageUrl.set((reader.result as string) || '');
    };
    reader.readAsDataURL(file);
  }

  // PUBLIC_INTERFACE
  /** Save the recipe (create or update) and navigate to detail view */
  onSubmit(): void {
    if (!this.title().trim()) {
      const alertFn = (typeof globalThis !== 'undefined' && (globalThis as any).alert) ? (globalThis as any).alert : null;
      if (alertFn) {
        alertFn('Title is required.');
      }
      return;
    }
    const payload: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'favorite'> = {
      title: this.title().trim(),
      description: this.description().trim() || undefined,
      imageUrl: this.imageUrl().trim() || undefined,
      prepMinutes: this.prepMinutes() ?? undefined,
      cookMinutes: this.cookMinutes() ?? undefined,
      servings: this.servings() ?? undefined,
      difficulty: (this.difficulty() || undefined) as Difficulty | undefined,
      ingredients: this.ingredients().filter(i => i.name.trim() || i.amount.trim()).map(i => ({ name: i.name.trim(), amount: i.amount.trim() })),
      instructions: this.instructions().filter(s => s.text.trim()).map((s, idx) => ({ step: idx + 1, text: s.text.trim() })),
      tags: this.tags().split(',').map(t => t.trim()).filter(Boolean),
    };

    if (this.editMode()) {
      const id = this.recipeId();
      if (id) {
        const updated = this.recipeService.update(id, payload);
        if (updated) {
          this.router.navigate(['/detail', id]);
        }
      }
    } else {
      const created = this.recipeService.create(payload);
      this.router.navigate(['/detail', created.id]);
    }
  }
}
