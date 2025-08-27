if (require('electron-squirrel-startup')) {
    process.exit(0);
}

const { app, BrowserWindow, shell, ipcMain, dialog } = require('electron');

// Disable all error dialogs at the app level before anything else loads
app.commandLine.appendSwitch('disable-dev-shm-usage');
app.commandLine.appendSwitch('disable-software-rasterizer');

// Override dialog.showErrorBox globally before any other code runs
const originalShowErrorBox = dialog.showErrorBox;
dialog.showErrorBox = (title, content) => {
    // Completely suppress all error dialogs containing these patterns
    if (content && (
        content.includes('EPIPE') || 
        content.includes('write after end') ||
        content.includes('afterWriteDispatched') ||
        content.includes('writeGeneric') ||
        content.includes('Object has been destroyed') ||
        content.includes('Socket._write') ||
        content.includes('destroyed') ||
        content.includes('TypeError') ||
        content.includes('Function.<anonymous>')
    )) {
        return; // Silently ignore - no dialog shown
    }
    
    // Only show critical errors
    if (content && (content.includes('FATAL') || content.includes('CRITICAL'))) {
        originalShowErrorBox.call(dialog, title, content);
    }
};
const { createWindow, updateGlobalShortcuts } = require('./utils/window');
const { stopMacOSAudioCapture, sendToRenderer } = require('./utils/gemini');
require('./utils/medisearch'); // Initialize MediSearch handlers
const { initializeRandomProcessNames } = require('./utils/processRandomizer');
const { applyAntiAnalysisMeasures } = require('./utils/stealthFeatures');
const { getLocalConfig, writeConfig } = require('./config');

// Safe logging that won't cause EPIPE errors
function safeLog(message, ...args) {
    try {
        console.log(message, ...args);
    } catch (e) {
        // Ignore console errors to prevent cascading EPIPE errors
    }
}

function safeError(message, ...args) {
    try {
        console.error(message, ...args);
    } catch (e) {
        // Ignore console errors to prevent cascading EPIPE errors
    }
}

// Disable all Electron error dialogs and security warnings
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
process.env.ELECTRON_NO_ATTACH_CONSOLE = '1';

// Override process error emission to prevent dialogs at the source
const originalEmit = process.emit;
process.emit = function (name, data, ...args) {
    if (name === 'uncaughtException' && data) {
        const errorMessage = data.message || data.toString();
        if (data.code === 'EPIPE' || 
            errorMessage.includes('EPIPE') || 
            errorMessage.includes('write after end') ||
            errorMessage.includes('afterWriteDispatched') ||
            errorMessage.includes('writeGeneric') ||
            errorMessage.includes('Object has been destroyed') ||
            errorMessage.includes('Socket._write') ||
            errorMessage.includes('destroyed') ||
            errorMessage.includes('TypeError') ||
            errorMessage.includes('Function.<anonymous>')) {
            // Completely suppress these errors - don't even emit them
            return false;
        }
    }
    return originalEmit.apply(process, arguments);
};

// Handle uncaught exceptions and EPIPE errors
process.on('uncaughtException', (error) => {
    // Silently ignore all EPIPE-related errors and common shutdown errors
    if (error.code === 'EPIPE' || 
        error.message?.includes('EPIPE') || 
        error.message?.includes('write after end') ||
        error.message?.includes('afterWriteDispatched') ||
        error.message?.includes('writeGeneric') ||
        error.message?.includes('Socket._write')) {
        return; // Don't show dialog or log
    }
    
    // Only log truly critical errors
    if (error.message?.includes('FATAL') || error.message?.includes('CRITICAL')) {
        safeError('Critical Exception:', error);
    }
    // Don't exit the process
});

process.on('unhandledRejection', (reason, promise) => {
    // Silently ignore all EPIPE-related rejections and common shutdown errors
    if (reason && (reason.code === 'EPIPE' || 
                   reason.message?.includes('EPIPE') || 
                   reason.message?.includes('write after end') ||
                   reason.message?.includes('afterWriteDispatched') ||
                   reason.message?.includes('writeGeneric'))) {
        return; // Don't show dialog or log
    }
    
    // Only log truly critical rejections
    if (reason?.message?.includes('FATAL') || reason?.message?.includes('CRITICAL')) {
        safeError('Critical Rejection:', reason);
    }
});

const geminiSessionRef = { current: null };
let mainWindow = null;

// Initialize random process names for stealth
const randomNames = initializeRandomProcessNames();

function createMainWindow() {
    mainWindow = createWindow(sendToRenderer, geminiSessionRef, randomNames);
    return mainWindow;
}

app.whenReady().then(async () => {
    // Apply anti-analysis measures with random delay
    await applyAntiAnalysisMeasures();

    createMainWindow();
    setupGeneralIpcHandlers();
});

app.on('window-all-closed', () => {
    stopMacOSAudioCapture();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    stopMacOSAudioCapture();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

function setupGeneralIpcHandlers() {
    // Config-related IPC handlers
    ipcMain.handle('set-onboarded', async (event) => {
        try {
            const config = getLocalConfig();
            config.onboarded = true;
            writeConfig(config);
            return { success: true, config };
        } catch (error) {
            console.error('Error setting onboarded:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('set-stealth-level', async (event, stealthLevel) => {
        try {
            const validLevels = ['visible', 'balanced', 'ultra'];
            if (!validLevels.includes(stealthLevel)) {
                throw new Error(`Invalid stealth level: ${stealthLevel}. Must be one of: ${validLevels.join(', ')}`);
            }
            
            const config = getLocalConfig();
            config.stealthLevel = stealthLevel;
            writeConfig(config);
            return { success: true, config };
        } catch (error) {
            console.error('Error setting stealth level:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('set-layout', async (event, layout) => {
        try {
            const validLayouts = ['normal', 'compact'];
            if (!validLayouts.includes(layout)) {
                throw new Error(`Invalid layout: ${layout}. Must be one of: ${validLayouts.join(', ')}`);
            }
            
            const config = getLocalConfig();
            config.layout = layout;
            writeConfig(config);
            return { success: true, config };
        } catch (error) {
            console.error('Error setting layout:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('get-config', async (event) => {
        try {
            const config = getLocalConfig();
            return { success: true, config };
        } catch (error) {
            console.error('Error getting config:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('quit-application', async event => {
        try {
            stopMacOSAudioCapture();
            app.quit();
            return { success: true };
        } catch (error) {
            console.error('Error quitting application:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('open-external', async (event, url) => {
        try {
            await shell.openExternal(url);
            return { success: true };
        } catch (error) {
            console.error('Error opening external URL:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.on('update-keybinds', (event, newKeybinds) => {
        if (mainWindow) {
            updateGlobalShortcuts(newKeybinds, mainWindow, sendToRenderer, geminiSessionRef);
        }
    });

    ipcMain.handle('update-content-protection', async (event, contentProtection) => {
        try {
            if (mainWindow) {
                // Disable content protection to allow screenshots
                mainWindow.setContentProtection(false);
                console.log('Content protection disabled - screenshots allowed');
            }
            return { success: true };
        } catch (error) {
            console.error('Error updating content protection:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('get-random-display-name', async event => {
        try {
            return randomNames ? randomNames.displayName : 'System Monitor';
        } catch (error) {
            console.error('Error getting random display name:', error);
            return 'System Monitor';
        }
    });
}
