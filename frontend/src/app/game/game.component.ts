import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { EventService } from '../event.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  score: number = 0;

  constructor(private http: HttpClient, private authService: AuthService, private eventService: EventService) {}

  ngOnInit(): void {}

  incrementScore(): void {
    this.score += 1;
    this.updateScore();
  }

  updateScore(): void {
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
