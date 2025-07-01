# 🚀 PREVENTION API - FRONTEND INTEGRATION GUIDE

## 📖 Tổng quan
API hệ thống hỗ trợ phòng ngừa sử dụng ma túy với các tính năng chính:
- Authentication & Authorization
- Quản lý khóa học và đăng ký
- Hệ thống khảo sát đánh giá rủi ro
- Blog chia sẻ kinh nghiệm
- Review và đánh giá
- **Hệ thống đặt lịch hẹn với chuyên viên tư vấn**

## 🌐 Base URLs
- **Production:** `https://prevention-api-tdt.onrender.com/api/v1`
- **Development:** `http://localhost:8001/api/v1`

---

## 🔐 1. AUTHENTICATION ENDPOINTS

### 1.1 Đăng ký tài khoản
```http
POST /auth/signup
```

**Request Body:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Success Response (201):**
```json
{
  "status": "success"
}
```

**Frontend Usage:**
```javascript
const signup = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
};
```

### 1.2 Đăng nhập
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "token": "jwt_token_here",
  "data": {
    "user": {
      "_id": "648abc123def456789",
      "name": "Nguyễn Văn A",
      "email": "user@example.com",
      "role": "member",
      "photo": "default.jpg"
    }
  }
}
```

### 1.3 Đăng nhập Google
```http
POST /auth/google-login
```

**Request Body:**
```json
{
  "token": "google_oauth_token"
}
```

### 1.4 Quên mật khẩu
```http
POST /auth/forgotPassword
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### 1.5 Reset mật khẩu
```http
PATCH /auth/resetPassword/:token
```

**Request Body:**
```json
{
  "password": "newPassword123",
  "passwordConfirm": "newPassword123"
}
```

---

## 📚 2. COURSE ENDPOINTS

### 2.1 Lấy danh sách khóa học (Public)
```http
GET /courses
```

**Query Parameters:**
- `page`: Trang hiện tại (default: 1)
- `limit`: Số lượng items per page (default: 100)
- `sort`: Sắp xếp (-createdAt, name, duration)
- `targetAudience`: Lọc theo đối tượng (student, university_student, parent, teacher)

**Example:** `/courses?targetAudience=student&limit=10&page=1`

**Success Response (200):**
```json
{
  "status": "success",
  "results": 5,
  "data": {
    "data": [
      {
        "_id": "648abc123def456789",
        "name": "Nhận thức về ma túy cho học sinh",
        "description": "Khóa học giúp học sinh nhận biết tác hại của ma túy",
        "topics": ["awareness", "prevention"],
        "targetAudience": "student",
        "duration": 120,
        "author": "648abc123def456788",
        "createdAt": "2024-01-15T08:00:00.000Z"
      }
    ]
  }
}
```

### 2.2 Lấy chi tiết khóa học (Public)
```http
GET /courses/:id
```

### 2.3 Đăng ký khóa học (Cần đăng nhập)
```http
POST /courses/:courseId/enrollments
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "data": {
      "_id": "648abc123def456790",
      "course": "648abc123def456789",
      "user": "648abc123def456791",
      "createdAt": "2024-01-15T09:00:00.000Z"
    }
  }
}
```

### 2.4 Lấy danh sách đăng ký của khóa học
```http
GET /courses/:courseId/enrollments
```

### 2.5 Đánh giá khóa học (Phải đã đăng ký)
```http
POST /courses/:courseId/reviews
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Request Body:**
```json
{
  "review": "Khóa học rất hay và bổ ích",
  "rating": 5
}
```

### 2.6 Lấy đánh giá của khóa học
```http
GET /courses/:courseId/reviews
```

---

## 📝 3. SURVEY ENDPOINTS

### 3.1 Lấy danh sách khảo sát
```http
GET /surveys
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Success Response (200):**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "data": [
      {
        "_id": "648abc123def456789",
        "name": "ASSIST - Screening Tool",
        "description": "Công cụ sàng lọc mức độ rủi ro sử dụng chất",
        "questions": [
          {
            "text": "Bạn có từng sử dụng thuốc lá không?",
            "options": [
              { "text": "Không bao giờ", "score": 0 },
              { "text": "1-2 lần", "score": 2 },
              { "text": "Thường xuyên", "score": 4 }
            ]
          }
        ],
        "author": "648abc123def456788"
      }
    ]
  }
}
```

### 3.2 Lấy chi tiết khảo sát
```http
GET /surveys/:id
```

**Headers:**
```
Authorization: Bearer jwt_token
```

### 3.3 Submit kết quả khảo sát
```http
POST /surveys/:id/submit
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Request Body:**
```json
{
  "answers": [
    {
      "questionIndex": 0,
      "optionIndex": 1
    },
    {
      "questionIndex": 1,
      "optionIndex": 0
    }
  ]
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "result": {
      "_id": "648abc123def456792",
      "survey": "648abc123def456789",
      "user": "648abc123def456791",
      "answer": [
        {
          "questionText": "Bạn có từng sử dụng thuốc lá không?",
          "chosenOptionText": "1-2 lần",
          "score": 2
        }
      ],
      "totalScore": 2,
      "recommendation": "Nguy cơ thấp. Hãy tiếp tục duy trì lối sống lành mạnh...",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

---

## 📰 4. BLOG ENDPOINTS

### 4.1 Lấy danh sách blog (Public)
```http
GET /blogs
```

**Success Response (200):**
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "data": [
      {
        "_id": "648abc123def456789",
        "title": "5 cách nhận biết dấu hiệu sử dụng ma túy",
        "content": "Nội dung bài viết...",
        "imageCover": "blog-image-1.jpg",
        "author": "648abc123def456788"
      }
    ]
  }
}
```

