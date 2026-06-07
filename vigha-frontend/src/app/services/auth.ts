import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://vigha-teste-tecnico.onrender.com';

  constructor(private http: HttpClient, private router: Router) {}

  cadastrar(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/cadastro`, { email, senha });
  }

  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, senha });
  }

  salvarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getHeaders() {
    return {
      headers: { Authorization: `Bearer ${this.getToken()}` }
    };
  }

  listarUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios`, this.getHeaders());
  }

  editarUsuario(id: number, dados: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${id}`, dados, this.getHeaders());
  }

  excluirUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`, this.getHeaders());
  }
}