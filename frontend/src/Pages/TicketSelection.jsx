
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function TicketSelection({ setBooking }) {

    const { id } = useParams();
    const navigate = useNavigate();

    const [movieDetails, setMovieDetails] = useState(null);

    const [category, setCategory] = useState("Premium");
    const [quantity, setQuantity] = useState(1);

    // Fetch movie and seat details from Flask
    useEffect(() => {

        axios.get(`http://127.0.0.1:5000/seats/${id}`)

        .then((res) => {
            setMovieDetails(res.data);
        })

        .catch((error) => {
            console.log(error);
        });

    }, [id]);

    // Wait until movie details are loaded
    if (!movieDetails) {
        return <h2 className="text-center mt-5">Loading...</h2>;
    }

    // Get selected category information
    const selectedSeat = movieDetails.seats[category];

    const availableCount = selectedSeat.available.length;

    const total = selectedSeat.price * quantity;

    // Book tickets through Flask
    function handleBooking() {

        if (quantity < 1 || quantity > availableCount) {
            alert("Invalid quantity or insufficient seats available.");
            return;
        }

        axios.post("http://127.0.0.1:5000/book", {

            movie_id: Number(id),
            category: category,
            quantity: quantity

        })

        .then((res) => {

            // Store booking response
            setBooking(res.data);

            // Navigate to summary page
            navigate("/summary");

        })

        .catch((error) => {

            console.log(error);

            alert(
                error.response?.data?.error ||
                "Booking failed. Please try again."
            );

        });

    }

    return (
        <div className="container py-5">

            <h2 className="fw-bold mb-2">
                Select Your Tickets
            </h2>

            <p className="text-secondary">
                {movieDetails.movie}
            </p>

            <p>
                Show Time: {movieDetails.show_time}
            </p>

            <div className="booking-box p-4 rounded">

                <div className="mb-4">

                    <label className="form-label fw-bold">
                        Select Ticket Category
                    </label>

                    <select
                        className="form-select"
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setQuantity(1);
                        }}
                    >

                        {Object.keys(movieDetails.seats).map((seat) => (
                            <option key={seat} value={seat}>
                                {seat}
                            </option>
                        ))}

                    </select>

                </div>

                <div className="mb-4">

                    <h5>Ticket Information</h5>

                    <p>
                        Price per ticket: ₹{selectedSeat.price}
                    </p>

                    <p>
                        Available seats: {availableCount}
                    </p>

                </div>

                <div className="mb-4">

                    <label className="form-label fw-bold">
                        Number of Tickets
                    </label>

                    <input
                        type="number"
                        className="form-control"
                        min="1"
                        max={availableCount}
                        value={quantity}
                        onChange={(e) => {
                            const value = e.target.value;
                            setQuantity(value === "" ? "" : Number(value));
                        }}
                    />

                </div>

                <h4>
                    Total Amount: ₹{total}
                </h4>

                <button
                    className="btn btn-danger mt-3 w-100"
                    onClick={handleBooking}
                >
                    Continue to Summary
                </button>

            </div>

        </div>
    );
}

export default TicketSelection;
