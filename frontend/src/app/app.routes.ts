import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from '../pages/auth/auth.component';
import { GameComponent } from '../pages/game/game.component';
import { LeaderboardComponent } from '../pages/leaderboard/leaderboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' }, // Page par défaut
  { path: 'auth', component: AuthComponent },
  { path: 'game', component: GameComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
];

export const appRoutingProviders = [
  provideRouter(routes)
];
