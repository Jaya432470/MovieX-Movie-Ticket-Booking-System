
import sqlite3

def get_connection():
    conn = sqlite3.connect("moviex.db")
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Movies (
            movie_id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            language TEXT NOT NULL,
            show_time TEXT NOT NULL
        )
    """)
    
    cursor.execute("PRAGMA table_info(Movies)")
    columns = [column[1] for column in cursor.fetchall()]

    if "poster" not in columns:
        cursor.execute("ALTER TABLE Movies ADD COLUMN poster TEXT")
    
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Seats (
            seat_id INTEGER PRIMARY KEY AUTOINCREMENT,
            movie_id INTEGER,
            category TEXT NOT NULL,
            seat_number TEXT NOT NULL,
            price INTEGER NOT NULL,
            status TEXT DEFAULT 'Available',
            FOREIGN KEY (movie_id) REFERENCES Movies(movie_id)
        )
    """)
    

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Bookings (
            booking_id TEXT PRIMARY KEY,
            movie_id INTEGER,
            category TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            amount INTEGER NOT NULL,
            FOREIGN KEY (movie_id) REFERENCES Movies(movie_id)
        )
    """)
    
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS BookingSeats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            booking_id TEXT NOT NULL,
            seat_number TEXT NOT NULL,
            FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id)
        )
    """)
    
    # Admins Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Admins (
            admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    """)
    
    cursor.execute("""
        CREATE UNIQUE INDEX IF NOT EXISTS unique_seat
        ON Seats (movie_id, category, seat_number)
    """)
    
    conn.commit()
    conn.close()




def insert_movies():
    conn = get_connection()
    cursor = conn.cursor()

    movies = [
        (1, "Avengers", "English", "10:00 AM"),
        (2, "Pushpa 2", "Telugu", "01:00 PM"),
        (3, "Kalki 2898 AD", "Hindi", "06:00 PM")
    ]

    cursor.executemany("""
        INSERT OR IGNORE INTO Movies
        (movie_id, name, language, show_time)
        VALUES (?, ?, ?, ?)
    """, movies)

    conn.commit()
    conn.close()
    
    
def insert_seats():
    conn = get_connection()
    cursor = conn.cursor()
    
    categories = {
        "Premium": ("P", 300),
        "Recliner": ("R", 250),
        "Mid Premium": ("M", 200),
        "Normal": ("N", 150)
    }
    
    seats = []
    for movie_id in range(1, 4):
        for category, details in categories.items():
            prefix = details[0]
            price = details[1]
            for i in range(1, 11):
                seat_number = f"{prefix}{i}"
                seats.append((
                    movie_id,
                    category,
                    seat_number,
                    price,
                    "Available"
                ))
    cursor.executemany("""
        INSERT OR IGNORE INTO Seats
        (movie_id, category, seat_number, price, status)
        VALUES (?, ?, ?, ?, ?)
    """, seats)
    
    conn.commit()
    conn.close()

    print("120 seats inserted successfully!")
    
    
    
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM Seats")
    result = cursor.fetchone()

    print("Total seats:", result[0])

    conn.close()
    
    
    
    
    
# Run database functions

if __name__ == "__main__":
    create_tables()
    insert_movies()
    insert_seats()
    
    
    # Update
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE Movies
        SET show_time = '11:00 AM'
        WHERE movie_id = 1
    """)

    conn.commit()
    conn.close()

    print("MovieX database created successfully!")
    print("Movies inserted successfully!")
