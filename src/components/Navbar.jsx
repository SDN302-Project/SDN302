import React, { useRef, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";
import DrugFreeLogo from "../images/DrugFreeLogo.svg";
import "../styles/Navbar.scss";

const Navbar = () => {
  const searchRef = useRef();
  const [user, setUser] = useState(null); //lưu user từ localStorage

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    console.log("📦 Navbar loaded user:", storedUser);
  }, []);
  

  const handleSearch = () => {
    const query = searchRef.current.value.trim();
    if (query) {
      console.log("Searching for:", query);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); // cập nhật lại UI
    window.location.href = "/login"; // chuyển hướng
  };

  return (
    <nav className="navbar fixed-top navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        {/* Logo and Title */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={DrugFreeLogo} alt="DrugFree Logo" className="navbar-logo" />
          <span className="navbar-title">DrugFree</span>
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Centered links */}
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <ul className="navbar-nav gap-3">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/course">
                Khóa học
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/booking">
                Tư vấn
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blog">
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/assestment">
                Kiểm tra
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/aboutus">
                Về chúng tôi
              </Link>
            </li>
          </ul>
        </div>

        {/* Right: search + user buttons */}
        <div className="d-flex align-items-center gap-2">
          <div className="input-group search-box">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              ref={searchRef}
            />
            <button className="btn btn-search" onClick={handleSearch}>
              <i className="bi bi-search text-white"></i>
            </button>
          </div>

          {user ? (
            <>
              <span className="me-2 fw-semibold">
                Xin chào, {user.name || user.email}
              </span>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-login">
                Đăng nhập
              </Link>
              <Link to="/signup" className="btn btn-signup">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
