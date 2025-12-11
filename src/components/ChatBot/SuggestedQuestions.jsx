import React from 'react';
import { Box, Chip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import './ChatBot.css';

/**
 * Suggested questions component - shows clickable question chips
 */
const SuggestedQuestions = ({ questions, onQuestionClick, disabled = false }) => {
    if (!questions || questions.length === 0) {
        return null;
    }

    return (
        <Box className="suggested-questions">
            <Box className="suggestions-header">
                <AutoAwesomeIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                <span>Try asking:</span>
            </Box>
            <Box className="suggestions-list">
                {questions.map((question, index) => (
                    <Chip
                        key={index}
                        label={question}
                        onClick={() => !disabled && onQuestionClick(question)}
                        disabled={disabled}
                        className="suggestion-chip"
                        sx={{
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            color: '#6366f1',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: disabled ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.2)',
                                transform: disabled ? 'none' : 'translateY(-1px)',
                            },
                            '& .MuiChip-label': {
                                fontSize: '0.8rem',
                                padding: '4px 8px',
                            },
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default SuggestedQuestions;
