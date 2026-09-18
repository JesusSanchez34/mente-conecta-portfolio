import { useState } from 'react';
import { questions as defaultQuestions } from '../../utils/demo/demoConstants';

export function useDemoQuestionnaire(initialQuestions = defaultQuestions) {
    const [currentPage, setCurrentPage] = useState(1);
    const [answers, setAnswers] = useState({});
    const [errors, setErrors] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleOptionChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
        setErrors(prev => prev.filter(id => id !== questionId));
    };

    const validatePage = () => {
        const currentQuestions = initialQuestions.filter(q => q.page === currentPage);
        const newErrors = [];

        currentQuestions.forEach(q => {
            if (!answers[q.id] || (typeof answers[q.id] === 'string' && answers[q.id].trim() === '')) {
                newErrors.push(q.id);
            }
        });

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleNext = () => {
        if (validatePage()) {
            setCurrentPage(currentPage + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = () => {
        if (validatePage()) {
            setShowSuccessModal(true);
        }
    };

    const totalPages = Math.max(...initialQuestions.map(q => q.page));

    return {
        currentPage,
        answers,
        errors,
        showSuccessModal,
        currentQuestions: initialQuestions.filter(q => q.page === currentPage),
        handleOptionChange,
        handleNext,
        handleSubmit,
        setCurrentPage,
        totalPages
    };
}
