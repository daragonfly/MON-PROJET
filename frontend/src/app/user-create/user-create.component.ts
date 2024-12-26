import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; // Importer ReactiveFormsModule
import { CommonModule } from '@angular/common'; // Importer CommonModule

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule] // Ajouter ReactiveFormsModule et CommonModule ici
})
export class UserCreateComponent {
  userForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.http.post('http://localhost:3010/api/users', this.userForm.value)
        .subscribe(
          () => {
            this.router.navigate(['/login']);
          },
          (error) => {
            console.error('Error creating user', error);
            this.errorMessage = error.error.message;
          }
        );
    }
  }
}
