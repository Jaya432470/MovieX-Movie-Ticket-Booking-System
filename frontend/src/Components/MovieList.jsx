
import { useState, useEffect } from 'react';
import axios from 'axios';

function MovieList() {

    const [movies, setMovies] = useState([]);

    useEffect(() => {

        axios.get("http://127.0.0.1:5000/movies")

        .then((res) => {
            setMovies(res.data);
        })

        .catch((error) => {
            console.log(error);
        });

    }, []);

    return (
        <>
            <h1>Available Movies</h1>

            {movies.map((movie) => (
                <div key={movie.movie_id}>
                    <h3>{movie.name}</h3>
                    <p>Language: {movie.language}</p>
                    <p>Show Time: {movie.show_time}</p>
                </div>
            ))}

        </>
    );
}

export default MovieList;
