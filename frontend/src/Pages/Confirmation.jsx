
import { Link } from "react-router-dom";

function Confirmation({ booking, setBooking }) {

    if (!booking) {
        return (
            <div className="container text-center py-5">
                <h3>No confirmed booking found.</h3>

                <Link to="/" className="btn btn-danger mt-3">
                    Go Home
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-5">

            <div className="confirmation-box text-center p-5 rounded">

                <h1 className="text-success">✓</h1>

                <h2 className="fw-bold">
                    Booking Successful!
                </h2>

                <p className="text-secondary">
                    Your movie ticket booking has been confirmed.
                </p>

                <hr />

                <h4>{booking.movie}</h4>

                <p>
                    Booking ID: <strong>{booking.booking_id}</strong>
                </p>

                <p>Show Time: {booking.show_time}</p>

                <p>Category: {booking.category}</p>

                <p>Tickets: {booking.quantity}</p>

                <p>
                    Selected Seats: {booking.seats.join(", ")}
                </p>

                <h4 className="text-danger">
                    Total Amount: ₹{booking.amount}
                </h4>

                <p className="text-secondary mt-3">
                    This is a demo confirmation. No real payment was made.
                </p>

                <Link
                    to="/"
                    className="btn btn-danger mt-3"
                    onClick={() => setBooking(null)}
                >
                    Back to Home
                </Link>

            </div>

        </div>
    );
}

export default Confirmation;
