const BASE_URL = "https://prevention-api-tdt.onrender.com/api/v1";

// 🛠️ Helper dùng chung
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
    throw new Error(data.message || "Lỗi khi gọi API khoá học");
  }

  return data.data?.data ?? data.data; // hỗ trợ cả array và object
};

// 📌 API chính

/**
 * Lấy danh sách khoá học (có filter: page, limit, sort, targetAudience, search)
 */
const getCourses = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `/courses?${query}` : `/courses`;
  return request(endpoint, { method: "GET" });
};

/**
 * Lấy chi tiết khoá học theo ID
 */
const getCourseById = async (id) => {
  return request(`/courses/${id}`, { method: "GET" });
};

// 📌 Utilities

/**
 * Format ngày/thời gian/dữ liệu người tạo
 */
const formatCourse = (course) => ({
  ...course,
  formattedCreatedAt: new Date(course.createdAt).toLocaleDateString("vi-VN"),
  authorName: course.author?.name || "Không rõ",
  formattedDuration: formatDuration(course.duration),
  audienceLabel: getAudienceLabel(course.targetAudience),
});

/**
 * Format danh sách khoá học
 */
const formatCourseList = (courses) => courses.map(formatCourse);

/**
 * Format thời lượng (phút → giờ/phút)
 */
const formatDuration = (minutes) => {
  if (!minutes || isNaN(minutes)) return "";
  if (minutes < 60) return `${minutes} phút`;
  const hours = Math.floor(minutes / 60);
  const remain = minutes % 60;
  return remain === 0 ? `${hours} giờ` : `${hours} giờ ${remain} phút`;
};

/**
 * Format audience
 */
const getAudienceLabel = (code) => {
  const map = {
    student: "Học sinh",
    university_student: "Sinh viên",
    parent: "Phụ huynh",
    teacher: "Giáo viên",
  };
  return map[code] || code;
};

/**
 * Đăng ký khoá học theo ID (yêu cầu token)
 */
const enrollCourse = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${BASE_URL}/courses/${id}/enrollments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) throw new Error("Unauthorized");
    throw new Error(data.message || "Lỗi khi đăng ký khóa học");
  }

  return data;
};

/**
 * Huỷ đăng ký khoá học (yêu cầu token)
 */
const unenrollCourse = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${BASE_URL}/courses/${id}/enrollments`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) throw new Error("Unauthorized");
    throw new Error(data.message || "Lỗi khi huỷ đăng ký");
  }

  return data;
};

/**
 * Kiểm tra đã đăng ký khoá học chưa (dành cho người dùng đã login)
 */
const checkEnrolled = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) return { isEnrolled: false };

  try {
    const response = await fetch(
      `${BASE_URL}/courses/${id}/enrollments/check`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json", // thêm để tránh lỗi backend
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("⚠️ checkEnrolled API error:", data);
      return { isEnrolled: false };
    }

    return { isEnrolled: data?.data?.isEnrolled ?? false };
  } catch (err) {
    console.error("❌ Exception in checkEnrolled:", err);
    return { isEnrolled: false };
  }
};

const getCourseContent = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${BASE_URL}/courses/${id}/content`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error(data.message || "Bạn chưa đăng ký khoá học này.");
    }
    throw new Error(data.message || "Lỗi khi lấy nội dung khoá học");
  }

  return data.data.course.content; // hoặc `data.data.content` tùy theo cấu trúc
};

const courseApi = {
  getCourses,
  getCourseById,
  getCourseContent,
  enrollCourse,
  unenrollCourse,
  checkEnrolled,
  formatCourse,
  formatCourseList,
  formatDuration,
  getAudienceLabel,
};

export default courseApi;
