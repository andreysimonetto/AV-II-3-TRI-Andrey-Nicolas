# GameBlog

Blog pessoal sobre games, desenvolvido como atividade Full Stack.

## Tecnologias
- Front-end: HTML, CSS e JavaScript
- Back-end: Java 17, Spring Boot e API REST
- Banco de dados: Supabase (PostgreSQL)

## Configuração
1. No Supabase, execute `backend/database/schema.sql` e depois `backend/database/seed.sql`.
2. Copie `backend/src/main/resources/application.properties.example` para `application.properties`
   e preencha a URL (host real do Supabase, usuário `postgres.SEUID` e senha).
3. Na raiz do projeto, execute:

```bash
./run.sh
```

Abra a porta 5500 na aba **Portas**. A pagina e a API usam o mesmo endereco.
A API tambem atende em `/api/publicacoes` na porta 8080.
