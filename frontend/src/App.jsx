
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import Home from "./Pages/Home";
import MovieDetails from "./Pages/MovieDetails";
import TicketSelection from "./Pages/TicketSelection";
import BookingSummary from "./Pages/BookingSummary";
import Confirmation from "./Pages/Confirmation";

import BookingHistory from "./Pages/BookingHistory";

import AdminDashboard from "./Components/AdminDashbord";

import AdminLogin from "./Pages/AdminLogin";

function ProtectedAdmin() {

    const token = localStorage.getItem("adminToken");

    if (!token) {
        return <Navigate to="/admin-login" />;
    }

    return <AdminDashboard />;
}

function App() {

    const [booking, setBooking] = useState(null);

    return (
        <>

            <Navbar />

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/movie/:id"
                    element={<MovieDetails />}
                />

                <Route
                    path="/booking/:id"
                    element={
                        <TicketSelection setBooking={setBooking} />
                    }
                />

                <Route
                    path="/summary"
                    element={
                        <BookingSummary booking={booking} />
                    }
                />

                <Route
                    path="/confirmation"
                    element={
                        <Confirmation
                            booking={booking}
                            setBooking={setBooking}
                        />
                    }
                />

                <Route 
                    path="/history"
                    element = {<BookingHistory/>}
                />

                {/* <Route path="/admin" element={<AdminDashboard />} /> */}

                <Route path="/admin" element = {<AdminDashboard />} />

                <Route path="/admin-login" element={<AdminLogin />}/>

            </Routes>

            <Footer />

        </>
    );
}

export default App;
