import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Fab,
    Box,
    Typography,
    IconButton,
    Avatar,
    Zoom,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import MinimizeIcon from '@mui/icons-material/Remove';

import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestedQuestions from './SuggestedQuestions';
import { useChatBotData } from './context/ChatBotContext';
import { extractEmailFromGoogleToken } from '../../utils/verifyGoogleToken';
import './ChatBot.css';

/**
 * Main ChatBot component
 * Uses preloaded data and model from ChatBotContext
 * Only shows up when model is ready
 */
const ChatBot = () => {
    // Chat state
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);

    // Refs
    const messagesEndRef = useRef(null);

    // Get preloaded data and model state from context
    const {
        contextPrompt,
        suggestedQuestions,
        isDataLoading,

        // LLM State from Context
        generateResponse,
        resetChat,
        isModelReady,
        isGenerating,
    } = useChatBotData();

    // Get user email and name
    const googleTokenPayload = extractEmailFromGoogleToken(
        localStorage.getItem('jwtToken')
    );
    const { email, name, given_name } = googleTokenPayload || {};
    const userName = given_name || name || 'there';

    // Scroll to bottom of messages
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    // Scroll when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Add welcome message when model is ready
    useEffect(() => {
        if (isModelReady && messages.length === 0) {
            setMessages([
                {
                    id: 'welcome',
                    content: `Hi ${userName}! 👋 I'm your AI assistant for the Daily Activity Tracker.\n\nI have access to your entire year's work data. Ask me anything like:\n• "How many hours did I work this week?"\n• "Which project took most of my time this year?"\n• "What's my leave balance?"`,
                    isUser: false,
                    timestamp: new Date(),
                },
            ]);
        }
    }, [isModelReady, messages.length, userName]);

    // Handle sending a message
    const handleSendMessage = useCallback(
        async (message) => {
            if (!message.trim() || isGenerating) return;

            // Add user message
            const userMessage = {
                id: `user-${Date.now()}`,
                content: message,
                isUser: true,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMessage]);

            // Construct history for LLM (exclude welcome message if desired, or keep it)
            // Map internal messages to { role, content }
            // We use the current 'messages' state + the new 'userMessage'
            const history = [...messages, userMessage]
                .filter(msg => !msg.isTyping) // Filter out any typing indicators
                .map(msg => ({
                    role: msg.isUser ? 'user' : 'assistant',
                    content: msg.content
                }));

            // Limit history to last 10 messages to prevent context overflow
            const recentHistory = history.slice(-10);

            // Add placeholder for AI response
            const aiMessageId = `ai-${Date.now()}`;
            setMessages((prev) => [
                ...prev,
                {
                    id: aiMessageId,
                    content: '',
                    isUser: false,
                    isTyping: true,
                    timestamp: new Date(),
                },
            ]);

            try {
                // Generate response with streaming using preloaded context AND history
                await generateResponse(recentHistory, contextPrompt, (token, fullText) => {
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === aiMessageId
                                ? { ...msg, content: fullText, isTyping: false }
                                : msg
                        )
                    );
                });
            } catch (error) {
                console.error('Generation error:', error);
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === aiMessageId
                            ? {
                                ...msg,
                                content: "I'm sorry, I encountered an error. Please try again.",
                                isTyping: false,
                            }
                            : msg
                    )
                );
            }
        },
        [contextPrompt, isGenerating, generateResponse, messages]
    );

    // Handle suggested question click
    const handleSuggestedClick = useCallback(
        (question) => {
            handleSendMessage(question);
        },
        [handleSendMessage]
    );

    // Handle reset chat
    const handleResetChat = useCallback(async () => {
        await resetChat();
        setMessages([]);
        // Re-add welcome message
        setMessages([
            {
                id: 'welcome',
                content: `Chat reset! 🔄 How can I help you with your work data?`,
                isUser: false,
                timestamp: new Date(),
            },
        ]);
    }, [resetChat]);

    // Toggle chat open/close
    const toggleChat = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    // Don't render if no email (not logged in)
    if (!email) {
        return null;
    }

    // CRITICAL: Only show FAB if model is ready
    if (!isModelReady) {
        return null;
    }

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <Box className="chat-window">
                    {/* Header */}
                    <Box className="chat-header">
                        <Box className="chat-header-info">
                            <Avatar className="chat-header-avatar">
                                <SmartToyIcon />
                            </Avatar>
                            <Box className="chat-header-text">
                                <Typography variant="h6">AI Assistant</Typography>
                                <Typography variant="caption" component="span">
                                    Online • TinyLlama (lightweight)
                                </Typography>
                            </Box>
                        </Box>
                        <Box className="chat-header-actions">
                            <IconButton size="small" onClick={handleResetChat} title="Reset chat">
                                <RefreshIcon />
                            </IconButton>
                            <IconButton size="small" onClick={toggleChat} title="Close">
                                <MinimizeIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Messages */}
                    <Box className="chat-messages">
                        {messages.map((msg) => (
                            <ChatMessage
                                key={msg.id}
                                message={msg}
                                isUser={msg.isUser}
                                isTyping={msg.isTyping}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Suggested Questions */}
                    {suggestedQuestions.length > 0 && messages.length <= 3 && (
                        <SuggestedQuestions
                            questions={suggestedQuestions}
                            onQuestionClick={handleSuggestedClick}
                            disabled={isGenerating}
                        />
                    )}

                    {/* Input */}
                    <ChatInput
                        onSend={handleSendMessage}
                        disabled={isGenerating || isDataLoading}
                        placeholder={
                            isGenerating
                                ? 'AI is thinking...'
                                : isDataLoading
                                    ? 'Updating data...'
                                    : 'Ask about your work data...'
                        }
                    />
                </Box>
            )}

            {/* Floating Action Button - Only visible when model is ready */}
            <Zoom in={isModelReady} timeout={300}>
                <Fab
                    className={`chat-fab ${isOpen ? 'open' : ''}`}
                    onClick={toggleChat}
                    aria-label={isOpen ? 'Close chat' : 'Open AI chat'}
                >
                    {isOpen ? <CloseIcon /> : <SmartToyIcon />}
                </Fab>
            </Zoom>
        </>
    );
};

export default ChatBot;
