
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                "http://127.0.0.1:5000/admin/login",
                {
                    username: username,
                    password: password
                }
            );

            localStorage.setItem("adminToken", response.data.token);

            alert("Admin Login Successful!");

            navigate("/admin");

        } catch (error) {

    console.log("Login Error:", error.response?.data || error.message);

    alert(
        error.response?.data?.message ||
        "Unable to connect to the backend!"
    );

}
    };

    return (

        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow p-4">

                        <h2 className="text-center mb-4">
                            Admin Login
                        </h2>

                        <form onSubmit={handleLogin}>

                            <div className="mb-3">

                                <label className="form-label">
                                    Username
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                className="btn btn-dark w-100"
                            >
                                Login
                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AdminLogin;
