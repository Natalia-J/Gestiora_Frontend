import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Home } from './auth/home/home';
import { Dashboard } from './dashboard/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path: 'login', component:Login},
    {path:'register', component:Register},
    {path: 'home', component:Home},
    {path: 'dashboard', component:Dashboard, canActivate:[authGuard]},
    {path: '**', redirectTo:'home'}
];