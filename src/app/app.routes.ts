import { Routes } from '@angular/router';
import {PageDeConnexion} from './component/page-de-connexion/page-de-connexion';
import {Home} from './component/home/home';
import {authGuard} from './AuthGuard/auth-guard';
import { Register } from './component/register/register';

export const routes: Routes = [
  {path: 'login', component: PageDeConnexion},
  {path:'home',
    component: Home,
  /*  canActivate:[authGuard]*/
    data : {expectedRole: 'Admin'}
  },
  {path: '', redirectTo: '/login', pathMatch: 'full' },
  {path: 'register', component: Register},
  {path: '**', redirectTo: 'login'},
];
