import { RouterModule, Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Home } from './auth/home/home';
import { Dashboard } from './dashboard/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { NgModule } from '@angular/core';
import { CompanySelector } from './dashboard/dashboard/company-selector/company-selector';

export const routes: Routes = [
  {path: 'select', component: CompanySelector},
    {path: 'login', component:Login},
    {path:'register', component:Register},
    {path: '', component:Home},
    {path: 'dashboard', component:Dashboard, canActivate:[authGuard]},
    {path: '**', redirectTo:'', pathMatch: 'full'},
    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}