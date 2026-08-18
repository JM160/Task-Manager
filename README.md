# Gerenciador de Tarefas (Task Manager CRUD)

Este é um projeto Full-Stack de um Gerenciador de Tarefas (To-Do List) desenvolvido com uma arquitetura moderna, englobando um frontend interativo e um backend robusto em formato de API RESTful.

O sistema permite a criação, listagem, conclusão e remoção de tarefas (CRUD completo), além de suportar recursos como prazos (due dates), modo escuro/claro e controle de estado visual (ex: tarefas em atraso).

## 🚀 Tecnologias Utilizadas

### Frontend
- **React (com Vite):** Biblioteca para construção da interface de usuário, focada em performance e desenvolvimento rápido.
- **TypeScript:** Adiciona tipagem estática ao JavaScript, garantindo maior segurança e previsibilidade do código.
- **Tailwind CSS:** Framework de CSS utilitário para a estilização rápida e responsiva.
- **Lucide React:** Biblioteca de ícones modernos para a interface.

### Backend
- **Node.js & Express:** Ambiente de execução e framework minimalista para roteamento e criação da API REST.
- **TypeScript:** Utilizado no backend para padronizar tipos (ex: Models) junto ao frontend.
- **PostgreSQL:** Banco de dados relacional para persistência dos dados das tarefas.
- **Pacote `pg`:** Cliente PostgreSQL para Node.js.
- **CORS & Dotenv:** Middlewares para segurança de requisições cross-origin e gerenciamento de variáveis de ambiente.

---

## 🏗️ Estrutura do Projeto

O repositório é um monorepo dividido principalmente em duas partes:

- `/frontend`: Aplicação SPA (Single Page Application) em React.
- `/backend`: Servidor da API construído em Express.

### Principais Arquivos e Diretórios
- `backend/src/routes/taskRoutes.ts`: Definição dos endpoints de tarefas.
- `backend/src/controllers/taskController.ts`: Lógica de processamento das requisições (CRUD).
- `backend/src/models/Task.ts`: Tipagem base da Tarefa (`id`, `title`, `description`, `is_completed`, `created_at`, `due_date`, `completed_at`).
- `frontend/src/App.tsx`: Ponto de entrada e componente principal, contendo o estado da aplicação e lógica visual.
- `frontend/src/services/api.ts`: Camada de comunicação com a API do backend (Fetch requests).
- `alter_db.ts`: Script utilitário em TypeScript para criar e/ou alterar a estrutura da tabela no banco de dados.

---

## ⚙️ Funcionalidades

1. **Criar Tarefa:** Adicionar uma nova tarefa com título, descrição e, opcionalmente, uma data/hora de prazo de conclusão (*Due Date*).
2. **Listar Tarefas:** Visualização completa das tarefas cadastradas com divisão inteligente de status.
3. **Concluir Tarefa:** Marcar uma tarefa como resolvida (grava a data de conclusão).
4. **Excluir Tarefa:** Remoção definitiva de uma tarefa do sistema.
5. **Modo Escuro (Dark Mode):** Suporte nativo a temas visuais (claro e escuro), sincronizado com as preferências do sistema do usuário e salvo no `localStorage`.
6. **Controle de Atrasos:** Tratamento visual específico para destacar tarefas em aberto que já passaram do prazo de conclusão.

---

## 🔗 Endpoints da API

A API roda por padrão na porta `3000` (ou de acordo com a variável `PORT` do `.env`).

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/tasks` | Retorna a lista de todas as tarefas cadastradas. |
| `POST` | `/tasks` | Cria uma nova tarefa. Body esperado: `{ "title": "...", "description": "...", "due_date": "..." }` |
| `PUT` | `/tasks/:id/complete`| Marca a tarefa especificada pelo ID como concluída e registra a data atual. |
| `DELETE`| `/tasks/:id` | Remove a tarefa do banco de dados. |

---

## 🛠️ Como Executar o Projeto

### 1. Pré-requisitos
- Node.js (v18+)
- PostgreSQL rodando localmente ou em nuvem.

### 2. Configuração do Banco de Dados
1. Crie um banco de dados no PostgreSQL.
2. Na raiz do projeto, configure o arquivo `.env` com as credenciais do banco (ex: `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`).
3. Execute o script de banco de dados se necessário para estruturar as tabelas (ex: `npx tsx alter_db.ts`).

### 3. Rodando o Backend
Abra um terminal e acesse a pasta `backend`:
```bash
cd backend
npm install
npm run dev # ou comando equivalente definido no seu package.json (ex: npx tsx src/server.ts)
```

### 4. Rodando o Frontend
Em outro terminal, acesse a pasta `frontend`:
```bash
cd frontend
npm install
npm run dev
```

O Frontend estará disponível por padrão na porta do Vite (geralmente `http://localhost:5173`).

---

## 📝 Próximos Passos (Possíveis Melhorias)
- Implementar paginação ou rolagem infinita.
- Adicionar filtros (por "pendentes", "concluídas", "atrasadas").
- Criação de autenticação de usuários para suporte multi-usuário.

---

## 📄 Licença e Direitos Autorais

Copyright (c) 2026, JM160.
Este projeto está licenciado sob a licença ISC. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