### 4.2 Lấy chi tiết blog (Public)
```http
GET /blogs/:id
```

---

## 📅 5. APPOINTMENT SYSTEM ENDPOINTS

### 5.1 Tạo khung thời gian khả dụng (Consultant only)
```http
POST /appointment-slots/my-slots
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Request Body:**
```json
{
  "slots": [
    {
      "startTime": "2025-06-20T09:00:00.000Z",
      "endTime": "2025-06-20T10:00:00.000Z"
    },
    {
      "startTime": "2025-06-20T10:00:00.000Z", 
      "endTime": "2025-06-20T11:00:00.000Z"
    }
  ]
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "slots": [
      {
        "_id": "648abc123def456789",
        "consultant": "648abc123def456788",
        "startTime": "2025-06-20T09:00:00.000Z",
        "endTime": "2025-06-20T10:00:00.000Z",
        "status": "available",
        "createdAt": "2025-06-18T08:00:00.000Z"
      }
    ]
  }
}
```

### 5.2 Xem khung thời gian khả dụng của consultant
```http
GET /appointment-slots/consultant/:consultantId
```

**Success Response (200):**
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "slots": [
      {
        "_id": "648abc123def456789",
        "consultant": "648abc123def456788",
        "startTime": "2025-06-20T09:00:00.000Z",
        "endTime": "2025-06-20T10:00:00.000Z",
        "status": "available"
      }
    ]
  }
}
```

### 5.3 Đặt lịch hẹn (Member only)
```http
PATCH /appointment-slots/:slotId/book
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Đặt lịch thành công!",
  "data": {
    "appointment": {
      "_id": "648abc123def456789",
      "consultant": "648abc123def456788",
      "startTime": "2025-06-20T09:00:00.000Z",
      "endTime": "2025-06-20T10:00:00.000Z",
      "status": "booked"
    }
  }
}
```

**Error Response (409):**
```json
{
  "status": "fail",
  "message": "Rất tiếc, khung giờ này vừa có người khác đặt hoặc không tồn tại."
}
```

---

## 👥 6. USER ENDPOINTS

### 6.1 Lấy thông tin user hiện tại
```http
GET /users/:id
```

**Headers:**
```
Authorization: Bearer jwt_token
```

### 6.2 Lấy danh sách tất cả users (Admin only)
```http
GET /users
```

**Headers:**
```
Authorization: Bearer jwt_token
```

### 6.3 Xóa user (Admin only)
```http
DELETE /users/:id
```

**Headers:**
```
Authorization: Bearer jwt_token
```

---

## 🛡️ 7. AUTHENTICATION HELPERS

### Token Management
```javascript
const API_BASE_URL = "https://prevention-api-tdt.onrender.com/api/v1";

// Store token after login
const storeAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

// Get stored token
const getToken = () => localStorage.getItem("token");

// Get current user
const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Check if authenticated
const isAuthenticated = () => !!getToken();

// Logout
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Make authenticated request
const authenticatedFetch = async (endpoint, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    logout();
    window.location.href = "/login";
  }

  return response.json();
};
```

---

## 🎭 8. USER ROLES & PERMISSIONS

### Roles Available:
- `guest`: Khách (chỉ xem)
- `member`: Thành viên (đăng ký khóa học, làm khảo sát, review, đặt lịch hẹn)
- `staff`: Nhân viên
- `consultant`: Chuyên viên tư vấn (tạo blog, tạo khung giờ làm việc)
- `manager`: Quản lý (tạo khóa học)
- `admin`: Quản trị viên (toàn quyền)

---

## 🔄 9. ERROR HANDLING

