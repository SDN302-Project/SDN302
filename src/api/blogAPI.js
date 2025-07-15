const BASE_URL = "https://prevention-api-tdt.onrender.com/api/v1";

/**
 * Lấy danh sách tất cả blog (public)
 * @returns {Promise<Array>} Danh sách blog
 */
const getAllBlogs = async () => {
  const response = await fetch(`${BASE_URL}/blogs`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Lỗi khi lấy danh sách blog");
  }

  return data.data.data; // Trả về array các blog
};

/**
 * Lấy chi tiết blog theo ID
 * @param {string} id - ID của blog
 * @returns {Promise<Object>} Thông tin blog chi tiết
 */
const getBlogById = async (id) => {
  const response = await fetch(`${BASE_URL}/blogs/${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Lỗi khi lấy chi tiết blog");
  }

  return data.data;
};

// ✅ Export mặc định theo object để dùng: blogApi.getAllBlogs()
export default {
  getAllBlogs,
  getBlogById,
};
