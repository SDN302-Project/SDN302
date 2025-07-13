# 🚀 PREVENTION API - FRONTEND INTEGRATION GUIDE

## 📖 Tổng quan

API hệ thống hỗ trợ phòng ngừa sử dụng ma túy với các tính năng chính:

- Authentication & Authorization (3 roles: member, consultant, admin)
- Quản lý khóa học và đăng ký với nội dung text-based learning
- Hệ thống khảo sát đánh giá rủi ro
- Blog chia sẻ kinh nghiệm
- Review và đánh giá
- **🎯 HỆ THỐNG ĐẶT LỊCH HẸN HOÀN CHỈNH VỚI CHUYÊN VIÊN TƯ VẤN**

## 🌐 Base URLs

- **Production:** `https://prevention-api-tdt.onrender.com/api/v1`
- **Development:** `http://localhost:8001/api/v1`

---

## 👥 ROLES SYSTEM (🆕 ĐƠN GIẢN HÓA)

### **3 Roles chính:**

- **`member`** - Người dùng cuối (sinh viên)
- **`consultant`** - Chuyên viên tư vấn
- **`admin`** - Quản trị viên

### **Permissions:**

```javascript
member: [
  "view_courses",
  "enroll_courses",
  "take_surveys",
  "book_appointments",
  "write_reviews",
];
consultant: [
  "manage_schedule",
  "mark_noshow",
  "create_blogs",
  "view_client_history",
];
admin: ["manage_users", "manage_content", "view_analytics", "system_config"];
```

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

## 📚 2. COURSE ENDPOINTS (🆕 CẬP NHẬT)

### 2.1 Lấy danh sách khóa học (Public)

```http
GET /courses
```

**Query Parameters:**

- `page`: Trang hiện tại (default: 1)
- `limit`: Số lượng items per page (default: 100)
- `sort`: Sắp xếp (-createdAt, name, duration)
- `targetAudience`: Lọc theo đối tượng (student, university_student, parent, teacher)

**Success Response (200):**

```json
{
  "status": "success",
  "results": 5,
  "data": {
    "data": [
      {
        "_id": "648abc123def456789",
        "name": "Nhận thức về ma túy cho sinh viên",
        "description": "Khóa học giúp sinh viên nhận biết tác hại của ma túy...",
        "topics": ["nhận thức", "phòng tránh", "kỹ năng từ chối"],
        "targetAudience": "university_student",
        "duration": 120,
        "author": {
          "name": "Dr. Nguyễn Văn A",
          "photo": "doctor.jpg"
        },
        "isPublished": true,
        "createdAt": "2025-07-01T08:00:00.000Z"
      }
    ]
  }
}
```

### 2.2 Lấy chi tiết khóa học (Public)

```http
GET /courses/:id
```

### 2.3 Lấy nội dung khóa học (🆕 CHỈ CHO ENROLLED USERS)

```http
GET /courses/:id/content
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Business Rules:**

- ⚠️ Phải đã đăng ký khóa học
- ⚠️ User phải đăng nhập

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "course": {
      "_id": "648abc123def456789",
      "name": "Nhận thức về ma túy cho sinh viên",
      "description": "Mô tả khóa học...",
      "topics": ["nhận thức", "phòng tránh", "kỹ năng từ chối"],
      "duration": 120,
      "content": "# Chương 1: Tổng quan về ma túy\n\nMa túy là những chất gây nghiện...\n\n# Chương 2: Tác hại của ma túy\n\nViệc sử dụng ma túy gây ra những tác hại nghiêm trọng...\n\n# Chương 3: Kỹ năng phòng tránh\n\n1. Nhận biết dấu hiệu...\n2. Từ chối một cách lịch sự...",
      "author": {
        "name": "Dr. Nguyễn Văn A",
        "photo": "doctor.jpg"
      }
    },
    "enrollment": {
      "enrolledAt": "2025-07-01T10:00:00.000Z"
    }
  }
}
```

**Error Response (403):**

```json
{
  "status": "fail",
  "message": "Bạn cần đăng ký khóa học trước khi xem nội dung"
}
```

### 2.4 Đăng ký khóa học

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

