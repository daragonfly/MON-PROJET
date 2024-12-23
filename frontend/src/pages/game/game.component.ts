import { Component } from '@angular/core';

@Component({
  selector: 'app-game',
  standalone: true,
  template: `
    <div style="text-align: center; margin-top: 50px;">
      <h1>Clicker Game</h1>
      <button (click)="incrementPoints()">Click Me!</button>
      <p>Your current points: {{ points }}</p>
    </div>
  `,
  styles: [`
    h1 {
      color: darkblue;
    }
    button {
      padding: 10px 20px;
      font-size: 18px;
      margin: 20px 0;
    }
    p {
      font-size: 20px;
      color: green;
    }
  `]
})
export class GameComponent {
  points = 0; // Points du joueur

  incrementPoints() {
    this.points++;
  }
}
