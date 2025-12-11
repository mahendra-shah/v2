import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchAllUserData, buildContextPrompt, getSuggestedQuestions } from '../services/dataService';
import { extractEmailFromGoogleToken } from '../../../utils/verifyGoogleToken';
import { useLLM } from '../hooks/useLLM';

/**
 * Context for ChatBot data preloading and Model management
 * Preloads user data AND initializes AI model in background
 */
const ChatBotContext = createContext(null);

export const ChatBotProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [contextPrompt, setContextPrompt] = useState('');
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [isDataReady, setIsDataReady] = useState(false);
    const [lastFetchTime, setLastFetchTime] = useState(null);

    // Integrate LLM Hook here for global background loading
    const llmState = useLLM();
    const { initializeModel, isModelReady, isWebGPUSupported } = llmState;

    // Get email from token
    const getEmail = useCallback(() => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) return null;
            const payload = extractEmailFromGoogleToken(token);
            return payload?.email || null;
        } catch {
            return null;
        }
    }, []);

    /**
     * Load all user data in background
     */
    const loadUserData = useCallback(async (forceRefresh = false) => {
        const email = getEmail();
        if (!email) {
            console.log('[ChatBot] No email found, skipping data preload');
            return;
        }

        // Skip if already loaded recently (within 5 minutes) unless forced
        if (!forceRefresh && lastFetchTime && (Date.now() - lastFetchTime) < 5 * 60 * 1000) {
            console.log('[ChatBot] Data already loaded, skipping refresh');
            return;
        }

        console.log('[ChatBot] Preloading user data in background...');
        setIsDataLoading(true);

        try {
            const data = await fetchAllUserData(email);
            setUserData(data);
            setContextPrompt(buildContextPrompt(data));
            setSuggestedQuestions(getSuggestedQuestions(data));
            setIsDataReady(true);
            setLastFetchTime(Date.now());
            console.log('[ChatBot] User data preloaded successfully');
        } catch (error) {
            console.error('[ChatBot] Failed to preload user data:', error);
        } finally {
            setIsDataLoading(false);
        }
    }, [getEmail, lastFetchTime]);

    /**
     * Refresh data (force reload)
     */
    const refreshData = useCallback(() => {
        return loadUserData(true);
    }, [loadUserData]);

    // Auto-preload Data AND Model when component mounts and user is logged in
    useEffect(() => {
        const email = getEmail();
        if (email) {
            // 1. Load User Data
            if (!isDataReady && !isDataLoading) {
                // Delay preload slightly to not block initial render
                const timer = setTimeout(() => {
                    loadUserData();
                }, 2000);
                return () => clearTimeout(timer);
            }

            // 2. Initialize Model in Background
            if (!isModelReady && isWebGPUSupported) {
                console.log('[ChatBot] Initializing AI model in background...');
                initializeModel();
            }
        }
    }, [getEmail, isDataReady, isDataLoading, loadUserData, isModelReady, isWebGPUSupported, initializeModel]);

    // Listen for login changes (localStorage)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'jwtToken' && e.newValue) {
                // User just logged in, preload data and model
                setTimeout(() => {
                    loadUserData(true);
                    initializeModel();
                }, 1000);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [loadUserData, initializeModel]);

    const value = {
        userData,
        contextPrompt,
        suggestedQuestions,
        isDataLoading,
        isDataReady,
        loadUserData,
        refreshData,
        // Expose LLM state
        ...llmState
    };

    return (
        <ChatBotContext.Provider value={value}>
            {children}
        </ChatBotContext.Provider>
    );
};

export const useChatBotData = () => {
    const context = useContext(ChatBotContext);
    if (!context) {
        throw new Error('useChatBotData must be used within ChatBotProvider');
    }
    return context;
};

export default ChatBotContext;
