# TaskBoard: Full-Stack Interactive Kanban Board

TaskBoard is a high-performance, premium full-stack task management application. It features a responsive Angular frontend styled with Angular Material, interactive CDK Drag-and-Drop column boards, custom light/dark color themes, and a secure Django REST Framework (DRF) backend with JWT authentication and strict multi-user task isolation.

---

## Key Features

- **Interactive Kanban Board**: Smooth drag-and-drop mechanics (via `@angular/cdk/drag-drop`) to update task states (Todo, In Progress, Done) reactively.
- **Premium Aesthetics**: Styled with the geometric sans-serif font *Outfit*, custom Google Material Icons, and glassmorphic navigation panels.
- **Custom Color Themes**: Light and Dark mode options.
  - **Deep Space (Dark Theme)**: Dark obsidian backgrounds with glowing borders and vibrant accents.
  - **Frosted Sage (Light Theme)**: Clean white backgrounds with mint and teal styling.
- **Multi-User Task Isolation**: Strict authentication boundary. Registered users can only view, edit, or drag tasks associated with their account.
- **Secure JWT Authentication**: Clean login and signup workflows utilizing Simple JWT access tokens.
- **Hybrid Storage Strategy**: User databases and tasks persist permanently in `localStorage`, while active auth sessions remain tab-bound in `sessionStorage` for security.

---

## Architectural Layout

```
├── backend/                  # Django REST API (DRF)
│   ├── config/               # Main configurations & settings.py
│   ├── tasks/                # Database schemas, serializers, views
│   ├── manage.py             # Django controller script
│   └── db.sqlite3            # SQLite Development Database
│
└── src/                      # Angular Client Application
    ├── app/
    │   ├── components/       # Standalone components (board, card, forms, auth)
    │   ├── services/         # Asynchronous HTTP Services (auth, tasks)
    │   ├── models/           # Frontend TypeScript interfaces
    │   └── app.routes.ts     # Lazy-loaded route configurations
    └── main.ts               # Application bootstrap
```

---

## Getting Started

### Prerequisites
Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)

---

### Backend Setup (Django)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Initialize a Python virtual environment:
   ```bash
   python3 -m venv venv
   ```

3. Activate the virtual environment:
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```
   - **Windows**:
     ```cmd
     venv\Scripts\activate
     ```

4. Install the required dependencies:
   ```bash
   pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
   ```

5. Run database migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Start the Django development server:
   ```bash
   python manage.py runserver
   ```
   The backend API will run on `http://127.0.0.1:8000/api/`.

---

### Frontend Setup (Angular)

1. Navigate to the project root directory:
   ```bash
   cd ..
   ```

2. Install the node dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:4200/
   ```

---

## Running Quality Checks

### Angular Unit Tests
The client application uses the [Vitest](https://vitest.dev/) test runner for high-speed, mocked HTTP unit testing. To run the test suite:
```bash
npm run test
```

### Production Build
To compile the Angular application with budget optimizations and AOT:
```bash
npm run build
```
This builds and stores the static outputs in the `dist/todo-board` directory.
