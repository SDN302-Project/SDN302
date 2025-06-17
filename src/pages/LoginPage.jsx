import React from "react";
import "../styles/LoginPage.scss";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import { RiHospitalFill } from "react-icons/ri";
import getGoogleAuthUrl from "../utils/getGoogleAuthUrl"

const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.href = getGoogleAuthUrl();
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

          <div className="input-group mb-3">
            <span className="input-group-text">
              <FaEnvelope className="text-muted" />
            </span>
            <input
              type="email"
              placeholder="Email của bạn"
              className="form-control"
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
            <a href="/forget" className="small">
              Quên mật khẩu?
            </a>
          </div>

          <button className="btn btn-primary w-100 mb-3">Đăng nhập</button>

          <div className="divider">
            <span className="divider-text">hoặc</span>
          </div>

          {/* Google Login Button */}
          <button
            className="btn btn-outline-secondary w-100 google-btn mb-4"
            onClick={handleGoogleLogin}
          >
            <FaGoogle className="me-2" />
            Đăng nhập với Google
          </button>

          <div>
            <p className="text-muted mb-0">
              Chưa có tài khoản? <a href="/signup">Đăng ký ngay</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
