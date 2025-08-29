import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { AppHeader } from './AppHeader.js';
import { MainView } from '../views/MainView.js';
import { CustomizeView } from '../views/CustomizeView.js';
import { HelpView } from '../views/HelpView.js';
import { HistoryView } from '../views/HistoryView.js';
import { AssistantView } from '../views/AssistantView.js';
import { OnboardingView } from '../views/OnboardingView.js';
import { AdvancedView } from '../views/AdvancedView.js';

export class CheatingDaddyApp extends LitElement {
    static styles = css`
        * {
            box-sizing: border-box;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0px;
            padding: 0px;
            cursor: default;
            user-select: none;
        }

        :host {
            display: block;
            width: 100%;
            height: 100vh;
            background-color: var(--background-transparent);
            color: var(--text-color);
            text-shadow: var(--text-shadow);
        }

        .window-container {
            height: 100vh;
            border-radius: 7px;
            overflow: hidden;
        }

        .container {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .main-content {
            flex: 1;
            padding: var(--main-content-padding);
            overflow-y: auto;
            margin-top: var(--main-content-margin-top);
            border-radius: var(--content-border-radius);
            transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            background: var(--main-content-background);
            backdrop-filter: var(--main-content-backdrop-filter);
            -webkit-backdrop-filter: var(--main-content-backdrop-filter);
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 
                0 8px 32px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                0 1px 0 0 rgba(255, 255, 255, 0.2) inset;
            animation: scaleIn 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .main-content.assistant-view {
            padding: 10px;
            border: none;
            position: relative;
        }

        .main-content.assistant-view::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: var(--content-border-radius);
            background: linear-gradient(45deg, transparent 30%, rgba(64, 169, 255, 0.05) 50%, transparent 70%);
            pointer-events: none;
            animation: blueGlow 4s ease-in-out infinite;
            z-index: -1;
        }

        .main-content.with-border {
            border: 1px solid var(--border-color);
        }

        .main-content.onboarding-view {
            padding: 0;
            border: none;
            background: transparent;
        }

        .view-container {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.4s cubic-bezier(0.4, 0.0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
            height: 100%;
            animation: fadeInUp 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .view-container.entering {
            opacity: 0;
            transform: translateY(20px);
        }

        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        ::-webkit-scrollbar-track {
            background: var(--scrollbar-background);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--scrollbar-thumb-hover);
        }
    `;

    static properties = {
        currentView: { type: String },
        statusText: { type: String },
        startTime: { type: Number },
        isRecording: { type: Boolean },
        sessionActive: { type: Boolean },
        selectedProfile: { type: String },
        selectedLanguage: { type: String },
        responses: { type: Array },
        currentResponseIndex: { type: Number },
        selectedScreenshotInterval: { type: String },
        selectedImageQuality: { type: String },
        layoutMode: { type: String },
        advancedMode: { type: Boolean },
        _viewInstances: { type: Object, state: true },
        _isClickThrough: { state: true },
        _awaitingNewResponse: { state: true },
        shouldAnimateResponse: { type: Boolean },
        sources: { type: Array },
        isLoading: { type: Boolean },
    };

    constructor() {
        super();
        this.currentView = localStorage.getItem('onboardingCompleted') ? 'assistant' : 'onboarding';
        this.statusText = '';
        this.startTime = null;
        this.isRecording = false;
        this.sessionActive = false;
        
        // Auto-start session if going directly to assistant view
        if (this.currentView === 'assistant') {
            this.sessionActive = true;
            this.startTime = Date.now();
            // Initialize session after component is connected
            setTimeout(() => this.autoStartSession(), 100);
        }
        this.selectedProfile = localStorage.getItem('selectedProfile') || 'interview';
        this.selectedLanguage = localStorage.getItem('selectedLanguage') || 'en-US';
        this.selectedScreenshotInterval = localStorage.getItem('selectedScreenshotInterval') || '5';
        this.selectedImageQuality = localStorage.getItem('selectedImageQuality') || 'medium';
        this.layoutMode = localStorage.getItem('layoutMode') || 'normal';
        this.advancedMode = localStorage.getItem('advancedMode') === 'true';
        this.responses = [];
        this.currentResponseIndex = -1;
        this._viewInstances = new Map();
        this._isClickThrough = false;
        this._awaitingNewResponse = false;
        this._currentResponseIsComplete = true;
        this.shouldAnimateResponse = false;
        this.sources = [];
        this.currentQuestion = '';
        this.isLoading = false;

        // Apply layout mode to document root
        this.updateLayoutMode();
    }

