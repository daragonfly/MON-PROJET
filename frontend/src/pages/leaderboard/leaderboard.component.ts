import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importer CommonModule

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],  // Ajouter CommonModule ici
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent {
  // Tableau des joueurs avec leurs scores
  players = [
    { username: 'Alice', score: 150 },
    { username: 'Bob', score: 100 },
    { username: 'Charlie', score: 50 },
    { username: 'David', score: 200 },
  ];

  // Méthode pour trier les joueurs par score, en ordre décroissant
  get sortedPlayers() {
    return this.players.sort((a, b) => b.score - a.score);
  }
}
