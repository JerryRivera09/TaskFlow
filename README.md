# TaskFlow — Task Management Application

TaskFlow is a full-stack web application designed to organize daily tasks, track progress, and manage activities through a simple and intuitive interface.

This project was built as a portfolio project to practice frontend development, REST API design, relational databases, and containerization with Docker.

## Features

- Create tasks with a title and description.
- View saved tasks.
- Edit existing tasks.
- Mark tasks as completed or pending.
- Delete tasks with confirmation.
- Persist data in PostgreSQL.
- Run the application using Docker Compose.

## Tech Stack

**Frontend**
- React
- Vite
- CSS
- Nginx

**Backend**
- Node.js
- Express.js
- REST API

**Database**
- PostgreSQL

**DevOps**
- Docker
- Docker Compose
- Git and GitHub

## Architecture

TaskFlow consists of three services:

1. Frontend: serves the React application through Nginx.
2. Backend: provides REST API endpoints using Express.js.
3. Database: stores tasks in PostgreSQL.

Docker Compose orchestrates all services and configures their communication.

## Getting Started

### Prerequisites

- Docker Desktop
- Git

## Screenshots

TaskFlow features a modern dark interface with emerald green accents, subtle animations, and a responsive layout.

### Dashboard

![TaskFlow dashboard](assets/Screenshots/Task%20ADD.png)

### Task management

![TaskFlow task list](assets/Screenshots/available%20tasks.png)

### Responsive design

![TaskFlow responsive interface](assets/Screenshots/narrow%20window.png)


### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_REPOSITORY_URL
   cd TaskFlow
   ```

2. Create a `.env` file in the project root using `.env.example` as a template.

3. Set `DB_PASSWORD` to a local password. For an existing database volume, use the password already configured for that database.

4. Build and start the application:

   ```bash
   docker compose up --build -d
   ```

5. Open the application:

   - Frontend: http://localhost:5173
   - API health check: http://localhost:3000/api/health

### Stop the application

```bash
docker compose down
```

The PostgreSQL data volume is preserved when the containers are stopped this way.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API and database connectivity |
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| PATCH | `/api/tasks/:id/completed` | Update completion status |
| DELETE | `/api/tasks/:id` | Delete a task |

## Project Structure

```text
TaskFlow/
├── backend/
│   ├── src/
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Learning Objectives

This project demonstrates practical experience with:

- Building interactive interfaces with React.
- Developing REST APIs with Node.js and Express.
- Connecting an application to PostgreSQL.
- Managing configuration through environment variables.
- Containerizing services with Docker.
- Orchestrating multi-container applications with Docker Compose.
- Using Git and GitHub for version control.

## Future Improvements

- User authentication and authorization.
- Task filtering and search.
- Due dates and priorities.
- Automated tests.
- Continuous integration and deployment.

## Author

Systems Engineering student interested in software development, web technologies, and DevOps.