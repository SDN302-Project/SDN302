import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/CourseDetailPage.scss";
import fallbackImage from "../images/Images.jpg";
import courseApi from "../api/courseAPI";
import ReactMarkdown from "react-markdown";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [courseContent, setCourseContent] = useState(null);
  const [contentError, setContentError] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const raw = await courseApi.getCourseById(id);
        setCourse(courseApi.formatCourse(raw));
      } catch (err) {
        console.error("Lỗi khi tải khoá học:", err.message);
      } finally {
        setLoading(false);
      }
    };

    const checkStatus = async () => {
      try {
        const res = await courseApi.checkEnrolled(id);
        setEnrolled(res.isEnrolled);
      } catch {
        setEnrolled(false);
      }
    };

    fetchData();
    checkStatus();
  }, [id]);

  const handleEnroll = async () => {
    try {
      setEnrollLoading(true);
      await courseApi.enrollCourse(id);
      alert("✅ Đăng ký thành công!");
      setEnrolled(true);
    } catch (err) {
      if (err.message === "Unauthorized") navigate("/login");
      else alert("❌ Lỗi khi đăng ký");
    } finally {
      setEnrollLoading(false);
    }
  };

  const fetchContent = async () => {
    setLoadingContent(true);
    setContentError("");
    try {
      const content = await courseApi.getCourseContent(id);
      setCourseContent(content);
    } catch (err) {
      setContentError(err.message || "Không thể tải nội dung");
    } finally {
      setLoadingContent(false);
    }
  };

  const getImageUrl = (imageCover) => {
    if (!imageCover) return fallbackImage;
    return imageCover.startsWith("http")
      ? imageCover
      : `https://prevention-api-tdt.onrender.com/img/courses/${imageCover}`;
  };

  if (loading)
    return <div className="text-center py-5">Đang tải khóa học...</div>;

  if (!course)
    return (
      <div className="text-center text-danger py-5">
        Không tìm thấy khóa học!
      </div>
    );

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

                <Link
                  to="/course"
                  className="btn btn-outline-secondary mt-4 me-3"
                >
                  ← Quay lại
                </Link>

                {enrolled ? (
                  <>
                    <button
                      className="btn btn-success mt-4"
                      onClick={() => {
                        setShowContent(!showContent);
                        if (!courseContent && !loadingContent && !showContent) {
                          fetchContent();
                        }
                      }}
                    >
                      {showContent ? "Ẩn nội dung" : "Xem nội dung"}
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary mt-4"
                    onClick={handleEnroll}
                    disabled={enrollLoading}
                  >
                    {enrollLoading ? "Đang đăng ký..." : "Đăng ký khoá học"}
                  </button>
                )}

                {/* Nội dung khóa học */}
                {enrolled && showContent && (
                  <div className="mt-4 p-3 border rounded bg-light">
                    {loadingContent ? (
                      <p>Đang tải nội dung khóa học...</p>
                    ) : contentError ? (
                      <p className="text-danger">{contentError}</p>
                    ) : courseContent ? (
                      <ReactMarkdown>{courseContent}</ReactMarkdown>
                    ) : null}
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
