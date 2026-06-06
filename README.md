# Teste Técnico – VIGHA

CRUD completo de usuários com autenticação JWT.

## Tecnologias

- **Frontend:** Angular 19
- **Backend:** Node.js + Express
- **Banco de dados:** MySQL
- **Autenticação:** JWT (jsonwebtoken) + bcrypt

---

## Banco de dados

Execute o script abaixo no MySQL para criar o banco e a tabela:

```sql
CREATE DATABASE IF NOT EXISTS vigha_db;

USE vigha_db;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Backend (Node.js)

### Variáveis de ambiente

Crie um arquivo `.env` dentro da pasta `vigha-backend` com o seguinte conteúdo:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
DB_NAME=vigha_db
JWT_SECRET=uma_chave_secreta_forte
PORT=3000
```

### Como rodar

```bash
cd vigha-backend
npm install
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

### Rotas disponíveis

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | /auth/cadastro | Cadastrar usuário | Não |
| POST | /auth/login | Login e geração de token | Não |
| GET | /usuarios | Listar usuários | Sim |
| PUT | /usuarios/:id | Editar usuário | Sim |
| DELETE | /usuarios/:id | Excluir usuário | Sim |

---

## Frontend (Angular)

### Como rodar

```bash
cd vigha-frontend
npm install
ng serve
```

O frontend estará disponível em `http://localhost:4200`

---

## Como usar

1. Acesse `http://localhost:4200/cadastro` e crie uma conta
2. Faça login em `http://localhost:4200/login`
3. Visualize, edite e exclua usuários na tabela
