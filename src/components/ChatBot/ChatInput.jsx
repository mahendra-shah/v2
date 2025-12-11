import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, InputAdornment } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './ChatBot.css';

/**
 * Chat input component with send button
 */
const ChatInput = ({ onSend, disabled = false, placeholder = 'Ask me anything...' }) => {
    const [message, setMessage] = useState('');
    const inputRef = useRef(null);

    // Focus input on mount
    useEffect(() => {
        if (inputRef.current && !disabled) {
            inputRef.current.focus();
        }
    }, [disabled]);

    const handleSend = () => {
        const trimmedMessage = message.trim();
        if (trimmedMessage && !disabled) {
            onSend(trimmedMessage);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Box className="chat-input-container">
            <TextField
                inputRef={inputRef}
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={disabled}
                multiline
                maxRows={3}
                variant="outlined"
                className="chat-input-field"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '24px',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.2s ease',
                        '& fieldset': {
                            borderColor: 'rgba(99, 102, 241, 0.2)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(99, 102, 241, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#6366f1',
                            borderWidth: '2px',
                        },
                    },
                    '& .MuiInputBase-input': {
                        padding: '12px 16px',
                        fontSize: '0.95rem',
                    },
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleSend}
                                disabled={disabled || !message.trim()}
                                className="send-button"
                                sx={{
                                    backgroundColor: message.trim() ? '#6366f1' : 'transparent',
                                    color: message.trim() ? '#fff' : '#9ca3af',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: message.trim() ? '#4f46e5' : 'transparent',
                                        transform: message.trim() ? 'scale(1.05)' : 'none',
                                    },
                                    '&.Mui-disabled': {
                                        backgroundColor: 'transparent',
                                        color: '#d1d5db',
                                    },
                                }}
                            >
                                <SendIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
};

export default ChatInput;
