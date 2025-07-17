import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";
import DrugFreeLogo from "../images/DrugFreeLogo.svg";
import "../styles/Navbar.scss";
import authApi from "../api/authApi";

const Navbar = () => {
  // const searchRef = useRef();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authApi.getUser();
    setUser(currentUser);
    console.log("📦 Navbar loaded user:", currentUser);
  }, []);

  // const handleSearch = () => {
  //   const query = searchRef.current.value.trim();
  //   if (query) {
  //     console.log("Searching for:", query);
  //   }
  // };

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <nav className="navbar fixed-top navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={DrugFreeLogo} alt="DrugFree Logo" className="navbar-logo" />
          <span className="navbar-title">DrugFree</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

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
              <Link className="nav-link" to="/assessment">
                Kiểm tra
              </Link>
            </li>
          </ul>
        </div>

        <div className="d-flex align-items-center gap-2">


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
