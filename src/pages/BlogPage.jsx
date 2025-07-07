import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/BlogPage.scss";
import api from "../api/frontend-sdk";

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.getBlogs();
        console.log("📦 Blog data:", res);
        setPosts(res.data.data); // đúng theo cấu trúc API trả về
      } catch (err) {
        console.error("Lỗi khi lấy blog:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Đang tải bài viết...</div>;
  }

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12 text-center">
              <h1 className="hero-title">Kiến Thức & Góc Nhìn</h1>
              <p className="hero-subtitle">
                Khám phá các bài viết, nghiên cứu và chia sẻ chuyên gia mới nhất
                về phòng ngừa, nhận thức và hỗ trợ cộng đồng liên quan đến lạm
                dụng chất kích thích.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div
        className="container"
        style={{ paddingTop: "5rem", paddingBottom: "5rem" }}
      >
        {/* Featured Article Section */}
        {featuredPost && (
          <section className="featured-section mb-5">
            <div className="section-header text-center mb-5">
              <h2 className="section-title">Bài Viết Nổi Bật</h2>
              <p className="section-subtitle">
                Nội dung mới nhất và có ảnh hưởng nhất của chúng tôi
              </p>
            </div>

            <div className="featured-post">
              <div className="row align-items-center">
                <div className="col-lg-4">
                  <div className="featured-image">
                    <img
                      src={featuredPost.imageCover}
                      alt={featuredPost.title}
                      className="img-fluid rounded-3"
                    />
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="featured-content">
                    <h3 className="featured-title">{featuredPost.title}</h3>
                    <p className="featured-meta">
                      <i className="bi bi-person me-2"></i>
                      Tác giả: {featuredPost.author}
                    </p>
                    <p className="featured-excerpt">
                      {featuredPost.content.slice(0, 120)}...
                    </p>
                    <Link
                      to={`/blog/${featuredPost._id}`}
                      className="btn btn-primary"
                    >
                      <i className="bi bi-arrow-right me-2"></i>
                      Đọc Thêm
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Latest Articles Section */}
        <section className="articles-section mb-5">
          <div className="section-header text-center mb-5">
            <h2 className="section-title">Bài Viết Mới Nhất</h2>
            <p className="section-subtitle">
              Cập nhật những góc nhìn và nghiên cứu mới nhất của chúng tôi
            </p>
          </div>

          <div className="row">
            {regularPosts.map((post) => (
              <div key={post._id} className="col-lg-4 col-md-6 mb-4">
                <div className="article-card">
                  <div className="article-image">
                    <img
                      src={post.imageCover}
                      alt={post.title}
                      className="img-fluid"
                    />
                  </div>
                  <div className="article-content">
                    <h4 className="article-title">{post.title}</h4>
                    <p className="article-meta">
                      <i className="bi bi-person me-2"></i>
                      Tác giả: {post.author}
                    </p>
                    <p className="article-excerpt">
                      {post.content.slice(0, 100)}...
                    </p>
                    <Link
                      to={`/blog/${post._id}`}
                      className="btn btn-outline-primary"
                    >
                      Đọc Bài Viết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Giữ nguyên phần Newsletter, Pagination */}
      </div>
    </div>
  );
};

export default BlogPage;
