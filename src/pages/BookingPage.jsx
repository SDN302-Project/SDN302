import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Image1 from '../images/Image1.jpg';
import Image2 from '../images/Image2.jpg';
import Image3 from '../images/Image3.jpg';
import '../styles/BookingPage.scss';

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

    const [selectedConsultant, setSelectedConsultant] = useState(null);

    const consultants = [
        {
            id: 1,
            name: "TS. Nguyễn Văn An",
            specialization: "Chuyên gia tâm lý học",
            experience: "15 năm kinh nghiệm",
            description: "Chuyên tư vấn về phòng chống ma túy và hỗ trợ người nghiện",
            image: Image1,
            rating: 4.9,
            availableSlots: ["09:00", "14:00", "16:00"]
        },
        {
            id: 2,
            name: "BS. Trần Thị Bình",
            specialization: "Bác sĩ chuyên khoa tâm thần",
            experience: "12 năm kinh nghiệm",
            description: "Chuyên điều trị và tư vấn cho người nghiện ma túy",
            image: Image2,
            rating: 4.8,
            availableSlots: ["10:00", "15:00", "17:00"]
        },
        {
            id: 3,
            name: "ThS. Lê Văn Cường",
            specialization: "Chuyên gia công tác xã hội",
            experience: "10 năm kinh nghiệm",
            description: "Tư vấn phòng chống ma túy trong cộng đồng và học đường",
            image: Image3,
            rating: 4.7,
            availableSlots: ["08:00", "13:00", "18:00"]
        }
    ];

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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleConsultantSelect = (consultant) => {
        setSelectedConsultant(consultant);
        toast.success(`Đã chọn chuyên gia: ${consultant.name}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedConsultant) {
            toast.error('Vui lòng chọn chuyên gia tư vấn');
            return;
        }

        if (!formData.fullName || !formData.phone || !formData.consultationType) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        // Mock API call
        setTimeout(() => {
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
        }, 1000);
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
                                                {consultant.availableSlots.map(slot => (
                                                    <span key={slot} className="slot">{slot}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="preferredTime">Giờ mong muốn</label>
                                    <select
                                        id="preferredTime"
                                        name="preferredTime"
                                        value={formData.preferredTime}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Chọn giờ</option>
                                        <option value="08:00">08:00</option>
                                        <option value="09:00">09:00</option>
                                        <option value="10:00">10:00</option>
                                        <option value="13:00">13:00</option>
                                        <option value="14:00">14:00</option>
                                        <option value="15:00">15:00</option>
                                        <option value="16:00">16:00</option>
                                        <option value="17:00">17:00</option>
                                        <option value="18:00">18:00</option>
                                    </select>
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
                                <button type="submit" className="btn btn-primary btn-lg">
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