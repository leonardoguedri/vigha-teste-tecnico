import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {
  usuarios: any[] = [];
  editando: any = null;
  emailEdit = '';
  senhaEdit = '';
  erro = '';
  sucesso = '';

 constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.carregar();
  }

carregar() {
  this.authService.listarUsuarios().subscribe({
    next: (res) => {
      this.usuarios = [...res];
      this.cdr.detectChanges();
      console.log('usuarios carregados:', this.usuarios);
    },
    error: (err) => {
      console.error('ERRO AO CARREGAR:', err);
      this.erro = 'Erro ao carregar usuários';
    }
  });
}

  iniciarEdicao(usuario: any) {
    this.editando = usuario;
    this.emailEdit = usuario.email;
    this.senhaEdit = '';
  }

  salvarEdicao() {
    const dados: any = {};
    if (this.emailEdit) dados.email = this.emailEdit;
    if (this.senhaEdit) dados.senha = this.senhaEdit;

    this.authService.editarUsuario(this.editando.id, dados).subscribe({
      next: () => {
        this.sucesso = 'Usuário atualizado!';
        this.editando = null;
        this.carregar();
        setTimeout(() => this.sucesso = '', 2000);
      },
      error: (err) => this.erro = err.error?.erro || 'Erro ao editar'
    });
  }

  excluir(id: number) {
    if (!confirm('Tem certeza que deseja excluir?')) return;

    this.authService.excluirUsuario(id).subscribe({
      next: () => {
        this.sucesso = 'Usuário excluído!';
        this.carregar();
        setTimeout(() => this.sucesso = '', 2000);
      },
      error: () => this.erro = 'Erro ao excluir'
    });
  }

  logout() {
    this.authService.logout();
  }
}