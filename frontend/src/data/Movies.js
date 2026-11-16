
const movies = [
    {
        id: 1,
        name: "Avengers: Endgame",
        genre: "Action | Adventure | Sci-Fi",
        duration: "3h 1m",
        language: "English",
        rating: 8.4,
        description: "After the devastating events of Infinity War, the Avengers assemble once again to restore balance to the universe.",
        image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        seats: {
            Premium: { price: 250, available: 10, max: 2 },
            Recliner: { price: 400, available: 20, max: 5 },
            "Mid Premium": { price: 180, available: 30, max: 8 },
            Normal: { price: 120, available: 40, max: 10 }
        }
    },
    {
        id: 2,
        name: "Spider-Man: No Way Home",
        genre: "Action | Adventure",
        duration: "2h 28m",
        language: "English",
        rating: 8.2,
        description: "Peter Parker faces unexpected challenges when his identity is revealed to the world.",
        image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
        seats: {
            Premium: { price: 250, available: 20, max: 2 },
            Recliner: { price: 400, available: 30, max: 5 },
            "Mid Premium": { price: 180, available: 40, max: 8 },
            Normal: { price: 120, available: 60, max: 10 }
        }
    },
    {
        id: 3,
        name: "Interstellar",
        genre: "Adventure | Drama | Sci-Fi",
        duration: "2h 49m",
        language: "English",
        rating: 8.7,
        description: "A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars.",
        image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        seats: {
            Premium: { price: 250, available: 10, max: 2 },
            Recliner: { price: 400, available: 20, max: 5 },
            "Mid Premium": { price: 180, available: 30, max: 8 },
            Normal: { price: 120, available: 40, max: 10 }
        }
    }
];

export default movies;
