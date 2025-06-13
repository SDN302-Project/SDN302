import React from 'react';
import '../styles/RegisterPage.scss';
import { FaEnvelope, FaLock, FaGoogle, FaUser } from 'react-icons/fa';
import { RiHospitalFill } from 'react-icons/ri';

const RegisterPage = () => {
    return (
        <div className="register-page">
            <div className="register-blur-box">
                <div className="register-form-container text-center">
                    <div className="mb-4">
                        <RiHospitalFill size={40} color="#1976d2" />
                        <h2 className="mt-3">Đăng ký</h2>
                        <p className="text-muted">Tạo tài khoản để bắt đầu sử dụng hệ thống</p>
                    </div>

                    {/* First Row */}
                    <div className="input-row">
                        {/* Username */}
                        <div className="input-group">
                            <span className="input-group-text">
                                <FaUser className="text-muted" />
                            </span>
                            <input
                                type="text"
                                placeholder="Tên người dùng"
                                className="form-control"
                            />
                        </div>

                        {/* Email */}
                        <div className="input-group">
                            <span className="input-group-text">
                                <FaEnvelope className="text-muted" />
                            </span>
                            <input
                                type="email"
                                placeholder="Email của bạn"
                                className="form-control"
                            />
                        </div>
                    </div>

                    {/* Second Row */}
                    <div className="input-row">
                        {/* Password */}
                        <div className="input-group">
                            <span className="input-group-text">
                                <FaLock className="text-muted" />
                            </span>
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                className="form-control"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="input-group">
                            <span className="input-group-text">
                                <FaLock className="text-muted" />
                            </span>
                            <input
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                className="form-control"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button className="btn btn-primary w-100 mb-3">
                        Đăng ký
                    </button>

                    <div className="divider">
                        <span className="divider-text">hoặc</span>
                    </div>

                    {/* Google Signup */}
                    <button className="btn btn-outline-secondary w-100 google-btn mb-4">
                        <FaGoogle className="me-2" />
                        Đăng ký với Google
                    </button>

                    {/* Link to Login */}
                    <div>
                        <p className="text-muted mb-0">
                            Đã có tài khoản?{' '}
                            <a href="/login">Đăng nhập</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
