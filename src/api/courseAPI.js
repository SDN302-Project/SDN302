const BASE_URL = "https://prevention-api-tdt.onrender.com/api/v1";

// =======================
// 🛠️ COMMON FETCH WRAPPER
// =======================
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

  return data.data?.data ?? data.data;
};

// =======================
// 📚 COURSE: LIST & DETAIL
// =======================
const getCourses = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `/courses?${query}` : `/courses`;
  return request(endpoint, { method: "GET" });
};

const getCourseById = async (id) => {
  return request(`/courses/${id}`, { method: "GET" });
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

  return data.data.course.content;
};

// =======================
// ✅ ENROLLMENT
// =======================
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

  localStorage.setItem(`enrolled_${id}`, "true");
  return data;
};

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

  localStorage.removeItem(`enrolled_${id}`);
  return data;
};

const checkEnrolled = async (courseId) => {
  const token = localStorage.getItem("token");
  if (!token) return { isEnrolled: false };

  try {
    const response = await fetch(`${BASE_URL}/enrollments/my-courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn("⚠️ enrollments/my-courses lỗi:", data.message);
      const local = localStorage.getItem(`enrolled_${courseId}`);
      return { isEnrolled: local === "true" };
    }

    const enrolledCourses = data?.data?.enrollments ?? [];
    const isEnrolled = enrolledCourses.some((e) => e.course?._id === courseId);

    localStorage.setItem(`enrolled_${courseId}`, isEnrolled.toString());

    return { isEnrolled };
  } catch (err) {
    console.error("❌ Exception trong checkEnrolled:", err);
    const local = localStorage.getItem(`enrolled_${courseId}`);
    return { isEnrolled: local === "true" };
  }
};

// =======================
// ✍️ REVIEW: POST & CHECK
// =======================
const getReviews = async (courseId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${BASE_URL}/courses/${courseId}/reviews`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Lỗi khi lấy đánh giá");
  }

  return data?.data?.data ?? [];
};

const writeReview = async (courseId, reviewData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${BASE_URL}/courses/${courseId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData), // { rating: number, comment: string }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Lỗi khi gửi đánh giá");
  }

  localStorage.setItem(`reviewed_${courseId}`, "true");
  return data.data;
};

const hasReviewed = async (courseId, userId) => {
  const token = localStorage.getItem("token");
  if (!token || !userId) return false;

  try {
    const response = await fetch(`${BASE_URL}/courses/${courseId}/reviews`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) return false;

    // ✅ SỬA CHỖ NÀY
    const reviews = data.data?.data ?? [];
    return reviews.some((r) => r.user?._id === userId);
  } catch (err) {
    console.error("❌ Lỗi khi kiểm tra review:", err);
    return false;
  }
};

// =======================
// 🎨 FORMAT HELPERS
// =======================
const formatDuration = (minutes) => {
  if (!minutes || isNaN(minutes)) return "";
  if (minutes < 60) return `${minutes} phút`;
  const hours = Math.floor(minutes / 60);
  const remain = minutes % 60;
  return remain === 0 ? `${hours} giờ` : `${hours} giờ ${remain} phút`;
};

const getAudienceLabel = (code) => {
  const map = {
    student: "Học sinh",
    university_student: "Sinh viên",
    parent: "Phụ huynh",
    teacher: "Giáo viên",
  };
  return map[code] || code;
};

const formatCourse = (course) => ({
  ...course,
  formattedCreatedAt: new Date(course.createdAt).toLocaleDateString("vi-VN"),
  authorName: course.author?.name || "Không rõ",
  formattedDuration: formatDuration(course.duration),
  audienceLabel: getAudienceLabel(course.targetAudience),
});

const formatCourseList = (courses) => courses.map(formatCourse);

// =======================
// 📦 EXPORT API
// =======================
const courseApi = {
  // Course
  getCourses,
  getCourseById,
  getCourseContent,

  // Enrollment
  enrollCourse,
  unenrollCourse,
  checkEnrolled,

  // Review
  getReviews,
  writeReview,
  hasReviewed,

  // Formatting
  formatCourse,
  formatCourseList,
  formatDuration,
  getAudienceLabel,
};

export default courseApi;
