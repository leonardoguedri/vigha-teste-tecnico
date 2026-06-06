import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, RouterLink, NgIf],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro {
  email = '';
  senha = '';
  erro = '';
  sucesso = '';

  constructor(private authService: AuthService, private router: Router) {}

  cadastrar() {
    this.authService.cadastrar(this.email, this.senha).subscribe({
      next: () => {
        this.sucesso = 'Cadastro realizado! Redirecionando...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.erro = err.error?.erro || 'Erro ao cadastrar';
      }
    });
  }
}