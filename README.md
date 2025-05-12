# Smi Backend

API para gerenciamento de demandas de itens e peças, desenvolvida em NestJS, Prisma e SQLite, seguindo a Clean Architecture.

## Tecnologias

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [SQLite](https://www.sqlite.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Swagger (OpenAPI)](https://swagger.io/)

---

## Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/seu-repo.git
   cd seu-repo
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure o banco de dados:**

   - Crie um arquivo `.env` na raiz, baseado no `.env example`

4. **Rode as migrations do Prisma:**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Gere o client do Prisma:**

   ```bash
   npx prisma generate
   ```

6. **Inicie a aplicação:**
   ```bash
   npm run start:dev
   ```

---

## Endpoints principais

### **Documentação**

Acesse [http://localhost:3000/api](http://localhost:3000/api) para testar todos os endpoints via Swagger.

### **Categorias**

- `POST /categories` — Cria uma ou mais categorias
- `GET /categories` — Lista todas as categorias

### **Itens**

- `POST /items` — Cria um ou mais itens
- `GET /items?take=20&cursor=ID` — Lista itens paginados
- `PUT /items/:id` — Atualiza um item individual
- `PATCH /items/bulk/status` — Atualiza o status de vários itens em massa
