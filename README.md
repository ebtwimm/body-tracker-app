# Body Tracker App

A 3-tier containerized web application designed to track body measurements (weight and height), calculate BMI automatically, and perform month-over-month progress comparisons.

## Tech Stack
* **Frontend:** React (Vite, Tailwind CSS)
* **Backend:** Node.js, Express, JWT Authentication
* **Database:** PostgreSQL
* **Containerization:** Docker & Docker Compose

---

## Prerequisites
Make sure you have the following installed on your machine:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (running and active)
* [Git](https://git-scm.com/)

---

## Getting Started

### 1. Clone the Repository
Clone the project to your local machine and navigate into the project directory:
```bash
git clone https://github.com/your-username/body-tracker-app.git
cd body-tracker-app
```

### 2. Configure Environment Variables (Optional)
If your backend requires custom environment variables (like a JWT secret or custom database port), create a `.env` file in the `backend` folder or rely on the defaults provided in `docker-compose.yml`.

### 3. Run with Docker Compose
Build and start all services (PostgreSQL database, Node.js backend, and Nginx-hosted React frontend) using a single command:
```bash
docker compose up --build
```

### 4. Initialize Database Tables
Once the containers are running, open a new terminal window and connect to the PostgreSQL database container to create the necessary tables:
```bash
docker exec -it body_tracker_db psql -U postgres -d bodytracker
```
Inside the interactive `psql` prompt, paste and execute the following SQL schema:
```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS measurements (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  weight DECIMAL(5,2) NOT NULL,
  height DECIMAL(5,2) NOT NULL,
  bmi DECIMAL(4,2) NOT NULL,
  recorded_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
Type `\q` and press **Enter** to exit the database shell.

---

## Accessing the Application
* **Frontend UI:** Open your browser and go to `http://localhost:3000`
* **Backend API:** Running at `http://localhost:5000`
* **PostgreSQL Database:** Accessible externally on port `5432`

---

## Stopping the Application
To stop all running containers, press `Ctrl + C` in your terminal where Docker is running, or execute:
```bash
docker compose down
```
