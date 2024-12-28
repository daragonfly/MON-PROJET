import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3010/api';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    console.log("demande");
    return this.http.get(`${this.apiUrl}/users`);
  }
}
