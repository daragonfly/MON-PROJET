import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule], // Importez CommonModule ici
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(private apiService: ApiService) {
    console.log('ApiService injected:', apiService); // Ajoutez ceci pour vérifier l'injection du service
  }

  ngOnInit(): void {
    console.log('UsersComponent initialized'); // Ajoutez ceci pour vérifier l'initialisation du composant
    this.getUsers();
  }

  getUsers(): void {
    this.apiService.getUsers().subscribe(
      (data) => {
        console.log('Data received from backend:', data); // Ajoutez ceci pour vérifier les données reçues
        this.users = data; // Les données ne sont pas enveloppées
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }
}

