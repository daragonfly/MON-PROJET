import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { UserCreateComponent } from './user-create/user-create.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'user-create', component: UserCreateComponent },
  { path: '', redirectTo: '/user-create', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


