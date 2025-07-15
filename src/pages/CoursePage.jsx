import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/CoursePage.scss";
import fallbackImage from "../images/Images.jpg";
import courseApi from "../api/courseAPI";

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [courseIndex, setCourseIndex] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const rawCourses = await courseApi.getCourses();
        const formatted = courseApi.formatCourseList(rawCourses);
        setCourses(formatted);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách khóa học:", error);
        alert("Không thể tải danh sách khóa học!");
      }
    };

    fetchCourses();
  }, []);

  const handlePrev = () => {
    setCourseIndex(Math.max(0, courseIndex - itemsPerPage));
  };

  const handleNext = () => {
    setCourseIndex(
      Math.min(courses.length - itemsPerPage, courseIndex + itemsPerPage)
    );
  };

  const getImageUrl = (imageCover) => {
    if (!imageCover) return fallbackImage;
    if (imageCover.startsWith("http")) return imageCover;
    return `https://prevention-api-tdt.onrender.com/img/courses/${imageCover}`;
  };

  const renderCourses = () => {
    const visibleCourses = courses.slice(
      courseIndex,
      courseIndex + itemsPerPage
    );

    return (
      <div className="position-relative">
        <div className="row gx-4 gy-4">
          {visibleCourses.map((course) => (
            <div className="col-md-3" key={course._id}>
              <Link to={`/course/${course._id}`} className="custom-card-link">
                <div className="custom-card">
                  <img
                    src={getImageUrl(course.imageCover)}
                    alt={course.name}
                    className="card-image"
                    onError={(e) => (e.target.src = fallbackImage)}
                  />
                  <hr className="card-divider" />
                  <h5 className="card-title">{course.name}</h5>
                  <p className="card-meta">
                    {course.formattedCreatedAt} • {course.formattedDuration}
                  </p>
                  <p className="card-author">Tác giả: {course.authorName}</p>
                  <p className="card-topics">
                    Chủ đề: {course.topics?.join(", ") || "Không có"}
                  </p>
                  <p className="card-audience">
                    Đối tượng: {course.audienceLabel || "Không rõ"}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {courses.length > itemsPerPage && (
          <>
            <button
              className="arrow-btn position-absolute start-0 top-50 translate-middle-y"
              onClick={handlePrev}
              disabled={courseIndex === 0}
            >
              ←
            </button>
            <button
              className="arrow-btn position-absolute end-0 top-50 translate-middle-y"
              onClick={handleNext}
              disabled={courseIndex + itemsPerPage >= courses.length}
            >
              →
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="course-page">
      {/* Hero Section */}
      <section className="course-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="hero-title">Khám phá các khóa học</h1>
              <p className="hero-subtitle">
                Nâng cao nhận thức và phục hồi với các khóa học chất lượng từ
                chuyên gia.
              </p>
            </div>
            <div className="col-lg-4">
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">{courses.length}</span>
                  <span className="stat-label">Khóa học</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course List */}
      <div className="container py-5">
        {courses.length > 0 ? (
          <section className="section mb-5">
            <div className="text-center mb-4">
              <h2 className="section-header">Khóa học miễn phí</h2>
              <p className="section-subtitle">
                Truy cập tài liệu học tập hoàn toàn miễn phí, mọi lúc mọi nơi
              </p>
            </div>

            {renderCourses()}
          </section>
        ) : (
          <div className="text-center py-5">
            <p>Đang tải khóa học...</p>
          </div>
        )}

        {/* Call to Action */}
        <section className="cta-section py-5">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h3 className="cta-title">
                Sẵn sàng bắt đầu hành trình học tập?
              </h3>
              <p className="cta-description">
                Tham gia ngay hôm nay để nâng cao nhận thức và phát triển bản
                thân.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/signup" className="btn btn-cta btn-lg">
                <i className="bi bi-person-plus me-2" />
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CoursePage;
