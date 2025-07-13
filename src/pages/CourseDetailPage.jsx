import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/CourseDetailPage.scss';
import fallbackImage from '../images/Images.jpg';
import api from '../api/frontend-sdk';
// Thử import react-markdown, nếu chưa có thì sẽ fallback sang plain text
let ReactMarkdown = null;
try {
    // eslint-disable-next-line global-require
    ReactMarkdown = require('react-markdown');
} catch (e) {
    ReactMarkdown = null;
}

const CourseDetailPage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = 'https://prevention-api-tdt.onrender.com/api/v1';
    const navigate = useNavigate();
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const [submitting, setSubmitting] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [enrolled, setEnrolled] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [loadingContent, setLoadingContent] = useState(false);
    const [courseContent, setCourseContent] = useState(null);
    const [contentError, setContentError] = useState('');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/courses/${id}`);
                const data = await res.json();
                if (data.status === 'success' && data.data) {
                    setCourse(data.data.data);
                } else {
                    alert('Không tìm thấy thông tin khóa học!');
                }
            } catch (error) {
                console.error('Lỗi khi tải khóa học:', error);
                alert('Lỗi khi tải thông tin khóa học!');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    // Lấy danh sách đánh giá khi load trang hoặc khi id thay đổi
    useEffect(() => {
        const fetchReviews = async () => {
            setLoadingReviews(true);
            try {
                const res = await api.getCourseReviews(id);
                if (res.status === 'success' && res.data && res.data.data) {
                    setReviews(res.data.data);
                } else {
                    setReviews([]);
                }
            } catch (error) {
                setReviews([]);
            } finally {
                setLoadingReviews(false);
            }
        };
        fetchReviews();
    }, [id]);

    // Hàm lấy danh sách khóa học đã đăng ký từ localStorage
    const getEnrolledCourses = () => {
        const data = localStorage.getItem('enrolledCourses');
        return data ? JSON.parse(data) : [];
    };
    // Hàm lưu danh sách khóa học đã đăng ký vào localStorage
    const setEnrolledCourses = (arr) => {
        localStorage.setItem('enrolledCourses', JSON.stringify(arr));
    };
    // Khi load trang, kiểm tra trạng thái đã đăng ký
    useEffect(() => {
        const enrolledList = getEnrolledCourses();
        setEnrolled(enrolledList.includes(id));
    }, [id]);

    // Hàm lấy token
    const getToken = () => localStorage.getItem('token');
    // Hàm logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };
    // Hàm gọi API có xác thực
    const authenticatedFetch = async (endpoint, options = {}) => {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 401) {
            logout();
            navigate('/login');
            throw new Error('Chưa đăng nhập');
        }
        return response.json();
    };

    const handleEnroll = async () => {
        const token = getToken();
        if (!token) {
            navigate('  ');
            return;
        }
        try {
            const data = await authenticatedFetch(`/courses/${id}/enrollments`, {
                method: 'POST',
            });
            if (data.status === 'success') {
                alert('Đăng ký khoá học thành công!');
                setEnrolled(true);
                // Lưu vào localStorage
                const enrolledList = getEnrolledCourses();
                if (!enrolledList.includes(id)) {
                    enrolledList.push(id);
                    setEnrolledCourses(enrolledList);
                }
            } else {
                alert(data.message || 'Đăng ký khoá học thất bại!');
            }
        } catch (error) {
            if (error.message === 'Chưa đăng nhập') return;
            alert('Lỗi khi đăng ký khoá học!');
        }
    };

    // Hàm hủy đăng ký khóa học
    const handleUnenroll = async () => {
        const token = getToken();
        if (!token) {
            navigate('/login');
            return;
        }
        if (!window.confirm('Bạn có chắc chắn muốn hủy đăng ký khóa học này?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/courses/${id}/enrollments`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            if (data.status === 'success') {
                alert('Đã hủy đăng ký khóa học!');
                setEnrolled(false);
                // Xóa khỏi localStorage
                let enrolledList = getEnrolledCourses();
                enrolledList = enrolledList.filter(cid => cid !== id);
                setEnrolledCourses(enrolledList);
            } else {
                alert(data.message || 'Hủy đăng ký thất bại!');
            }
        } catch (error) {
            alert('Lỗi khi hủy đăng ký!');
        }
    };

    // Hàm gửi đánh giá khóa học
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await api.reviewCourse(id, reviewText, rating);
            if (res.status === 'success') {
                alert('Gửi đánh giá thành công!');
                setReviewText('');
                setRating(5);
                // Reload lại danh sách đánh giá
                const reviewRes = await api.getCourseReviews(id);
                if (reviewRes.status === 'success' && reviewRes.data && reviewRes.data.data) {
                    setReviews(reviewRes.data.data);
                }
            } else {
                alert(res.message || 'Gửi đánh giá thất bại!');
            }
        } catch (error) {
            alert('Lỗi khi gửi đánh giá!');
        } finally {
            setSubmitting(false);
        }
    };

    // Hàm lấy nội dung khóa học
    const fetchCourseContent = async () => {
        setLoadingContent(true);
        setContentError('');
        try {
            const token = getToken();
            if (!token) {
                navigate('/login');
                return;
            }
            const res = await fetch(`${API_BASE_URL}/courses/${id}/content`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            if (res.status === 403 || data.status === 'fail') {
                setContentError(data.message || 'Bạn cần đăng ký khóa học để xem nội dung.');
                setCourseContent(null);
            } else if (data.status === 'success' && data.data && data.data.course && data.data.course.content) {
                setCourseContent(data.data.course.content);
            } else {
                setContentError('Không tìm thấy nội dung khóa học.');
                setCourseContent(null);
            }
        } catch (error) {
            setContentError('Lỗi khi tải nội dung khóa học!');
            setCourseContent(null);
        } finally {
            setLoadingContent(false);
        }
    };

    if (loading) {
        return <div className="text-center py-5">Đang tải chi tiết khóa học...</div>;
    }

    if (!course) {
        return <div className="text-center py-5 text-danger">Không tìm thấy khóa học!</div>;
    }

    return (
        <div className="course-detail container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card course-detail-card shadow-lg border-0 mt-4">
                        <div className="row g-0 align-items-center">
                            <div className="col-md-5 text-center p-4">
                                <img
                                    src={course.imageCover || fallbackImage}
                                    alt={course.name}
                                    className="img-fluid rounded course-detail-img mb-3 mb-md-0"
                                />
                            </div>
                            <div className="col-md-7 p-4">
                                <h1 className="course-title mb-3 fw-bold">{course.name}</h1>
                                <p className="course-description mb-4">{course.description}</p>
                                <div className="mb-3">
                                    <span className="badge bg-primary bg-opacity-75 me-2">Ngày tạo</span>
                                    <span className="text-muted">
                                        {new Date(course.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                {/* Thông tin phụ nếu có */}
                                {course.teacher && (
                                    <div className="mb-3">
                                        <span className="badge bg-success bg-opacity-75 me-2">Giáo viên</span>
                                        <span className="fw-medium">{course.teacher}</span>
                                    </div>
                                )}
                                {/* Có thể thêm các thông tin khác ở đây */}
                                <Link to="/course" className="btn btn-outline-primary mt-4 px-4 py-2 fw-semibold me-3">
                                    ← Quay lại danh sách khóa học
                                </Link>
                                {/* Nút đăng ký/hủy đăng ký khóa học */}
                                {enrolled ? (
                                    <div className="d-flex align-items-center gap-3 mt-4">
                                        <button className="btn btn-secondary px-4 py-2 fw-semibold" disabled>
                                            Đã đăng ký khóa học
                                        </button>
                                        <button className="btn btn-outline-danger px-4 py-2 fw-semibold" onClick={handleUnenroll}>
                                            Hủy đăng ký
                                        </button>
                                        {/* Nút xem nội dung khóa học */}
                                        <button
                                            className="btn btn-success px-4 py-2 fw-semibold"
                                            style={{ marginLeft: 8 }}
                                            onClick={() => {
                                                setShowContent(!showContent);
                                                if (!showContent && !courseContent && !loadingContent) fetchCourseContent();
                                            }}
                                        >
                                            {showContent ? 'Ẩn nội dung' : 'Xem nội dung khóa học'}
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={handleEnroll} className="btn btn-primary mt-4 px-4 py-2 fw-semibold">
                                        Đăng ký khoá học
                                    </button>
                                )}
                                {/* Hiển thị nội dung khóa học nếu đã đăng ký và bấm nút */}
                                {enrolled && showContent && (
                                    <div className="mt-4 p-3 border rounded bg-light">
                                        {loadingContent ? (
                                            <div>Đang tải nội dung khóa học...</div>
                                        ) : contentError ? (
                                            <div className="text-danger">{contentError}</div>
                                        ) : courseContent ? (
                                            ReactMarkdown ? (
                                                <ReactMarkdown>{courseContent}</ReactMarkdown>
                                            ) : (
                                                <pre style={{ whiteSpace: 'pre-wrap' }}>{courseContent}</pre>
                                            )
                                        ) : null}
                                    </div>
                                )}
                                {/* Form đánh giá khóa học */}
                                <div className="mt-5">
                                    <h5 className="mb-3">Đánh giá khóa học</h5>
                                    <form onSubmit={handleSubmitReview}>
                                        <div className="mb-3">
                                            <label className="form-label">Nội dung đánh giá</label>
                                            <textarea
                                                className="form-control"
                                                value={reviewText}
                                                onChange={e => setReviewText(e.target.value)}
                                                rows={3}
                                                required
                                                placeholder="Nhập cảm nhận của bạn về khóa học..."
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Chấm điểm</label>
                                            <div style={{ fontSize: '2rem', color: '#ffc107', cursor: 'pointer' }}>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <span
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                        style={{
                                                            color: star <= rating ? '#ffc107' : '#e4e5e9',
                                                            transition: 'color 0.2s',
                                                            marginRight: 4
                                                        }}
                                                        role="button"
                                                        aria-label={`Chọn ${star} sao`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-success" disabled={submitting}>
                                            {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                                        </button>
                                    </form>
                                </div>
                                {/* Danh sách đánh giá */}
                                <div className="mt-5">
                                    <h5 className="mb-3">Đánh giá từ học viên</h5>
                                    {loadingReviews ? (
                                        <div>Đang tải đánh giá...</div>
                                    ) : reviews.length === 0 ? (
                                        <div>Chưa có đánh giá nào cho khóa học này.</div>
                                    ) : (
                                        <div
                                            className="review-slider"
                                            style={{
                                                overflowX: 'auto',
                                                whiteSpace: 'nowrap',
                                                paddingBottom: 8,
                                            }}
                                        >
                                            {reviews.map((rv, idx) => (
                                                <div
                                                    key={rv._id || idx}
                                                    className="border rounded p-3 mb-3 bg-light d-inline-block me-3 align-top"
                                                    style={{
                                                        minWidth: 260,
                                                        maxWidth: 320,
                                                        verticalAlign: 'top',
                                                        whiteSpace: 'normal',
                                                    }}
                                                >
                                                    <div style={{ fontSize: '1.2rem', color: '#ffc107' }}>
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <span key={star} style={{ color: star <= rv.rating ? '#ffc107' : '#e4e5e9' }}>★</span>
                                                        ))}
                                                    </div>
                                                    <div className="fw-semibold mt-1">{rv.review}</div>
                                                    {rv.user && <div className="text-muted small">{rv.user.name || 'Ẩn danh'}</div>}
                                                    <div className="text-muted small">{rv.createdAt ? new Date(rv.createdAt).toLocaleString('vi-VN') : ''}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;
