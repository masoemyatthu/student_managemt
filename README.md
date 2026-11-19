# Student Management System

A full-stack Student Management System built with **Laravel** and **React.js**. This project provides a foundation for managing students and school classes through a RESTful API and a modern frontend interface.

## 🚀 Tech Stack

### Frontend
- React.js
- JavaScript
- Vite
- CSS

### Backend
- PHP
- Laravel
- RESTful API
- PostgreSQL

### Development Tools
- Docker
- Docker Compose
- Git & GitHub

## 📁 Project Structure

```text
student_management/
│
├── backend/
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── storage/
│   ├── docker-compose.yml
│   ├── artisan
│   └── composer.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## ⚙️ Requirements

Make sure you have installed:

- PHP 8.2+
- Composer
- Node.js and npm
- Docker Engine
- Docker Compose
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd student_management
```

### 2. Backend Setup

```bash
cd backend
```

Install PHP dependencies:

```bash
composer install
```

Create environment file:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

Configure your database credentials in `.env`.

### 3. Start PostgreSQL with Docker

```bash
docker compose up -d
```

Run database migrations:

```bash
php artisan migrate
```

Start Laravel development server:

```bash
php artisan serve
```

Backend API:

```text
http://127.0.0.1:8000
```

### 4. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start React development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## 🔑 Environment Configuration

Configure your backend `.env` file according to your Docker PostgreSQL configuration.

Example:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=student_management
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

> Note: If Laravel runs inside Docker, use the PostgreSQL service name as `DB_HOST` and the container's internal port.

## 📌 Features

- Student Management
- School Class Management
- RESTful API Integration
- Database Management
- React.js Frontend
- Laravel Backend

*Features may be updated as development progresses.*

## 🧑‍💻 Development

This project is developed for learning and practicing full-stack web development, backend API development, database relationships, and Docker-based development workflows.

## 📄 License

This project is open-source and available under the MIT License.
