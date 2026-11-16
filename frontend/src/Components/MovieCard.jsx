
import { Link } from "react-router-dom";

function MovieCard({ movie }) {

    const movieImages = {
        1: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
        2: "https://image.tmdb.org/t/p/w500/1XDDXPXGiI8id7MrUxK36ke7gkX.jpg",
        3: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg"
    };

    const poster = movie.poster
    ? movie.poster.startsWith("http")
        ? movie.poster
        : `http://127.0.0.1:5000/static/uploads/${movie.poster}`
    : movieImages[movie.id];

    
    return (

        <div className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">

            <div
                className="h-100 overflow-hidden"
                style={{
                    background: "#1c1a29",
                    border: "1px solid #353047",
                    borderRadius: "18px",
                    color: "white",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease"
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(139, 92, 246, 0.25)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                }}
            >

                {/* Movie Poster */}

                {poster ? (

                    <img
                        src={poster}
                        alt={movie.name}
                        className="w-100"
                        style={{
                            width: "100%",
                            height: "360px",
                            objectFit: "contain",
                            objectPosition: "center",
                            backgroundColor: "#171725"
                        }}
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />

                ) : (

                    <div
                        className="d-flex align-items-center justify-content-center text-center p-4"
                        style={{
                            height: "360px",
                            background: "linear-gradient(135deg, #30204d, #11101a)"
                        }}
                    >
                        <h3 className="fw-bold">
                            {movie.name}
                        </h3>
                    </div>

                )}

                {/* Movie Information */}

                <div className="p-3">

                    <h5 className="fw-bold mb-2">
                        {movie.name}
                    </h5>

                    <p className="text-secondary mb-2">
                        <i className="bi bi-translate me-2"></i>
                        {movie.language}
                    </p>

                    <p className="mb-3" style={{ color: "#c4a7ff" }}>
                        <i className="bi bi-clock me-2"></i>
                        {movie.show_time}
                    </p>

                    <Link
                        to={`/movie/${movie.id}`}
                        className="btn w-100 fw-bold text-white"
                        style={{
                            background: "linear-gradient(90deg, #7c3aed, #a855f7)",
                            border: "none",
                            borderRadius: "10px",
                            padding: "11px"
                        }}
                    >
                        Book Tickets
                        <i className="bi bi-arrow-right ms-2"></i>
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default MovieCard;
