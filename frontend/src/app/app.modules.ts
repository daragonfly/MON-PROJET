import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';  // Importer RouterModule

import { AppComponent } from './app.component';
import { AuthComponent } from '../pages/auth/auth.component';
import { GameComponent } from '../pages/game/game.component';
import { LeaderboardComponent } from '../pages/leaderboard/leaderboard.component';
import { routes } from './app.routes';  // Importer les routes définies dans app.routes.ts

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),  // Configurer les routes ici
  ],
  providers: [],
})
export class AppModule {}
