
import { useState, useEffect } from "react";
import axios from "axios";
import MovieCard from "../Components/MovieCard";

function Home() {

    const [movies, setMovies] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch movies from Flask Backend
    useEffect(() => {

        axios.get("http://127.0.0.1:5000/movies")

            .then((res) => {
                setMovies(res.data);
            })

            .catch((error) => {
                console.log("Movie Fetch Error:", error);
            })

            .finally(() => {
                setLoading(false);
            });

    }, []);

    // Search movies by name or language
    const filteredMovies = movies.filter((movie) => {

        return (
            movie.name.toLowerCase().includes(search.toLowerCase()) ||
            movie.language.toLowerCase().includes(search.toLowerCase())
        );

    });

    return (

        <div style={{
            background: "#100e19",
            minHeight: "100vh",
            color: "white"
        }}>

            {/* HERO SECTION */}

            <section
                className="container-fluid px-3 px-md-5 d-flex align-items-center"
                style={{
                    minHeight: "480px",
                    background: "radial-gradient(circle at 80% 30%, #512b83 0%, transparent 35%), linear-gradient(120deg, #171126, #100e19 70%)"
                }}
            >

                <div className="container py-5">

                    <div className="row align-items-center">

                        <div className="col-lg-8">

                            <span
                                className="badge rounded-pill px-3 py-2 mb-4"
                                style={{
                                    background: "#39235a",
                                    color: "#d8bdff"
                                }}
                            >
                                <i className="bi bi-stars me-2"></i>
                                YOUR CINEMA EXPERIENCE STARTS HERE
                            </span>

                            <h1
                                className="fw-bold mb-3"
                                style={{
                                    fontSize: "clamp(2.5rem, 6vw, 5rem)",
                                    lineHeight: "1.1"
                                }}
                            >
                                Every Movie.
                                <br />

                                Every Moment.

                                <span style={{ color: "#b58aff" }}>
                                    {" "}One Place.
                                </span>

                            </h1>

                            <p
                                className="mb-4"
                                style={{
                                    color: "#b8b3c7",
                                    fontSize: "18px",
                                    maxWidth: "550px"
                                }}
                            >
                                Discover amazing movies, choose your favourite
                                seats and experience the magic of cinema with MOVIEX.
                            </p>

                            <a
                                href="#movies"
                                className="btn btn-lg text-white px-4 py-3 fw-bold"
                                style={{
                                    background: "linear-gradient(90deg, #7c3aed, #a855f7)",
                                    borderRadius: "12px",
                                    border: "none"
                                }}
                            >
                                Explore Movies
                                <i className="bi bi-arrow-down-circle ms-2"></i>
                            </a>

                        </div>

                        <div className="col-lg-4 text-center d-none d-lg-block">

                            <div
                                className="mx-auto d-flex align-items-center justify-content-center"
                                style={{
                                    width: "230px",
                                    height: "230px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #7c3aed, #25123e)",
                                    boxShadow: "0 0 90px rgba(168, 85, 247, 0.3)"
                                }}
                            >

                                <i
                                    className="bi bi-film"
                                    style={{
                                        fontSize: "100px",
                                        color: "white"
                                    }}
                                ></i>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* MOVIE SECTION */}

            <section
                id="movies"
                className="container py-5"
            >

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

                    <div>

                        <p
                            className="mb-2 fw-bold"
                            style={{ color: "#b58aff" }}
                        >
                            DISCOVER YOUR NEXT FAVOURITE
                        </p>

                        <h2 className="fw-bold mb-0">
                            Explore Movies
                        </h2>

                        <p className="text-secondary mt-2 mb-0">
                            Find your movie. Book your experience.
                        </p>

                    </div>

                    <div
                        className="px-3 py-2 rounded-pill"
                        style={{
                            background: "#241b35",
                            color: "#d8bdff"
                        }}
                    >
                        <i className="bi bi-film me-2"></i>
                        {movies.length} Movies Available
                    </div>

                </div>


                {/* SEARCH BAR */}

                <div
                    className="mb-5 p-2 d-flex align-items-center"
                    style={{
                        background: "#201b2d",
                        border: "1px solid #3a304c",
                        borderRadius: "14px",
                        maxWidth: "550px"
                    }}
                >

                    <i
                        className="bi bi-search ms-3"
                        style={{ color: "#b58aff" }}
                    ></i>

                    <input
                        type="text"
                        className="form-control border-0 shadow-none"
                        placeholder="Search movies by name or language..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            background: "transparent",
                            color: "white",
                            padding: "12px"
                        }}
                    />

                    {search && (

                        <button
                            className="btn text-white"
                            onClick={() => setSearch("")}
                        >
                            <i className="bi bi-x-circle"></i>
                        </button>

                    )}

                </div>


                {/* MOVIE CARDS */}

                {loading ? (

                    <div className="text-center py-5">

                        <div
                            className="spinner-border"
                            style={{ color: "#a855f7" }}
                        ></div>

                        <p className="text-secondary mt-3">
                            Loading amazing movies...
                        </p>

                    </div>

                ) : filteredMovies.length > 0 ? (

                    <div className="row">

                        {filteredMovies.map((movie) => (

                            <MovieCard
                                key={movie.movie_id}
                                movie={{
                                    ...movie,
                                    id: movie.movie_id
                                }}
                            />

                        ))}

                    </div>

                ) : (

                    <div className="text-center py-5">

                        <i
                            className="bi bi-film"
                            style={{
                                fontSize: "55px",
                                color: "#8b5cf6"
                            }}
                        ></i>

                        <h4 className="fw-bold mt-3">
                            No Movies Found
                        </h4>

                        <p className="text-secondary">
                            Try searching with another movie name or language.
                        </p>

                        <button
                            className="btn btn-outline-light"
                            onClick={() => setSearch("")}
                        >
                            Show All Movies
                        </button>

                    </div>

                )}

            </section>


            {/* BOTTOM BANNER */}

            <section className="container pb-5">

                <div
                    className="p-4 p-md-5 text-center"
                    style={{
                        background: "linear-gradient(110deg, #321b53, #191327)",
                        border: "1px solid #4b326c",
                        borderRadius: "20px"
                    }}
                >

                    <i
                        className="bi bi-ticket-perforated"
                        style={{
                            fontSize: "40px",
                            color: "#c4a7ff"
                        }}
                    ></i>

                    <h3 className="fw-bold mt-3">
                        Your Next Movie Adventure Awaits!
                    </h3>

                    <p style={{ color: "#c4bfd0" }}>
                        Choose your favourite movie and reserve your seats today.
                    </p>

                    <a
                        href="#movies"
                        className="btn text-white px-4 fw-bold"
                        style={{
                            background: "#8b5cf6",
                            borderRadius: "10px"
                        }}
                    >
                        Book Your Tickets
                    </a>

                </div>

            </section>

        </div>

    );

}

export default Home;
