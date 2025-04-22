import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {NonAuthGuard} from './_guards/nonAuth.guard';
import {AuthGuard} from './_guards/auth.guard';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    canActivate: [NonAuthGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent),
    canActivate: [NonAuthGuard]
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'offices',
    loadComponent: () => import('./components/map/map.component').then(m => m.MapComponent)
  },
  {
    path: 'calculate',
    loadComponent: () => import('./components/calculate-order/calculate-order.component').then(m => m.CalculateOrderComponent)
  },
  {
    path: 'user/orders',
    loadComponent: () => import('./components/history/history.component').then(m => m.HistoryComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'user/orders/:tracker/changes',
    loadComponent: () => import('./components/history-changes/history-changes.component').then(m => m.HistoryChangesComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'user/order/:tracker',
    loadComponent: () => import('./components/order/order.component').then(m => m.OrderComponent)
  }
];
