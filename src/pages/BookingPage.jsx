import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getConsultants, getAvailableSlots, bookAppointmentSlot } from '../api/BookingAPI';
import '../styles/BookingPage.scss';

// Dữ liệu mẫu fallback (sử dụng khi API thất bại hoàn toàn)
const fallbackConsultants = [
    {
        id: 'fallback-1',
        name: 'Chuyên gia dự phòng',
        specialization: 'Tư vấn chung',
        experience: '5 năm',
        description: 'Chuyên gia hỗ trợ tạm thời khi hệ thống gặp sự cố',
        image: 'https://via.placeholder.com/150',
        rating: 4
    }
];

const BookingPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        consultationType: '',
        preferredDate: '',
        preferredTime: '',
        urgency: '',
        description: '',
        isAnonymous: false
    });

    const [consultants, setConsultants] = useState([]);
    const [selectedConsultant, setSelectedConsultant] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [token] = useState(localStorage.getItem('token') || '');

    const consultationTypes = [
        { value: 'prevention', label: 'Tư vấn phòng chống ma túy' },
        { value: 'detection', label: 'Nhận biết dấu hiệu sử dụng ma túy' },
        { value: 'intervention', label: 'Can thiệp cho người nghiện' },
        { value: 'family', label: 'Tư vấn gia đình có người nghiện' },
        { value: 'recovery', label: 'Hỗ trợ cai nghiện và tái hòa nhập' },
        { value: 'education', label: 'Giáo dục phòng chống ma túy' }
    ];

    const urgencyLevels = [
        { value: 'low', label: 'Không khẩn cấp', color: 'success' },
        { value: 'medium', label: 'Cần tư vấn sớm', color: 'warning' },
        { value: 'high', label: 'Khẩn cấp', color: 'danger' }
    ];

    // Hàm format thời gian chuẩn hóa
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    // Hàm thử lại API với số lần retry tối đa
    const retryFetch = async (fn, retries = 3, delay = 1000) => {
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    };

    // Lấy danh sách chuyên gia
    useEffect(() => {
        const fetchConsultants = async () => {
            if (!token) {
                toast.error('Vui lòng đăng nhập để xem danh sách chuyên gia');
                setConsultants(fallbackConsultants);
                return;
            }

            setLoading(true);
            try {
                const response = await retryFetch(() => getConsultants(token));
                if (response.status === 'success' && Array.isArray(response.data.consultantsList)) {
                    const mappedConsultants = response.data.consultantsList.map(consultant => ({
                        id: consultant._id,
                        name: consultant.name || 'Chưa cung cấp tên',
                        specialization: consultant.specialization || 'Tư vấn phòng chống ma túy',
                        experience: consultant.experience || 'Không xác định',
                        description: consultant.description || 'Chuyên gia hỗ trợ tư vấn chuyên sâu',
                        image: consultant.photo || 'https://via.placeholder.com/150',
                        rating: consultant.rating || 0
                    }));
                    setConsultants(mappedConsultants);
                    if (mappedConsultants.length === 0) {
                        toast.warn('Không có chuyên gia nào khả dụng');
                        setConsultants(fallbackConsultants);
                    }
                } else {
                    toast.error('Dữ liệu chuyên gia không hợp lệ: ' + (response.message || 'Lỗi không xác định'));
                    setConsultants(fallbackConsultants);
                }
            } catch (error) {
                toast.error('Lỗi kết nối khi lấy danh sách chuyên gia');
                console.error('Error fetching consultants:', error);
                setConsultants(fallbackConsultants);
            } finally {
                setLoading(false);
            }
        };

        fetchConsultants();
    }, [token]);

    // Lấy slot khả dụng khi chọn chuyên gia và ngày
    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (selectedConsultant && token && formData.preferredDate) {
                console.log('Fetching available slots with:', {
                    consultantId: selectedConsultant.id,
                    date: formData.preferredDate,
                    token: token.substring(0, 10) + '...' // Chỉ log 10 ký tự đầu của token để bảo mật
                });

                setSlotsLoading(true);
                try {
                    const response = await retryFetch(() =>
                        getAvailableSlots(selectedConsultant.id, formData.preferredDate, token)
                    );
                    console.log('Raw response from getAvailableSlots:', response);

                    if (response.status === 'success' && Array.isArray(response.data.slots)) {
                        const slots = response.data.slots;
                        console.log('Available slots after filtering:', slots);
                        setAvailableSlots(slots);
                        if (slots.length === 0) {
                            console.log('No slots available for date:', formData.preferredDate);
                            toast.warn(`Không có slot khả dụng cho ngày ${formData.preferredDate}`);
                        }
                    } else {
                        console.log('Invalid response from getAvailableSlots:', response);
                        toast.error('Không thể lấy slot khả dụng');
                        setAvailableSlots([]);
                    }
                } catch (error) {
                    console.error('Error fetching available slots:', error);
                    toast.error('Lỗi khi lấy slot khả dụng: ' + error.message);
                    setAvailableSlots([]);
                } finally {
                    setSlotsLoading(false);
                }
            } else {
                console.log('Not fetching slots. Missing:', {
                    hasConsultant: !!selectedConsultant,
                    hasToken: !!token,
                    hasDate: !!formData.preferredDate
                });
                setAvailableSlots([]);
            }
        };

        fetchAvailableSlots();
    }, [selectedConsultant, formData.preferredDate, token]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log('Input changed:', { name, value: type === 'checkbox' ? checked : value });
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
            ...(name === 'preferredDate' ? { preferredTime: '' } : {})
        }));
    };

    const handleConsultantSelect = (consultant) => {
        console.log('Consultant selected:', consultant);
        setSelectedConsultant(consultant);
        setFormData(prev => ({ ...prev, preferredDate: '', preferredTime: '' }));
        setAvailableSlots([]); // Reset slots khi chọn consultant mới
        toast.success(`Đã chọn chuyên gia: ${consultant.name}`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error('Vui lòng đăng nhập để đặt lịch');
            return;
        }

        if (!selectedConsultant) {
            toast.error('Vui lòng chọn chuyên gia tư vấn');
            return;
        }

        if (!formData.fullName || !formData.phone || !formData.consultationType) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        if (!formData.preferredDate || !formData.preferredTime) {
            toast.error('Vui lòng chọn ngày và giờ mong muốn');
            return;
        }

        console.log('Form data on submit:', formData);
        console.log('Available slots for submit:', availableSlots);

        const selectedSlot = availableSlots.find(slot => {
            const slotTime = formatTime(slot.startTime);
            return slotTime === formData.preferredTime;
        });

        if (!selectedSlot) {
            console.log('No matching slot found for:', {
                preferredDate: formData.preferredDate,
                preferredTime: formData.preferredTime
            });
            toast.error('Không tìm thấy slot phù hợp. Vui lòng chọn lại thời gian.');
            return;
        }

        console.log('Selected slot for booking:', selectedSlot);

        try {
            const response = await bookAppointmentSlot(selectedSlot._id, token);
            console.log('Booking response:', response);
            if (response.status === 'success') {
                toast.success('Đặt lịch tư vấn thành công! Chúng tôi sẽ liên hệ sớm nhất.');
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    age: '',
                    gender: '',
                    consultationType: '',
                    preferredDate: '',
                    preferredTime: '',
                    urgency: '',
                    description: '',
                    isAnonymous: false
                });
                setSelectedConsultant(null);
                setAvailableSlots([]);
            } else {
                toast.error('Đặt lịch thất bại: ' + (response.message || 'Lỗi không xác định'));
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            toast.error('Lỗi khi đặt lịch tư vấn: ' + error.message);
        }
    };

    return (
        <div className="booking-page">
            <div className="container">
                {/* Header */}
                <div className="booking-header">
                    <h1>Tư Vấn Phòng Chống Ma Túy</h1>
                    <p>Đội ngũ chuyên gia giàu kinh nghiệm sẵn sàng hỗ trợ bạn 24/7</p>
                </div>

                <div className="booking-content">
                    {/* Consultants Section */}
                    <div className="consultants-section">
                        <h2>Chọn Chuyên Gia Tư Vấn</h2>
                        {loading ? (
                            <div className="loading">Đang tải danh sách chuyên gia...</div>
                        ) : consultants.length === 0 ? (
                            <div className="no-data">Không có chuyên gia nào khả dụng</div>
                        ) : (
                            <div className="consultants-grid">
                                {consultants.map(consultant => (
                                    <div
                                        key={consultant.id}
                                        className={`consultant-card ${selectedConsultant?.id === consultant.id ? 'selected' : ''}`}
                                        onClick={() => handleConsultantSelect(consultant)}
                                    >
                                        <div className="consultant-image">
                                            <img src={consultant.image} alt={consultant.name} />
                                            <div className="rating">
                                                <i className="bi bi-star-fill"></i>
                                                <span>{consultant.rating}</span>
                                            </div>
                                        </div>
                                        <div className="consultant-info">
                                            <h3>{consultant.name}</h3>
                                            <p className="specialization">{consultant.specialization}</p>
                                            <p className="experience">{consultant.experience}</p>
                                            <p className="description">{consultant.description}</p>
                                            <div className="available-slots">
                                                <span>Giờ trống:</span>
                                                <div className="slots">
                                                    {slotsLoading && selectedConsultant?.id === consultant.id ? (
                                                        <span>Đang tải slot...</span>
                                                    ) : (availableSlots.length > 0 && selectedConsultant?.id === consultant.id) ? (
                                                        availableSlots.map(slot => (
                                                            <span key={slot._id} className="slot">
                                                                {formatTime(slot.startTime)}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span>Chọn để xem slot</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Booking Form */}
                    <div className="booking-form-section">
                        <h2>Thông Tin Đặt Lịch</h2>
                        <form onSubmit={handleSubmit} className="booking-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="fullName">Họ và tên *</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Nhập họ và tên"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Số điện thoại *</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Nhập email (không bắt buộc)"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="age">Tuổi</label>
                                    <input
                                        type="number"
                                        id="age"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        min="1"
                                        max="100"
                                        placeholder="Nhập tuổi"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="gender">Giới tính</label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                        <option value="other">Khác</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="consultationType">Loại tư vấn *</label>
                                    <select
                                        id="consultationType"
                                        name="consultationType"
                                        value={formData.consultationType}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Chọn loại tư vấn</option>
                                        {consultationTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="preferredDate">Ngày mong muốn</label>
                                    <input
                                        type="date"
                                        id="preferredDate"
                                        name="preferredDate"
                                        value={formData.preferredDate}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="preferredTime">Giờ mong muốn</label>
                                    <select
                                        id="preferredTime"
                                        name="preferredTime"
                                        value={formData.preferredTime}
                                        onChange={handleInputChange}
                                        disabled={slotsLoading || !formData.preferredDate || availableSlots.length === 0}
                                        required
                                    >
                                        <option value="">Chọn giờ</option>
                                        {availableSlots.map(slot => (
                                            <option key={slot._id} value={formatTime(slot.startTime)}>
                                                {formatTime(slot.startTime)}
                                            </option>
                                        ))}
                                    </select>
                                    {formData.preferredDate && !slotsLoading && availableSlots.length === 0 && (
                                        <p className="no-slots-message">Không có slot khả dụng cho ngày này</p>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="urgency">Mức độ khẩn cấp</label>
                                <div className="urgency-options">
                                    {urgencyLevels.map(level => (
                                        <label key={level.value} className="urgency-option">
                                            <input
                                                type="radio"
                                                name="urgency"
                                                value={level.value}
                                                checked={formData.urgency === level.value}
                                                onChange={handleInputChange}
                                            />
                                            <span className={`urgency-badge bg-${level.color}`}>
                                                {level.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Mô tả tình huống</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    placeholder="Mô tả chi tiết tình huống cần tư vấn..."
                                />
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="isAnonymous"
                                        checked={formData.isAnonymous}
                                        onChange={handleInputChange}
                                    />
                                    <span>Tôi muốn tư vấn ẩn danh</span>
                                </label>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg"
                                    disabled={slotsLoading || !formData.preferredTime}
                                >
                                    <i className="bi bi-calendar-check"></i>
                                    Đặt Lịch Tư Vấn
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Emergency Contact */}
                    <div className="emergency-section">
                        <div className="emergency-card">
                            <div className="emergency-icon">
                                <i className="bi bi-telephone-fill"></i>
                            </div>
                            <div className="emergency-content">
                                <h3>Khẩn Cấp?</h3>
                                <p>Gọi ngay đường dây nóng tư vấn phòng chống ma túy</p>
                                <a href="tel:1900-1234" className="emergency-phone">
                                    1900-1234
                                </a>
                                <p className="emergency-note">Hỗ trợ 24/7, miễn phí và bảo mật</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;