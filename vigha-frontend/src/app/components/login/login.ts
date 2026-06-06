import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  senha = '';
  erro = '';

  constructor(private authService: AuthService, private router: Router) {}

  entrar() {
    this.authService.login(this.email, this.senha).subscribe({
      next: (res) => {
        this.authService.salvarToken(res.token);
        this.router.navigate(['/usuarios']);
      },
      error: (err) => {
        this.erro = err.error?.erro || 'Erro ao fazer login';
      }
    });
  }
}