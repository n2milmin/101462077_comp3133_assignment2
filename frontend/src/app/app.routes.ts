import { Routes } from '@angular/router';
import { LoginComponent } from './components/login';
import { SignupComponent } from './components/signup';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./components/signup').then(m => m.SignupComponent) },
  {
    path: 'employees',
    loadComponent: () => import('./pages/employees/employee-list.component').then(m => m.EmployeeListComponent)
  },
];
