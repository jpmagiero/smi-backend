# Smi Backend

API para gerenciamento de peças de roupa e acessórios, desenvolvida em NestJS, Prisma e PostgreSQL, seguindo a Clean Architecture.

## Tecnologias

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
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

   - Suba um container Postgres:
     ```bash
     docker run --name smi-postgres -e POSTGRES_PASSWORD=smi123 -e POSTGRES_DB=smidb -p 5432:5432 -d postgres:15
     ```
   - Crie um arquivo `.env` na raiz:
     ```
     DATABASE_URL="postgresql://postgres:smi123@localhost:5432/smidb"
     ```

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

**Caso deseje testar com uma grande quantidade de dados, basta importar a collection do Postman que estará incluída junto aos arquivos do projeto. Nela, você encontrará uma requisição POST para cadastro das categorias, que deve ser executada primeiro, e outra requisição POST com 250 itens para popular a tabela.**

### **Categorias**

- `POST /categories` — Cria uma ou mais categorias
- `GET /categories` — Lista todas as categorias

### **Itens**

- `POST /items` — Cria um ou mais itens
- `GET /items?take=20&cursor=ID` — Lista itens paginados
- `PUT /items/:id` — Atualiza um item individual
- `PATCH /items/bulk/status` — Atualiza o status de vários itens em massa