### 2.5 Lấy khóa học đã đăng ký (🆕 MY COURSES)

```http
GET /enrollments/my-courses
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
    "enrollments": [
      {
        "_id": "enrollment_id_123",
        "course": {
          "_id": "course_id_123",
          "name": "Nhận thức về ma túy cho sinh viên",
          "description": "Mô tả khóa học...",
          "duration": 120,
          "topics": ["nhận thức", "phòng tránh"],
          "targetAudience": "university_student",
          "author": {
            "name": "Dr. Nguyễn Văn A",
            "photo": "doctor.jpg"
          }
        },
        "createdAt": "2025-07-01T10:00:00.000Z"
      }
    ]
  }
}
```

### 2.6 Đánh giá khóa học

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

### 2.7 Lấy đánh giá của khóa học

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

## 📅 5. APPOINTMENT SYSTEM ENDPOINTS (🆕 HOÀN CHỈNH)

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
      "startTime": "2025-07-20T09:00:00.000Z",
      "endTime": "2025-07-20T10:00:00.000Z"
    },
    {
      "startTime": "2025-07-20T10:00:00.000Z",
      "endTime": "2025-07-20T11:00:00.000Z"
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
        "startTime": "2025-07-20T09:00:00.000Z",
        "endTime": "2025-07-20T10:00:00.000Z",
        "status": "available",
        "createdAt": "2025-07-09T08:00:00.000Z"
      }
    ]
  }
}
```

### 5.2 Xem tất cả slots của consultant (Consultant only)

```http
GET /appointment-slots/my-slots
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Success Response (200):**

```json
{
  "status": "success",
  "results": 5,
  "data": {
    "slots": [
      {
        "_id": "648abc123def456789",
        "consultant": "648abc123def456788",
        "startTime": "2025-07-20T09:00:00.000Z",
        "endTime": "2025-07-20T10:00:00.000Z",
        "status": "booked",
        "bookedBy": {
          "_id": "648abc123def456790",
          "name": "Nguyễn Văn A",
          "email": "user@example.com",
          "photo": "default.jpg"
        },
        "bookedAt": "2025-07-09T10:00:00.000Z",
        "isNoShow": false
      }
    ]
  }
}
```

### 5.3 Xem khung thời gian khả dụng của consultant (Public)

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
        "startTime": "2025-07-20T09:00:00.000Z",
        "endTime": "2025-07-20T10:00:00.000Z",
        "status": "available"
      }
    ]
  }
}
```

### 5.4 Đặt lịch hẹn (Member only) 🆕

```http
PATCH /appointment-slots/:slotId/book
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Business Rules:**

- ⚠️ Phải đặt trước ít nhất 30 phút
- ⚠️ Tối đa 2 lịch hẹn cùng lúc
- ⚠️ Tài khoản không bị ban

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Đặt lịch thành công!",
  "data": {
    "appointment": {
      "_id": "648abc123def456789",
      "consultant": "648abc123def456788",
      "startTime": "2025-07-20T09:00:00.000Z",
      "endTime": "2025-07-20T10:00:00.000Z",
      "status": "booked",
      "bookedBy": "648abc123def456790",
      "bookedAt": "2025-07-09T10:00:00.000Z"
    }
  }
}
```

**Error Responses:**

```json
// 403 - Banned user
{
  "status": "fail",
  "message": "Bạn đã tạm thời bị khoá chức năng đặt lịch hẹn."
}

// 403 - Too many bookings
{
  "status": "fail",
  "message": "Bạn chỉ được đặt 2 lịch cùng lúc"
}

// 403 - Too close to appointment time
{
  "status": "fail",
  "message": "Bạn cần đặt lịch trước ít nhất 30 phút. Vui lòng chọn slot khác hoặc thử lại sau."
}

// 409 - Slot conflict
{
  "status": "fail",
  "message": "Rất tiếc, khung giờ này vừa có người khác đặt hoặc không tồn tại."
}
```

### 5.5 Hủy lịch hẹn (Member only) 🆕

```http
PATCH /appointment-slots/:slotId/cancel
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Business Rules:**

