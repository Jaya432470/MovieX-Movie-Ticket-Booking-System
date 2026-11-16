
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-black text-white text-center py-3 mt-5">

            <p className="mb-0">
                © 2026 MOVIEX. All Rights Reserved.
            </p>

            <small className="text-secondary">
                Your favourite movies, your favourite seats.
            </small>

            <div className="mt-2">
                <Link
                    to="/admin-login"
                    className="text-secondary text-decoration-none"
                >
                    Admin Login
                </Link>
            </div>

        </footer>
    );
}

export default Footer;