### Common Error Responses:
```json
// 400 - Validation Error
{
  "status": "fail",
  "message": "Dữ liệu nhập vào không hợp lệ. Email đã được sử dụng"
}

// 401 - Authentication Error
{
  "status": "fail",
  "message": "Bạn chưa đăng nhập"
}

// 403 - Authorization Error
{
  "status": "fail",
  "message": "Bạn không có quyền thực hiện hành động này"
}

// 404 - Not Found
{
  "status": "fail",
  "message": "Không tìm thấy document với ID này"
}

// 409 - Conflict (Appointment booking)
{
  "status": "fail",
  "message": "Rất tiếc, khung giờ này vừa có người khác đặt hoặc không tồn tại."
}

// 500 - Server Error
{
  "status": "error",
  "message": "Đã có sự cố xảy ra từ hệ thống!"
}
```

---

## 📱 10. FRONTEND IMPLEMENTATION EXAMPLES

### Complete Login Flow:
```javascript
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === "success") {
        storeAuth(data.token, data.data.user);
        window.location.href = "/dashboard";
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
};
```

### Course Enrollment Flow:
```javascript
const enrollInCourse = async (courseId) => {
  try {
    const response = await authenticatedFetch(
      `/courses/${courseId}/enrollments`,
      {
        method: "POST",
      }
    );

    if (response.status === "success") {
      alert("Đăng ký khóa học thành công!");
    }
  } catch (error) {
    alert("Không thể đăng ký khóa học");
  }
};
```

### Survey Submission Flow:
```javascript
const submitSurvey = async (surveyId, answers) => {
  try {
    const response = await authenticatedFetch(`/surveys/${surveyId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    });

    if (response.status === "success") {
      const { totalScore, recommendation } = response.data.result;
      showSurveyResults(totalScore, recommendation);
    }
  } catch (error) {
    alert("Không thể submit khảo sát");
  }
};
```

### Appointment Booking Flow:
```javascript
// Get available slots for a consultant
const getAvailableSlots = async (consultantId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointment-slots/consultant/${consultantId}`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data.slots;
    }
  } catch (error) {
    alert('Không thể lấy lịch khả dụng');
  }
};

// Book an appointment slot
const bookAppointment = async (slotId) => {
  try {
    const response = await authenticatedFetch(`/appointment-slots/${slotId}/book`, {
      method: 'PATCH'
    });
    
    if (response.status === 'success') {
      alert('Đặt lịch hẹn thành công!');
      return response.data.appointment;
    }
  } catch (error) {
    if (error.message.includes('409')) {
      alert('Khung giờ này đã được đặt, vui lòng chọn khung giờ khác');
    } else {
      alert('Không thể đặt lịch hẹn');
    }
  }
};

// Create slots (for consultants)
const createTimeSlots = async (slots) => {
  try {
    const response = await authenticatedFetch('/appointment-slots/my-slots', {
      method: 'POST',
      body: JSON.stringify({ slots })
    });
    
    if (response.status === 'success') {
      alert('Tạo khung giờ thành công!');
      return response.data.slots;
    }
  } catch (error) {
    alert('Không thể tạo khung giờ');
  }
};
```

---

## 🧪 11. TESTING ENDPOINTS

### Sử dụng curl để test:

```bash
# Login
curl -X POST https://prevention-api-tdt.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get courses
curl https://prevention-api-tdt.onrender.com/api/v1/courses

# Get available slots for consultant
curl https://prevention-api-tdt.onrender.com/api/v1/appointment-slots/consultant/CONSULTANT_ID

# Create time slots (consultant only)
curl -X POST https://prevention-api-tdt.onrender.com/api/v1/appointment-slots/my-slots \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"slots":[{"startTime":"2025-06-20T09:00:00.000Z","endTime":"2025-06-20T10:00:00.000Z"}]}'

# Book appointment slot
curl -X PATCH https://prevention-api-tdt.onrender.com/api/v1/appointment-slots/SLOT_ID/book \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 📞 SUPPORT

Nếu có vấn đề trong quá trình integration:
1. Kiểm tra status code và error message
2. Verify token trong localStorage
3. Check network tab trong DevTools
4. **Appointment booking:** Check for 409 conflicts
5. Liên hệ backend team để debug

---

## 🎯 COMPLETE USER JOURNEY

### **Low Risk User:**
```
Survey → Low Risk Score → Blog Content → Stay Informed
```

### **Medium Risk User:**
```
Survey → Medium Risk Score → Course Recommendation → Enroll → Learn → Review
```

### **High Risk User:**
```
Survey → High Risk Score → Appointment Recommendation → 
View Consultants → Select Consultant → View Available Slots → 
Book Appointment → Get Professional Help
```

---

**🎉 Happy Coding! Chúc frontend team implement thành công!**
