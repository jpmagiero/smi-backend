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

### **Itens**

- `POST /items` — Cria um único item ou múltiplos itens em uma única requisição
- `GET /items` — Lista todos os itens
- `GET /items/:id` — Obtém detalhes de um item específico
- `PUT /items/:id` — Atualiza um item específico
- `DELETE /items/:id` — Remove um item específico

### **Demandas**

- `POST /demands` — Cria uma nova demanda
- `GET /demands?cursor=ID&limit=10` — Lista demandas paginadas usando cursor
- `GET /demands/:id` — Obtém detalhes de uma demanda específica
- `PUT /demands/:id` — Atualiza uma demanda específica
- `DELETE /demands/:id` — Remove uma demanda específica
- `POST /demands/:id/items` — Adiciona itens a uma demanda existente
- `DELETE /demands/:demandId/items/:itemId` — Remove um item específico de uma demanda
- `PATCH /demands/items/:id` — Atualiza informações de um item em uma demanda
- `GET /demands/:id/items?cursor=ID&limit=10` — Obtém itens paginados de uma demanda específica
