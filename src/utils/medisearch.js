const { BrowserWindow, ipcMain } = require('electron');
const fetch = require('node-fetch');

// Conversation tracking variables
let currentSessionId = null;
let currentTranscription = '';
let conversationHistory = [];
let isInitializingSession = false;

// MediSearch API configuration
const MEDISEARCH_API_URL = 'https://api.backend.medisearch.io/sse/medichat';
let medisearchApiKey = '463fc501-e19e-4e0d-98f2-2a680cb3c523';

// Audio capture variables
let messageBuffer = '';

// Reconnection tracking variables
let reconnectionAttempts = 0;
let maxReconnectionAttempts = 3;
let reconnectionDelay = 2000; // 2 seconds between attempts

// Safe logging to prevent cascading EPIPE errors
function safeLog(message, ...args) {
    try {
        console.log(message, ...args);
    } catch (e) {
        // Silently ignore console errors
    }
}

function safeWarn(message, ...args) {
    try {
        console.warn(message, ...args);
    } catch (e) {
        // Silently ignore console errors
    }
}

function sendToRenderer(channel, data) {
    try {
        const windows = BrowserWindow.getAllWindows();
        if (windows.length > 0 && !windows[0].isDestroyed()) {
            // Additional safety check for webContents
            if (windows[0].webContents && !windows[0].webContents.isDestroyed()) {
                windows[0].webContents.send(channel, data);
            }
        }
    } catch (error) {
        // Ignore EPIPE errors during renderer communication - don't log to prevent cascading errors
        if (error.code === 'EPIPE' || error.message?.includes('EPIPE') || error.message?.includes('write after end')) {
            return;
        }
        safeWarn('Failed to send to renderer:', error.message);
    }
}

// Conversation management functions
function initializeNewSession() {
    currentSessionId = Date.now().toString();
    currentTranscription = '';
    conversationHistory = [];
    safeLog('New MediSearch conversation session started:', currentSessionId);
}

function saveConversationTurn(question, aiResponse) {
    if (!currentSessionId) {
        initializeNewSession();
    }

    const turn = {
        sessionId: currentSessionId,
        timestamp: new Date().toISOString(),
        question: question,
        response: aiResponse,
    };

    conversationHistory.push(turn);
    safeLog('Conversation turn saved:', turn);
}

async function initializeMediSearch(apiKey, profile = 'medical', language = 'en-US') {
    if (isInitializingSession) {
        safeLog('MediSearch session already initializing, skipping...');
        return false;
    }

    safeLog('Initializing MediSearch session...');
    isInitializingSession = true;

    try {
        medisearchApiKey = apiKey;
        initializeNewSession();
        
        sendToRenderer('update-status', 'Ready');
        safeLog('MediSearch session initialized successfully');
        return true;
    } catch (error) {
        console.error('Failed to initialize MediSearch session:', error);
        sendToRenderer('update-status', 'Error initializing MediSearch');
        return false;
    } finally {
        isInitializingSession = false;
    }
}

