import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { PartyRequestsComponent } from './pages/party-requests/party-requests.component';
import { PartyAdminsComponent } from './pages/party-admins/party-admins.component';
import { SpecialistsComponent } from './pages/specialists/specialists.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'party-requests', pathMatch: 'full' },
      { path: 'party-requests', component: PartyRequestsComponent },
      { path: 'party-admins', component: PartyAdminsComponent },
      { path: 'specialists', component: SpecialistsComponent },
    ]
  }
];