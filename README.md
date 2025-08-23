# AI-Powered Todo Manager

A full-stack todo management application with AI capabilities.

## Project Structure

```
ai-todo-app/
├── frontend/          # Next.js 14 frontend
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/# React components
│   │   ├── lib/       # Utility functions
│   │   └── types/     # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.mjs
└── backend/           # Express.js backend
    ├── src/
    │   ├── controllers/# Route handlers
    │   ├── routes/     # API routes
    │   ├── middleware/ # Express middleware
    │   ├── types/      # TypeScript types
    │   ├── services/   # Business logic
    │   └── utils/      # Utility functions
    ├── package.json
    ├── tsconfig.json
    └── nodemon.json
```

## Getting Started

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

### Backend (Express.js)
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `GET /api/todos/:id` - Get a specific todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Tech Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Lucide React (icons)

### Backend
- Express.js
- TypeScript
- Express Validator
- Helmet (security)
- CORS
- Rate limiting