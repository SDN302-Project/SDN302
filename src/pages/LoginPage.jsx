import React, { useState } from "react";
import "../styles/LoginPage.scss";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import { RiHospitalFill } from "react-icons/ri";
import getGoogleAuthUrl from "../utils/getGoogleAuthUrl";
import { ROUTES } from "../routers/routes";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = "https://prevention-api-tdt.onrender.com/api/v1";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = getGoogleAuthUrl();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("🔐 Login response:", data);

      if (data.status === "success") {
        const user = data.data.user;
        const token = data.token;

        // Lưu vào localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        // Điều hướng về trang chủ
        navigate(ROUTES.HOME);
      } else {
        alert(data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi hệ thống: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-blur-box">
        <div className="login-form-container text-center">
          <div className="mb-4">
            <RiHospitalFill size={40} color="#1976d2" />
            <h2 className="mt-3">Đăng nhập</h2>
            <p className="text-muted">Chào mừng bạn đến với hệ thống quản lý</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <FaEnvelope className="text-muted" />
              </span>
              <input
                type="email"
                placeholder="Email của bạn"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text">
                <FaLock className="text-muted" />
              </span>
              <input
                type="password"
                placeholder="Mật khẩu"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check text-start">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <Link to={ROUTES.FORGET} className="small">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              className="btn btn-primary w-100 mb-3"
              type="submit"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="divider">
            <span className="divider-text">hoặc</span>
          </div>

          <button
            className="btn btn-outline-secondary w-100 google-btn mb-4"
            onClick={handleGoogleLogin}
          >
            <FaGoogle className="me-2" />
            Đăng nhập với Google
          </button>

          <div>
            <p className="text-muted mb-0">
              Chưa có tài khoản? <Link to={ROUTES.SIGNUP}>Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
