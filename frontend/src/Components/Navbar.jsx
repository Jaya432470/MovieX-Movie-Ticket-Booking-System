
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (

        <nav
            className="navbar navbar-expand-lg navbar-dark sticky-top"
            style={{
                background: "rgba(16, 14, 25, 0.96)",
                backdropFilter: "blur(15px)",
                borderBottom: "1px solid #302640",
                padding: "15px 0"
            }}
        >

            <div className="container">

                {/* MOVIEX LOGO */}

                <Link
                    className="navbar-brand fw-bold fs-3"
                    to="/"
                    onClick={closeMenu}
                    style={{
                        letterSpacing: "2px",
                        color: "white"
                    }}
                >

                    <span style={{ color: "#a855f7" }}>
                        MOVIE
                    </span>

                    <span>X</span>

                    <span
                        style={{
                            color: "#a855f7",
                            fontSize: "10px",
                            verticalAlign: "top",
                            marginLeft: "3px"
                        }}
                    >
                        .
                    </span>

                </Link>


                {/* MOBILE MENU BUTTON */}

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                    aria-expanded={menuOpen}
                    style={{
                        border: "1px solid #7652a8"
                    }}
                >

                    <span className="navbar-toggler-icon"></span>

                </button>


                {/* NAVIGATION LINKS */}

                <div
                    className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
                >

                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-4 mt-3 mt-lg-0">

                        <li className="nav-item">

                            <NavLink
                                to="/"
                                end
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `nav-link fw-semibold ${isActive ? "text-white" : "text-secondary"}`
                                }
                            >
                                <i className="bi bi-house-door me-2"></i>
                                Home
                            </NavLink>

                        </li>


                        <li className="nav-item">

                            <NavLink
                                to="/history"
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `nav-link fw-semibold ${isActive ? "text-white" : "text-secondary"}`
                                }
                            >
                                <i className="bi bi-clock-history me-2"></i>
                                Booking History
                            </NavLink>

                        </li>


                        

                    </ul>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;
