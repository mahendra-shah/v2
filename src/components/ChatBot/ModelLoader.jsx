import React from 'react';
import { Box, Typography, LinearProgress, Button, Alert, AlertTitle } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import RefreshIcon from '@mui/icons-material/Refresh';
import './ChatBot.css';

/**
 * Model loading indicator component
 */
const ModelLoader = ({
    isLoading,
    progress,
    error,
    isWebGPUSupported,
    onRetry,
}) => {
    // WebGPU not supported
    if (!isWebGPUSupported) {
        return (
            <Box className="model-loader-container">
                <Alert severity="warning" className="webgpu-alert">
                    <AlertTitle>Browser Not Supported</AlertTitle>
                    <Typography variant="body2">
                        Your browser doesn't support WebGPU, which is required for the AI chatbot.
                        Please use one of these browsers:
                    </Typography>
                    <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                        <li>Chrome 113+</li>
                        <li>Edge 113+</li>
                        <li>Safari 18+ (macOS Sonoma)</li>
                    </ul>
                </Alert>
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Box className="model-loader-container error-state">
                <Alert
                    severity="error"
                    className="error-alert"
                    action={
                        onRetry && (
                            <Button
                                color="inherit"
                                size="small"
                                onClick={onRetry}
                                startIcon={<RefreshIcon />}
                            >
                                Retry
                            </Button>
                        )
                    }
                >
                    <AlertTitle>Failed to Load AI</AlertTitle>
                    {error}
                </Alert>
            </Box>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <Box className="model-loader-container loading-state">
                <Box className="loader-icon-wrapper">
                    <SmartToyIcon className="loader-icon pulse" />
                </Box>

                <Typography variant="h6" className="loader-title">
                    Loading AI Assistant
                </Typography>

                <Typography variant="body2" className="loader-subtitle">
                    {progress.text || 'Initializing...'}
                </Typography>

                <Box className="progress-wrapper">
                    <LinearProgress
                        variant="determinate"
                        value={progress.progress || 0}
                        className="progress-bar"
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                            },
                        }}
                    />
                    <Typography variant="caption" className="progress-text">
                        {Math.round(progress.progress || 0)}%
                    </Typography>
                </Box>

                <Typography variant="caption" className="loader-hint">
                    First time takes ~30 seconds to download (~200MB)
                    <br />
                    The model is cached for instant future loads
                </Typography>
            </Box>
        );
    }

    return null;
};

export default ModelLoader;