- ⚠️ **Daily Limit:** Tối đa 3 lần hủy/ngày
- ⚠️ **Cooldown:** 2 tiếng giữa các lần hủy (khi cancel > 3h trước hẹn)
- ⚠️ **Strikes System:** Hủy < 3h trước hẹn có thể nhận cảnh cáo
- ⚠️ **Grace Period:** 30 phút đầu sau booking không bị cảnh cáo (nếu book < 3h trước hẹn)

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Hủy lịch thành công! Còn 2 lần hủy hôm nay. Có thể hủy tiếp sau 2 tiếng.",
  "data": {
    "slotUpdated": {
      "_id": "648abc123def456789",
      "status": "available",
      "cancelledAt": "2025-07-09T11:00:00.000Z"
    }
  }
}
```

**Error Responses:**

```json
// 429 - Daily limit exceeded
{
  "status": "fail",
  "message": "Hôm nay bạn đã hết lượt hủy đặt lịch (3/3). Vui lòng thử lại vào ngày mai."
}

// 429 - Cooldown active
{
  "status": "fail",
  "message": "Bạn cần đợi 1 tiếng 30 phút nữa để có thể hủy lịch tiếp theo"
}

// 403 - Not your appointment
{
  "status": "fail",
  "message": "Bạn chỉ có thể hủy lịch hẹn của mình"
}
```

### 5.6 Xem lịch hẹn đã đặt (Member only) 🆕

```http
GET /appointment-slots/my-bookings
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
    "appointments": [
      {
        "_id": "648abc123def456789",
        "consultant": {
          "_id": "648abc123def456788",
          "name": "Dr. Nguyễn Văn B",
          "email": "consultant@example.com",
          "photo": "consultant.jpg"
        },
        "startTime": "2025-07-20T09:00:00.000Z",
        "endTime": "2025-07-20T10:00:00.000Z",
        "status": "booked",
        "bookedAt": "2025-07-09T10:00:00.000Z",
        "isNoShow": false
      }
    ]
  }
}
```

### 5.7 Đánh dấu No-Show (Consultant only) 🆕

```http
PATCH /appointment-slots/:slotId/mark-no-show
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Business Rules:**

- ⚠️ **+2 Strikes** cho user không đến hẹn
- ⚠️ **Auto-ban 7 ngày** nếu đạt 3 strikes
- ⚠️ Chỉ consultant của slot mới có quyền đánh dấu

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Đã đánh dấu no-show. User nhận 2 cảnh cáo (2/3).",
  "data": {
    "slot": {
      "_id": "648abc123def456789",
      "isNoShow": true
    },
    "userStatus": {
      "strikes": 2,
      "isBanned": false,
      "banUntil": null
    }
  }
}
```

**Error Responses:**

```json
// 403 - Not your slot
{
  "status": "fail",
  "message": "Bạn chỉ có thể đánh dấu no-show cho slot của mình"
}

// 400 - Already marked
{
  "status": "fail",
  "message": "Slot này đã được đánh dấu no-show rồi"
}
```

---

## 👥 6. USER ENDPOINTS

### 6.1 Lấy danh sách consultant (Public) 🆕

```http
GET /users/consultants
```

**Headers:**

```
Authorization: Bearer jwt_token
```

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "consultantsList": [
      {
        "_id": "648abc123def456788",
        "name": "Dr. Nguyễn Văn B",
        "email": "consultant@example.com",
        "photo": "consultant.jpg"
      }
    ]
  }
}
```

### 6.2 Lấy thông tin user hiện tại

```http
GET /users/:id
```

**Headers:**

```
Authorization: Bearer jwt_token
```

### 6.3 Lấy danh sách tất cả users (Admin only)

```http
GET /users
```

**Headers:**

```
Authorization: Bearer jwt_token
```

### 6.4 Xóa user (Admin only)

```http
DELETE /users/:id
```

**Headers:**

```
Authorization: Bearer jwt_token
```

---

## 🛡️ 7. STRIKES & BAN SYSTEM (🆕 HOÀN CHỈNH)

### **How Strikes Work:**

#### **Strike Scenarios:**

