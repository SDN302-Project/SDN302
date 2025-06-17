import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CoursePage.scss';
import Image from '../images/Images.jpg';

const CoursePage = () => {
    const cardData = (titles) =>
        titles.map((title, index) => ({
            title,
            date: 'May 31, 2025',
            image: Image,
            id: index + 1
        }));

    const [blogIndex, setBlogIndex] = useState(0);
    const [courseIndex, setCourseIndex] = useState(0);
    const [newsIndex, setNewsIndex] = useState(0);

    const blogTitles = [
        "Lạm dụng chất kích thích: Nhận thức & Phòng ngừa",
        "12 cách phòng tránh lạm dụng ma túy",
        "Nhận thức về lạm dụng ma túy",
        "Tác hại của việc sử dụng ma túy lâu dài"
    ];
    const courseTitles = [
        "Sự thật về ma túy",
        "Sự thật về lạm dụng thuốc kê đơn",
        "Lộ trình phục hồi - Khóa học trực tuyến",
        "Bộ công cụ phòng chống ma túy cho thanh thiếu niên"
    ];
    const newsTitles = [
        "Chuyên gia y tế nói về sắc lệnh của Trump nhằm giảm giá thuốc tại Mỹ",
        "Luật Texas có thể làm trầm trọng thêm chương trình giảm giá thuốc cho bệnh nhân",
        "Mỹ đã đảo ngược tình trạng tử vong do sử dụng ma túy quá liều như thế nào",
        "Nghiên cứu mới tiết lộ xu hướng sử dụng ma túy ở thanh thiếu niên năm 2025"
    ];

    const itemsPerPage = 4;

    const renderCards = (data, basePath, startIndex, currentIndex, setIndex, maxItems) => {
        const visibleData = data.slice(startIndex, startIndex + itemsPerPage);
        return (
            <div className="position-relative">
                <div className="row gx-4 gy-4">
                    {visibleData.map((item) => (
                        <div className="col-md-3" key={item.id}>
                            <Link to={`${basePath}/${item.id}`} className="custom-card-link">
                                <div className="custom-card">
                                    <img src={item.image} alt="card-img" className="card-image" />
                                    <hr className="card-divider" />
                                    <h5 className="card-title">{item.title}</h5>
                                    <p className="card-date">{item.date}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <button
                    className="arrow-btn round-arrow-btn position-absolute start-0 top-50 translate-middle-y"
                    onClick={() => handlePrev(currentIndex, setIndex, maxItems)}
                    disabled={currentIndex === 0}
                    style={{
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    ←
                </button>
                <button
                    className="arrow-btn round-arrow-btn position-absolute end-0 top-50 translate-middle-y"
                    onClick={() => handleNext(currentIndex, setIndex, maxItems)}
                    disabled={currentIndex + itemsPerPage >= maxItems}
                    style={{
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        cursor: currentIndex + itemsPerPage >= maxItems ? 'not-allowed' : 'pointer'
                    }}
                >
                    →
                </button>
            </div>
        );
    };

    const handlePrev = (currentIndex, setIndex, maxItems) => {
        setIndex(Math.max(0, currentIndex - itemsPerPage));
    };

    const handleNext = (currentIndex, setIndex, maxItems) => {
        setIndex(Math.min(maxItems - itemsPerPage, currentIndex + itemsPerPage));
    };

    const blogData = cardData(blogTitles);
    const courseData = cardData(courseTitles);
    const newsData = cardData(newsTitles);

    return (
        <div className="course-page">
            {/* Hero Section */}
            <section className="course-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="hero-title">
                                Khám phá các lộ trình học tập
                            </h1>
                            <p className="hero-subtitle">
                                Khám phá bộ sưu tập tài nguyên giáo dục, khóa học và cập nhật mới nhất của chúng tôi
                                được thiết kế để hỗ trợ hành trình nâng cao nhận thức và phục hồi của bạn.
                            </p>
                        </div>
                        <div className="col-lg-4">
                            <div className="hero-stats">
                                <div className="stat-item">
                                    <span className="stat-number">500+</span>
                                    <span className="stat-label">Tài nguyên</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">1000+</span>
                                    <span className="stat-label">Học viên</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
                {/* Most Popular Section */}
                <section className="section mb-5">
                    <div className="section-header-wrapper text-center mb-5">
                        <h2 className="section-header">Tài nguyên nổi bật</h2>
                        <p className="section-subtitle">Bắt đầu với những nội dung hấp dẫn và bổ ích nhất của chúng tôi</p>
                    </div>

                    <div className="category-tabs d-flex justify-content-center mb-4">
                        <button className="category-btn active">
                            <i className="bi bi-book me-2"></i>
                            <span>Bài viết</span>
                        </button>
                        <button className="category-btn">
                            <i className="bi bi-postcard me-2"></i>
                            <span>Bưu thiếp</span>
                        </button>
                        <button className="category-btn">
                            <i className="bi bi-play-circle me-2"></i>
                            <span>Video</span>
                        </button>
                    </div>

                    {renderCards(blogData, "/blog", blogIndex, blogIndex, setBlogIndex, blogTitles.length)}

                    <div className="text-center mt-4">
                        <Link to="/blog" className="btn btn-outline-primary btn-lg">
                            <i className="bi bi-arrow-right me-2"></i>
                            Xem tất cả bài viết
                        </Link>
                    </div>
                </section>

                {/* Free Courses Section */}
                <section className="section mb-5">
                    <div className="section-header-wrapper text-center mb-5">
                        <h2 className="section-header">Khóa học miễn phí</h2>
                        <p className="section-subtitle">Truy cập các khóa học chất lượng cao hoàn toàn miễn phí</p>
                    </div>

                    {renderCards(courseData, "/course", courseIndex, courseIndex, setCourseIndex, courseTitles.length)}

                    <div className="text-center mt-4">
                        <Link to="/courses" className="btn btn-outline-primary btn-lg">
                            <i className="bi bi-collection me-2"></i>
                            Khám phá tất cả khóa học
                        </Link>
                    </div>
                </section>

                {/* Latest News Section */}
                <section className="section mb-5">
                    <div className="section-header-wrapper text-center mb-5">
                        <h2 className="section-header">Tin tức & cập nhật mới nhất</h2>
                        <p className="section-subtitle">Cập nhật những thông tin và nghiên cứu mới nhất</p>
                    </div>

                    {renderCards(newsData, "/news", newsIndex, newsIndex, setNewsIndex, newsTitles.length)}

                    <div className="text-center mt-4">
                        <Link to="/news" className="btn btn-outline-primary btn-lg">
                            <i className="bi bi-newspaper me-2"></i>
                            Xem thêm tin tức
                        </Link>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="cta-section py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h3 className="cta-title">Sẵn sàng bắt đầu hành trình học tập?</h3>
                            <p className="cta-description">
                                Tham gia cùng hàng ngàn học viên đã thay đổi cuộc sống nhờ giáo dục và nâng cao nhận thức.
                            </p>
                        </div>
                        <div className="col-lg-4 text-lg-end">
                            <Link to="/signup" className="btn btn-cta btn-lg">
                                <i className="bi bi-person-plus me-2"></i>
                                Bắt đầu ngay hôm nay
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CoursePage;