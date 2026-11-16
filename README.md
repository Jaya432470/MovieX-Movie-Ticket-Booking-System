# 🎬 MovieX – Movie Ticket Booking System

MovieX is a full-stack movie ticket booking application that allows users to explore movies, select seats, book tickets, and manage their bookings. It also provides an admin dashboard to manage movies.

## 🚀 Features

### User Features
- View available movies.
- Explore movie details, language, and show timings.
- Select seat categories and ticket quantities.
- View available seats.
- Book movie tickets.
- View booking confirmation and booking history.
- Cancel existing bookings.

### Admin Features
- Admin login authentication.
- Secure password verification using password hashing.
- Add new movies with poster images.
- Update movie details and posters.
- Delete movies.
- Protected admin dashboard and APIs.

## 🛠️ Technologies Used

**Frontend**
- React.js
- JavaScript
- HTML5
- CSS3
- Bootstrap
- Axios
- React Router
- Vite

**Backend**
- Python
- Flask
- Flask-CORS
- SQLite
- REST APIs
- Werkzeug

## 📁 Project Structure

```text
Movie-Booking-Application/
│
├── Backend/
│   ├── app.py
│   ├── create_admin.py
│   ├── database.py
│   ├── moviex_logic.py
│   └── static/
│       └── uploads/
│
├── frontend/
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── data/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Jaya432470/MovieX-Movie-Ticket-Booking-System.git
```

### 2. Backend Setup

```bash
cd MovieX-Movie-Ticket-Booking-System/Backend
```

Install the required Python packages used by the backend:

```bash
pip install flask flask-cors werkzeug itsdangerous python-dotenv
```

Create a `.env` file inside the Backend folder:

```env
MOVIEX_SECRET_KEY=your_secret_key
```

Create the admin account using:

```bash
python create_admin.py
```

Start the Flask backend:

```bash
python app.py
```

### 3. Frontend Setup

Open another terminal:

```bash
cd MovieX-Movie-Ticket-Booking-System/frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal to access MovieX.

**Note:** The frontend API configuration must point to the running backend server.

## 🔐 Security

- Admin passwords are stored as password hashes.
- Admin APIs are protected using authentication tokens.
- Secret keys are maintained in environment variables.
- Environment files and local database files are excluded from Git.

## 🔮 Future Improvements

- Online payment integration.
- Email booking confirmations.
- Improved user authentication.
- Production database integration.
- Cloud deployment.

## 👨‍💻 Author

**Jayaprakash Maharana**

GitHub: https://github.com/Jaya432470
