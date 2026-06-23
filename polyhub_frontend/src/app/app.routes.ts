import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/party-admin/dashboard/dashboard.component';
import { MyPartyComponent } from './pages/party-admin/my-party/my-party.component';
import { PartyProgramsComponent } from './pages/party-admin/programs/programs.component';
import { PersonalDetailsComponent } from './pages/party-admin/personal-details/personal-details.component';
import { EditProgramComponent } from './pages/party-admin/edit-program/edit-program.component';
import { ElectionDetailsComponent } from './pages/election-details/election-details.component';
import { ProgramDetailsComponent } from './pages/program-details/program-details.component';
import { PartyDetailsComponent } from './pages/party-details/party-details.component';
import { authGuard } from './core/guards/auth.guard';
import { PartiesComponent } from './pages/parties/parties.component';
import { ElectionsComponent } from './pages/elections/elections.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'auth/login', component: LoginComponent },
      { path: 'auth/register', component: RegisterComponent },
      { path: 'elections/:id', component: ElectionDetailsComponent },
      { path: 'programs/:id', component: ProgramDetailsComponent },
      { path: 'parties/:id', component: PartyDetailsComponent },
      { path: 'parties', component: PartiesComponent },
      { path: '**', redirectTo: '' },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        component: DashboardComponent,
        children: [
          { path: '', redirectTo: 'my-party', pathMatch: 'full' },
          { path: 'my-party', component: MyPartyComponent },
          { path: 'elections', component: ElectionsComponent },
          { path: 'programs', component: PartyProgramsComponent },
          { path: 'personal-details', component: PersonalDetailsComponent },
          { path: 'edit-program/:electionId', component: EditProgramComponent },
        ]
      }
    ]
  }
];
