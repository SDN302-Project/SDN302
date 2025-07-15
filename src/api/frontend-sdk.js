/*
PREVENTION API JAVASCRIPT SDK - FRONTEND INTEGRATION

🎯 QUICK START GUIDE:

1. AUTHENTICATION:
   - await api.login(email, password)
   - await api.signup(userData)

2. COURSES:
   - await api.getCourses() // Browse all courses
   - await api.getMyCourses() // My enrolled courses
   - await api.getCourseContent(courseId) // Read course content

3. APPOINTMENTS:
   - await api.appointmentBookingWorkflow() // Complete booking flow
   - await api.getMyBookings() // My appointments

4. PROFILE MANAGEMENT (🆕):
   - await api.getMe() // Get my profile
   - await api.updateMe(userData) // Update profile
   - await api.updateMyPassword(current, new, confirm) // Change password

5. SURVEYS:
   - await api.getSurveys() // Get risk assessment surveys
   - await api.submitSurveyResult(surveyId, answers) // Submit results

USAGE EXAMPLES AT THE BOTTOM OF THIS FILE!
*/

// Prevention API JavaScript SDK for Frontend

const API_BASE_URL = "https://prevention-api-tdt.onrender.com/api/v1";

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

  // Lấy nội dung khóa học (chỉ cho enrolled users)
  async getCourseContent(courseId) {
    return this.request(`/courses/${courseId}/content`);
  }

  // Lấy danh sách khóa học đã đăng ký
  async getMyCourses() {
    return this.request("/enrollments/my-courses");
  }

  async enrollInCourse(courseId) {
    return this.request(`/courses/${courseId}/enrollments`, {
      method: "POST",
    });
  }

  async getCourseEnrollments(courseId) {
    return this.request(`/courses/${courseId}/enrollments`);
  }

  // Review methods - Enhanced
  async reviewCourse(courseId, review, rating) {
    return this.request(`/courses/${courseId}/reviews`, {
      method: "POST",
      body: JSON.stringify({ review, rating }),
    });
  }

  async getCourseReviews(courseId) {
    return this.request(`/courses/${courseId}/reviews`);
  }

  // NEW: Get my review for specific course
  async getMyReview(courseId) {
    return this.request(`/courses/${courseId}/reviews/my-review`);
  }

  // NEW: Update my review
  async updateReview(courseId, reviewId, review, rating) {
    return this.request(`/courses/${courseId}/reviews/${reviewId}`, {
      method: "PATCH",
      body: JSON.stringify({ review, rating }),
    });
  }

  // NEW: Delete my review
  async deleteReview(courseId, reviewId) {
    return this.request(`/courses/${courseId}/reviews/${reviewId}`, {
      method: "DELETE",
    });
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

  async cancelAppointmentSlot(slotId) {
    return this.request(`/appointment-slots/${slotId}/cancel`, {
      method: "PATCH",
    });
  }

  async getMySlots() {
    return this.request("/appointment-slots/my-slots");
  }

  async getMyBookings() {
    return this.request("/appointment-slots/my-bookings");
  }

  async markNoShow(slotId) {
    return this.request(`/appointment-slots/${slotId}/mark-no-show`, {
      method: "PATCH",
    });
  }

  async getConsultants() {
    return this.request("/users/consultants");
  }

  // User methods
  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  // NEW: Profile management methods
  async getMe() {
    return this.request("/users/me");
  }

  async updateMe(userData) {
    return this.request("/users/update-me", {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  }

  async updateMyPassword(passwordCurrent, password, passwordConfirm) {
    return this.request("/users/update-my-password", {
      method: "PATCH",
      body: JSON.stringify({ passwordCurrent, password, passwordConfirm }),
    });
  }

  async deleteMe() {
    return this.request("/users/delete-me", {
      method: "DELETE",
    });
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
      // 1. Get list of consultants
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

// Export for use in frontend
const api = new PreventionAPI();

/*
// Login
try {
  const result = await api.login('user@example.com', 'password123');
  console.log('Login successful:', result.data.user);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Get courses with filters
const courses = await api.getCourses({
  targetAudience: 'student',
  page: 1,
  limit: 10
});

// Enroll in course
await api.enrollInCourse('courseId123');

// Submit survey
await api.submitSurveyResult('surveyId123', [
  { questionIndex: 0, optionIndex: 1 },
  { questionIndex: 1, optionIndex: 2 }
]);

// NEW: Appointment booking workflow
// 1. Get consultants
const consultantResult = await api.appointmentBookingWorkflow();
if (consultantResult.success) {
  const consultants = consultantResult.consultants;
  
  // 2. Get available slots for selected consultant
  const availabilityResult = await api.getConsultantAvailability(consultants[0]._id);
  if (availabilityResult.success) {
    const slots = availabilityResult.slots;
    
    // 3. Book selected slot
    const bookingResult = await api.completeBooking(slots[0]._id);
    if (bookingResult.success) {
      console.log('Appointment booked:', bookingResult.appointment);
    }
  }
}

// FOR CONSULTANTS: Create weekly schedule
const weeklySlots = await api.createWeeklySlots(
  '2025-06-20', // Start date
  '2025-06-26', // End date  
  [
    { startTime: '09:00', endTime: '10:00' },
    { startTime: '10:00', endTime: '11:00' },
    { startTime: '14:00', endTime: '15:00' }
  ]
);
*/

// Test function để kiểm tra update review
async function testUpdateReview() {
  console.log("🔧 Testing Update Review API...");

  try {
    // 1. Login để lấy token
    const loginResponse = await api.login("member@example.com", "password123");
    console.log("✅ Login successful");

    // 2. Lấy course ID (dùng course có sẵn)
    const courseId = "687393c0881cf842fe74cf4e";

    // 3. Kiểm tra xem user đã có review chưa
    const myReviewResponse = await api.getMyReview(courseId);
    console.log("📝 My review status:", myReviewResponse.data);

    if (myReviewResponse.data.review) {
      // User đã có review, test update
      const reviewId = myReviewResponse.data.review._id;
      console.log("🎯 Found existing review, testing update...");

      const updateResponse = await api.updateReview(
        courseId,
        reviewId,
        "Review đã được cập nhật bằng test function!",
        4
      );

      console.log("✅ Update successful:", updateResponse);
      return { success: true, action: "updated", data: updateResponse };
    } else {
      console.log("ℹ️ No existing review found, creating one first...");

      // Tạo review mới trước
      const createResponse = await api.reviewCourse(
        courseId,
        "Review test để kiểm tra chức năng sửa/xóa",
        5
      );

      console.log("✅ Review created:", createResponse);
      return { success: true, action: "created", data: createResponse };
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    return { success: false, error: error.message };
  }
}

// Test function để kiểm tra delete review
async function testDeleteReview() {
  console.log("🗑️ Testing Delete Review API...");

  try {
    // 1. Đảm bảo đã login
    if (!api.isAuthenticated()) {
      await api.login("member@example.com", "password123");
    }

    // 2. Lấy course ID
    const courseId = "687393c0881cf842fe74cf4e";

    // 3. Kiểm tra review hiện tại
    const myReviewResponse = await api.getMyReview(courseId);

    if (myReviewResponse.data.review) {
      const reviewId = myReviewResponse.data.review._id;
      console.log("🎯 Found review to delete:", reviewId);

      // Test delete
      const deleteResponse = await api.deleteReview(courseId, reviewId);
      console.log("✅ Delete successful:", deleteResponse);

      return { success: true, action: "deleted", data: deleteResponse };
    } else {
      console.log("ℹ️ No review found to delete");
      return { success: false, error: "No review to delete" };
    }
  } catch (error) {
    console.error("❌ Delete test failed:", error.message);
    return { success: false, error: error.message };
  }
}

// Complete test workflow cho review management
async function testCompleteReviewWorkflow() {
  console.log("🚀 Testing Complete Review Management Workflow...");

  try {
    const courseId = "687393c0881cf842fe74cf4e";

    // Step 1: Login
    console.log("Step 1: Login...");
    await api.login("member@example.com", "password123");

    // Step 2: Check enrollment status
    console.log("Step 2: Check enrollment...");
    const myCourses = await api.getMyCourses();
    const isEnrolled = myCourses.data.enrollments.some(
      (enrollment) => enrollment.course._id === courseId
    );

    if (!isEnrolled) {
      console.log("Step 2a: Enrolling in course...");
      await api.enrollInCourse(courseId);
    }

    // Step 3: Check current review status
    console.log("Step 3: Check review status...");
    let myReview = await api.getMyReview(courseId);

    // Step 4: Create review if not exists
    if (!myReview.data.review) {
      console.log("Step 4: Creating new review...");
      await api.reviewCourse(courseId, "Test review for workflow", 5);
      myReview = await api.getMyReview(courseId);
    }

    // Step 5: Update review
    console.log("Step 5: Updating review...");
    const reviewId = myReview.data.review._id;
    const updateResult = await api.updateReview(
      courseId,
      reviewId,
      "Updated review content from workflow test",
      4
    );

    // Step 6: Verify update
    console.log("Step 6: Verifying update...");
    const updatedReview = await api.getMyReview(courseId);

    console.log("✅ Complete workflow successful!");

    return {
      success: true,
      steps: {
        login: true,
        enrollment: isEnrolled,
        reviewCreated: !!myReview.data.review,
        reviewUpdated: true,
        finalReview: updatedReview.data.review,
      },
    };
  } catch (error) {
    console.error("❌ Workflow failed:", error.message);
    return { success: false, error: error.message, step: "unknown" };
  }
}

// Export test functions
window.testUpdateReview = testUpdateReview;
window.testDeleteReview = testDeleteReview;
window.testCompleteReviewWorkflow = testCompleteReviewWorkflow;

// NEW: Profile management test functions
async function testProfileManagement() {
  console.log("👤 Testing Profile Management API...");

  try {
    // Step 1: Login
    console.log("Step 1: Login...");
    await api.login("member@example.com", "password123");

    // Step 2: Get current profile
    console.log("Step 2: Get my profile...");
    const profileResponse = await api.getMe();
    console.log("✅ Current profile:", profileResponse.data.data);

    // Step 3: Update profile
    console.log("Step 3: Update profile...");
    const updateResponse = await api.updateMe({
      name: "Tên đã được cập nhật",
      email: "newemail@example.com",
    });
    console.log("✅ Profile updated:", updateResponse.data.user);

    // Step 4: Get updated profile to verify
    console.log("Step 4: Verify update...");
    const verifyResponse = await api.getMe();
    console.log("✅ Verified profile:", verifyResponse.data.data);

    return {
      success: true,
      originalProfile: profileResponse.data.data,
      updatedProfile: verifyResponse.data.data,
    };
  } catch (error) {
    console.error("❌ Profile test failed:", error.message);
    return { success: false, error: error.message };
  }
}

async function testPasswordChange() {
  console.log("🔐 Testing Password Change API...");

  try {
    // Ensure logged in
    if (!api.isAuthenticated()) {
      await api.login("member@example.com", "password123");
    }

    // Test password change
    const passwordResponse = await api.updateMyPassword(
      "password123", // current password
      "newpassword123", // new password
      "newpassword123" // confirm new password
    );

    console.log("✅ Password changed successfully");
    console.log("New token received:", passwordResponse.token);

    return {
      success: true,
      newToken: passwordResponse.token,
      user: passwordResponse.data.user,
    };
  } catch (error) {
    console.error("❌ Password change failed:", error.message);
    return { success: false, error: error.message };
  }
}

// Complete profile workflow
async function testCompleteProfileWorkflow() {
  console.log("🚀 Testing Complete Profile Workflow...");

  try {
    // 1. Login
    await api.login("member@example.com", "password123");

    // 2. Get profile
    const profile = await api.getMe();

    // 3. Update profile info
    const updatedProfile = await api.updateMe({
      name: "Updated Name From Test",
    });

    // 4. Change password
    const passwordResult = await api.updateMyPassword(
      "password123",
      "testpassword123",
      "testpassword123"
    );

    // 5. Verify all changes
    const finalProfile = await api.getMe();

    console.log("✅ Complete profile workflow successful!");

    return {
      success: true,
      workflow: {
        originalProfile: profile.data.data,
        updatedProfile: updatedProfile.data.user,
        passwordChanged: true,
        finalProfile: finalProfile.data.data,
      },
    };
  } catch (error) {
    console.error("❌ Profile workflow failed:", error.message);
    return { success: false, error: error.message };
  }
}

// Export new test functions
window.testProfileManagement = testProfileManagement;
window.testPasswordChange = testPasswordChange;
window.testCompleteProfileWorkflow = testCompleteProfileWorkflow;

console.log("🧪 Review test functions loaded!");
console.log("📋 Available functions:");
console.log("- testUpdateReview()");
console.log("- testDeleteReview()");
console.log("- testCompleteReviewWorkflow()");
console.log("👤 NEW: Profile management functions:");
console.log("- testProfileManagement()");
console.log("- testPasswordChange()");
console.log("- testCompleteProfileWorkflow()");

/*
================================================================================
📱 FRONTEND USAGE EXAMPLES - READY TO COPY & PASTE
================================================================================

1. 🔐 AUTHENTICATION FLOW:
--------------------------

// Login workflow
const loginUser = async (email, password) => {
  try {
    const result = await api.login(email, password);
    console.log('Login successful:', result.data.user);
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
};

// Signup workflow
const signupUser = async (userData) => {
  try {
    const result = await api.signup({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      passwordConfirm: userData.passwordConfirm
    });
    
    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    window.location.href = '/login';
  } catch (error) {
    alert('Signup failed: ' + error.message);
  }
};

2. 📚 COURSE LEARNING FLOW:
---------------------------

// Browse courses for university students
const loadCoursesPage = async () => {
  try {
    const courses = await api.getCourses({
      targetAudience: 'university_student',
      page: 1,
      limit: 10
    });
    
    return courses.data.data; // Array of courses
  } catch (error) {
    console.error('Failed to load courses:', error);
    return [];
  }
};

// Enroll in course
const enrollInCourse = async (courseId) => {
  try {
    await api.enrollInCourse(courseId);
    alert('Đăng ký khóa học thành công!');
    
    // Redirect to my courses
    window.location.href = '/my-courses';
  } catch (error) {
    alert('Enrollment failed: ' + error.message);
  }
};

// View my enrolled courses
const loadMyCourses = async () => {
  try {
    const response = await api.getMyCourses();
    return response.data.enrollments.map(enrollment => ({
      ...enrollment.course,
      enrolledAt: enrollment.createdAt
    }));
  } catch (error) {
    console.error('Failed to load my courses:', error);
    return [];
  }
};

// Read course content (enrolled users only)
const openCourseContent = async (courseId) => {
  try {
    const response = await api.getCourseContent(courseId);
    const course = response.data.course;
    
    // Display content in modal or new page
    showCourseReader({
      title: course.name,
      content: course.content,
      author: course.author,
      enrolledAt: response.data.enrollment.enrolledAt
    });
  } catch (error) {
    if (error.message.includes('đăng ký khóa học')) {
      alert('Bạn cần đăng ký khóa học trước khi xem nội dung');
    } else {
      alert('Failed to load course content: ' + error.message);
    }
  }
};

// Submit course review
const submitCourseReview = async (courseId, reviewText, rating) => {
  try {
    await api.reviewCourse(courseId, reviewText, rating);
    alert('Đánh giá thành công!');
    
    // Refresh course page to show new review
    window.location.reload();
  } catch (error) {
    alert('Review submission failed: ' + error.message);
  }
};

3. 👤 PROFILE MANAGEMENT FLOW:
------------------------------

// Load user profile page
const loadProfilePage = async () => {
  try {
    const response = await api.getMe();
    const user = response.data.data;
    
    // Populate form fields
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('photo').src = user.photo;
    
    // Show strikes/ban status if any
    if (user.appointmentProfile?.strikes > 0) {
      showWarning(`Cảnh cáo: ${user.appointmentProfile.strikes}/3`);
    }
    
    return user;
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
};

// Update profile information
const updateProfile = async (formData) => {
  try {
    const response = await api.updateMe({
      name: formData.name,
      email: formData.email,
      photo: formData.photo
    });
    
    alert('Cập nhật thông tin thành công!');
    
    // Update localStorage
    const currentUser = api.getCurrentUser();
    localStorage.setItem('user', JSON.stringify({
      ...currentUser,
      ...response.data.user
    }));
    
    return response.data.user;
  } catch (error) {
    alert('Update failed: ' + error.message);
  }
};

// Change password
const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  try {
    const response = await api.updateMyPassword(
      currentPassword,
      newPassword, 
      confirmPassword
    );
    
    alert('Đổi mật khẩu thành công!');
    
    // Update token in localStorage
    api.setToken(response.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
  } catch (error) {
    if (error.message.includes('không đúng')) {
      alert('Mật khẩu hiện tại không đúng');
    } else {
      alert('Password change failed: ' + error.message);
    }
  }
};

4. 📅 APPOINTMENT BOOKING FLOW:
-------------------------------

// Complete appointment booking workflow
const bookAppointment = async () => {
  try {
    // Step 1: Get consultants
    const consultantsResult = await api.appointmentBookingWorkflow();
    if (!consultantsResult.success) {
      throw new Error(consultantsResult.error);
    }
    
    const consultants = consultantsResult.consultants;
    
    // Step 2: Show consultant selection UI
    const selectedConsultantId = await showConsultantSelection(consultants);
    
    // Step 3: Get available slots
    const availabilityResult = await api.getConsultantAvailability(selectedConsultantId);
    if (!availabilityResult.success) {
      throw new Error(availabilityResult.error);
    }
    
    const slots = availabilityResult.slots;
    
    // Step 4: Show time slot selection UI
    const selectedSlotId = await showTimeSlotSelection(slots);
    
    // Step 5: Book appointment
    const bookingResult = await api.completeBooking(selectedSlotId);
    if (!bookingResult.success) {
      throw new Error(bookingResult.error);
    }
    
    alert('Đặt lịch hẹn thành công!');
    return bookingResult.appointment;
    
  } catch (error) {
    if (error.message.includes('409') || error.message.includes('đã được đặt')) {
      alert('Khung giờ này đã được đặt, vui lòng chọn khung giờ khác');
    } else if (error.message.includes('2 lịch cùng lúc')) {
      alert('Bạn đã đặt tối đa 2 lịch hẹn. Vui lòng hủy lịch cũ trước khi đặt mới.');
    } else if (error.message.includes('khoá chức năng')) {
      alert('Tài khoản bị tạm khóa đặt lịch do vi phạm. Vui lòng liên hệ admin.');
    } else {
      alert('Booking failed: ' + error.message);
    }
  }
};

// View my appointments
const loadMyAppointments = async () => {
  try {
    const response = await api.getMyBookings();
    return response.data.appointments;
  } catch (error) {
    console.error('Failed to load appointments:', error);
    return [];
  }
};

// Cancel appointment with proper error handling
const cancelAppointment = async (slotId) => {
  try {
    const response = await api.cancelAppointmentSlot(slotId);
    alert(response.message); // Shows remaining cancellations
    
    // Refresh appointments list
    window.location.reload();
  } catch (error) {
    if (error.message.includes('hết lượt hủy')) {
      alert('Hôm nay bạn đã hết lượt hủy (3/3). Thử lại vào ngày mai.');
    } else if (error.message.includes('đợi') && error.message.includes('tiếng')) {
      const timeMatch = error.message.match(/(\d+) tiếng (\d+) phút/);
      if (timeMatch) {
        alert(`Bạn cần đợi ${timeMatch[1]}h${timeMatch[2]}m nữa để hủy lịch tiếp theo`);
      }
    } else {
      alert('Cancel failed: ' + error.message);
    }
  }
};

5. 📝 SURVEY ASSESSMENT FLOW:
-----------------------------

// Load and take survey
const takeSurvey = async (surveyId) => {
  try {
    // Get survey questions
    const survey = await api.getSurvey(surveyId);
    const questions = survey.data.data.questions;
    
    // Show survey UI and collect answers
    const answers = await showSurveyQuestions(questions);
    
    // Submit survey
    const result = await api.submitSurveyResult(surveyId, answers);
    const surveyResult = result.data.result;
    
    // Show results and recommendations
    showSurveyResults({
      score: surveyResult.totalScore,
      recommendation: surveyResult.recommendation,
      riskLevel: getRiskLevel(surveyResult.totalScore)
    });
    
    return surveyResult;
  } catch (error) {
    alert('Survey submission failed: ' + error.message);
  }
};

const getRiskLevel = (score) => {
  if (score <= 3) return 'LOW';
  if (score <= 26) return 'MEDIUM';
  return 'HIGH';
};

6. 🎯 ERROR HANDLING HELPERS:
-----------------------------

// Global error handler for API calls
const handleApiError = (error, context = '') => {
  console.error(`API Error (${context}):`, error);
  
  if (error.message.includes('Session expired')) {
    alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
    window.location.href = '/login';
  } else if (error.message.includes('403')) {
    alert('Bạn không có quyền thực hiện hành động này.');
  } else if (error.message.includes('404')) {
    alert('Không tìm thấy dữ liệu yêu cầu.');
  } else {
    alert(`Lỗi: ${error.message}`);
  }
};

// Check authentication before sensitive operations
const requireAuth = () => {
  if (!api.isAuthenticated()) {
    alert('Vui lòng đăng nhập để sử dụng tính năng này.');
    window.location.href = '/login';
    return false;
  }
  return true;
};

// Check user role
const requireRole = (requiredRole) => {
  if (!api.hasRole(requiredRole)) {
    alert('Bạn không có quyền truy cập tính năng này.');
    return false;
  }
  return true;
};

7. 🔧 UTILITY FUNCTIONS:
------------------------

// Format date for display
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN');
};

// Show loading state
const withLoading = async (asyncFunction, loadingElement) => {
  loadingElement.style.display = 'block';
  try {
    return await asyncFunction();
  } finally {
    loadingElement.style.display = 'none';
  }
};

// Debounce search
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

8. 🎨 UI HELPER EXAMPLES:
-------------------------

// Show consultant selection modal
const showConsultantSelection = (consultants) => {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div class="modal">
        <h3>Chọn chuyên viên tư vấn</h3>
        ${consultants.map(consultant => `
          <div class="consultant-card" onclick="selectConsultant('${consultant._id}')">
            <img src="${consultant.photo}" alt="${consultant.name}">
            <h4>${consultant.name}</h4>
            <p>${consultant.email}</p>
          </div>
        `).join('')}
      </div>
    `;
    
    document.body.appendChild(modal);
    
    window.selectConsultant = (consultantId) => {
      document.body.removeChild(modal);
      resolve(consultantId);
    };
  });
};

// Show course content reader
const showCourseReader = (courseData) => {
  const modal = document.createElement('div');
  modal.innerHTML = `
    <div class="course-reader">
      <header>
        <h2>${courseData.title}</h2>
        <p>Tác giả: ${courseData.author.name}</p>
        <button onclick="closeCourseReader()">Đóng</button>
      </header>
      <div class="content">
        <pre>${courseData.content}</pre>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  window.closeCourseReader = () => {
    document.body.removeChild(modal);
  };
};

================================================================================
🚀 READY FOR MOBILE DEVELOPMENT!

Frontend team có thể:
✅ Copy-paste các function trên để tích hợp nhanh
✅ Customize UI theo design của mobile app
✅ Test từng workflow riêng biệt
✅ Handle errors properly với user feedback

📱 Next Steps:
1. Setup authentication flow
2. Implement course browsing & learning
3. Add profile management
4. Build appointment booking system
5. Integrate survey assessment

💡 Tips:
- Luôn check api.isAuthenticated() trước khi gọi protected endpoints
- Sử dụng try-catch cho tất cả API calls
- Update localStorage khi user data thay đổi
- Implement proper loading states
================================================================================
*/

export default api;
