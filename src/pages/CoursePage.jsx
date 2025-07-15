import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/CoursePage.scss";
import fallbackImage from "../images/Images.jpg"; // Ảnh mặc định nếu không có ảnh từ API

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [courseIndex, setCourseIndex] = useState(0);
  const itemsPerPage = 4;

  const API_BASE_URL = "https://prevention-api-tdt.onrender.com/api/v1";
  const IMAGE_BASE_URL = "https://prevention-api-tdt.onrender.com/img/courses/";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/courses`);
        const data = await res.json();
        console.log("API response:", data);
        if (
          data.status === "success" &&
          data.data &&
          Array.isArray(data.data.data)
        ) {
          setCourses(data.data.data);
        } else {
          setCourses([]);
          alert("Không lấy được danh sách khóa học!");
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách khóa học:", error);
        alert("Lỗi khi tải danh sách khóa học!");
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
    return imageCover
      ? `https://prevention-api-tdt.onrender.com/img/courses/${imageCover}`
      : fallbackImage;
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
                  <p className="card-date">
                    {new Date(course.createdAt).toLocaleDateString("vi-VN")}
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

            <div className="text-center mt-4">
            </div>
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
