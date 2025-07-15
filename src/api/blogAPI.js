const BASE_URL = "https://prevention-api-tdt.onrender.com/api/v1";

// 🛠️ Helper chung gọi API
const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const requestOptions = { ...defaultOptions, ...options };

  const response = await fetch(url, requestOptions);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Lỗi khi gọi API blog");
  }

  /**
   * API thường trả về:
   * {
   *   status: "success",
   *   data: {
   *     data: [ array hoặc object ]
   *   }
   * }
   */
  return data.data?.data ?? data.data; // ✅ Ưu tiên array nếu có, fallback về object nếu không
};

// 📌 API chính

/**
 * Lấy danh sách blog (có hỗ trợ filter: page, limit, sort, category, search)
 */
const getAllBlogs = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `/blogs?${query}` : `/blogs`;
  return request(endpoint, { method: "GET" });
};

/**
 * Lấy blog theo ID
 */
const getBlogById = async (id) => {
  return request(`/blogs/${id}`, { method: "GET" });
};

/**
 * Lấy blog mới nhất
 */
const getRecentBlogs = async (limit = 10) => {
  return getAllBlogs({ sort: "-createdAt", limit });
};

/**
 * Lấy blog nổi bật
 */
const getFeaturedBlogs = async (limit = 5) => {
  return getAllBlogs({ featured: true, sort: "-createdAt", limit });
};

/**
 * Tìm kiếm blog theo từ khóa
 */
const searchBlogs = async (search, params = {}) => {
  return getAllBlogs({ ...params, search });
};

/**
 * Lọc blog theo category
 */
const getBlogsByCategory = async (category, params = {}) => {
  return getAllBlogs({ ...params, category });
};

/**
 * Lấy danh mục blog (nếu backend hỗ trợ)
 */
const getCategories = async () => {
  return request("/blogs/categories", { method: "GET" });
};

// 📌 Utilities

/**
 * Ước tính thời gian đọc (dựa trên số từ)
 */
const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content?.split(" ").length || 0;
  const time = Math.ceil(wordCount / wordsPerMinute);
  return time <= 1 ? "1 phút đọc" : `${time} phút đọc`;
};

/**
 * Cắt đoạn mô tả ngắn
 */
const generateExcerpt = (content = "", maxLength = 150) => {
  if (content.length <= maxLength) return content;
  const cut = content.substring(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return lastSpace > 0 ? cut.substring(0, lastSpace) + "..." : cut + "...";
};

/**
 * Format 1 blog (thêm ngày, thời gian đọc, mô tả ngắn)
 */
const formatBlog = (blog) => ({
  ...blog,
  formattedDate: new Date(blog.createdAt).toLocaleDateString("vi-VN"),
  readingTime: calculateReadingTime(blog.content),
  excerpt: generateExcerpt(blog.content),
});

/**
 * Format danh sách blog
 */
const formatBlogList = (blogs) => blogs.map(formatBlog);

/**
 * Tạo dữ liệu chia sẻ
 */
const generateShareData = (blog) => ({
  title: blog.title,
  message: `Đọc bài viết: ${blog.title}`,
  url: `${BASE_URL}/blogs/${blog._id}`,
});

// ✅ Export dưới dạng object
const blogApi = {
  getAllBlogs,
  getBlogById,
  getRecentBlogs,
  getFeaturedBlogs,
  getBlogsByCategory,
  searchBlogs,
  getCategories,
  formatBlog,
  formatBlogList,
  generateExcerpt,
  generateShareData,
};

export default blogApi;
