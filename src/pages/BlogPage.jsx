import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BlogPage.scss';
import Image from '../images/Images.jpg';

const BlogPage = () => {
    const posts = [
        {
            title: 'Lạm dụng chất kích thích: Nhận thức & Phòng ngừa',
            date: '31 Tháng 5, 2025',
            author: 'Bác sĩ Sarah Johnson',
            image: Image,
            excerpt: 'Tìm hiểu về các chiến lược và phương pháp mới nhất để phòng ngừa lạm dụng chất kích thích trong cộng đồng.',
            id: 1
        },
        {
            title: '12 Cách Phòng Ngừa Lạm Dụng Ma Túy',
            date: '28 Tháng 5, 2025',
            author: 'Michael Chen',
            image: Image,
            excerpt: 'Các mẹo thực tế và phương pháp dựa trên bằng chứng giúp phòng ngừa lạm dụng ma túy ở thanh thiếu niên và người lớn.',
            id: 2
        },
        {
            title: 'Nhận Thức Về Lạm Dụng Ma Túy',
            date: '25 Tháng 5, 2025',
            author: 'Lisa Rodriguez',
            image: Image,
            excerpt: 'Hiểu về các dấu hiệu, triệu chứng và tác động của lạm dụng ma túy đối với cá nhân và gia đình.',
            id: 3
        },
        {
            title: 'Tác Động Của Việc Sử Dụng Ma Túy Lâu Dài',
            date: '22 Tháng 5, 2025',
            author: 'Bác sĩ Sarah Johnson',
            image: Image,
            excerpt: 'Phân tích toàn diện về tác động thể chất, tinh thần và xã hội của việc sử dụng chất kích thích kéo dài.',
            id: 4
        },
        {
            title: 'Xây Dựng Sức Đề Kháng Chống Lại Nghiện Ngập',
            date: '19 Tháng 5, 2025',
            author: 'Michael Chen',
            image: Image,
            excerpt: 'Chiến lược phát triển sức đề kháng cá nhân và cộng đồng để phòng ngừa nghiện ngập.',
            id: 5
        },
        {
            title: 'Hỗ Trợ Hành Trình Phục Hồi',
            date: '16 Tháng 5, 2025',
            author: 'Lisa Rodriguez',
            image: Image,
            excerpt: 'Gia đình và cộng đồng có thể hỗ trợ hiệu quả như thế nào trong quá trình phục hồi.',
            id: 6
        },
    ];

    const featuredPost = posts[0];
    const regularPosts = posts.slice(1);

    return (
        <div className="blog-page">
            {/* Hero Section */}
            <section className="blog-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12 text-center">
                            <h1 className="hero-title">
                                Kiến Thức & Góc Nhìn
                            </h1>
                            <p className="hero-subtitle">
                                Khám phá các bài viết, nghiên cứu và chia sẻ chuyên gia mới nhất về phòng ngừa, nhận thức và hỗ trợ cộng đồng liên quan đến lạm dụng chất kích thích.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
                {/* Featured Article Section */}
                <section className="featured-section mb-5">
                    <div className="section-header text-center mb-5">
                        <h2 className="section-title">Bài Viết Nổi Bật</h2>
                        <p className="section-subtitle">Nội dung mới nhất và có ảnh hưởng nhất của chúng tôi</p>
                    </div>

                    <div className="featured-post">
                        <div className="row align-items-center">
                            <div className="col-lg-4">
                                <div className="featured-image">
                                    <img src={featuredPost.image} alt={featuredPost.title} className="img-fluid rounded-3" />
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div className="featured-content">
                                    <h3 className="featured-title">{featuredPost.title}</h3>
                                    <p className="featured-meta">
                                        <i className="bi bi-calendar me-2"></i>
                                        {featuredPost.date}
                                        <span className="mx-2">|</span>
                                        <i className="bi bi-person me-2"></i>
                                        {featuredPost.author}
                                    </p>
                                    <p className="featured-excerpt">{featuredPost.excerpt}</p>
                                    <Link to={`/blog/${featuredPost.id}`} className="btn btn-primary">
                                        <i className="bi bi-arrow-right me-2"></i>
                                        Đọc Thêm
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Latest Articles Section */}
                <section className="articles-section mb-5">
                    <div className="section-header text-center mb-5">
                        <h2 className="section-title">Bài Viết Mới Nhất</h2>
                        <p className="section-subtitle">Cập nhật những góc nhìn và nghiên cứu mới nhất của chúng tôi</p>
                    </div>

                    <div className="row">
                        {regularPosts.map((post) => (
                            <div key={post.id} className="col-lg-4 col-md-6 mb-4">
                                <div className="article-card">
                                    <div className="article-image">
                                        <img src={post.image} alt={post.title} className="img-fluid" />
                                    </div>
                                    <div className="article-content">
                                        <h4 className="article-title">{post.title}</h4>
                                        <p className="article-meta">
                                            <i className="bi bi-calendar me-2"></i>
                                            {post.date}
                                            <span className="mx-2">|</span>
                                            <i className="bi bi-person me-2"></i>
                                            {post.author}
                                        </p>
                                        <p className="article-excerpt">{post.excerpt}</p>
                                        <Link to={`/blog/${post.id}`} className="btn btn-outline-primary">
                                            Đọc Bài Viết
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pagination */}
                <section className="pagination-section">
                    <nav aria-label="Blog pagination" className="d-flex justify-content-center">
                        <ul className="pagination">
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Previous">
                                    <i className="bi bi-chevron-left"></i>
                                </a>
                            </li>
                            <li className="page-item active">
                                <a className="page-link" href="#">1</a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">2</a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">3</a>
                            </li>
                            <li className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#">10</a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Next">
                                    <i className="bi bi-chevron-right"></i>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </section>

                {/* Newsletter Subscription */}
                <section className="newsletter-section py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h3 className="newsletter-title">Luôn Cập Nhật Thông Tin</h3>
                            <p className="newsletter-description">
                                Đăng ký nhận bản tin để nhận các bài viết và cập nhật mới nhất trực tiếp qua email của bạn.
                            </p>
                        </div>
                        <div className="col-lg-4 text-lg-end">
                            <Link to="/newsletter" className="btn btn-cta btn-lg">
                                <i className="bi bi-envelope me-2"></i>
                                Đăng Ký Ngay
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BlogPage;