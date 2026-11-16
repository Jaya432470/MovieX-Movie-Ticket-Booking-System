
import sqlite3
from getpass import getpass
from werkzeug.security import generate_password_hash

# Connect to MovieX database
conn = sqlite3.connect("moviex.db")
cursor = conn.cursor()

# Enter admin details
username = input("Enter admin username: ")
password = getpass("Enter admin password: ")
confirm_password = getpass("Confirm admin password: ")

if password != confirm_password:
    print("Passwords do not match!")

else:
    # Generate secure password hash
    password_hash = generate_password_hash(password)

    try:
        cursor.execute(
            "INSERT INTO Admins (username, password_hash) VALUES (?, ?)",
            (username, password_hash)
        )

        conn.commit()
        print("Admin account created successfully!")

    except sqlite3.IntegrityError:
        print("This admin username already exists!")

conn.close()
