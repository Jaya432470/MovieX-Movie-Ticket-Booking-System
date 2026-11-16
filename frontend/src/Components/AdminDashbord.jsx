
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

    const [movies, setMovies] = useState([]);

    const [name, setName] = useState("");
    const [language, setLanguage] = useState("");
    const [showTime, setShowTime] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [poster, setPoster] = useState("");

    const navigate = useNavigate();

    // Admin Logout
    const handleLogout = () => {

        localStorage.removeItem("adminToken");

        alert("Admin logged out successfully!");

        navigate("/admin-login", { replace: true });

    };

    // Fetch Movies
    const fetchMovies = async () => {

        try {

            const response = await axios.get(
                "http://127.0.0.1:5000/movies"
            );

            setMovies(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {
        fetchMovies();
    }, []);

    
// Add or Update Movie
const handleSaveMovie = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("adminToken");

    try {

        // Prepare movie details as JSON
        const movieData = {
            name,
            language,
            show_time: showTime,
            poster
        };

        if (editingId) {

            await axios.put(
                `http://127.0.0.1:5000/admin/movies/${editingId}`,
                movieData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Movie Updated Successfully!");

        } else {

            await axios.post(
                "http://127.0.0.1:5000/admin/movies",
                movieData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Movie Added Successfully!");

        }

        // Clear form after successful save
        setName("");
        setLanguage("");
        setShowTime("");
        setPoster("");
        setEditingId(null);

        fetchMovies();

    } catch (error) {

        console.log(error.response?.data || error);
        alert(error.response?.data?.error || "Unable to save movie!");

    }

};


// Edit Movie
const handleEdit = (movie) => {

    setEditingId(movie.movie_id);

    setName(movie.name);
    setLanguage(movie.language);
    setShowTime(movie.show_time);
    setPoster(movie.poster);

    window.scrollTo(0, 0);

};


    // Delete Movie
    const handleDelete = async (movieId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this movie?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const token = localStorage.getItem("adminToken");

            await axios.delete(
                `http://127.0.0.1:5000/admin/movies/${movieId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Movie Deleted Successfully!");

            fetchMovies();

        } catch (error) {

            console.log(error.response?.data || error);

            if (error.response?.status === 409) {
                alert("This movie has bookings and cannot be deleted!");
            } else {
                alert("Unable to delete movie!");
            }

        }

    };

    return (

        <div className="min-vh-100 py-5"
            style={{
                background: "#10101b",
                color: "white"
            }}
        >

            <div className="container">

                {/* Dashboard Header */}

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-5">

                    <div>
                        <h1 className="fw-bold mb-1"
                            style={{ color: "#b69cff" }}
                        >
                            MOVIEX ADMIN
                        </h1>

                        <p className="text-secondary mb-0">
                            Manage your cinema experience
                        </p>
                    </div>

                    <button
                        className="btn btn-danger px-4"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

                {/* Dashboard Summary */}

                <div className="row g-3 mb-5">

                    <div className="col-md-4">

                        <div className="card p-4 border-0 shadow"
                            style={{
                                background: "#201d32",
                                color: "white"
                            }}
                        >
                            <h6 className="text-secondary">
                                TOTAL MOVIES
                            </h6>

                            <h2 className="fw-bold">
                                {movies.length}
                            </h2>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div className="card p-4 border-0 shadow"
                            style={{
                                background: "#201d32",
                                color: "white"
                            }}
                        >
                            <h6 className="text-secondary">
                                ADMIN PANEL
                            </h6>

                            <h2 className="fw-bold">
                                ACTIVE
                            </h2>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div className="card p-4 border-0 shadow"
                            style={{
                                background: "#201d32",
                                color: "white"
                            }}
                        >
                            <h6 className="text-secondary">
                                MANAGEMENT
                            </h6>

                            <h2 className="fw-bold">
                                READY
                            </h2>

                        </div>

                    </div>

                </div>

                {/* Add / Edit Movie Form */}

                <div className="card border-0 shadow p-4 mb-5"
                    style={{
                        background: "#201d32",
                        color: "white",
                        borderRadius: "15px"
                    }}
                >

                    <h3 className="fw-bold mb-4">
                        {editingId ? "Edit Movie" : "Add New Movie"}
                    </h3>

                    <form onSubmit={handleSaveMovie}>

                        <div className="row g-3">

                            <div className="col-md-4">

                                <label className="form-label">
                                    Movie Name
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter movie name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    Language
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter language"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    required
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    Show Time
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Example: 09:00 PM"
                                    value={showTime}
                                    onChange={(e) => setShowTime(e.target.value)}
                                    required
                                />

                            </div>

                            <div className="col-md-6">

                                <label className="form-label">
                                    Movie Poster
                                </label>

                                <input
                                    type="url"
                                    className="form-control"
                                    placeholder="Paste movie poster image URL"
                                    value={poster}
                                    onChange={(e) => setPoster(e.target.value)}
                                    required
                                />

                                {poster && (
                                    <div className="mt-3">
                                        <img
                                            src={poster}
                                            alt="Movie Poster Preview"
                                            style={{
                                                width: "130px",
                                                height: "180px",
                                                objectFit: "cover",
                                                borderRadius: "10px"
                                            }}
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                            }}
                                        />
                                    </div>
                                )}

                            </div>      

                        </div>

                        <div className="mt-4">

                            <button
                                type="submit"
                                className="btn btn-success px-4 me-2"
                            >
                                {editingId ? "Update Movie" : "Add Movie"}
                            </button>

                            {editingId && (

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setEditingId(null);
                                        setName("");
                                        setLanguage("");
                                        setShowTime("");
                                        setPoster("");
                                    }}
                                >
                                    Cancel
                                </button>

                            )}

                        </div>

                    </form>

                </div>

                {/* Movie List */}

                <div className="card border-0 shadow p-4"
                    style={{
                        background: "#201d32",
                        color: "white",
                        borderRadius: "15px"
                    }}
                >

                    <h3 className="fw-bold mb-4">
                        Movie Management
                    </h3>

                    <div className="table-responsive">

                        <table className="table table-dark table-hover align-middle">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Movie</th>
                                    <th>Language</th>
                                    <th>Show Time</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {movies.map((movie) => (

                                    <tr key={movie.movie_id}>

                                        <td>{movie.movie_id}</td>
                                        <td>{movie.name}</td>
                                        <td>{movie.language}</td>
                                        <td>{movie.show_time}</td>

                                        <td>

                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => handleEdit(movie)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(movie.movie_id)}
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AdminDashboard;
