# MomentumPM — Frontend

A simplified project management app inspired by Jira and Trello. Built with Angular 21 and Angular Material, featuring a drag-and-drop Kanban board, JWT authentication, and real-time dashboard statistics.

> **Backend repo:** [MomentumPM-api](https://github.com/JasonPierceC/MomentumPM-api)

---

## Features

- **Authentication** — Register and login with JWT-based auth persisted across sessions
- **Projects** — Create, edit, and delete projects
- **Kanban Board** — Drag and drop tasks across four columns: To Do, In Progress, In Review, Done
- **Tasks** — Create tasks with title, description, priority, status, and due date
- **Comments** — Add and delete comments on individual tasks
- **Dashboard** — Live statistics showing task breakdown by status, priority, and overdue count

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 (standalone components) |
| UI Library | Angular Material 21 (Material Design 3) |
| Drag & Drop | Angular CDK DragDrop |
| State | Angular Signals |
| HTTP | HttpClient with functional interceptors |
| Auth | JWT stored in localStorage |
| Styling | SCSS + Angular Material theming |

## Project Structure

```
src/app/
├── core/
│   ├── guards/          # Auth guard
│   ├── interceptors/    # JWT auth interceptor
│   ├── models/          # TypeScript interfaces
│   └── services/        # HTTP services (auth, projects, tasks, comments)
├── features/
│   ├── auth/            # Login + Register pages
│   ├── dashboard/       # Statistics overview
│   ├── kanban/          # Kanban board, task cards, task dialog
│   └── projects/        # Project list + create/edit dialog
└── app.routes.ts        # Lazy-loaded route definitions
```

## Prerequisites

- Node.js 18+
- Angular CLI: `npm install -g @angular/cli`
- [MomentumPM-api](https://github.com/JasonPierceC/MomentumPM-api) running on `http://localhost:5000`

## Getting Started

```bash
# Clone the repo
git clone https://github.com/JasonPierceC/MomentumPM.git
cd MomentumPM

# Install dependencies
npm install

# Start the dev server
ng serve
```

Open [http://localhost:4200](http://localhost:4200). The app expects the backend API at `http://localhost:5000/api` — start the backend first.

## Building for Production

```bash
ng build
```

Output is placed in `dist/`. Update `src/environments/environment.prod.ts` with your production API URL before building.
