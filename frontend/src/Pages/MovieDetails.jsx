
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function MovieDetails() {

    const { id } = useParams();

    const [movieDetails, setMovieDetails] = useState(null);

    useEffect(() => {

        axios.get(`http://127.0.0.1:5000/seats/${id}`)

        .then((res) => {
            setMovieDetails(res.data);
        })

        .catch((error) => {
            console.log(error);
        });

    }, [id]);

    if (!movieDetails) {
        return <h2 className="text-center mt-5">Loading movie details...</h2>;
    }

    return (
        <div className="container py-5">

            <div className="row">

                <div className="col-md-8">

                    <h1 className="fw-bold">
                        {movieDetails.movie}
                    </h1>

                    <p>
                        Show Time: {movieDetails.show_time}
                    </p>

                    <h4 className="mt-4">Available Ticket Categories</h4>

                    {Object.entries(movieDetails.seats).map(
                        ([category, details]) => (

                            <div className="card p-3 mb-3" key={category}>

                                <h5>{category}</h5>

                                <p>Price: ₹{details.price}</p>

                                <p>
                                    Available Seats: {details.available.length}
                                </p>

                            </div>

                        )
                    )}

                    <Link
                        to={`/booking/${id}`}
                        className="btn btn-danger btn-lg"
                    >
                        Select Tickets
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default MovieDetails;