    connectedCallback() {
        super.connectedCallback();

        // Set up keyboard event listener for escape key
        this.boundKeydownHandler = this.handleKeydown.bind(this);
        document.addEventListener('keydown', this.boundKeydownHandler);

        // Set up IPC listeners if needed
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.on('update-response', (_, response) => {
                this.setResponse(response);
            });
            ipcRenderer.on('update-status', (_, status) => {
                this.setStatus(status);
            });
            ipcRenderer.on('click-through-toggled', (_, isEnabled) => {
                this._isClickThrough = isEnabled;
            });
            ipcRenderer.on('update-sources', (_, sources) => {
                this.sources = sources || [];
            });
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        
        // Remove keyboard event listener
        if (this.boundKeydownHandler) {
            document.removeEventListener('keydown', this.boundKeydownHandler);
        }
        
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.removeAllListeners('update-response');
            ipcRenderer.removeAllListeners('update-status');
            ipcRenderer.removeAllListeners('click-through-toggled');
            ipcRenderer.removeAllListeners('update-sources');
        }
    }

    handleKeydown(event) {
        // Handle escape key to exit assistant view
        if (event.key === 'Escape') {
            if (this.currentView === 'assistant') {
                event.preventDefault();
                this.handleClose();
            }
        }
    }

    setStatus(text) {
        this.statusText = text;
        
        // Set loading state based on status
        this.isLoading = text.includes('Processing') || text.includes('Sending') || text.includes('Analyzing');
        
        // Mark response as complete when we get certain status messages
        if (text.includes('Ready') || text.includes('Listening') || text.includes('Error')) {
            this._currentResponseIsComplete = true;
            this.isLoading = false;
            console.log('[setStatus] Marked current response as complete');
        }
    }

    setResponse(response) {
        // Check if this looks like a filler response (very short responses to hmm, ok, etc)
        const isFillerResponse =
            response.length < 30 &&
            (response.toLowerCase().includes('hmm') ||
                response.toLowerCase().includes('okay') ||
                response.toLowerCase().includes('next') ||
                response.toLowerCase().includes('go on') ||
                response.toLowerCase().includes('continue'));

        if (this._awaitingNewResponse || this.responses.length === 0) {
            // Always add as new response when explicitly waiting for one
            this.responses = [...this.responses, response];
            this.currentResponseIndex = this.responses.length - 1;
            this._awaitingNewResponse = false;
            this._currentResponseIsComplete = false;
            this.isLoading = false;
            console.log('[setResponse] Pushed new response:', response);
            
            // Update conversation title if this is a new conversation
            const assistantView = this.shadowRoot.querySelector('assistant-view');
            if (assistantView && this.currentQuestion) {
                assistantView.updateConversationTitle(this.currentQuestion);
            }
        } else if (!this._currentResponseIsComplete && !isFillerResponse && this.responses.length > 0) {
            // For substantial responses, update the last one (streaming behavior)
            // Only update if the current response is not marked as complete and content actually changed
            const lastResponse = this.responses[this.responses.length - 1];
            if (lastResponse !== response) { // Only update if content actually changed
                this.responses = [...this.responses.slice(0, this.responses.length - 1), response];
                console.log('[setResponse] Updated last response:', response);
            } else {
                console.log('[setResponse] No change, skipping update');
                return; // Don't trigger re-render if nothing changed
            }
        } else {
            // For filler responses or when current response is complete, add as new
            this.responses = [...this.responses, response];
            this.currentResponseIndex = this.responses.length - 1;
            this._currentResponseIsComplete = false;
            console.log('[setResponse] Added response as new:', response);
        }
        
        
        this.shouldAnimateResponse = true;
        this.requestUpdate();
    }

    // Header event handlers
    handleCustomizeClick() {
        this.currentView = 'customize';
        this.requestUpdate();
    }

    handleHelpClick() {
        this.currentView = 'help';
        this.requestUpdate();
    }

    handleHistoryClick() {
        this.currentView = 'history';
        this.requestUpdate();
    }

    handleAdvancedClick() {
        this.currentView = 'advanced';
        this.requestUpdate();
    }

    async handleClose() {
        if (this.currentView === 'customize' || this.currentView === 'help' || this.currentView === 'history' || this.currentView === 'advanced') {
            this.currentView = 'assistant'; // Go back to assistant instead of main
        } else if (this.currentView === 'assistant') {
            // Just hide the window instead of closing the session
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('toggle-window-visibility');
            }
            console.log('Assistant view hidden');
        } else {
            // Quit the entire application
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('quit-application');
            }
        }
    }

    async handleHideToggle() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('toggle-window-visibility');
        }
    }

    // Auto-start session when app opens directly to assistant view
    async autoStartSession() {
        try {
            // Hardcode the API key - skip validation
            localStorage.setItem('apiKey', '463fc501-e19e-4e0d-98f2-2a680cb3c523');

            await cheddar.initializeMediSearch(this.selectedProfile, this.selectedLanguage);
            // Pass the screenshot interval as string (including 'manual' option)
            cheddar.startCapture(this.selectedScreenshotInterval, this.selectedImageQuality);
            this.responses = [];
            this.currentResponseIndex = -1;
            this.setStatus('Ready');
            console.log('Session auto-started');
        } catch (error) {
            console.error('Failed to auto-start session:', error);
            this.setStatus('Error starting session');
        }
    }

    // Main view event handlers
    async handleStart() {
        // Hardcode the API key - skip validation
        localStorage.setItem('apiKey', '463fc501-e19e-4e0d-98f2-2a680cb3c523');

        await cheddar.initializeMediSearch(this.selectedProfile, this.selectedLanguage);
        // Pass the screenshot interval as string (including 'manual' option)
        cheddar.startCapture(this.selectedScreenshotInterval, this.selectedImageQuality);
        this.responses = [];
        this.currentResponseIndex = -1;
        this.startTime = Date.now();
        this.currentView = 'assistant';
    }

    async handleAPIKeyHelp() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('open-external', 'https://medisearch.io/developers/docs');
        }
    }

    // Customize view event handlers
    handleProfileChange(profile) {
        this.selectedProfile = profile;
    }

    handleLanguageChange(language) {
        this.selectedLanguage = language;
    }

    handleScreenshotIntervalChange(interval) {
        this.selectedScreenshotInterval = interval;
    }

    handleImageQualityChange(quality) {
        this.selectedImageQuality = quality;
        localStorage.setItem('selectedImageQuality', quality);
    }

    handleAdvancedModeChange(advancedMode) {
        this.advancedMode = advancedMode;
        localStorage.setItem('advancedMode', advancedMode.toString());
    }

    handleBackClick() {
        this.currentView = 'assistant'; // Go back to assistant instead of main
        this.requestUpdate();
    }

    // Help view event handlers
    async handleExternalLinkClick(url) {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('open-external', url);
        }
    }

    // Assistant view event handlers
    async handleSendText(message) {
        this.currentQuestion = message;
        this.isLoading = true;
        this.setStatus('Processing medical query...');
        this._awaitingNewResponse = true;
        this._currentResponseIsComplete = true; // Mark previous response as complete
        
        const result = await window.cheddar.sendMedicalQuery(message);

        if (!result.success) {
            console.error('Failed to send medical query:', result.error);
            this.setStatus('Error sending query: ' + result.error);
            this.isLoading = false;
            this._awaitingNewResponse = false;
        }
    }

    handleResponseIndexChanged(e) {
        this.currentResponseIndex = e.detail.index;
        this.shouldAnimateResponse = false;
        this.requestUpdate();
    }

    async handleNewConversation(e) {
        console.log('Starting new conversation:', e.detail.conversationId);
        
        // Clear all conversation state
        this.responses = [];
        this.currentResponseIndex = -1;
        this.sources = [];
        this.currentQuestion = '';
        this.isLoading = false;
        this._awaitingNewResponse = false;
        this._currentResponseIsComplete = true;
        this.setStatus('Ready');
        
        // Clear chat history in assistant view
        const assistantView = this.shadowRoot.querySelector('assistant-view');
        if (assistantView) {
            assistantView.chatHistory = [];
        }
        
        // Notify medisearch.js to start new conversation
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            try {
                await ipcRenderer.invoke('new-conversation', e.detail.conversationId);
                console.log('Backend conversation cleared successfully');
            } catch (error) {
                console.error('Failed to start new conversation:', error);
            }
        }
        
        this.requestUpdate();
    }

    // Onboarding event handlers
    handleOnboardingComplete() {
        this.currentView = 'main';
    }

    updated(changedProperties) {
        super.updated(changedProperties);

        // Only notify main process of view change if the view actually changed
        if (changedProperties.has('currentView') && window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('view-changed', this.currentView);

            // Add a small delay to smooth out the transition
            const viewContainer = this.shadowRoot?.querySelector('.view-container');
            if (viewContainer) {
                viewContainer.classList.add('entering');
                requestAnimationFrame(() => {
                    viewContainer.classList.remove('entering');
                });
            }
        }

        // Only update localStorage when these specific properties change
        if (changedProperties.has('selectedProfile')) {
            localStorage.setItem('selectedProfile', this.selectedProfile);
        }
        if (changedProperties.has('selectedLanguage')) {
            localStorage.setItem('selectedLanguage', this.selectedLanguage);
        }
        if (changedProperties.has('selectedScreenshotInterval')) {
            localStorage.setItem('selectedScreenshotInterval', this.selectedScreenshotInterval);
        }
        if (changedProperties.has('selectedImageQuality')) {
            localStorage.setItem('selectedImageQuality', this.selectedImageQuality);
        }
        if (changedProperties.has('layoutMode')) {
            this.updateLayoutMode();
        }
        if (changedProperties.has('advancedMode')) {
            localStorage.setItem('advancedMode', this.advancedMode.toString());
        }
    }

    renderCurrentView() {
        // Only re-render the view if it hasn't been cached or if critical properties changed
        const viewKey = `${this.currentView}-${this.selectedProfile}-${this.selectedLanguage}`;

        switch (this.currentView) {
            case 'onboarding':
                return html`
                    <onboarding-view .onComplete=${() => this.handleOnboardingComplete()} .onClose=${() => this.handleClose()}></onboarding-view>
                `;

            case 'main':
                return html`
                    <main-view
                        .onStart=${() => this.handleStart()}
                        .onAPIKeyHelp=${() => this.handleAPIKeyHelp()}
                        .onLayoutModeChange=${layoutMode => this.handleLayoutModeChange(layoutMode)}
                    ></main-view>
                `;

            case 'customize':
                return html`
                    <customize-view
                        .selectedProfile=${this.selectedProfile}
                        .selectedLanguage=${this.selectedLanguage}
                        .selectedScreenshotInterval=${this.selectedScreenshotInterval}
                        .selectedImageQuality=${this.selectedImageQuality}
                        .layoutMode=${this.layoutMode}
                        .advancedMode=${this.advancedMode}
                        .onProfileChange=${profile => this.handleProfileChange(profile)}
                        .onLanguageChange=${language => this.handleLanguageChange(language)}
                        .onScreenshotIntervalChange=${interval => this.handleScreenshotIntervalChange(interval)}
                        .onImageQualityChange=${quality => this.handleImageQualityChange(quality)}
                        .onLayoutModeChange=${layoutMode => this.handleLayoutModeChange(layoutMode)}
                        .onAdvancedModeChange=${advancedMode => this.handleAdvancedModeChange(advancedMode)}
                    ></customize-view>
                `;

            case 'help':
                return html` <help-view .onExternalLinkClick=${url => this.handleExternalLinkClick(url)}></help-view> `;

            case 'history':
                return html` <history-view></history-view> `;

            case 'advanced':
                return html` <advanced-view></advanced-view> `;

            case 'assistant':
                return html`
                    <assistant-view
                        .responses=${this.responses}
                        .currentResponseIndex=${this.currentResponseIndex}
                        .selectedProfile=${this.selectedProfile}
                        .onSendText=${message => this.handleSendText(message)}
                        .shouldAnimateResponse=${this.shouldAnimateResponse}
                        .sources=${this.sources}
                        .isLoading=${this.isLoading}
                        @response-index-changed=${this.handleResponseIndexChanged}
                        @new-conversation=${this.handleNewConversation}
                        @response-animation-complete=${() => {
                            this.shouldAnimateResponse = false;
                            this._currentResponseIsComplete = true;
                            console.log('[response-animation-complete] Marked current response as complete');
                            
                            // Add assistant response to chat history when animation completes
                            const assistantView = this.shadowRoot.querySelector('assistant-view');
                            const currentResponse = this.responses[this.currentResponseIndex];
                            if (assistantView && currentResponse && currentResponse.trim()) {
                                // Check if this response is already in chat history to avoid duplicates
                                const lastMessage = assistantView.chatHistory[assistantView.chatHistory.length - 1];
                                const isDuplicate = lastMessage && 
                                    lastMessage.role === 'assistant' && 
                                    lastMessage.content.trim() === currentResponse.trim();
                                    
                                if (!isDuplicate) {
                                    assistantView.chatHistory = [...assistantView.chatHistory, {
                                        role: 'assistant',
                                        content: currentResponse,
                                        timestamp: new Date()
                                    }];
                                    console.log('[response-complete] Added to chat history:', currentResponse.substring(0, 50) + '...');
                                    
                                    // Clear current response from responses array since it's now in chat history
                                    this.responses = [];
                                    this.currentResponseIndex = -1;
                                } else {
                                    console.log('[response-complete] Skipping duplicate response');
                                }
                                
                                // Auto-scroll to bottom after response is complete
                                setTimeout(() => {
                                    assistantView.scrollToBottom();
                                }, 100);
                            }
                            
                            this.requestUpdate();
                        }}
                    ></assistant-view>
                `;

            default:
                return html`<div>Unknown view: ${this.currentView}</div>`;
        }
    }

    render() {
        const mainContentClass = `main-content ${
            this.currentView === 'assistant' ? 'assistant-view' : this.currentView === 'onboarding' ? 'onboarding-view' : 'with-border'
        }`;

        return html`
            <div class="window-container">
                <div class="container">
                    <app-header
                        .currentView=${this.currentView}
                        .statusText=${this.statusText}
                        .startTime=${this.startTime}
                        .advancedMode=${this.advancedMode}
                        .onCustomizeClick=${() => this.handleCustomizeClick()}
                        .onHelpClick=${() => this.handleHelpClick()}
                        .onHistoryClick=${() => this.handleHistoryClick()}
                        .onAdvancedClick=${() => this.handleAdvancedClick()}
                        .onCloseClick=${() => this.handleClose()}
                        .onBackClick=${() => this.handleBackClick()}
                        .onHideToggleClick=${() => this.handleHideToggle()}
                        ?isClickThrough=${this._isClickThrough}
                    ></app-header>
                    <div class="${mainContentClass}">
                        <div class="view-container">${this.renderCurrentView()}</div>
                    </div>
                </div>
            </div>
        `;
    }

    updateLayoutMode() {
        // Apply or remove compact layout class to document root
        if (this.layoutMode === 'compact') {
            document.documentElement.classList.add('compact-layout');
        } else {
            document.documentElement.classList.remove('compact-layout');
        }
    }

    async handleLayoutModeChange(layoutMode) {
        this.layoutMode = layoutMode;
        localStorage.setItem('layoutMode', layoutMode);
        this.updateLayoutMode();

        // Notify main process about layout change for window resizing
        if (window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('update-sizes');
            } catch (error) {
                console.error('Failed to update sizes in main process:', error);
            }
        }

        this.requestUpdate();
    }
}

customElements.define('cheating-daddy-app', CheatingDaddyApp);
