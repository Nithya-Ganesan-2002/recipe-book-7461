import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/recipe-form/recipe-form.component').then(m => m.RecipeFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/recipe-form/recipe-form.component').then(m => m.RecipeFormComponent),
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./pages/recipe-detail/recipe-detail.component').then(m => m.RecipeDetailComponent),
  },
  { path: '**', redirectTo: '' },
];