```javascript
// +1 Strike: Cancel appointment < 3 hours before start time
//   (Grace period: 30 minutes after booking if booked < 3h before)

// +2 Strikes: No-show (marked by consultant)

// 3 Strikes = Auto-ban 7 days + Reset strikes to 0
```

#### **Daily Limits:**

```javascript
// Cancel Limits:
// - 3 cancellations per day
// - 2 hours cooldown between cancellations (when canceling > 3h before)

// Booking Limits:
// - Maximum 2 active appointments at once
// - Must book at least 30 minutes in advance
```

#### **Ban System:**

```javascript
// Auto-ban conditions:
// - Accumulate 3 strikes
// - Ban duration: 7 days
// - Auto-reset: Ban expires + strikes reset to 0

// Ban prevents:
// - Booking new appointments
// - All appointment-related actions
```

### **Frontend Strike Display:**

```javascript
// User dashboard should show:
{
  "currentStrikes": 1,
  "maxStrikes": 3,
  "dailyCancellations": 2,
  "maxDailyCancellations": 3,
  "isBanned": false,
  "banUntil": null,
  "nextCancelAvailable": "2025-07-09T13:00:00.000Z"
}
```

---

## 🔄 8. ERROR HANDLING & STATUS CODES

### **New Error Codes:**

```json
// 429 - Too Many Requests (Rate Limiting)
{
  "status": "fail",
  "message": "Hôm nay bạn đã hết lượt hủy đặt lịch (3/3). Vui lòng thử lại vào ngày mai."
}

// 429 - Cooldown Active
{
  "status": "fail",
  "message": "Bạn cần đợi 1 tiếng 30 phút nữa để có thể hủy lịch tiếp theo"
}

// 403 - User Banned
{
  "status": "fail",
  "message": "Bạn đã tạm thời bị khoá chức năng đặt lịch hẹn."
}
```

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

## 📱 9. FRONTEND IMPLEMENTATION EXAMPLES (🆕 CẬP NHẬT)

### **Complete Appointment Booking Flow:**

```javascript
// 1. Get consultants
const consultants = await api.getConsultants();

// 2. Get available slots for selected consultant
const slots = await api.getAvailableSlots(selectedConsultantId);

// 3. Book appointment
const booking = await api.bookAppointmentSlot(selectedSlotId);
```

### **Appointment Management Flow:**

```javascript
// Member: View my bookings
const myBookings = await api.getMyBookings();

// Member: Cancel appointment (with error handling)
try {
  const result = await api.cancelAppointmentSlot(slotId);
  alert(result.message); // Success message with remaining cancellations
} catch (error) {
  if (error.message.includes("429")) {
    // Rate limited - show cooldown time or daily limit
    alert("Bạn đã hết lượt hủy hoặc cần chờ cooldown");
  }
}

// Consultant: View my schedule
const mySlots = await api.getMySlots();

// Consultant: Mark no-show
const noShowResult = await api.markNoShow(slotId);
```

### **Error Handling for Strikes System:**

```javascript
const handleBookingError = (error) => {
  const message = error.message;

  if (message.includes("khoá chức năng đặt lịch")) {
    // User is banned
    showBanNotification(user.banUntil);
  } else if (message.includes("2 lịch cùng lúc")) {
    // Too many active bookings
    showBookingLimitWarning();
  } else if (message.includes("30 phút")) {
    // Too close to appointment time
    showTimeWarning();
  } else if (message.includes("409")) {
    // Slot conflict
    refreshAvailableSlots();
  }
};

const handleCancelError = (error) => {
  const message = error.message;

  if (message.includes("hết lượt hủy")) {
    // Daily limit reached
    showDailyLimitMessage();
  } else if (message.includes("đợi") && message.includes("tiếng")) {
    // Cooldown active
    const timeMatch = message.match(/(\d+) tiếng (\d+) phút/);
    if (timeMatch) {
      showCooldownTimer(timeMatch[1], timeMatch[2]);
    }
  }
};
```

### **User Status Dashboard:**