async function sendMedicalQuery(question) {
    if (!medisearchApiKey) {
        console.error('MediSearch API key not set');
        sendToRenderer('update-response', 'Error: MediSearch API key not configured');
        return;
    }

    try {
        safeLog('Sending medical query to MediSearch:', question);
        sendToRenderer('update-status', 'Processing...');
        
        // Build conversation history for context or send standalone question
        const conversation = conversationHistory.length > 0 
            ? [...conversationHistory.slice(-5).map(turn => turn.question), question]
            : [question];

        const requestBody = {
            conversation: conversation,
            key: medisearchApiKey,
            id: currentSessionId,
            settings: {
                language: "English",
                model_type: "pro",
                followup_count: 3,
                filters: {
                    sources: ["scientificArticles", "internationalHealthGuidelines", "clinicalTrials", "medicalReviews", "medicalTextbooks"],
                    year_start: 1990,
                    year_end: 2024
                }
            }
        };

        safeLog('MediSearch request:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(MEDISEARCH_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`MediSearch API error: ${response.status} ${response.statusText}`);
        }

        messageBuffer = '';
        let articles = [];
        let followups = [];

        // Handle streaming response
        let buffer = '';
        
        response.body.on('data', (chunk) => {
            try {
                buffer += chunk.toString();
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep incomplete line in buffer

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const jsonStr = line.slice(6).trim();
                            if (!jsonStr || jsonStr === '[DONE]') continue;
                            
                            const data = JSON.parse(jsonStr);
                            
                            switch (data.event) {
                                case 'llm_response':
                                    if (data.data) {
                                        // MediSearch sends the complete response text with each chunk
                                        // Just display it directly - no need to concatenate
                                        messageBuffer = data.data;
                                        try {
                                            sendToRenderer('update-response', messageBuffer);
                                        } catch (rendererError) {
                                            console.warn('Failed to send update to renderer:', rendererError.message);
                                        }
                                    }
                                    break;
                                    
                                case 'articles':
                                    articles = data.data || [];
                                    safeLog('Referenced articles:', articles);
                                    try {
                                        sendToRenderer('update-sources', articles);
                                    } catch (rendererError) {
                                        console.warn('Failed to send articles to renderer:', rendererError.message);
                                    }
                                    break;
                                    
                                case 'followups':
                                    followups = data.data || [];
                                    safeLog('Follow-up questions:', followups);
                                    break;
                                    
                                case 'error':
                                    console.error('MediSearch API error:', data.data);
                                    try {
                                        sendToRenderer('update-status', 'Error');
                                    } catch (rendererError) {
                                        console.warn('Failed to send error status to renderer:', rendererError.message);
                                    }
                                    break;
                            }
                        } catch (parseError) {
                            console.warn('Failed to parse SSE data:', parseError);
                        }
                    }
                }
            } catch (chunkError) {
                console.warn('Error processing chunk:', chunkError.message);
                // Don't throw, just log and continue
            }
        });

        response.body.on('end', () => {
            safeLog('Stream ended');
        });

        response.body.on('error', (error) => {
            safeWarn('Stream error:', error.message);
            if (error.code === 'EPIPE' || error.message.includes('EPIPE')) {
                safeLog('Connection closed by client, stopping stream processing');
                // Don't throw EPIPE errors as they're normal when connection closes
                return;
            }
            // For other errors, still log but don't crash
            safeWarn('Stream processing error:', error);
        });

        // Wait for the stream to complete
        await new Promise((resolve, reject) => {
            let completed = false;
            
            const handleEnd = () => {
                if (!completed) {
                    completed = true;
                    resolve();
                }
            };
            
            const handleError = (error) => {
                if (!completed) {
                    completed = true;
                    if (error.code === 'EPIPE' || error.message.includes('EPIPE')) {
                        // EPIPE is normal when connection closes, treat as success
                        safeLog('Stream closed with EPIPE, treating as completion');
                        resolve();
                    } else {
                        reject(error);
                    }
                }
            };
            
            response.body.on('end', handleEnd);
            response.body.on('error', handleError);
            
            // Add a timeout to prevent hanging
            setTimeout(() => {
                if (!completed) {
                    completed = true;
                    safeLog('Stream timeout, completing');
                    resolve();
                }
            }, 30000); // 30 second timeout
        });

        // Save the conversation turn
        if (messageBuffer) {
            saveConversationTurn(question, messageBuffer);
        }

        try {
            sendToRenderer('update-status', 'Complete');
        } catch (rendererError) {
            console.warn('Failed to send completion status to renderer:', rendererError.message);
        }
        safeLog('MediSearch query completed successfully');

    } catch (error) {
        console.error('Error in MediSearch query:', error);
        try {
            sendToRenderer('update-response', `Error: ${error.message}`);
        } catch (rendererError) {
            console.warn('Failed to send error response to renderer:', rendererError.message);
        }
        try {
            sendToRenderer('update-status', 'Error');
        } catch (rendererError) {
            console.warn('Failed to send error status to renderer:', rendererError.message);
        }
    }
}

// IPC handlers
ipcMain.handle('initialize-medisearch', async (event, apiKey, profile, language) => {
    return await initializeMediSearch(apiKey, profile, language);
});

ipcMain.handle('send-medical-query', async (event, question) => {
    await sendMedicalQuery(question);
});

// Legacy IPC handlers for compatibility (redirect to MediSearch)
ipcMain.handle('initialize-gemini', async (event, apiKey, customPrompt, profile, language) => {
    console.log('Redirecting Gemini initialization to MediSearch...');
    return await initializeMediSearch(apiKey, profile, language);
});

ipcMain.handle('send-text-message', async (event, message) => {
    console.log('Redirecting text message to MediSearch...');
    await sendMedicalQuery(message);
});

// Audio handlers for compatibility
ipcMain.handle('start-macos-audio', async (event) => {
    // MediSearch doesn't use audio, but we need this handler for compatibility
    console.log('start-macos-audio called but not needed for MediSearch');
    return { success: true };
});

ipcMain.handle('stop-macos-audio', async (event) => {
    // MediSearch doesn't use audio, but we need this handler for compatibility
    console.log('stop-macos-audio called but not needed for MediSearch');
    return { success: true };
});

ipcMain.handle('send-audio-content', async (event, data) => {
    // MediSearch doesn't use audio, but we need this handler for compatibility
    console.log('send-audio-content called but not needed for MediSearch');
    return { success: true };
});

ipcMain.handle('send-mic-audio-content', async (event, data) => {
    // MediSearch doesn't use audio, but we need this handler for compatibility
    console.log('send-mic-audio-content called but not needed for MediSearch');
    return { success: true };
});

ipcMain.handle('send-image-content', async (event, data) => {
    // MediSearch doesn't use images, but we need this handler for compatibility
    console.log('send-image-content called but not needed for MediSearch');
    return { success: true };
});

ipcMain.handle('close-session', async (event) => {
    console.log('Closing MediSearch session');
    currentSessionId = null;
    currentTranscription = '';
    conversationHistory = [];
    return { success: true };
});

ipcMain.handle('new-conversation', async (event, conversationId) => {
    console.log('Starting new MediSearch conversation:', conversationId);
    currentSessionId = conversationId;
    currentTranscription = '';
    conversationHistory = [];
    return { success: true };
});

// Export functions for testing
module.exports = {
    initializeMediSearch,
    sendMedicalQuery,
    saveConversationTurn,
    formatSpeakerResults: () => '', // Placeholder for compatibility
};