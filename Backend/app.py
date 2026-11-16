
from flask import Flask, jsonify, request
from flask_cors import CORS

from moviex_logic import MovieXBookingSystem

from database import get_connection

from werkzeug.security import check_password_hash

from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

import os
from dotenv import load_dotenv

from werkzeug.utils import secure_filename
import uuid


# app = Flask(__name__)
# CORS(app)

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("MOVIEX_SECRET_KEY")

# Movie poster upload configuration
app.config["UPLOAD_FOLDER"] = os.path.join(
    app.root_path, "static", "uploads"
)

# Maximum image size: 5 MB
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024

# Create upload folder automatically
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# Allowed image formats
ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

def allowed_image(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS
    )

if not app.config["SECRET_KEY"]:
    raise RuntimeError("MOVIEX_SECRET_KEY is missing from .env")

CORS(app)



booking_system = MovieXBookingSystem()


# Verify Admin Authentication Token
def verify_admin_token(token):

    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])

    try:
        data = serializer.loads(token, max_age=3600)

        return data["username"]

    except (BadSignature, SignatureExpired):
        return None
    

from functools import wraps

# Protect Admin-Only APIs
def admin_required(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        # Get token from request header
        token = request.headers.get("Authorization")

        if not token or not token.startswith("Bearer "):
            return jsonify({
                "error": "Admin login required"
            }), 401

        # Extract token
        token = token.split(" ", 1)[1]

        # Verify token
        username = verify_admin_token(token)

        if username is None:
            return jsonify({
                "error": "Invalid or expired admin token"
            }), 401

        # Allow access
        return function(*args, **kwargs)

    return wrapper

# ADMIN PROTECTED TEST API
@app.route("/admin/dashboard", methods=["GET"])
@admin_required
def admin_dashboard():

    return jsonify({
        "message": "Welcome to MovieX Admin Dashboard!",
        "admin": "Authenticated successfully"
    }), 200
    
    

# ADMIN API - ADD NEW MOVIE

@app.route("/admin/movies", methods=["POST"])
@admin_required
def add_movie():

    # Receive movie details and poster image
    data = request.form
    image = request.files.get("image")

    # Check required movie fields
    if not all(data.get(key) for key in ["name", "language", "show_time"]):
        return jsonify({
            "error": "Movie name, language and show time are required"
        }), 400

    # Check poster image
    if not image or image.filename == "":
        return jsonify({"error": "Movie poster is required"}), 400

    if not allowed_image(image.filename):
        return jsonify({
            "error": "Only PNG, JPG, JPEG and WEBP images are allowed"
        }), 400

    # Get movie details
    name = data["name"].strip()
    language = data["language"].strip()
    show_time = data["show_time"].strip()

    if not name or not language or not show_time:
        return jsonify({"error": "Fields cannot be empty"}), 400

    # Generate a unique poster filename
    extension = image.filename.rsplit(".", 1)[1].lower()
    poster_filename = f"{uuid.uuid4().hex}.{extension}"

    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Save poster inside static/uploads
        image.save(
            os.path.join(app.config["UPLOAD_FOLDER"], poster_filename)
        )

        # Insert movie into Movies table
        cursor.execute("""
            INSERT INTO Movies (name, language, show_time, poster)
            VALUES (?, ?, ?, ?)
        """, (name, language, show_time, poster_filename))

        # Get automatically generated movie ID
        movie_id = cursor.lastrowid

        # Create seats for the new movie
        categories = {
            "Premium": ("P", 300),
            "Recliner": ("R", 250),
            "Mid Premium": ("M", 200),
            "Normal": ("N", 150)
        }

        seats = []

        for category, details in categories.items():
            prefix, price = details

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
            INSERT INTO Seats
            (movie_id, category, seat_number, price, status)
            VALUES (?, ?, ?, ?, ?)
        """, seats)

        conn.commit()

        return jsonify({
            "message": "Movie added successfully!",
            "movie_id": movie_id,
            "name": name,
            "language": language,
            "show_time": show_time,
            "poster": poster_filename,
            "total_seats_created": len(seats)
        }), 201

    except Exception as error:
        conn.rollback()
        print("Add movie error:", error)

        return jsonify({
            "error": "Unable to add movie"
        }), 500

    finally:
        conn.close()



# ADMIN API - UPDATE MOVIE

@app.route("/admin/movies/<int:movie_id>", methods=["PUT"])
@admin_required
def update_movie(movie_id):

    # Receive movie details and optional poster
    data = request.form
    image = request.files.get("image")

    if not all(data.get(key) for key in ["name", "language", "show_time"]):
        return jsonify({
            "error": "Movie name, language and show time are required"
        }), 400

    name = data["name"].strip()
    language = data["language"].strip()
    show_time = data["show_time"].strip()

    if not name or not language or not show_time:
        return jsonify({"error": "Fields cannot be empty"}), 400

    # Validate poster only if a new image is uploaded
    if image and image.filename:
        if not allowed_image(image.filename):
            return jsonify({
                "error": "Only PNG, JPG, JPEG and WEBP images are allowed"
            }), 400

    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Check whether movie exists and get old poster
        cursor.execute("""
            SELECT poster
            FROM Movies
            WHERE movie_id = ?
        """, (movie_id,))

        movie = cursor.fetchone()

        if movie is None:
            return jsonify({"error": "Movie not found"}), 404

        poster_filename = movie[0]

        # If a new poster is uploaded
        if image and image.filename:
            extension = image.filename.rsplit(".", 1)[1].lower()
            poster_filename = f"{uuid.uuid4().hex}.{extension}"

            image.save(
                os.path.join(app.config["UPLOAD_FOLDER"], poster_filename)
            )

        # Update movie details
        cursor.execute("""
            UPDATE Movies
            SET name = ?, language = ?, show_time = ?, poster = ?
            WHERE movie_id = ?
        """, (name, language, show_time, poster_filename, movie_id))

        conn.commit()

        return jsonify({
            "message": "Movie updated successfully!",
            "movie_id": movie_id,
            "name": name,
            "language": language,
            "show_time": show_time,
            "poster": poster_filename
        }), 200

    except Exception as error:
        conn.rollback()
        print("Update movie error:", error)

        return jsonify({
            "error": "Unable to update movie"
        }), 500

    finally:
        conn.close()




# ADMIN API - DELETE MOVIE

@app.route("/admin/movies/<int:movie_id>", methods=["DELETE"])
@admin_required
def delete_movie(movie_id):

    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Check whether movie exists
        cursor.execute("""
            SELECT movie_id
            FROM Movies
            WHERE movie_id = ?
        """, (movie_id,))

        movie = cursor.fetchone()

        if movie is None:
            return jsonify({
                "error": "Movie not found"
            }), 404

        # Check whether movie has existing bookings
        cursor.execute("""
            SELECT COUNT(*)
            FROM Bookings
            WHERE movie_id = ?
        """, (movie_id,))

        booking_count = cursor.fetchone()[0]

        if booking_count > 0:
            return jsonify({
                "error": "Cannot delete movie because bookings already exist"
            }), 409

        # Delete seats belonging to this movie
        cursor.execute("""
            DELETE FROM Seats
            WHERE movie_id = ?
        """, (movie_id,))

        # Delete movie
        cursor.execute("""
            DELETE FROM Movies
            WHERE movie_id = ?
        """, (movie_id,))

        conn.commit()

        return jsonify({
            "message": "Movie deleted successfully!",
            "movie_id": movie_id
        }), 200

    except Exception:
        conn.rollback()

        return jsonify({
            "error": "Unable to delete movie"
        }), 500

    finally:
        conn.close()




# ADMIN LOGIN API
@app.route("/admin/login", methods=["POST"])
def admin_login():

    # Get username and password from frontend
    data = request.get_json()
    
    if not data or not data.get("username") or not data.get("password"):
        return jsonify({
            "error": "Username and password are required"
        }), 400

    username = data.get("username")
    password = data.get("password")

    # Connect to database
    conn = get_connection()
    cursor = conn.cursor()

    # Find admin using username
    cursor.execute(
        "SELECT * FROM Admins WHERE username = ?",
        (username,)
    )

    admin = cursor.fetchone()
    conn.close()

    # Check whether admin exists
    if admin is None:
        return jsonify({
            "error": "Invalid username or password"
        }), 401

    # Verify entered password with stored hash
    if not check_password_hash(admin[2], password):
        return jsonify({
            "error": "Invalid username or password"
        }), 401

   # Create token generator
    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])

    # Generate admin authentication token
    token = serializer.dumps({
        "username": username
    })

    # Return token to frontend
    return jsonify({
        "message": "Admin login successful!",
        "token": token
    }), 200
    
    

# API - 1 :- Fetch All Movies..
@app.route("/movies", methods=["GET"])
def get_movies():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Movies")

    rows = cursor.fetchall()

    movies = []

    for row in rows:
        movies.append({
            "movie_id": row[0],
            "name": row[1],
            "language": row[2],
            "show_time": row[3],
            "poster": row[4]
        })

    conn.close()

    return jsonify(movies)



    

# API - 2: Book Movie Tickets

@app.route("/book", methods=["POST"])
def book_ticket():

    data = request.json

    movie_id = data["movie_id"]
    category = data["category"]
    quantity = data["quantity"]
    
    conn = get_connection()
    cursor = conn.cursor()

    # Check whether movie exists
    cursor.execute("""
        SELECT name, show_time
        FROM Movies
        WHERE movie_id = ?
    """, (movie_id,))

    movie = cursor.fetchone()

    if movie is None:
        conn.close()
        return jsonify({"error": "Invalid movie ID"}), 404

    # Check whether seat category exists
    cursor.execute("""
        SELECT DISTINCT category
        FROM Seats
        WHERE movie_id = ?
    """, (movie_id,))

    categories = [row[0] for row in cursor.fetchall()]

    if category not in categories:
        conn.close()
        return jsonify({"error": "Invalid seat category"}), 400
    
    # Get available seats
    cursor.execute("""
        SELECT seat_number, price
        FROM Seats
        WHERE movie_id = ?
        AND category = ?
        AND status = 'Available'
    """, (movie_id, category))

    available_seats = cursor.fetchall()
    
    # Check whether enough seats are available
    if quantity <= 0 or quantity > len(available_seats):
        conn.close()
        return jsonify({
            "error": "Invalid quantity or insufficient seats available"
        }), 400
        
        
    # Select required seats
    selected_seats = available_seats[:quantity]

    # Extract seat numbers
    selected_seats = [seat[0] for seat in selected_seats]

    # Get ticket price
    price = available_seats[0][1]
    
    
    
    total_amount = quantity * price
    
    # Generate booking ID
    cursor.execute("""
        SELECT COUNT(*) FROM Bookings
    """)

    booking_count = cursor.fetchone()[0]

    booking_id = f"MX{1001 + booking_count}"
    
    # Store booking information
    cursor.execute("""
        INSERT INTO Bookings
        (booking_id, movie_id, category, quantity, amount)
        VALUES (?, ?, ?, ?, ?)
    """, (booking_id, movie_id, category, quantity, total_amount))
    
    # Update selected seats as Booked
    for seat_number in selected_seats:

        cursor.execute("""
            UPDATE Seats
            SET status = 'Booked'
            WHERE movie_id = ?
            AND category = ?
            AND seat_number = ?
        """, (movie_id, category, seat_number))

    # Store selected seats in BookingSeats
    for seat_number in selected_seats:

        cursor.execute("""
            INSERT INTO BookingSeats
            (booking_id, seat_number)
            VALUES (?, ?)
        """, (booking_id, seat_number))
        
        
    # Save all database changes
    conn.commit()

    # Close database connection
    conn.close()

    # Return booking confirmation
    return jsonify({
        "message": "Booking confirmed successfully!",
        "booking_id": booking_id,
        "movie": movie[0],
        "show_time": movie[1],
        "category": category,
        "seats": selected_seats,
        "quantity": quantity,
        "amount": total_amount
    }), 200

# API - 3: Get Booking History

@app.route("/bookings", methods=["GET"])
def get_bookings():

    conn = get_connection()
    cursor = conn.cursor()

    # Get booking details along with movie details
    cursor.execute("""
        SELECT
            Bookings.booking_id,
            Movies.name,
            Movies.show_time,
            Bookings.category,
            Bookings.quantity,
            Bookings.amount
        FROM Bookings
        INNER JOIN Movies
        ON Bookings.movie_id = Movies.movie_id
    """)

    rows = cursor.fetchall()

    bookings = {}

    for row in rows:

        booking_id = row[0]

        # Get seats for this booking
        cursor.execute("""
            SELECT seat_number
            FROM BookingSeats
            WHERE booking_id = ?
        """, (booking_id,))

        seats = [seat[0] for seat in cursor.fetchall()]

        bookings[booking_id] = {
            "movie": row[1],
            "show_time": row[2],
            "category": row[3],
            "seats": seats,
            "quantity": row[4],
            "amount": row[5]
        }

    conn.close()

    return jsonify(bookings)



# API - 4: Fetch Available Seats

# @app.route("/seats/<int:movie_id>", methods=["GET"])
# def get_available_seats(movie_id):

@app.route("/seats/<int:movie_id>", methods=["GET"])
def get_available_seats(movie_id):

    conn = get_connection()
    cursor = conn.cursor()

    # Get movie details
    cursor.execute("""
        SELECT name, show_time
        FROM Movies
        WHERE movie_id = ?
    """, (movie_id,))

    movie = cursor.fetchone()

    # Check whether movie exists
    if movie is None:
        conn.close()
        return jsonify({"error": "Movie not found"}), 404

    # Get seat details
    cursor.execute("""
        SELECT category, price, seat_number
        FROM Seats
        WHERE movie_id = ? AND status = 'Available'
    """, (movie_id,))

    rows = cursor.fetchall()

    seat_details = {}

    for category, price, seat_number in rows:

        if category not in seat_details:
            seat_details[category] = {
                "price": price,
                "available": []
            }

        seat_details[category]["available"].append(seat_number)

    conn.close()

    return jsonify({
        "movie": movie[0],
        "show_time": movie[1],
        "seats": seat_details
    })

    

# API - 5: Cancel Booking

@app.route("/cancel", methods=["POST"])
def cancel_booking():

    data = request.json
    booking_id = data["booking_id"]

    conn = get_connection()
    cursor = conn.cursor()

    # Check whether booking exists
    cursor.execute("""
        SELECT movie_id, category
        FROM Bookings
        WHERE booking_id = ?
    """, (booking_id,))

    booking = cursor.fetchone()

    if booking is None:
        conn.close()
        return jsonify({"error": "Booking not found"}), 404

    movie_id = booking[0]
    category = booking[1]

    # Get booked seat numbers
    cursor.execute("""
        SELECT seat_number
        FROM BookingSeats
        WHERE booking_id = ?
    """, (booking_id,))

    seats = cursor.fetchall()

    # Make seats available again
    for seat in seats:
        cursor.execute("""
            UPDATE Seats
            SET status = 'Available'
            WHERE movie_id = ?
            AND category = ?
            AND seat_number = ?
        """, (movie_id, category, seat[0]))

    # Delete booking seat records
    cursor.execute("""
        DELETE FROM BookingSeats
        WHERE booking_id = ?
    """, (booking_id,))

    # Delete booking record
    cursor.execute("""
        DELETE FROM Bookings
        WHERE booking_id = ?
    """, (booking_id,))

    # Save database changes
    conn.commit()

    conn.close()

    return jsonify({
        "message": "Booking cancelled successfully!",
        "booking_id": booking_id,
        "released_seats": [seat[0] for seat in seats]
    }), 200




# Start Flask server
if __name__ == "__main__":
    app.run(debug=True)