```javascript
const UserAppointmentStatus = () => {
  const [userStatus, setUserStatus] = useState(null);

  const fetchUserStatus = async () => {
    // Get current user appointment status
    const user = api.getCurrentUser();
    const bookings = await api.getMyBookings();

    setUserStatus({
      activeBookings: bookings.data.appointments.length,
      maxBookings: 2,
      isBanned: user.appointmentProfile?.isBanned || false,
      strikes: user.appointmentProfile?.strikes || 0,
      banUntil: user.appointmentProfile?.banUntil,
    });
  };

  return (
    <div className="user-status">
      {userStatus?.isBanned && (
        <Alert type="error">
          Tài khoản bị khóa đặt lịch đến:{" "}
          {new Date(userStatus.banUntil).toLocaleDateString()}
        </Alert>
      )}

      <div className="status-grid">
        <StatusCard
          title="Lịch hẹn hiện tại"
          value={`${userStatus?.activeBookings || 0}/2`}
          warning={userStatus?.activeBookings >= 2}
        />

        <StatusCard
          title="Cảnh cáo"
          value={`${userStatus?.strikes || 0}/3`}
          warning={userStatus?.strikes >= 2}
        />
      </div>
    </div>
  );
};
```

---

## 🧪 10. TESTING ENDPOINTS (🆕 CẬP NHẬT)

### **Test Complete Appointment Flow:**

```bash
# 1. Login as member
curl -X POST https://prevention-api-tdt.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"member@example.com","password":"password123"}'

# 2. Get consultants
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://prevention-api-tdt.onrender.com/api/v1/users/consultants

# 3. Get available slots
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://prevention-api-tdt.onrender.com/api/v1/appointment-slots/consultant/CONSULTANT_ID

# 4. Book appointment
curl -X PATCH https://prevention-api-tdt.onrender.com/api/v1/appointment-slots/SLOT_ID/book \
  -H "Authorization: Bearer YOUR_TOKEN"

# 5. View my bookings
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://prevention-api-tdt.onrender.com/api/v1/appointment-slots/my-bookings

# 6. Cancel appointment
curl -X PATCH https://prevention-api-tdt.onrender.com/api/v1/appointment-slots/SLOT_ID/cancel \
  -H "Authorization: Bearer YOUR_TOKEN"

# 7. Consultant mark no-show
curl -X PATCH https://prevention-api-tdt.onrender.com/api/v1/appointment-slots/SLOT_ID/mark-no-show \
  -H "Authorization: Bearer CONSULTANT_TOKEN"
```

---

## 🎯 COMPLETE USER JOURNEY (🆕 CẬP NHẬT)

### **Low Risk User Journey:**

```
Survey → Low Risk Score → Blog Reading → Stay Informed
```

### **Medium Risk User Journey:**

```
Survey → Medium Risk Score → Course Recommendation →
Enroll → Complete Course → Review Course
```

### **High Risk User Journey:**

```
Survey → High Risk Score → Appointment Recommendation →
Get Consultants → Select Consultant → View Available Slots →
Book Appointment → Attend Meeting → (Possible Follow-up Bookings)
```

### **Consultant Journey:**

```
Login → Create Weekly Schedule → View Bookings →
Conduct Appointments → Mark No-Shows (if any) →
Manage Schedule → Create Blog Content
```

---

## 📱 MOBILE APP COURSE LEARNING FLOW (🆕)

### **Simple Text-Based Learning cho Sinh Viên:**

#### **1. Course Discovery:**

```javascript
// Get courses by target audience
const courses = await api.getCourses({
  targetAudience: "university_student",
  page: 1,
  limit: 10,
});
```

#### **2. Course Enrollment:**

```javascript
// Enroll in course
const enrollment = await api.enrollInCourse(courseId);

// Get my courses
const myCourses = await api.getMyCourses();
```

#### **3. Course Learning:**

```javascript
// Access course content (only for enrolled users)
const courseContent = await api.getCourseContent(courseId);

// Display content in mobile app
<ScrollView>
  <Text style={styles.title}>{courseContent.data.course.name}</Text>
  <Text style={styles.content}>{courseContent.data.course.content}</Text>

  <Button
    title="Hoàn thành khóa học"
    onPress={() => markAsCompleted(courseId)}
  />
</ScrollView>;
```

#### **4. Course Review:**

