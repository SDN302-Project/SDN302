import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/QuizPage.scss';

const QuizPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Mock data cho bài kiểm tra
    const quizData = {
        1: {
            title: "Kiến thức cơ bản về ma túy",
            duration: 15 * 60, // 15 phút
            questions: [
                {
                    id: 1,
                    type: 'multiple_choice',
                    question: "Ma túy là gì?",
                    options: [
                        "Chất kích thích có nguồn gốc tự nhiên",
                        "Chất gây nghiện được sử dụng trong y tế",
                        "Chất gây nghiện bị cấm sử dụng",
                        "Tất cả các đáp án trên"
                    ],
                    correctAnswer: 3
                },
                {
                    id: 2,
                    type: 'multiple_choice',
                    question: "Loại ma túy nào được coi là 'ma túy đá'?",
                    options: [
                        "Heroin",
                        "Methamphetamine",
                        "Cocaine",
                        "Cần sa"
                    ],
                    correctAnswer: 1
                },
                {
                    id: 3,
                    type: 'multiple_choice',
                    question: "Dấu hiệu nào KHÔNG phải là biểu hiện của người sử dụng ma túy?",
                    options: [
                        "Mắt đỏ, đồng tử giãn",
                        "Thay đổi thói quen sinh hoạt",
                        "Tăng cân nhanh chóng",
                        "Thường xuyên vay tiền"
                    ],
                    correctAnswer: 2
                },
                {
                    id: 4,
                    type: 'essay',
                    question: "Hãy mô tả 3 tác hại chính của ma túy đối với sức khỏe con người.",
                    maxWords: 200
                },
                {
                    id: 5,
                    type: 'essay',
                    question: "Bạn sẽ làm gì nếu phát hiện bạn bè mình có dấu hiệu sử dụng ma túy?",
                    maxWords: 300
                }
            ]
        }
    };

    const currentQuiz = quizData[id];
    const totalQuestions = currentQuiz?.questions.length || 0;

    useEffect(() => {
        if (currentQuiz) {
            setTimeLeft(currentQuiz.duration);
        }
    }, [currentQuiz]);

    useEffect(() => {
        if (timeLeft > 0 && !isSubmitted) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, isSubmitted]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleNext = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        setShowResults(true);
    };

    const calculateScore = () => {
        let correctAnswers = 0;
        let totalMultipleChoice = 0;

        currentQuiz.questions.forEach(q => {
            if (q.type === 'multiple_choice') {
                totalMultipleChoice++;
                if (answers[q.id] === q.correctAnswer) {
                    correctAnswers++;
                }
            }
        });

        return {
            correct: correctAnswers,
            total: totalMultipleChoice,
            percentage: Math.round((correctAnswers / totalMultipleChoice) * 100)
        };
    };

    if (!currentQuiz) {
        return (
            <div className="quiz-page">
                <div className="container">
                    <div className="error-message">
                        <h2>Không tìm thấy bài kiểm tra</h2>
                        <button onClick={() => navigate('/assestment')} className="btn btn-primary">
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = currentQuiz.questions[currentQuestion];

    return (
        <div className="quiz-page">
            <div className="container">
                {/* Header */}
                <div className="quiz-header">
                    <div className="quiz-info">
                        <h1>{currentQuiz.title}</h1>
                        <div className="progress-info">
                            <span>Câu hỏi {currentQuestion + 1} / {totalQuestions}</span>
                        </div>
                    </div>
                    <div className="timer">
                        <i className="bi bi-clock"></i>
                        <span className={timeLeft < 300 ? 'warning' : ''}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-container">
                    <div 
                        className="progress-bar" 
                        style={{width: `${((currentQuestion + 1) / totalQuestions) * 100}%`}}
                    ></div>
                </div>

                {!showResults ? (
                    <>
                        {/* Question */}
                        <div className="question-container">
                            <div className="question-header">
                                <span className="question-number">Câu {currentQuestion + 1}</span>
                                <span className="question-type">
                                    {currentQ.type === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'}
                                </span>
                            </div>
                            
                            <div className="question-content">
                                <h3>{currentQ.question}</h3>
                                
                                {currentQ.type === 'multiple_choice' ? (
                                    <div className="options">
                                        {currentQ.options.map((option, index) => (
                                            <label key={index} className="option">
                                                <input
                                                    type="radio"
                                                    name={`question-${currentQ.id}`}
                                                    value={index}
                                                    checked={answers[currentQ.id] === index}
                                                    onChange={() => handleAnswerChange(currentQ.id, index)}
                                                />
                                                <span className="option-text">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="essay-input">
                                        <textarea
                                            placeholder="Nhập câu trả lời của bạn..."
                                            value={answers[currentQ.id] || ''}
                                            onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                                            rows={6}
                                            maxLength={currentQ.maxWords * 10}
                                        />
                                        <div className="word-count">
                                            Tối đa {currentQ.maxWords} từ
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="quiz-navigation">
                            <button 
                                className="btn btn-outline-primary"
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                            >
                                <i className="bi bi-arrow-left"></i>
                                Câu trước
                            </button>
                            
                            <div className="question-dots">
                                {currentQuiz.questions.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`dot ${index === currentQuestion ? 'active' : ''} ${answers[currentQuiz.questions[index].id] ? 'answered' : ''}`}
                                        onClick={() => setCurrentQuestion(index)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            {currentQuestion === totalQuestions - 1 ? (
                                <button 
                                    className="btn btn-success"
                                    onClick={handleSubmit}
                                >
                                    Nộp bài
                                    <i className="bi bi-check-circle"></i>
                                </button>
                            ) : (
                                <button 
                                    className="btn btn-primary"
                                    onClick={handleNext}
                                >
                                    Câu tiếp
                                    <i className="bi bi-arrow-right"></i>
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    /* Results */
                    <div className="results-container">
                        <div className="results-header">
                            <h2>Kết quả bài kiểm tra</h2>
                            <div className="score">
                                <div className="score-circle">
                                    <span className="score-number">{calculateScore().percentage}%</span>
                                    <span className="score-text">Điểm số</span>
                                </div>
                            </div>
                        </div>

                        <div className="results-details">
                            <div className="result-item">
                                <span>Câu trả lời đúng:</span>
                                <span>{calculateScore().correct}/{calculateScore().total}</span>
                            </div>
                            <div className="result-item">
                                <span>Thời gian làm bài:</span>
                                <span>{formatTime(currentQuiz.duration - timeLeft)}</span>
                            </div>
                        </div>

                        <div className="results-actions">
                            <button 
                                className="btn btn-primary"
                                onClick={() => navigate('/assestment')}
                            >
                                Quay lại danh sách
                            </button>
                            <button 
                                className="btn btn-outline-primary"
                                onClick={() => window.location.reload()}
                            >
                                Làm lại
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizPage; 