import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/CourseDetailPage.scss";
import fallbackImage from "../images/Images.jpg";
import courseApi from "../api/courseAPI";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState("");
  const [courseContent, setCourseContent] = useState(null);
  const [showContent, setShowContent] = useState(false);

  const [enrollLoading, setEnrollLoading] = useState(false);

  const [hasReviewed, setHasReviewed] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const rawCourse = await courseApi.getCourseById(id);
        setCourse(courseApi.formatCourse(rawCourse));

        const { isEnrolled } = await courseApi.checkEnrolled(id);
        setEnrolled(isEnrolled);

        const fetchedReviews = await courseApi.getReviews(id);
        setReviews(Array.isArray(fetchedReviews) ? fetchedReviews : []);

        if (user) {
          const reviewed = fetchedReviews.some(
            (r) => r.user === user._id || r.user?._id === user._id
          );
          setHasReviewed(reviewed);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải khóa học:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const yourReview = useMemo(() => {
    return user
      ? reviews.find((r) => r.user === user._id || r.user?._id === user._id)
      : null;
  }, [user, reviews]);

  const otherReviews = useMemo(() => {
    return user
      ? reviews.filter((r) => (r.user?._id || r.user) !== user._id)
      : reviews;
  }, [user, reviews]);

  const handleEnroll = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để đăng ký khóa học.");
      navigate("/login");
      return;
    }

    try {
      setEnrollLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      await courseApi.enrollCourse(id);
      setEnrolled(true);
      alert("✅ Đăng ký thành công!");
    } catch (err) {
      console.error("Enroll error:", err);
      if (err.message === "Unauthorized") {
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        navigate("/login");
      } else {
        alert("❌ Lỗi khi đăng ký khóa học");
      }
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleToggleContent = async () => {
    if (showContent) {
      setShowContent(false);
      return;
    }

    if (!courseContent && !contentLoading) {
      setContentLoading(true);
      try {
        const content = await courseApi.getCourseContent(id);
        setCourseContent(content);
      } catch (err) {
        setContentError(err.message || "Không thể tải nội dung");
      } finally {
        setContentLoading(false);
      }
    }

    setShowContent(true);
  };

  const handleReviewSubmit = async () => {
    if (!rating || !comment.trim()) {
      alert("Vui lòng nhập đầy đủ đánh giá và bình luận.");
      return;
    }

    try {
      setReviewLoading(true);
      const newReview = await courseApi.writeReview(id, { rating, comment });

      const updatedReviews = [
        ...reviews.filter((r) => (r.user?._id || r.user) !== user._id),
        {
          ...newReview,
          user: { _id: user._id, name: user.name },
        },
      ];

      setReviews(updatedReviews);
      setHasReviewed(true);
      setRating(5);
      setComment("");
    } catch (err) {
      alert("❌ Lỗi khi gửi đánh giá: " + err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  const getImageUrl = (imageCover) => {
    if (!imageCover) return fallbackImage;
    return imageCover.startsWith("http")
      ? imageCover
      : `https://prevention-api-tdt.onrender.com/img/courses/${imageCover}`;
  };

  if (loading) {
    return <div className="text-center py-5">🔄 Đang tải khóa học...</div>;
  }

  if (!course) {
    return (
      <div className="text-center text-danger py-5">
        ❌ Không tìm thấy khóa học!
      </div>
    );
  }

  return (
    <div className="course-detail container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow border-0 mt-4">
            <div className="row g-0 align-items-center">
              <div className="col-md-5 text-center p-4">
                <img
                  src={getImageUrl(course.imageCover)}
                  alt={course.name}
                  className="img-fluid rounded"
                  onError={(e) => (e.target.src = fallbackImage)}
                />
              </div>

              <div className="col-md-7 p-4">
                <h2 className="fw-bold mb-3">{course.name}</h2>
                <p className="text-muted">{course.description}</p>

                <div className="mb-2">
                  <span className="badge bg-primary me-2">Ngày tạo:</span>
                  {course.formattedCreatedAt}
                </div>

                <div className="mb-2">
                  <span className="badge bg-success me-2">Đối tượng:</span>
                  {course.audienceLabel}
                </div>

                <div className="mb-2">
                  <span className="badge bg-info me-2">Thời lượng:</span>
                  {course.formattedDuration}
                </div>

                <div className="mt-4 d-flex gap-3 flex-wrap">
                  <Link to="/course" className="btn btn-outline-secondary">
                    ← Quay lại
                  </Link>

                  {enrolled ? (
                    <button
                      className="btn btn-success"
                      onClick={handleToggleContent}
                    >
                      {showContent ? "Ẩn nội dung" : "Xem nội dung"}
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={handleEnroll}
                      disabled={enrollLoading}
                    >
                      {enrollLoading ? "Đang đăng ký..." : "Đăng ký khoá học"}
                    </button>
                  )}
                </div>

                {enrolled && showContent && (
                  <div className="mt-4 p-3 border rounded bg-light">
                    {contentLoading ? (
                      <p>🔄 Đang tải nội dung khóa học...</p>
                    ) : contentError ? (
                      <p className="text-danger">{contentError}</p>
                    ) : courseContent ? (
                      <ReactMarkdown>{courseContent}</ReactMarkdown>
                    ) : null}
                  </div>
                )}

                {enrolled && user && !hasReviewed && (
                  <div className="mt-4 p-4 border rounded bg-white shadow-sm">
                    <h5 className="fw-bold mb-3">✍️ Đánh giá khoá học</h5>
                    <div className="mb-3">
                      <label className="form-label">Chọn số sao:</label>
                      <select
                        className="form-select"
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                      >
                        {[5, 4, 3, 2, 1].map((star) => (
                          <option key={star} value={star}>
                            {star} sao
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Nhận xét:</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={handleReviewSubmit}
                      disabled={reviewLoading}
                    >
                      {reviewLoading ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                  </div>
                )}

                {enrolled && user && hasReviewed && (
                  <div className="mt-4 alert alert-info">
                    ✅ Bạn đã đánh giá khoá học này.
                  </div>
                )}

                {enrolled && reviews.length > 0 && (
                  <div className="mt-4">
                    <h5 className="fw-bold">💬 Các đánh giá từ học viên</h5>
                    <ul className="list-group">
                      {yourReview && (
                        <li
                          key={yourReview._id}
                          className="list-group-item border rounded mb-2 shadow-sm bg-light"
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <strong>Bạn</strong>
                            <span className="badge bg-success">
                              ⭐ {yourReview.rating} / 5
                            </span>
                          </div>
                          <p className="mt-2 mb-0">{yourReview.review}</p>
                        </li>
                      )}
                      {otherReviews.map((review) => (
                        <li
                          key={review._id}
                          className="list-group-item border rounded mb-2 shadow-sm"
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <strong>{review.user?.name || "Người dùng"}</strong>
                            <span className="badge bg-warning text-dark">
                              ⭐ {review.rating} / 5
                            </span>
                          </div>
                          <p className="mt-2 mb-0">{review.review}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
