// Prevention API JavaScript SDK for Frontend

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api/v1";

class PreventionAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem("token");
  }

  // Token management
  setToken(token) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  getToken() {
    return this.token || localStorage.getItem("token");
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // Base fetch method with error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(this.getToken() && { Authorization: `Bearer ${this.getToken()}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (response.status === 401) {
        this.clearToken();
        window.location.href = "/login";
        throw new Error("Session expired");
      }

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return data;
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  // Authentication methods
  async signup(userData) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(email, password) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.status === "success") {
      this.setToken(response.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response;
  }

  async googleLogin(token) {
    const response = await this.request("/auth/google-login", {
      method: "POST",
      body: JSON.stringify({ token }),
    });

    if (response.status === "success") {
      this.setToken(response.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response;
  }

  async forgotPassword(email) {
    return this.request("/auth/forgotPassword", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, password, passwordConfirm) {
    return this.request(`/auth/resetPassword/${token}`, {
      method: "PATCH",
      body: JSON.stringify({ password, passwordConfirm }),
    });
  }

  // Course methods
  async getCourses(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/courses${query ? `?${query}` : ""}`);
  }

  async getCourse(id) {
    return this.request(`/courses/${id}`);
  }

  async enrollInCourse(courseId) {
    return this.request(`/courses/${courseId}/enrollments`, {
      method: "POST",
    });
  }

  async getCourseEnrollments(courseId) {
    return this.request(`/courses/${courseId}/enrollments`);
  }

  async reviewCourse(courseId, review, rating) {
    return this.request(`/courses/${courseId}/reviews`, {
      method: "POST",
      body: JSON.stringify({ review, rating }),
    });
  }

  async getCourseReviews(courseId) {
    return this.request(`/courses/${courseId}/reviews`);
  }

  // Survey methods
  async getSurveys() {
    return this.request("/surveys");
  }

  async getSurvey(id) {
    return this.request(`/surveys/${id}`);
  }

  async submitSurveyResult(surveyId, answers) {
    return this.request(`/surveys/${surveyId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    });
  }

  // Appointment methods
  async createTimeSlots(slots) {
    return this.request("/appointment-slots/my-slots", {
      method: "POST",
      body: JSON.stringify({ slots }),
    });
  }

  async getAvailableSlots(consultantId) {
    return this.request(`/appointment-slots/consultant/${consultantId}`);
  }

  async bookAppointmentSlot(slotId) {
    return this.request(`/appointment-slots/${slotId}/book`, {
      method: "PATCH",
    });
  }

  async getConsultants() {
    return this.request("/users?role=consultant");
  }

  // Blog methods
  async getBlogs() {
    return this.request("/blogs");
  }

  async getBlog(id) {
    return this.request(`/blogs/${id}`);
  }

  // User methods
  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  // Utility methods
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  }

  logout() {
    this.clearToken();
    window.location.href = "/login";
  }

  // Complete appointment booking workflow
  async appointmentBookingWorkflow() {
    try {
      const consultantsResponse = await this.getConsultants();
      const consultants = consultantsResponse.data.data;

      if (!consultants || consultants.length === 0) {
        throw new Error("Không có chuyên viên tư vấn nào khả dụng");
      }

      return {
        success: true,
        consultants,
        message: "Lấy danh sách chuyên viên thành công",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getConsultantAvailability(consultantId) {
    try {
      const response = await this.getAvailableSlots(consultantId);
      return {
        success: true,
        slots: response.data.slots,
        message: "Lấy lịch khả dụng thành công",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async completeBooking(slotId) {
    try {
      const response = await this.bookAppointmentSlot(slotId);
      return {
        success: true,
        appointment: response.data.appointment,
        message: response.message || "Đặt lịch hẹn thành công!",
      };
    } catch (error) {
      const errorMessage = error.message.includes("409")
        ? "Khung giờ này đã được đặt, vui lòng chọn khung giờ khác"
        : "Không thể đặt lịch hẹn";

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Helper method for consultants to create multiple time slots
  async createWeeklySlots(startDate, endDate, dailySlots) {
    try {
      const slots = [];
      const current = new Date(startDate);
      const end = new Date(endDate);

      while (current <= end) {
        dailySlots.forEach((slot) => {
          const startTime = new Date(current);
          const endTime = new Date(current);

          const [startHour, startMinute] = slot.startTime.split(":");
          const [endHour, endMinute] = slot.endTime.split(":");

          startTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
          endTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

          slots.push({
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          });
        });

        current.setDate(current.getDate() + 1);
      }

      const response = await this.createTimeSlots(slots);
      return {
        success: true,
        slots: response.data.slots,
        message: "Tạo lịch làm việc hàng tuần thành công!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

const api = new PreventionAPI();
export default api;
