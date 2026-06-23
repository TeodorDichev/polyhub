import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { ElectionsComponent } from './pages/elections/elections.component';
import { PoliciesComponent } from './pages/policies/policies.component';
import { PartiesComponent } from './pages/parties/parties.component';
import { authGuard } from './core/guards/auth.guard';
import { ProgramsComponent } from './pages/programs/programs.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'elections', pathMatch: 'full' },
      { path: 'elections', component: ElectionsComponent },
      { path: 'policies', component: PoliciesComponent },
      { path: 'parties', component: PartiesComponent },
      { path: 'programs', component: ProgramsComponent },
    ]
  }
];