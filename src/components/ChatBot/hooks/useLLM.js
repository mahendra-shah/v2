import { useState, useCallback, useRef, useEffect } from 'react';
import * as webllm from '@mlc-ai/web-llm';

// Model to use - TinyLlama 1.1B (Better reasoning than SmolLM, still lightweight)
// ~675MB RAM, ~400MB download
const MODEL_ID = 'TinyLlama-1.1B-Chat-v0.4-q4f16_1-MLC-1k';

/**
 * Custom hook for managing WebLLM model lifecycle and chat
 */
export const useLLM = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isModelReady, setIsModelReady] = useState(false);
    const [loadProgress, setLoadProgress] = useState({ progress: 0, text: '' });
    const [error, setError] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isWebGPUSupported, setIsWebGPUSupported] = useState(true);

    const engineRef = useRef(null);

    // Check WebGPU support on mount
    useEffect(() => {
        const checkWebGPU = async () => {
            if (!navigator.gpu) {
                setIsWebGPUSupported(false);
                setError('WebGPU is not supported in this browser. Please use Chrome 113+, Edge 113+, or Safari 18+.');
            }
        };
        checkWebGPU();
    }, []);

    /**
     * Initialize the LLM model
     */
    const initializeModel = useCallback(async () => {
        if (!isWebGPUSupported) {
            return false;
        }

        if (engineRef.current) {
            setIsModelReady(true);
            return true;
        }

        setIsLoading(true);
        setError(null);
        setLoadProgress({ progress: 0, text: 'Initializing...' });

        try {
            const engine = await webllm.CreateMLCEngine(MODEL_ID, {
                initProgressCallback: (progress) => {
                    setLoadProgress({
                        progress: progress.progress * 100,
                        text: progress.text,
                    });
                },
            });

            engineRef.current = engine;
            setIsModelReady(true);
            setIsLoading(false);
            return true;
        } catch (err) {
            console.error('Failed to initialize model:', err);
            setError(err.message || 'Failed to load AI model');
            setIsLoading(false);
            return false;
        }
    }, [isWebGPUSupported]);

    /**
     * Generate a response from the model
     * @param {Array} chatHistory - Array of { role, content } messages
     * @param {string} contextPrompt - The system context with user data
     * @param {function} onToken - Callback for streaming tokens
     */
    const generateResponse = useCallback(async (chatHistory, contextPrompt, onToken) => {
        if (!engineRef.current) {
            throw new Error('Model not initialized');
        }

        setIsGenerating(true);
        setError(null);

        try {
            // Construct full message chain: System Prompt + Chat History
            const messages = [
                {
                    role: 'system',
                    content: contextPrompt,
                },
                ...chatHistory
            ];

            let fullResponse = '';

            // Use streaming for better UX
            const asyncChunkGenerator = await engineRef.current.chat.completions.create({
                messages,
                temperature: 0.7,
                max_tokens: 512,
                stream: true,
            });

            for await (const chunk of asyncChunkGenerator) {
                const delta = chunk.choices[0]?.delta?.content || '';
                fullResponse += delta;
                if (onToken) {
                    onToken(delta, fullResponse);
                }
            }

            setIsGenerating(false);
            return fullResponse;
        } catch (err) {
            console.error('Generation error:', err);
            setError(err.message || 'Failed to generate response');
            setIsGenerating(false);
            throw err;
        }
    }, []);

    /**
     * Reset the chat context
     */
    const resetChat = useCallback(async () => {
        if (engineRef.current) {
            await engineRef.current.resetChat();
        }
    }, []);

    /**
     * Cleanup on unmount
     */
    useEffect(() => {
        return () => {
            if (engineRef.current) {
                engineRef.current.unload();
                engineRef.current = null;
            }
        };
    }, []);

    return {
        initializeModel,
        generateResponse,
        resetChat,
        isLoading,
        isModelReady,
        loadProgress,
        error,
        isGenerating,
        isWebGPUSupported,
    };
};

export default useLLM;
