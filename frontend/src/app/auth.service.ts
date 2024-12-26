import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {jwtDecode } from 'jwt-decode';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3010/api'; // Assurez-vous que l'URL est correcte

  constructor(private http: HttpClient, private router: Router) {}

  login(identifier: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { identifier, password }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token); // Stockez le token dans le localStorage
          this.router.navigate(['/game']); // Rediriger vers la page game
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserId(): number {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.userId;
    }
    return 1;
  }
}