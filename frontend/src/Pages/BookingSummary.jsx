
import { Link, useNavigate } from "react-router-dom";

function BookingSummary({ booking }) {

    const navigate = useNavigate();

    if (!booking) {
        return (
            <div className="container py-5 text-center">
                <h3>No booking details found.</h3>

                <Link to="/" className="btn btn-danger mt-3">
                    Go Home
                </Link>
            </div>
        );
    }

    // Calculate price per ticket
    const price = booking.amount / booking.quantity;

    return (
        <div className="container py-5">

            <h2 className="fw-bold mb-4">
                Booking Summary
            </h2>

            <div className="booking-box p-4 rounded">

                <h4>{booking.movie}</h4>

                <p>
                    <strong>Show Time:</strong> {booking.show_time}
                </p>

                <hr />

                <p>
                    <strong>Booking ID:</strong> {booking.booking_id}
                </p>

                <p>
                    <strong>Ticket Category:</strong> {booking.category}
                </p>

                <p>
                    <strong>Number of Tickets:</strong> {booking.quantity}
                </p>

                <p>
                    <strong>Selected Seats:</strong> {booking.seats.join(", ")}
                </p>

                <p>
                    <strong>Price per Ticket:</strong> ₹{price}
                </p>

                <hr />

                <h4 className="text-danger">
                    Total Amount: ₹{booking.amount}
                </h4>

                <button
                    className="btn btn-success w-100 mt-4"
                    onClick={() => navigate("/confirmation")}
                >
                    Confirm Booking
                </button>

            </div>

        </div>
    );
}

export default BookingSummary;
