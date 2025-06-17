import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.scss';
import Image from '../images/Images.jpg';
import Image1 from '../images/Image1.jpg';
import Image2 from '../images/Image2.jpg';
import Image3 from '../images/Image3.jpg';
import PreventionImg from '../images/Prevention.jpg';
import SupportImg from '../images/supporthug.jpg';
import GroupSessionImg from '../images/groupsession.jpg';
import OutdoorsImg from '../images/outdoors.jpg';

const HomePage = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [stats, setStats] = useState({ users: 0, courses: 0, consultations: 0, success: 0 });

    // Animated counter effect
    useEffect(() => {
        const targets = { users: 5000, courses: 150, consultations: 2500, success: 95 };
        const duration = 2000; // 2 seconds
        const increment = 50; // Update every 50ms
        const steps = duration / increment;

        const counters = Object.keys(targets).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
        }, {});

        const timer = setInterval(() => {
            let allComplete = true;
            Object.keys(targets).forEach(key => {
                if (counters[key] < targets[key]) {
                    counters[key] = Math.min(counters[key] + targets[key] / steps, targets[key]);
                    allComplete = false;
                }
            });

            setStats({ ...counters });

            if (allComplete) {
                clearInterval(timer);
            }
        }, increment);

        return () => clearInterval(timer);
    }, []);

    // Testimonials rotation
    useEffect(() => {
        const testimonialTimer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(testimonialTimer);
    }, []);

    const cardData = (titles, images = []) =>
        titles.map((title, index) => ({
            title,
            date: 'May 31, 2025',
            image: images[index] || Image,
            id: index + 1,
            excerpt: getExcerpt(title)
        }));

    const getExcerpt = (title) => {
        const excerpts = {
            "Lạm dụng chất: Nhận thức & Phòng ngừa": "Tìm hiểu về các chiến lược phòng ngừa mới nhất và cách nhận biết các dấu hiệu cảnh báo sớm.",
            "12 cách phòng ngừa lạm dụng ma túy": "Các mẹo thực tế và phương pháp dựa trên bằng chứng để ngăn chặn lạm dụng chất trong cộng đồng của bạn.",
            "Nhận thức về lạm dụng ma túy": "Hướng dẫn toàn diện về hiểu và giải quyết vấn đề lạm dụng ma túy trong xã hội ngày nay.",
            "Tác động của việc sử dụng ma túy lâu dài": "Phân tích chi tiết về tác động của việc sử dụng chất kéo dài đến sức khỏe thể chất và tinh thần.",
            "Sự thật về ma túy": "Thông tin dựa trên bằng chứng về các loại chất và tác động của chúng đối với cơ thể và tâm trí.",
            "Sự thật về lạm dụng thuốc kê đơn": "Hiểu về rủi ro và phòng ngừa việc lạm dụng thuốc kê đơn.",
            "Con đường phục hồi - Khóa học trực tuyến": "Khóa học tương tác hướng dẫn bạn qua hành trình phục hồi và chữa lành.",
            "Bộ công cụ phòng ngừa ma túy cho thanh thiếu niên": "Tài nguyên và chiến lược được thiết kế đặc biệt để ngăn chặn lạm dụng chất ở thanh thiếu niên."
        };
        return excerpts[title] || "Khám phá những hiểu biết có giá trị và hướng dẫn thực tế trong tài nguyên toàn diện này.";
    };

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Huấn luyện viên phục hồi",
            content: "SUBSTANCE đã thay đổi cách chúng ta tiếp cận việc phục hồi nghiện. Các tài nguyên rất toàn diện và thực sự thay đổi cuộc sống.",
            avatar: "👩‍⚕️"
        },
        {
            name: "Michael Chen",
            role: "Phụ huynh",
            content: "Các khóa học phòng ngừa đã giúp tôi hiểu cách bảo vệ con cái và hỗ trợ gia đình chúng tôi vượt qua những thời điểm khó khăn.",
            avatar: "👨‍👦"
        },
        {
            name: "Dr. Emily Rodriguez",
            role: "Chuyên gia nghiện",
            content: "Tôi giới thiệu SUBSTANCE cho tất cả bệnh nhân của mình. Cách tiếp cận dựa trên bằng chứng và định dạng dễ tiếp cận giúp việc phục hồi dễ đạt được hơn.",
            avatar: "👩‍⚕️"
        }
    ];

    const renderCards = (data, basePath, showExcerpt = true) => (
        data.map((item) => (
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4" key={item.id}>
                <Link to={`${basePath}/${item.id}`} className="custom-card-link">
                    <div className="custom-card">
                        <div className="card-image-wrapper">
                            <img src={item.image} alt={item.title} className="card-image" />
                            <div className="card-overlay">
                                <i className="bi bi-arrow-right-circle"></i>
                            </div>
                        </div>
                        <div className="card-content">
                            <h5 className="card-title">{item.title}</h5>
                            {showExcerpt && <p className="card-excerpt">{item.excerpt}</p>}
                            <div className="card-meta">
                                <span className="card-date">
                                    <i className="bi bi-calendar3"></i> {item.date}
                                </span>
                                <span className="read-more">Read More →</span>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        ))
    );

    return (
        <div className="homepage">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="container">
                        <div className="row align-items-center min-vh-100">
                            <div className="col-lg-6">
                                <div className="hero-text">
                                    <h1 className="hero-title">
                                        Hành trình
                                        <span className="highlight"> Phục hồi</span>
                                        <br />Bắt đầu từ đây
                                    </h1>
                                    <p className="hero-description">
                                        Khám phá tài nguyên toàn diện, hướng dẫn chuyên môn và cộng đồng hỗ trợ
                                        dành riêng cho phòng ngừa, phục hồi và chữa lành lạm dụng chất.
                                    </p>
                                    <div className="hero-buttons">
                                        <Link to="/courses" className="btn btn-primary-custom btn-lg">
                                            <i className="bi bi-play-circle me-2"></i>
                                            Bắt đầu học
                                        </Link>
                                        <Link to="/booking" className="btn btn-outline-custom btn-lg">
                                            <i className="bi bi-calendar-check me-2"></i>
                                            Đặt lịch tư vấn
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="hero-carousel">
                                    <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
                                        <div className="carousel-inner">
                                            <div className="carousel-item active">
                                                <img src={GroupSessionImg} className="d-block w-100" alt="Group Support Session" />
                                                <div className="carousel-caption">
                                                    <h5>Hỗ trợ cộng đồng</h5>
                                                    <p>Tham gia cộng đồng hỗ trợ của chúng tôi trong hành trình phục hồi</p>
                                                </div>
                                            </div>
                                            <div className="carousel-item">
                                                <img src={OutdoorsImg} className="d-block w-100" alt="Outdoor Recovery Activities" />
                                                <div className="carousel-caption">
                                                    <h5>Chữa lành toàn diện</h5>
                                                    <p>Khám phá các chương trình phục hồi và sức khỏe dựa trên thiên nhiên</p>
                                                </div>
                                            </div>
                                            <div className="carousel-item">
                                                <img src={SupportImg} className="d-block w-100" alt="Professional Support" />
                                                <div className="carousel-caption">
                                                    <h5>Hướng dẫn chuyên môn</h5>
                                                    <p>Truy cập tư vấn chuyên nghiệp và chăm sóc cá nhân</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon"></span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                                            <span className="carousel-control-next-icon"></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="stats-section py-5">
                <div className="container">
                    <div className="row text-center">
                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <i className="bi bi-people-fill"></i>
                                </div>
                                <h3 className="stat-number">{Math.floor(stats.users).toLocaleString()}+</h3>
                                <p className="stat-label">Cuộc sống được thay đổi</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <i className="bi bi-book-fill"></i>
                                </div>
                                <h3 className="stat-number">{Math.floor(stats.courses)}+</h3>
                                <p className="stat-label">Tài nguyên giáo dục</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <i className="bi bi-heart-fill"></i>
                                </div>
                                <h3 className="stat-number">{Math.floor(stats.consultations)}+</h3>
                                <p className="stat-label">Buổi hỗ trợ</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <i className="bi bi-trophy-fill"></i>
                                </div>
                                <h3 className="stat-number">{Math.floor(stats.success)}%</h3>
                                <p className="stat-label">Tỷ lệ thành công</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container py-5">
                {/* Featured Courses Section */}
                <section className="section mb-5">
                    <div className="section-header-wrapper text-center mb-5">
                        <h2 className="section-header">Lộ trình học tập nổi bật</h2>
                        <p className="section-subtitle">Bắt đầu hành trình của bạn với các khóa học phổ biến và hiệu quả nhất</p>
                    </div>
                    <div className="row gx-3">
                        {renderCards(cardData([
                            "The Truth About Drugs",
                            "The Truth About Prescription Drug Abuse",
                            "Recovery Pathways - Online Course",
                            "Youth Drug Prevention Toolkit"
                        ], [PreventionImg, Image2, SupportImg, Image3]), "/course")}
                    </div>
                    <div className="text-center mt-4">
                        <Link to="/courses" className="btn btn-outline-primary btn-lg">
                            <i className="bi bi-collection me-2"></i>
                            Xem tất cả khóa học
                        </Link>
                    </div>
                </section>

                {/* Popular Blogs Section */}
                <section className="section mb-5">
                    <div className="section-header-wrapper text-center mb-5">
                        <h2 className="section-header">Trung tâm kiến thức</h2>
                        <p className="section-subtitle">Cập nhật với những hiểu biết và nghiên cứu mới nhất</p>
                    </div>
                    <div className="row gx-3">
                        {renderCards(cardData([
                            "Substance Abuse: Awareness & Prevention",
                            "12 ways to prevent drug abuse",
                            "Drug Abuse Awareness",
                            "Effects of Long-Term Drug Use"
                        ], [PreventionImg, Image1, Image2, Image3]), "/blog")}
                    </div>
                    <div className="text-center mt-4">
                        <Link to="/blog" className="btn btn-outline-primary btn-lg">
                            <i className="bi bi-journal-text me-2"></i>
                            Đọc thêm bài viết
                        </Link>
                    </div>
                </section>
            </div>

            {/* Testimonials Section */}
            <section className="testimonials-section py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-header">Cộng đồng nói gì về chúng tôi</h2>
                        <p className="section-subtitle">Những câu chuyện thực từ những người thực trong hành trình phục hồi của họ</p>
                    </div>
                    <div className="testimonial-container">
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                <div className="quote-icon">
                                    <i className="bi bi-quote"></i>
                                </div>
                                <p className="testimonial-text">"{testimonials[currentTestimonial].content}"</p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">{testimonials[currentTestimonial].avatar}</div>
                                    <div className="author-info">
                                        <h5 className="author-name">{testimonials[currentTestimonial].name}</h5>
                                        <p className="author-role">{testimonials[currentTestimonial].role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-indicators">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    className={`indicator ${index === currentTestimonial ? 'active' : ''}`}
                                    onClick={() => setCurrentTestimonial(index)}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="cta-section py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h2 className="cta-title">Sẵn sàng bắt đầu hành trình phục hồi của bạn?</h2>
                            <p className="cta-description">
                                Thực hiện bước đầu tiên hướng tới sự chữa lành và thay đổi. Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn trong mọi bước đi.
                            </p>
                        </div>
                        <div className="col-lg-4 text-lg-end">
                            <Link to="/booking" className="btn btn-cta btn-lg">
                                <i className="bi bi-calendar-heart me-2"></i>
                                Đặt lịch tư vấn miễn phí
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;