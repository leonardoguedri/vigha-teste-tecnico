import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  email = '';
  senha = '';
  erro = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.salvarToken(token);
      this.router.navigate(['/usuarios']);
    }
  }

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

  loginGoogle() {
   window.location.href = 'https://vigha-teste-tecnico.onrender.com/auth/google';
  }
}