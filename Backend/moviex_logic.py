
# 1. MOVIE CLASS

class Movie:

    def __init__(self, movie_id, name, language, show_time):

        self.movie_id = movie_id
        self.name = name
        self.language = language
        self.show_time = show_time

        # Available seats and ticket prices
        self.seats = {

            "Premium": {
                "available": [f"P{i}" for i in range(1, 11)],
                "price": 300
            },

            "Recliner": {
                "available": [f"R{i}" for i in range(1, 11)],
                "price": 250
            },

            "Mid Premium": {
                "available": [f"M{i}" for i in range(1, 11)],
                "price": 200
            },

            "Normal": {
                "available": [f"N{i}" for i in range(1, 11)],
                "price": 150
            }

        }


# 2. MAIN BOOKING SYSTEM

class MovieXBookingSystem:

    def __init__(self):

        self.movies = [

            Movie(1, "Avengers", "English", "10:00 AM"),

            Movie(2, "Pushpa 2", "Telugu", "01:00 PM"),

            Movie(3, "Kalki 2898 AD", "Hindi", "06:00 PM")

        ]

        self.bookings = {}

        self.booking_count = 1000


    # 3. DISPLAY MOVIES

    def display_movies(self):

        print("\n========== AVAILABLE MOVIES ==========")

        for movie in self.movies:

            print(
                f"{movie.movie_id}. {movie.name} | "
                f"{movie.language} | {movie.show_time}"
            )


    # 4. GET VALID INTEGER INPUT

    def get_integer(self, message, minimum, maximum):

        while True:

            try:

                value = int(input(message))

                if minimum <= value <= maximum:

                    return value

                else:

                    print("Please enter a valid number.")

            except ValueError:

                print("Please enter numbers only.")


    # 5. DISPLAY SEAT CATEGORIES

    def display_seats(self, movie):

        print("\n========== SEAT CATEGORIES ==========")

        categories = list(movie.seats.keys())

        for index, category in enumerate(categories, start=1):

            available = len(movie.seats[category]["available"])

            price = movie.seats[category]["price"]

            print(
                f"{index}. {category} | "
                f"Available: {available} | Price: Rs.{price}"
            )


    # 6. BOOK TICKETS

    def book_ticket(self):

        self.display_movies()

        movie_choice = self.get_integer(
            "\nSelect your movie: ", 1, len(self.movies)
        )

        movie = self.movies[movie_choice - 1]

        print("\nSelected Movie:", movie.name)
        print("Show Time:", movie.show_time)

        self.display_seats(movie)

        categories = list(movie.seats.keys())

        category_choice = self.get_integer(
            "\nSelect seat category: ", 1, len(categories)
        )

        category = categories[category_choice - 1]

        available_seats = movie.seats[category]["available"]

        price = movie.seats[category]["price"]

        if len(available_seats) == 0:

            print("\nSorry! No seats available.")

            return

        print("\nAvailable Seats:", available_seats)

        quantity = self.get_integer(
            "How many tickets do you want? ",
            1,
            len(available_seats)
        )

        # Allocate seats
        selected_seats = available_seats[:quantity]

        # Remove booked seats
        movie.seats[category]["available"] = available_seats[quantity:]

        # Calculate total amount
        total_amount = quantity * price

        # Generate booking ID
        self.booking_count += 1

        booking_id = f"MX{self.booking_count}"

        # Store booking information
        self.bookings[booking_id] = {

            "movie": movie.name,
            "show_time": movie.show_time,
            "category": category,
            "seats": selected_seats,
            "quantity": quantity,
            "amount": total_amount

        }

        # Booking confirmation
        print("\n========== BOOKING CONFIRMED ==========")

        print("Booking ID:", booking_id)
        print("Movie:", movie.name)
        print("Show Time:", movie.show_time)
        print("Seat Category:", category)
        print("Selected Seats:", selected_seats)
        print("Number of Tickets:", quantity)
        print("Total Amount: Rs.", total_amount)

        print("\nThank you for booking with MovieX!")
        
        
        
    
    def book_ticket_api(self, movie_id, category, quantity):

        # Find the selected movie
        movie = next(
            (m for m in self.movies if m.movie_id == movie_id),
            None
        )

        # Check whether movie exists
        if movie is None:
            return {
                "error": "Invalid movie ID"
            }, 404
            
    
        # Check whether seat category exists
        if category not in movie.seats:
            return {
                "error": "Invalid seat category"
            }, 400
            
    
        # Get available seats
        available_seats = movie.seats[category]["available"]

        # Get ticket price
        price = movie.seats[category]["price"]

        # Check whether enough seats are available
        if quantity <= 0 or quantity > len(available_seats):
            return {
                "error": "Invalid quantity or insufficient seats available"
            }, 400

        # Select the required number of seats
        selected_seats = available_seats[:quantity]

        # Remove booked seats from available seats
        movie.seats[category]["available"] = available_seats[quantity:]

        # Calculate total amount
        total_amount = quantity * price
        
        
        # Generate booking ID
        self.booking_count += 1

        booking_id = f"MX{self.booking_count}"


        # Store booking information
        self.bookings[booking_id] = {

            "movie": movie.name,
            "show_time": movie.show_time,
            "category": category,
            "seats": selected_seats,
            "quantity": quantity,
            "amount": total_amount

        }
        
        
        # Return booking confirmation
        return {
            "message": "Booking confirmed successfully!",
            "booking_id": booking_id,
            "movie": movie.name,
            "show_time": movie.show_time,
            "category": category,
            "seats": selected_seats,
            "quantity": quantity,
            "amount": total_amount
        }, 200
        
        
        
    def cancel_booking_api(self, booking_id):

        # Check whether booking exists
        if booking_id not in self.bookings:
            return {
                "error": "Booking ID not found"
            }, 404

        # Get booking details
        booking = self.bookings[booking_id]

        # Find the movie
        movie = next(
            (m for m in self.movies if m.name == booking["movie"]),
            None
        )

        # Return cancelled seats to available seats
        if movie is not None:
            category = booking["category"]
            seats = booking["seats"]

            movie.seats[category]["available"].extend(seats)

        # Delete booking from booking history
        del self.bookings[booking_id]

        return {
            "message": "Booking cancelled successfully!",
            "booking_id": booking_id,
            "movie": booking["movie"],
            "cancelled_seats": booking["seats"],
            "refund_amount": booking["amount"]
        }, 200







    # 7. VIEW BOOKING HISTORY

    def view_bookings(self):

        print("\n========== BOOKING HISTORY ==========")

        if not self.bookings:

            print("No bookings found.")

            return

        for booking_id, details in self.bookings.items():

            print("\nBooking ID:", booking_id)
            print("Movie:", details["movie"])
            print("Show Time:", details["show_time"])
            print("Category:", details["category"])
            print("Seats:", details["seats"])
            print("Amount: Rs.", details["amount"])


    # 8. CANCEL BOOKING

    def cancel_booking(self):

        booking_id = input(
            "\nEnter your Booking ID: "
        ).strip().upper()

        if booking_id not in self.bookings:

            print("Invalid Booking ID.")

            return

        booking = self.bookings[booking_id]

        # Find the movie associated with booking
        movie = next(
            m for m in self.movies
            if m.name == booking["movie"]
        )

        category = booking["category"]

        # Restore cancelled seats
        movie.seats[category]["available"].extend(
            booking["seats"]
        )

        movie.seats[category]["available"].sort(
            key=lambda seat: int(seat[1:])
        )

        # Remove booking record
        del self.bookings[booking_id]

        print("\nBooking cancelled successfully!")
        print("Your seats are now available again.")
        
        
    
    
    
    



    # 9. MAIN MENU

    def main_menu(self):

        while True:

            print("\n===================================")
            print("       WELCOME TO MOVIEX")
            print("===================================")

            print("1. View Movies")
            print("2. Book Tickets")
            print("3. View Booking History")
            print("4. Cancel Booking")
            print("5. Exit")

            choice = self.get_integer(
                "\nEnter your choice: ", 1, 5
            )

            if choice == 1:

                self.display_movies()

            elif choice == 2:

                self.book_ticket()

            elif choice == 3:

                self.view_bookings()

            elif choice == 4:

                self.cancel_booking()

            elif choice == 5:

                print("\nThank you for using MovieX!")

                break


# 10. CREATE APPLICATION OBJECT

# app = MovieXBookingSystem()

# app.main_menu()


# for use Flask... 

if __name__ == "__main__":
    app = MovieXBookingSystem()
    app.main_menu()