import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import './ChatBot.css';

/**
 * Individual chat message component
 */
const ChatMessage = ({ message, isUser, isTyping = false }) => {
    // Format timestamp
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Box className={`chat-message ${isUser ? 'user-message' : 'ai-message'}`}>
            {/* Avatar */}
            <Avatar
                className={`message-avatar ${isUser ? 'user-avatar' : 'ai-avatar'}`}
                sx={{
                    width: 32,
                    height: 32,
                    bgcolor: isUser ? '#6366f1' : '#10b981',
                }}
            >
                {isUser ? <PersonIcon sx={{ fontSize: 18 }} /> : <SmartToyIcon sx={{ fontSize: 18 }} />}
            </Avatar>

            {/* Message Content */}
            <Box className="message-content-wrapper">
                <Box className={`message-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`}>
                    {isTyping ? (
                        <Box className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </Box>
                    ) : (
                        <Typography
                            variant="body2"
                            className="message-text"
                            sx={{ whiteSpace: 'pre-wrap' }}
                        >
                            {message.content}
                        </Typography>
                    )}
                </Box>

                {/* Timestamp */}
                {message.timestamp && !isTyping && (
                    <Typography variant="caption" className="message-time">
                        {formatTime(message.timestamp)}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default ChatMessage;
