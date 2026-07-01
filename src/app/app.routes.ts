import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'board',
    loadComponent: () =>
      import('./components/todo-board/todo-board.component').then((m) => m.TodoBoardComponent),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: '/board',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/board',
  },
];
