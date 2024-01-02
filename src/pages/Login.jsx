import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import "../css/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/home");
    } catch (e) {
      setError(e.message);
      console.log(e.message);
    }
  };

  return (
    <div class="container-fluid ps-md-0">
      <div class="row g-0">
        <div class="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
        <div class="col-md-8 col-lg-6">
          <div class="login d-flex align-items-center py-5">
            <div class="container">
              <div class="row">
                <div class="col-md-9 col-lg-8 mx-auto">
                  <h3 class="login-heading mb-4">Welcome back!</h3>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div class="form-floating mb-3">
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="name@example.com"
                      />
                      <label for="email">Email address</label>
                    </div>
                    <div class="form-floating mb-3">
                      <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                      />
                      <label for="password">Password</label>
                    </div>
                    <div class="d-grid">
                      <button
                        class="btn btn-lg btn-primary btn-login text-uppercase fw-bold mb-2"
                        type="submit"
                      >
                        Sign in
                      </button>
                      <div class="text-center">
                        <a class="small" href="/">
                          Forgot password?
                        </a>
                        <p className="mt-3">
                          Add user Comp <Link to="/adduser">Add User</Link>
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
