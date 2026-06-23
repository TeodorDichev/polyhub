import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/party-admin/dashboard/dashboard.component';
import { SubmitPartyComponent } from './pages/party-admin/submit-party/submit-party.component';
import { MySubmissionComponent } from './pages/party-admin/my-submission/my-submission.component';
import { PersonalDetailsComponent } from './pages/party-admin/personal-details/personal-details.component';
import { ElectionDetailsComponent } from './pages/election-details/election-details.component';
import { ProgramDetailsComponent } from './pages/program-details/program-details.component';
import { PartyDetailsComponent } from './pages/party-details/party-details.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,   // wraps all pages with the sidebar layout
    children: [
      { path: '', component: HomeComponent },
      { path: 'auth/login', component: LoginComponent },
      { path: 'auth/register', component: RegisterComponent },
      { path: 'elections/:id', component: ElectionDetailsComponent },
      { path: 'programs/:id', component: ProgramDetailsComponent },
      { path: 'parties/:id', component: PartyDetailsComponent },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        component: DashboardComponent,
        children: [
          { path: 'submit-party', component: SubmitPartyComponent },
          { path: 'my-submission', component: MySubmissionComponent },
          { path: 'personal-details', component: PersonalDetailsComponent },
        ]
      }
    ]
  }
];
