import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Prevention from '../images/Prevention.jpg';
import GroupSession from '../images/groupsession.jpg';
import Image1 from '../images/Image1.jpg';
import Image2 from '../images/Image2.jpg';
import Image3 from '../images/Image3.jpg';
import SupportHug from '../images/supporthug.jpg';
import '../styles/AssessmentPage.scss';

const AssessmentPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const navigate = useNavigate();

    const assessments = [
        {
            id: 1,
            title: "Kiến thức cơ bản về ma túy",
            category: "basic",
            description: "Bài kiểm tra về các loại ma túy cơ bản, tác hại và cách nhận biết",
            duration: "15 phút",
            questions: "20 câu trắc nghiệm + 2 câu tự luận",
            difficulty: "Dễ",
            image: Prevention
        },
        {
            id: 2,
            title: "Phòng chống ma túy trong học đường",
            category: "school",
            description: "Kiểm tra kiến thức về phòng chống ma túy trong môi trường học tập",
            duration: "20 phút",
            questions: "25 câu trắc nghiệm + 3 câu tự luận",
            difficulty: "Trung bình",
            image: GroupSession
        },
        {
            id: 3,
            title: "Tác hại của ma túy đối với sức khỏe",
            category: "health",
            description: "Bài kiểm tra về tác động của ma túy đến cơ thể và tâm lý",
            duration: "18 phút",
            questions: "22 câu trắc nghiệm + 2 câu tự luận",
            difficulty: "Trung bình",
            image: Image1
        },
        {
            id: 4,
            title: "Kỹ năng từ chối ma túy",
            category: "skills",
            description: "Kiểm tra khả năng ứng phó và từ chối khi bị rủ rê sử dụng ma túy",
            duration: "25 phút",
            questions: "30 câu trắc nghiệm + 4 câu tự luận",
            difficulty: "Khó",
            image: Image2
        },
        {
            id: 5,
            title: "Luật pháp về ma túy",
            category: "law",
            description: "Bài kiểm tra về các quy định pháp luật liên quan đến ma túy",
            duration: "12 phút",
            questions: "15 câu trắc nghiệm + 1 câu tự luận",
            difficulty: "Dễ",
            image: Image3
        },
        {
            id: 6,
            title: "Hỗ trợ người nghiện ma túy",
            category: "support",
            description: "Kiểm tra kiến thức về cách hỗ trợ và điều trị cho người nghiện",
            duration: "22 phút",
            questions: "28 câu trắc nghiệm + 3 câu tự luận",
            difficulty: "Khó",
            image: SupportHug
        }
    ];

    const categories = [
        { id: 'all', name: 'Tất cả' },
        { id: 'basic', name: 'Kiến thức cơ bản' },
        { id: 'school', name: 'Học đường' },
        { id: 'health', name: 'Sức khỏe' },
        { id: 'skills', name: 'Kỹ năng' },
        { id: 'law', name: 'Pháp luật' },
        { id: 'support', name: 'Hỗ trợ' }
    ];

    const filteredAssessments = selectedCategory === 'all' 
        ? assessments 
        : assessments.filter(assessment => assessment.category === selectedCategory);

    const getDifficultyColor = (difficulty) => {
        switch(difficulty) {
            case 'Dễ': return 'success';
            case 'Trung bình': return 'warning';
            case 'Khó': return 'danger';
            default: return 'secondary';
        }
    };

    return (
        <div className="assessment-page">
            <div className="container">
                {/* Header */}
                <div className="assessment-header">
                    <h1>Bài Kiểm Tra Phòng Chống Ma Túy</h1>
                    <p>Chọn bài kiểm tra phù hợp để đánh giá kiến thức của bạn về phòng chống ma túy</p>
                </div>

                {/* Category Filter */}
                <div className="category-filter">
                    <div className="filter-buttons">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Assessment Grid */}
                <div className="assessment-grid">
                    {filteredAssessments.map(assessment => (
                        <div key={assessment.id} className="assessment-card">
                            <div className="card-image">
                                <img src={assessment.image} alt={assessment.title} />
                                <div className="difficulty-badge">
                                    <span className={`badge bg-${getDifficultyColor(assessment.difficulty)}`}>
                                        {assessment.difficulty}
                                    </span>
                                </div>
                            </div>
                            <div className="card-content">
                                <h3>{assessment.title}</h3>
                                <p className="description">{assessment.description}</p>
                                <div className="assessment-info">
                                    <div className="info-item">
                                        <i className="bi bi-clock"></i>
                                        <span>{assessment.duration}</span>
                                    </div>
                                    <div className="info-item">
                                        <i className="bi bi-question-circle"></i>
                                        <span>{assessment.questions}</span>
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button 
                                        className="btn btn-primary start-btn"
                                        onClick={() => navigate(`/quiz/${assessment.id}`)}
                                    >
                                        Bắt đầu kiểm tra
                                    </button>
                                    <button className="btn btn-outline-secondary preview-btn">
                                        Xem trước
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredAssessments.length === 0 && (
                    <div className="empty-state">
                        <i className="bi bi-search"></i>
                        <h3>Không tìm thấy bài kiểm tra</h3>
                        <p>Hãy thử chọn danh mục khác hoặc quay lại trang chủ</p>
                        <Link to="/" className="btn btn-primary">Về trang chủ</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssessmentPage; 