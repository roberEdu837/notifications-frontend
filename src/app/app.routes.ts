import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guards';

export const routes: Routes = [
    {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent),
    canActivate: [authGuard]
  },
  {
   path:'simulator',
   loadComponent:() => import('./features/simulator/simulator.component').then(m => m.SimulatorComponent)
  },   
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
