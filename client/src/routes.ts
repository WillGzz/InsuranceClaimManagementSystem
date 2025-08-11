import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app/layout/topbar.component').then(m => m.TopbarComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'claims' },
      {
        path: 'claims',
        loadChildren: () => import('./app/features/claims/claims.routes').then(m => m.CLAIMS_ROUTES)
      }
    ]
  }
];
