import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventService } from '../event.service';
import { CommonModule } from '@angular/common'; // Importer CommonModule
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

interface LeaderboardUser {
  id: number;
  username: string;
  points: number;
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  standalone: true,
  imports: [CommonModule] // Ajouter CommonModule ici
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  leaderboard: LeaderboardUser[] = [];
  scoreUpdatedSubscription: Subscription = new Subscription(); // Initialiser la souscription

  constructor(private http: HttpClient, private eventService: EventService, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchLeaderboard();
    this.scoreUpdatedSubscription = this.eventService.scoreUpdated$.subscribe(() => {
      this.fetchLeaderboard();
    });
  }

  ngOnDestroy(): void {
    if (this.scoreUpdatedSubscription) {
      this.scoreUpdatedSubscription.unsubscribe();
    }
  }

  fetchLeaderboard(): void {
    this.http.get<LeaderboardUser[]>('http://localhost:3010/api/leaderboard')
      .subscribe(
        (data) => {
          this.leaderboard = data;
        },
        (error) => {
          console.error('Error fetching leaderboard', error);
        }
      );
  }

  addPoint(): void {
    const userId = this.authService.getUserId(); // Récupérer l'ID de l'utilisateur connecté
    if (userId) {
      this.http.put(`http://localhost:3010/api/users/${userId}/points`, { points: 1 }, { responseType: 'text' })
        .subscribe(
          () => {
            console.log('Point added successfully.');
            this.eventService.announceScoreUpdated(); // Émettre un événement
          },
          (error) => {
            console.error('Error adding point', error);
          }
        );
    }
  }
}
