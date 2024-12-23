import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule], // Ajouter FormsModule ici
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  username = '';
  password = '';

  constructor() {}

  onSubmit() {
    if (this.username && this.password) {
      console.log('User logged in:', this.username);
    } else {
      alert('Please fill in all fields');
    }
  }
}
