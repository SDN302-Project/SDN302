// BookingAPI.js - API cho hệ thống đặt lịch hẹn
// Tham khảo chi tiết endpoint tại FRONTEND_APPOINTMENT_API.md

const BASE_URL = "https://prevention-api-tdt.onrender.com/api/v1";

// Hàm xử lý response chung
const handleResponse = async (res) => {
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || `HTTP error! Status: ${res.status}`);
    }
    return data;
};

// Lấy danh sách consultant (cần token)
export async function getConsultants(token) {
    if (!token) throw new Error("Token is required");
    const res = await fetch(`${BASE_URL}/users/consultants`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return handleResponse(res);
}

// Lấy slot khả dụng của 1 consultant (public)
export async function getAvailableSlots(consultantId, token) {
    if (!token || !consultantId) throw new Error("Token và consultantId là bắt buộc");
    const res = await fetch(`${BASE_URL}/appointment-slots/consultants/${consultantId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return handleResponse(res);
}

// Đặt lịch hẹn (member only)
export async function bookAppointmentSlot(slotId, token) {
    if (!token || !slotId) throw new Error("Token và slotId là bắt buộc");
    const res = await fetch(`${BASE_URL}/appointment-slots/${slotId}/book`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return handleResponse(res);
}

// Hủy lịch hẹn (member only)
export async function cancelAppointmentSlot(slotId, token) {
    if (!token || !slotId) throw new Error("Token và slotId là bắt buộc");
    const res = await fetch(`${BASE_URL}/appointment-slots/${slotId}/cancel`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return handleResponse(res);
}

// Lấy lịch hẹn đã đặt của user (member only)
export async function getMyBookings(token) {
    if (!token) throw new Error("Token là bắt buộc");
    const res = await fetch(`${BASE_URL}/appointment-slots/my-bookings`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return handleResponse(res);
}

// Lấy danh sách slot đã hủy của user (member only)
export async function getMyCancelledSlots(token) {
    if (!token) throw new Error("Token là bắt buộc");
    const res = await fetch(`${BASE_URL}/appointment-slots/my-cancelled-slots`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return handleResponse(res);
}

// Đặt lại lịch hẹn sau khi consultant hủy (member only)
export async function rebookAppointment(originalSlotId, newSlotId, token) {
    if (!token || !originalSlotId || !newSlotId) throw new Error("Token, originalSlotId, newSlotId là bắt buộc");
    const res = await fetch(`${BASE_URL}/appointment-slots/${originalSlotId}/rebook`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ newSlotId }),
    });
    return handleResponse(res);
}

// Đánh dấu slot đã được xử lý sau khi consultant hủy (member only)
export async function markSlotProcessed(slotId, token) {
    if (!token || !slotId) throw new Error("Token và slotId là bắt buộc");
    const res = await fetch(`${BASE_URL}/appointment-slots/${slotId}/mark-processed`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return handleResponse(res);
}

// Consultant: Tạo các slot thời gian (consultant only)
export async function createMySlots(slots, token) {
    if (!token || !Array.isArray(slots) || slots.length === 0) throw new Error("Token và danh sách slots là bắt buộc");
    const res = await fetch(`${BASE_URL}/appointment-slots/my-slots`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ slots }),
    });
    return handleResponse(res);
}

// Consultant: Lấy slot của mình (consultant only)
export async function getMySlots(token) {
    if (!token) throw new Error("Token là bắt buộc");
    const res = await fetch(`${BASE_URL}/appointment-slots/my-slots`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return handleResponse(res);
}

// Consultant: Xóa slot của mình (chỉ slot available)
export async function deleteMySlot(slotId, token) {
    if (!token || !slotId) throw new Error("Token và slotId là bắt buộc");
    const res = await fetch(`${BASE_URL}/appointment-slots/my-slots/${slotId}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return handleResponse(res);
}

// Consultant: Đánh dấu member không đến (no-show)
export async function markNoShow(slotId, token) {
    if (!token || !slotId) throw new Error("Token và slotId là bắt buộc");
    const res = await fetch(`${BASE_URL}/appointment-slots/${slotId}/mark-no-show`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return handleResponse(res);
}

// Consultant: Hủy slot đã được đặt (consultant only)
export async function consultantCancelSlot(slotId, reason, token) {
    if (!token || !slotId || !reason) throw new Error("Token, slotId, reason là bắt buộc");
    const res = await fetch(`${BASE_URL}/appointment-slots/${slotId}/consultant-cancel`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
    });
    return handleResponse(res);
}

// Consultant: Xem trạng thái penalty
export async function getMyPenaltyStatus(token) {
    if (!token) throw new Error("Token là bắt buộc");
    const res = await fetch(`${BASE_URL}/appointment-slots/my-penalty-status`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return handleResponse(res);
}