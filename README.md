# URL Shortener

A full-stack web application that converts long URLs into short, shareable links with click tracking and history.

Built as a university mini project using **React**, **Node.js**, **Express**, and **MySQL (XAMPP)**.

---

## Screenshots

### Home Page & Shortening
![Home Page](screenshots/home.png)

### History with Click Tracking
![History](screenshots/history.png)

---

## Features

- Shorten any long URL into a 6-character code
- One-click copy to clipboard
- Click tracking — every visit increments the counter
- History table showing all shortened URLs
- Auto-redirect from short URL to original
- Auto-adds `https://` if the user forgets it

---

## Tech Stack

| Layer     | Technology                     |
|-----------|--------------------------------|
| Frontend  | React (Vite), Axios, CSS       |
| Backend   | Node.js, Express               |
| Database  | MySQL (via XAMPP)              |
| Libraries | `nanoid`, `mysql2`, `cors`     |

---

## Project Structure

```
url-shortener/
├── backend/
│   ├── db.js            # MySQL connection pool
│   ├── server.js        # Express server + API routes
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx      # Main React component
│   │   ├── App.css      # Styles
│   │   └── main.jsx
│   └── package.json
├── screenshots/
│   ├── home.png
│   └── history.png
└── README.md
```

---

## Database Setup

Open **phpMyAdmin** (`http://localhost/phpmyadmin`) and run this SQL once:

```sql
CREATE DATABASE url_shortener;

USE url_shortener;

CREATE TABLE urls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) NOT NULL UNIQUE,
  clicks INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

| Method | Endpoint    | Description                          |
|--------|-------------|--------------------------------------|
| POST   | `/shorten`  | Create a short URL from a long URL   |
| GET    | `/urls`     | Get all shortened URLs (history)     |
| GET    | `/:code`    | Redirect to the original URL         |

**Example — POST `/shorten`:**

Request:
```json
{ "original_url": "https://www.google.com" }
```

Response:
```json
{
  "short_url": "http://localhost:5000/9RtcM2",
  "short_code": "9RtcM2",
  "original_url": "https://www.google.com"
}
```

---

## How to Run Locally

### Prerequisites
- Node.js installed
- XAMPP installed (Apache + MySQL)

### Step 1 — Start XAMPP
Open XAMPP Control Panel -> Start **Apache** and **MySQL**.

### Step 2 — Set up the database
Open phpMyAdmin and run the SQL shown in the **Database Setup** section above.

### Step 3 — Run the backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000`.

### Step 4 — Run the frontend
Open a **new terminal**:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

### Step 5 — Use the app
Open `http://localhost:5173`, paste a URL, click **Shorten**.

---

## How It Works

1. User pastes a long URL into the React form.
2. Frontend sends `POST /shorten` to the backend.
3. Backend generates a unique 6-character code using `nanoid`.
4. Backend stores `(original_url, short_code)` in MySQL.
5. Backend returns the short URL to the frontend.
6. When someone opens the short URL, the backend:
   - Looks up the code in MySQL
   - Increments the `clicks` counter
   - Redirects to the original URL

---

## Future Scope

- User authentication (login/signup with JWT)
- QR code generation for each short link
- Custom short codes chosen by the user
- Expiry dates for links
- Analytics dashboard with charts
- Delete / edit links
- Cloud deployment (Vercel + Render + Railway)

---

## Author
Ayushi Chopra
Mini Project — [2026]

---

## License

This project is open-source and available under the [MIT License](LICENSE).
