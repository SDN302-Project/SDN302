import React, { useState } from 'react';
import '../styles/RegisterPage.scss';
import { FaEnvelope, FaLock, FaGoogle, FaUser } from 'react-icons/fa';
import { RiHospitalFill } from 'react-icons/ri';

const API_BASE_URL = 'https://prevention-api-tdt.onrender.com/api/v1';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle regular signup
    const handleRegularSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                setSuccess(true);
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    passwordConfirm: ''
                });
                // Redirect to login page after a short delay
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                setError(data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            }
        } catch (err) {
            setError('Đã có lỗi xảy ra. Vui lòng kiểm tra kết nối và thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Google signup
    const handleGoogleSignup = async () => {
        // Note: This requires Google OAuth setup on the frontend
        // For demo purposes, we'll simulate the flow
        setLoading(true);
        setError(null);

        try {
            // This is where you would implement Google OAuth flow
            // For example, using @react-oauth/google or similar library
            // const googleToken = await getGoogleOAuthToken(); // Implement your Google OAuth flow here

            // Simulated Google token (replace with actual Google OAuth implementation)
            const googleToken = 'your_google_oauth_token';

            const response = await fetch(`${API_BASE_URL}auth/google-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: googleToken })
            });

            const data = await response.json();

            if (data.status === 'success') {
                // Store token and user data as per API_GUIDE
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                window.location.href = '/dashboard';
            } else {
                setError(data.message || 'Đăng ký Google thất bại. Vui lòng thử lại.');
            }
        } catch (err) {
            setError('Đã có lỗi xảy ra khi đăng ký với Google.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-blur-box">
                <div className="register-form-container text-center">
                    <div className="mb-4">
                        <RiHospitalFill size={40} color="#1976d2" />
                        <h2 className="mt-3">Đăng ký</h2>
                        <p className="text-muted">Tạo tài khoản để bắt đầu sử dụng hệ thống</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success" role="alert">
                            Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...
                        </div>
                    )}

                    <form onSubmit={handleRegularSignup}>
                        {/* First Row */}
                        <div className="input-row">
                            {/* Username */}
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FaUser className="text-muted" />
                                </span>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Tên người dùng"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FaEnvelope className="text-muted" />
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email của bạn"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
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
                                    name="password"
                                    placeholder="Mật khẩu"
                                    className="form-control"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FaLock className="text-muted" />
                                </span>
                                <input
                                    type="password"
                                    name="passwordConfirm"
                                    placeholder="Xác nhận mật khẩu"
                                    className="form-control"
                                    value={formData.passwordConfirm}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary w-100 mb-3"
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : 'Đăng ký'}
                        </button>
                    </form>

                    <div className="divider">
                        <span className="divider-text">hoặc</span>
                    </div>

                    {/* Google Signup */}
                    <button
                        className="btn btn-outline-secondary w-100 google-btn mb-4"
                        onClick={handleGoogleSignup}
                        disabled={loading}
                    >
                        <FaGoogle className="me-2" />
                        Đăng ký với Google
                    </button>

                    {/* Link to Login */}
                    <div>
                        <p className="text-muted mb-0">
                            Đã có tài khoản? <a href="/login">Đăng nhập</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;