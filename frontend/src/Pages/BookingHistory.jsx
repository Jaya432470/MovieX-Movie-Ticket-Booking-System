
import { useState, useEffect } from "react";
import axios from "axios";

function BookingHistory() {

    const [bookings, setBookings] = useState({});

    // Fetch all bookings from Flask
    function fetchBookings() {

        axios.get("http://127.0.0.1:5000/bookings")

        .then((res) => {
            setBookings(res.data);
        })

        .catch((error) => {
            console.log(error);
        });

    }

    // Run when the page loads
    useEffect(() => {
        fetchBookings();
    }, []);

    // Cancel a booking
    function handleCancel(bookingId) {

        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmCancel) {
            return;
        }

        axios.post("http://127.0.0.1:5000/cancel", {
            booking_id: bookingId
        })

        .then((res) => {

            alert(res.data.message);

            // Refresh booking history
            fetchBookings();

        })

        .catch((error) => {

            console.log(error);

            alert(
                error.response?.data?.error ||
                "Cancellation failed."
            );

        });

    }

    return (
        <div className="container py-5">

            <h2 className="fw-bold mb-4">
                Booking History
            </h2>

            {Object.keys(bookings).length === 0 ? (

                <h5 className="text-secondary">
                    No bookings found.
                </h5>

            ) : (

                <div className="row">

                    {Object.entries(bookings).map(
                        ([bookingId, booking]) => (

                            <div
                                className="col-md-6 mb-4"
                                key={bookingId}
                            >

                                <div className="card p-3 h-100">

                                    <h5 className="fw-bold">
                                        {booking.movie}
                                    </h5>

                                    <p>
                                        Booking ID: {bookingId}
                                    </p>

                                    <p>
                                        Show Time: {booking.show_time}
                                    </p>

                                    <p>
                                        Category: {booking.category}
                                    </p>

                                    <p>
                                        Tickets: {booking.quantity}
                                    </p>

                                    <p>
                                        Seats: {booking.seats.join(", ")}
                                    </p>

                                    <h5 className="text-danger">
                                        Amount: ₹{booking.amount}
                                    </h5>

                                    <button
                                        className="btn btn-outline-danger mt-2"
                                        onClick={() => handleCancel(bookingId)}
                                    >
                                        Cancel Booking
                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
}

export default BookingHistory;