```javascript
// After completing course
const review = await api.reviewCourse(courseId, "Khóa học rất bổ ích!", 5);
```

---

## 📱 FRONTEND SDK CẬP NHẬT (🆕)

### **Course Methods:**

```javascript
// Basic course operations
await api.getCourses(params);
await api.getCourse(courseId);
await api.enrollInCourse(courseId);

// NEW: Course content & my courses
await api.getCourseContent(courseId); // 🆕 Lấy nội dung để đọc
await api.getMyCourses(); // 🆕 Khóa học đã đăng ký

// Reviews
await api.reviewCourse(courseId, review, rating);
await api.getCourseReviews(courseId);
```

### **Complete Course Learning Workflow:**

```javascript
const CourseWorkflow = {
  // 1. Browse courses
  async browseCourses() {
    return await api.getCourses({
      targetAudience: "university_student",
    });
  },

  // 2. Enroll in course
  async enrollCourse(courseId) {
    return await api.enrollInCourse(courseId);
  },

  // 3. Access learning content
  async startLearning(courseId) {
    return await api.getCourseContent(courseId);
  },

  // 4. View my courses
  async viewMyCourses() {
    return await api.getMyCourses();
  },

  // 5. Complete and review
  async completeCourse(courseId, review, rating) {
    return await api.reviewCourse(courseId, review, rating);
  },
};
```

---

## 🧪 TESTING COURSE ENDPOINTS (🆕)

### **Test Course Learning Flow:**

```bash
# 1. Login as student
curl -X POST https://prevention-api-tdt.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password123"}'

# 2. Browse courses
curl https://prevention-api-tdt.onrender.com/api/v1/courses?targetAudience=university_student

# 3. Get course details
curl https://prevention-api-tdt.onrender.com/api/v1/courses/COURSE_ID

# 4. Enroll in course
curl -X POST https://prevention-api-tdt.onrender.com/api/v1/courses/COURSE_ID/enrollments \
  -H "Authorization: Bearer YOUR_TOKEN"

# 5. Access course content (enrolled users only)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://prevention-api-tdt.onrender.com/api/v1/courses/COURSE_ID/content

# 6. View my enrolled courses
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://prevention-api-tdt.onrender.com/api/v1/enrollments/my-courses

# 7. Submit review
curl -X POST https://prevention-api-tdt.onrender.com/api/v1/courses/COURSE_ID/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"review":"Khóa học rất bổ ích!","rating":5}'
```

---

## 🎯 COMPLETE USER JOURNEYS (🆕 CẬP NHẬT)

### **Sinh Viên Learning Journey:**

```
1. Browse Courses → Filter by university_student
2. View Course Details → Read description & topics
3. Enroll in Course → Confirm enrollment
4. Access Course Content → Read text-based learning material
5. Complete Learning → Mark as completed
6. Write Review → Rate & review experience
7. View My Courses → Track learning progress
```

### **Content Structure cho Courses:**

```json
{
  "course": {
    "name": "Nhận thức về ma túy cho sinh viên",
    "content": "# Chương 1: Tổng quan\n\nNội dung chi tiết...\n\n# Chương 2: Tác hại\n\nVí dụ thực tế...\n\n# Chương 3: Phòng tránh\n\nKỹ năng cần thiết..."
  }
}
```

---

## 📞 SUPPORT & UPDATES

### **Latest Changes (9/7/2025):**

1. **🔧 Simplified Roles:** Giảm từ 6 roles xuống 3 roles chính
2. **📚 Enhanced Course System:** Thêm content field cho text-based learning
3. **🆕 New Endpoints:** `/courses/:id/content`, `/enrollments/my-courses`
4. **🔄 Routes Optimization:** Sửa lỗi typo và cải thiện route structure
5. **📱 Mobile-Ready:** Tối ưu cho mobile app development

### **Breaking Changes:**

- ❌ Removed roles: `guest`, `staff`, `manager`
- ✅ Simplified to: `member`, `consultant`, `admin`
- 🆕 Course content chỉ accessible cho enrolled users

---

**Last Updated:** 9/7/2025 - Course System Enhancement & Role Simplification
