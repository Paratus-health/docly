import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class AssistantView extends LitElement {
    static styles = css`
        :host {
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .content-wrapper {
            display: flex;
            flex-direction: column;
            height: calc(100% - 70px);
        }

        .tab-container {
            background: var(--main-content-background);
            backdrop-filter: var(--main-content-backdrop-filter);
            -webkit-backdrop-filter: var(--main-content-backdrop-filter);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: hidden;
        }

        .tab-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(0, 0, 0, 0.2);
            border-bottom: 1px solid var(--border-color);
            padding: 4px;
            gap: 4px;
        }

        .tab-nav {
            display: flex;
            gap: 4px;
        }

        .chat-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .conversation-title {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.8);
            font-weight: 500;
        }

        .new-chat-button {
            padding: 6px 12px;
            background: linear-gradient(135deg, #007AFF, #5856D6);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .new-chat-button:hover {
            background: linear-gradient(135deg, #0056CC, #4940B8);
            transform: translateY(-1px);
        }

        .tab-button {
            padding: 8px 16px;
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            font-size: 13px;
            font-weight: 500;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .tab-button.active {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-color);
        }

        .tab-button:hover:not(.active) {
            background: rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.8);
        }

        .tab-content {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
        }

        .response-content {
            display: none;
        }

        .response-content.active {
            display: block;
        }

        .sources-content {
            display: none;
        }

        .sources-content.active {
            display: block;
        }

        .sources-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 16px;
            margin-top: 16px;
        }

        .source-item {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .source-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #007AFF, #5856D6);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }

        .source-item:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .source-item:hover::before {
            transform: translateX(0);
        }

        .source-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-color);
            line-height: 1.4;
            margin-bottom: 8px;
        }

        .source-meta {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .source-journal {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
            margin-right: 8px;
        }

        .source-year {
            font-weight: 600;
            color: #007AFF;
            font-size: 12px;
        }

        .source-authors {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.5);
            line-height: 1.3;
        }

        .system-prompt-content {
            display: none;
        }

        .system-prompt-content.active {
            display: block;
        }

        .prompt-editor {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 16px;
        }

        .prompt-editor h3 {
            color: var(--text-color);
            font-size: 16px;
            margin-bottom: 12px;
            font-weight: 600;
        }

        .prompt-textarea {
            width: 100%;
            min-height: 200px;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: var(--text-color);
            padding: 16px;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.5;
            resize: vertical;
        }

        .prompt-textarea:focus {
            outline: none;
            border-color: #007AFF;
            box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
        }

        .prompt-actions {
            display: flex;
            gap: 12px;
            margin-top: 12px;
        }

        .prompt-button {
            background: linear-gradient(135deg, #007AFF, #5856D6);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .prompt-button:hover {
            background: linear-gradient(135deg, #0056CC, #4940B8);
        }

        .prompt-button.secondary {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-color);
        }

        .prompt-button.secondary:hover {
            background: rgba(255, 255, 255, 0.2);
        }


        * {
            font-family: 'Inter', sans-serif;
            cursor: default;
        }

        .response-container {
            height: auto;
            border-radius: 10px;
            font-size: var(--response-font-size, 16px);
            line-height: 1.7;
            background: var(--main-content-background);
            backdrop-filter: var(--main-content-backdrop-filter);
            -webkit-backdrop-filter: var(--main-content-backdrop-filter);
            border: 1px solid var(--border-color);
            padding: 24px;
            scroll-behavior: smooth;
            user-select: text;
            cursor: text;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            letter-spacing: 0.01em;
            word-spacing: 0.05em;
        }

        /* Elegant scrollbar */
        .response-container::-webkit-scrollbar {
            width: 8px;
        }
        
        .response-container::-webkit-scrollbar-track {
            background: transparent;
        }
        
        .response-container::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
        }
        
        .response-container::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        /* Allow text selection for all content within the response container */
        .response-container * {
            user-select: text;
            cursor: text;
        }

        /* Restore default cursor for interactive elements */
        .response-container a {
            cursor: pointer;
        }

        /* Loading animation for waiting responses */
        .response-container.loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100px;
            position: relative;
        }

        .loading-animation {
            display: flex;
            align-items: center;
            gap: 16px;
            color: var(--text-color);
            font-size: 14px;
            opacity: 0.8;
        }

        .thinking-dots {
            display: flex;
            gap: 4px;
        }

        .thinking-dots .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--text-color);
            animation: thinking 1.4s infinite both;
        }

        .thinking-dots .dot:nth-child(1) {
            animation-delay: 0s;
        }
        
        .thinking-dots .dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .thinking-dots .dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes thinking {
            0%, 80%, 100% {
                transform: scale(0.8);
                opacity: 0.5;
            }
            40% {
                transform: scale(1.1);
                opacity: 1;
            }
        }

        /* Smooth, epilepsy-friendly streaming animation */
        .response-container.streaming {
            position: relative;
        }
        
        .response-container.streaming::after {
            content: '';
            display: inline-block;
            width: 2px;
            height: 1.2em;
            background: var(--text-color);
            animation: blink 1s infinite;
            margin-left: 2px;
            vertical-align: baseline;
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        /* Remove jarring word-by-word animation */
        .response-container [data-word] {
            display: inline;
            opacity: 1;
            transform: none;
            transition: none;
        }
        
        /* Smooth fade-in for new content */
        .response-container {
            transition: opacity 0.15s ease-out;
        }
        
        .response-container.updating {
            opacity: 0.95;
        }

        /* Markdown styling */
        .response-container h1,
        .response-container h2,
        .response-container h3,
        .response-container h4,
        .response-container h5,
        .response-container h6 {
            margin: 1.2em 0 0.6em 0;
            color: var(--text-color);
            text-shadow: var(--text-shadow);
            font-weight: 600;
        }

        .response-container h1 {
            font-size: 1.8em;
        }
        .response-container h2 {
            font-size: 1.5em;
        }
        .response-container h3 {
            font-size: 1.3em;
        }
        .response-container h4 {
            font-size: 1.1em;
        }
        .response-container h5 {
            font-size: 1em;
        }
        .response-container h6 {
            font-size: 0.9em;
        }

        .response-container p {
            margin: 1.2em 0;
            color: var(--text-color);
            text-shadow: var(--text-shadow);
            text-align: justify;
            hyphens: auto;
        }
        
        .response-container p:first-child {
            margin-top: 0;
        }
        
        .response-container p:last-child {
            margin-bottom: 0;
        }

        .response-container ul,
        .response-container ol {
            margin: 0.8em 0;
            padding-left: 2em;
            color: var(--text-color);
            text-shadow: var(--text-shadow);
        }

        .response-container li {
            margin: 0.4em 0;
        }

        .response-container blockquote {
            margin: 1em 0;
            padding: 0.5em 1em;
            border-left: 4px solid var(--focus-border-color);
            background: rgba(0, 122, 255, 0.1);
            font-style: italic;
        }

        .response-container code {
            background: rgba(255, 255, 255, 0.1);
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.85em;
        }

        .response-container pre {
            background: var(--input-background);
            border: 1px solid var(--button-border);
            border-radius: 6px;
            padding: 1em;
            overflow-x: auto;
            margin: 1em 0;
        }

        .response-container pre code {
            background: none;
            padding: 0;
            border-radius: 0;
        }

        .response-container a {
            color: var(--link-color);
            text-decoration: none;
        }

        .response-container a:hover {
            text-decoration: underline;
        }

        .response-container strong,
        .response-container b {
            font-weight: 600;
            color: var(--text-color);
        }

        .response-container em,
        .response-container i {
            font-style: italic;
        }

        .response-container hr {
            border: none;
            border-top: 1px solid var(--border-color);
            margin: 2em 0;
        }

        .response-container table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
        }

        .response-container th,
        .response-container td {
            border: 1px solid var(--border-color);
            padding: 0.5em;
            text-align: left;
        }

        .response-container th {
            background: var(--input-background);
            font-weight: 600;
        }

        .response-container::-webkit-scrollbar {
            width: 8px;
        }

        .response-container::-webkit-scrollbar-track {
            background: var(--scrollbar-track);
            border-radius: 4px;
        }

        .response-container::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 4px;
        }

        .response-container::-webkit-scrollbar-thumb:hover {
            background: var(--scrollbar-thumb-hover);
        }

        .text-input-container {
            display: flex;
            gap: 12px;
            margin-top: 16px;
            align-items: stretch;
            background: var(--main-content-background);
            backdrop-filter: var(--main-content-backdrop-filter);
            -webkit-backdrop-filter: var(--main-content-backdrop-filter);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 8px;
            transition: all 0.3s ease;
        }

        .text-input-container:focus-within {
            border-color: #007AFF;
            box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
        }

        .input-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 4px 12px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            transition: all 0.2s ease;
        }

        .input-wrapper:focus-within {
            background: rgba(255, 255, 255, 0.08);
        }

        .text-input-container input {
            flex: 1;
            background: transparent;
            color: var(--text-color);
            border: none;
            padding: 12px 0;
            font-size: 15px;
            font-weight: 400;
            line-height: 1.4;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .text-input-container input:focus {
            outline: none;
        }

        .text-input-container input::placeholder {
            color: rgba(255, 255, 255, 0.5);
            font-weight: 400;
        }

        .send-button {
            background: linear-gradient(135deg, #007AFF, #5856D6);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 80px;
            justify-content: center;
        }

        .send-button:hover {
            background: linear-gradient(135deg, #0056CC, #4940B8);
            transform: translateY(-1px);
            box-shadow: 0 8px 25px rgba(0, 122, 255, 0.3);
        }

        .send-button:active {
            transform: translateY(0);
        }

        .send-button:disabled {
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.4);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .text-input-container button {
            background: transparent;
            color: var(--start-button-background);
            border: none;
            padding: 0;
            border-radius: 100px;
        }

        .text-input-container button:hover {
            background: var(--text-input-button-hover);
        }

        .nav-button {
            background: transparent;
            color: white;
            border: none;
            padding: 4px;
            border-radius: 50%;
            font-size: 12px;
            display: flex;
            align-items: center;
            width: 36px;
            height: 36px;
            justify-content: center;
        }

        .nav-button:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .nav-button:disabled {
            opacity: 0.3;
        }

        .nav-button svg {
            stroke: white !important;
        }

        .response-counter {
            font-size: 12px;
            color: var(--description-color);
            white-space: nowrap;
            min-width: 60px;
            text-align: center;
        }

        .save-button {
            background: transparent;
            color: var(--start-button-background);
            border: none;
            padding: 4px;
            border-radius: 50%;
            font-size: 12px;
            display: flex;
            align-items: center;
            width: 36px;
            height: 36px;
            justify-content: center;
            cursor: pointer;
        }

        .save-button:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .save-button.saved {
            color: #4caf50;
        }

        .save-button svg {
            stroke: currentColor !important;
        }
    `;

    static properties = {
        responses: { type: Array },
        currentResponseIndex: { type: Number },
        selectedProfile: { type: String },
        onSendText: { type: Function },
        shouldAnimateResponse: { type: Boolean },
        savedResponses: { type: Array },
        sources: { type: Array },
        activeTab: { type: String },
        systemPrompt: { type: String },
        conversationId: { type: String },
        conversationTitle: { type: String },
        isLoading: { type: Boolean },
    };

    constructor() {
        super();
        this.responses = [];
        this.currentResponseIndex = -1;
        this.selectedProfile = 'interview';
        this.onSendText = () => {};
        this._lastAnimatedWordCount = 0;
        this._updatePending = false;
        this.sources = [];
        this.activeTab = 'response';
        this.systemPrompt = localStorage.getItem('systemPrompt') || 'You are a helpful medical AI assistant. Provide accurate, evidence-based medical information while always recommending consulting healthcare professionals for personal medical advice.';
        this.conversationId = Date.now().toString();
        this.conversationTitle = 'New Chat';
        this.isLoading = false;
        // Load saved responses from localStorage
        try {
            this.savedResponses = JSON.parse(localStorage.getItem('savedResponses') || '[]');
        } catch (e) {
            this.savedResponses = [];
        }
    }

    getProfileNames() {
        return {
            interview: 'Job Interview',
            sales: 'Sales Call',
            meeting: 'Business Meeting',
            presentation: 'Presentation',
            negotiation: 'Negotiation',
            exam: 'Exam Assistant',
        };
    }

    getCurrentResponse() {
        const profileNames = this.getProfileNames();
        return this.responses.length > 0 && this.currentResponseIndex >= 0
            ? this.responses[this.currentResponseIndex]
            : `What medical question do you have?`;
    }


    renderMarkdown(content) {
        // Check if marked is available
        if (typeof window !== 'undefined' && window.marked) {
            try {
                // Configure marked for better security and formatting
                window.marked.setOptions({
                    breaks: true,
                    gfm: true,
                    sanitize: false, // We trust the AI responses
                });
                let rendered = window.marked.parse(content);
                return rendered;
            } catch (error) {
                console.warn('Error parsing markdown:', error);
                return this.formatPlainText(content);
            }
        }
        console.log('Marked not available, using plain text formatting');
        return this.formatPlainText(content);
    }

    formatPlainText(content) {
        // Simple plain text formatting with line breaks
        return content
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>')
            .replace(/<p><\/p>/g, '');
    }

    getResponseCounter() {
        return this.responses.length > 0 ? `${this.currentResponseIndex + 1}/${this.responses.length}` : '';
    }

    navigateToPreviousResponse() {
        if (this.currentResponseIndex > 0) {
            this.currentResponseIndex--;
            this.dispatchEvent(
                new CustomEvent('response-index-changed', {
                    detail: { index: this.currentResponseIndex },
                })
            );
            this.requestUpdate();
        }
    }

    navigateToNextResponse() {
        if (this.currentResponseIndex < this.responses.length - 1) {
            this.currentResponseIndex++;
            this.dispatchEvent(
                new CustomEvent('response-index-changed', {
                    detail: { index: this.currentResponseIndex },
                })
            );
            this.requestUpdate();
        }
    }

    scrollResponseUp() {
        const container = this.shadowRoot.querySelector('.response-container');
        if (container) {
            const scrollAmount = container.clientHeight * 0.3; // Scroll 30% of container height
            container.scrollTop = Math.max(0, container.scrollTop - scrollAmount);
        }
    }

    scrollResponseDown() {
        const container = this.shadowRoot.querySelector('.response-container');
        if (container) {
            const scrollAmount = container.clientHeight * 0.3; // Scroll 30% of container height
            container.scrollTop = Math.min(container.scrollHeight - container.clientHeight, container.scrollTop + scrollAmount);
        }
    }

    loadFontSize() {
        const fontSize = localStorage.getItem('fontSize');
        if (fontSize !== null) {
            const fontSizeValue = parseInt(fontSize, 10) || 20;
            const root = document.documentElement;
            root.style.setProperty('--response-font-size', `${fontSizeValue}px`);
        }
    }

    connectedCallback() {
        super.connectedCallback();

        // Load and apply font size
        this.loadFontSize();

        // Set up IPC listeners for keyboard shortcuts
        if (window.require) {
            const { ipcRenderer } = window.require('electron');

            this.handlePreviousResponse = () => {
                console.log('Received navigate-previous-response message');
                this.navigateToPreviousResponse();
            };

            this.handleNextResponse = () => {
                console.log('Received navigate-next-response message');
                this.navigateToNextResponse();
            };

            this.handleScrollUp = () => {
                console.log('Received scroll-response-up message');
                this.scrollResponseUp();
            };

            this.handleScrollDown = () => {
                console.log('Received scroll-response-down message');
                this.scrollResponseDown();
            };

            ipcRenderer.on('navigate-previous-response', this.handlePreviousResponse);
            ipcRenderer.on('navigate-next-response', this.handleNextResponse);
            ipcRenderer.on('scroll-response-up', this.handleScrollUp);
            ipcRenderer.on('scroll-response-down', this.handleScrollDown);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        // Clean up IPC listeners
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            if (this.handlePreviousResponse) {
                ipcRenderer.removeListener('navigate-previous-response', this.handlePreviousResponse);
            }
            if (this.handleNextResponse) {
                ipcRenderer.removeListener('navigate-next-response', this.handleNextResponse);
            }
            if (this.handleScrollUp) {
                ipcRenderer.removeListener('scroll-response-up', this.handleScrollUp);
            }
            if (this.handleScrollDown) {
                ipcRenderer.removeListener('scroll-response-down', this.handleScrollDown);
            }
        }
    }

    async handleSendText() {
        const textInput = this.shadowRoot.querySelector('#textInput');
        if (textInput && textInput.value.trim()) {
            const message = textInput.value.trim();
            textInput.value = ''; // Clear input
            this.isLoading = true;
            this.requestUpdate();
            await this.onSendText(message);
        }
    }

    handleTextKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendText();
        }
    }

    sendTextMessage() {
        this.handleSendText();
    }

    switchTab(tabName) {
        this.activeTab = tabName;
        this.requestUpdate();
    }

    saveSystemPrompt() {
        const textarea = this.shadowRoot.querySelector('.prompt-textarea');
        if (textarea) {
            this.systemPrompt = textarea.value;
            localStorage.setItem('systemPrompt', this.systemPrompt);
            // You could add logic here to update the actual system prompt in the backend
            console.log('System prompt saved:', this.systemPrompt);
        }
    }

    resetSystemPrompt() {
        const defaultPrompt = 'You are a helpful medical AI assistant. Provide accurate, evidence-based medical information while always recommending consulting healthcare professionals for personal medical advice.';
        this.systemPrompt = defaultPrompt;
        localStorage.setItem('systemPrompt', this.systemPrompt);
        const textarea = this.shadowRoot.querySelector('.prompt-textarea');
        if (textarea) {
            textarea.value = this.systemPrompt;
        }
        this.requestUpdate();
    }

    newChat() {
        // Create new conversation
        this.conversationId = Date.now().toString();
        this.conversationTitle = 'New Chat';
        this.activeTab = 'response';
        
        // Notify parent component to start new conversation
        // Parent will handle clearing responses, sources, and backend state
        this.dispatchEvent(new CustomEvent('new-conversation', {
            detail: { conversationId: this.conversationId },
            bubbles: true,
            composed: true
        }));
        
        this.requestUpdate();
    }

    updateConversationTitle(question) {
        // Update title to first few words of the question
        if (this.conversationTitle === 'New Chat' && question) {
            const words = question.split(' ').slice(0, 4).join(' ');
            this.conversationTitle = words.length > 30 ? words.substring(0, 27) + '...' : words;
            this.requestUpdate();
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            const container = this.shadowRoot.querySelector('.response-container');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, 0);
    }

    saveCurrentResponse() {
        const currentResponse = this.getCurrentResponse();
        if (currentResponse && !this.isResponseSaved()) {
            this.savedResponses = [
                ...this.savedResponses,
                {
                    response: currentResponse,
                    timestamp: new Date().toISOString(),
                    profile: this.selectedProfile,
                },
            ];
            // Save to localStorage for persistence
            localStorage.setItem('savedResponses', JSON.stringify(this.savedResponses));
            this.requestUpdate();
        }
    }

    isResponseSaved() {
        const currentResponse = this.getCurrentResponse();
        return this.savedResponses.some(saved => saved.response === currentResponse);
    }

    firstUpdated() {
        super.firstUpdated();
        this.updateResponseContent();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('responses') || changedProperties.has('currentResponseIndex') || changedProperties.has('isLoading')) {
            if (changedProperties.has('currentResponseIndex')) {
                this._lastAnimatedWordCount = 0;
            }
            // Clear loading state when responses change
            if (changedProperties.has('responses') && this.responses.length > 0) {
                this.isLoading = false;
            }
            // Throttle updates for smoother streaming
            if (!this._updatePending) {
                this._updatePending = true;
                requestAnimationFrame(() => {
                    this.updateResponseContent();
                    this._updatePending = false;
                });
            }
        }
    }

    updateResponseContent() {
        console.log('updateResponseContent called');
        const container = this.shadowRoot.querySelector('#responseContainer');
        if (container) {
            // Clear all state classes first
            container.classList.remove('loading', 'streaming', 'updating');
            
            // Show loading animation if waiting for response
            if (this.isLoading && this.responses.length === 0) {
                container.classList.add('loading');
                container.innerHTML = `
                    <div class="loading-animation">
                        <span>Thinking</span>
                        <div class="thinking-dots">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                    </div>
                `;
                return;
            }
            
            const currentResponse = this.getCurrentResponse();
            console.log('Current response:', currentResponse);
            
            // Show streaming indicator if response is being updated
            if (this.shouldAnimateResponse) {
                container.classList.add('streaming');
                // Remove streaming class after a delay to show completion
                clearTimeout(this._streamingTimeout);
                this._streamingTimeout = setTimeout(() => {
                    container.classList.remove('streaming');
                    this.dispatchEvent(new CustomEvent('response-animation-complete', { bubbles: true, composed: true }));
                }, 2000);
            }
            
            // Apply brief update indication for smooth transition
            container.classList.add('updating');
            
            const renderedResponse = this.renderMarkdown(currentResponse);
            console.log('Rendered response:', renderedResponse);
            
            // Use requestAnimationFrame for smooth DOM update
            requestAnimationFrame(() => {
                container.innerHTML = renderedResponse;
                container.classList.remove('updating');
            });
            
        } else {
            console.log('Response container not found');
        }
    }

    openSource(url) {
        if (url && typeof window !== 'undefined' && window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.invoke('open-external', url);
        }
    }

    render() {
        const currentResponse = this.getCurrentResponse();
        const responseCounter = this.getResponseCounter();
        const isSaved = this.isResponseSaved();

        return html`
            <div class="content-wrapper">
                <div class="tab-container">
                    <div class="tab-header">
                        <div class="tab-nav">
                            <button 
                                class="tab-button ${this.activeTab === 'response' ? 'active' : ''}"
                                @click=${() => this.switchTab('response')}
                            >
                                💬 Response
                            </button>
                            <button 
                                class="tab-button ${this.activeTab === 'sources' ? 'active' : ''}"
                                @click=${() => this.switchTab('sources')}
                            >
                                📚 Sources ${this.sources?.length ? `(${this.sources.length})` : ''}
                            </button>
                            <button 
                                class="tab-button ${this.activeTab === 'system-prompt' ? 'active' : ''}"
                                @click=${() => this.switchTab('system-prompt')}
                            >
                                ⚙️ System Prompt
                            </button>
                        </div>
                        <div class="chat-controls">
                            <span class="conversation-title">${this.conversationTitle}</span>
                            <button class="new-chat-button" @click=${this.newChat}>
                                ✨ New Chat
                            </button>
                        </div>
                    </div>
                    
                    <div class="tab-content">
                        <div class="response-content ${this.activeTab === 'response' ? 'active' : ''}">
                            <div class="response-container" id="responseContainer"></div>
                        </div>
                        
                        <div class="sources-content ${this.activeTab === 'sources' ? 'active' : ''}">
                            ${this.sources && this.sources.length > 0 
                                ? html`
                                    <div class="sources-grid">
                                        ${this.sources.map(source => html`
                                            <div class="source-item" @click=${() => this.openSource(source.url)}>
                                                <div class="source-title">${source.title}</div>
                                                <div class="source-meta">
                                                    <div class="source-journal">${source.journal || 'Research Article'}</div>
                                                    <div class="source-year">${source.year || 'N/A'}</div>
                                                </div>
                                                ${source.authors && source.authors.length > 0 
                                                    ? html`<div class="source-authors">${Array.isArray(source.authors) ? source.authors.slice(0, 3).join(', ') + (source.authors.length > 3 ? ' et al.' : '') : source.authors}</div>`
                                                    : ''
                                                }
                                            </div>
                                        `)}
                                    </div>
                                `
                                : html`<div style="color: rgba(255,255,255,0.5); font-size: 14px; text-align: center; padding: 40px;">No sources available for this response</div>`
                            }
                        </div>
                        
                        <div class="system-prompt-content ${this.activeTab === 'system-prompt' ? 'active' : ''}">
                            <div class="prompt-editor">
                                <h3>System Prompt</h3>
                                <textarea 
                                    class="prompt-textarea" 
                                    .value=${this.systemPrompt}
                                    placeholder="Enter your system prompt here..."
                                ></textarea>
                                <div class="prompt-actions">
                                    <button class="prompt-button" @click=${this.saveSystemPrompt}>Save Changes</button>
                                    <button class="prompt-button secondary" @click=${this.resetSystemPrompt}>Reset to Default</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-input-container">
                <button class="nav-button" @click=${this.navigateToPreviousResponse} ?disabled=${this.currentResponseIndex <= 0}>
                    <?xml version="1.0" encoding="UTF-8"?><svg
                        width="24px"
                        height="24px"
                        stroke-width="1.7"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        color="#ffffff"
                    >
                        <path d="M15 6L9 12L15 18" stroke="#ffffff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </button>

                ${this.responses.length > 0 ? html` <span class="response-counter">${responseCounter}</span> ` : ''}

                <button
                    class="save-button ${isSaved ? 'saved' : ''}"
                    @click=${this.saveCurrentResponse}
                    title="${isSaved ? 'Response saved' : 'Save this response'}"
                >
                    <?xml version="1.0" encoding="UTF-8"?><svg
                        width="24px"
                        height="24px"
                        stroke-width="1.7"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M5 20V5C5 3.89543 5.89543 3 7 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L19.4142 5.41421C19.7893 5.78929 20 6.29799 20 6.82843V20C20 21.1046 19.1046 22 18 22H7C5.89543 22 5 21 5 20Z"
                            stroke="currentColor"
                            stroke-width="1.7"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path>
                        <path d="M15 22V13H9V22" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M9 3V8H15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </button>

                
                <div class="input-wrapper">
                    <input type="text" id="textInput" placeholder="Ask a medical question..." @keydown=${this.handleTextKeydown} />
                </div>
                
                <button class="send-button" @click=${this.sendTextMessage}>
                    Send
                </button>

                <button class="nav-button" @click=${this.navigateToNextResponse} ?disabled=${this.currentResponseIndex >= this.responses.length - 1}>
                    <?xml version="1.0" encoding="UTF-8"?><svg
                        width="24px"
                        height="24px"
                        stroke-width="1.7"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        color="#ffffff"
                    >
                        <path d="M9 6L15 12L9 18" stroke="#ffffff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </button>
            </div>
        `;
    }
}

customElements.define('assistant-view', AssistantView);
