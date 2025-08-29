import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class AssistantView extends LitElement {
    static styles = css`
        :host {
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .content-wrapper {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: hidden;
            gap: 8px;
            padding: 8px;
        }

        .tab-container {
            position: relative;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            backdrop-filter: blur(20px) saturate(150%) brightness(0.8);
            -webkit-backdrop-filter: blur(20px) saturate(150%) brightness(0.8);
            box-shadow: 
                0 20px 40px rgba(0, 0, 0, 0.1),
                0 1px 2px rgba(255, 255, 255, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 0;
            overflow: hidden;
        }

        .tab-container::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent);
            pointer-events: none;
            border-radius: 16px 16px 0 0;
            animation: subtleGlow 3s ease-in-out infinite;
        }

        .tab-header {
            position: relative;
            z-index: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(15px) saturate(120%);
            -webkit-backdrop-filter: blur(15px) saturate(120%);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 12px 16px;
            gap: 12px;
            border-radius: 16px 16px 0 0;
            flex-shrink: 0;
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
            font-size: 11px;
            color: rgba(255, 255, 255, 0.5);
            font-weight: 400;
            letter-spacing: 0.02em;
            text-transform: uppercase;
        }

        .new-chat-button {
            padding: 6px 10px;
            background: rgba(59, 130, 246, 0.03);
            border: 1px solid rgba(59, 130, 246, 0.08);
            color: rgba(255, 255, 255, 0.7);
            border-radius: 6px;
            font-size: 10px;
            font-weight: 400;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 3px;
            backdrop-filter: blur(20px);
        }

        .new-chat-button:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.25);
            transform: translateY(-1px);
        }

        .new-chat-button:active {
            transform: translateY(0);
        }

        .tab-button {
            padding: 8px 14px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: rgba(255, 255, 255, 0.6);
            font-size: 12px;
            font-weight: 500;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 6px;
            text-shadow: none;
            backdrop-filter: blur(30px) saturate(180%);
            -webkit-backdrop-filter: blur(30px) saturate(180%);
            animation: fadeInUp 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
            animation-fill-mode: both;
            box-shadow: 
                0 2px 8px rgba(0, 0, 0, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.03) inset;
            position: relative;
            overflow: hidden;
        }

        .tab-button:nth-child(1) { animation-delay: 0.1s; }
        .tab-button:nth-child(2) { animation-delay: 0.2s; }
        .tab-button:nth-child(3) { animation-delay: 0.3s; }

        .tab-button.active {
            background: rgba(59, 130, 246, 0.08);
            border-color: rgba(59, 130, 246, 0.15);
            color: rgba(255, 255, 255, 0.95);
            box-shadow: 
                0 4px 16px rgba(59, 130, 246, 0.1),
                0 0 0 1px rgba(59, 130, 246, 0.1) inset,
                0 1px 0 0 rgba(255, 255, 255, 0.1) inset;
            transform: translateY(-1px);
        }

        .tab-button:hover:not(.active) {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.15);
            color: rgba(255, 255, 255, 0.85);
            transform: translateY(-1px);
            box-shadow: 
                0 4px 12px rgba(0, 0, 0, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.05) inset;
        }

        .tab-button::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: all 0.4s ease;
        }

        .tab-button:active::before {
            width: 200%;
            height: 200%;
        }

        .tab-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 0;
            position: relative;
            z-index: 1;
            overflow: hidden;
        }

        .response-content {
            display: none;
        }

        .response-content.active {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .sources-content {
            display: none;
        }

        .sources-content.active {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow-y: auto;
            padding: 32px;
        }

        .sources-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .source-item {
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            position: relative;
            overflow: hidden;
            color: rgba(255, 255, 255, 0.95);
            text-shadow: none;
            backdrop-filter: blur(12px);
            animation: fadeInUp 0.6s cubic-bezier(0.4, 0.0, 0.2, 1), breathe 8s ease-in-out infinite;
            animation-fill-mode: both;
        }

        .source-item:nth-child(1) { animation-delay: 0.1s; }
        .source-item:nth-child(2) { animation-delay: 0.2s; }
        .source-item:nth-child(3) { animation-delay: 0.3s; }
        .source-item:nth-child(4) { animation-delay: 0.4s; }
        .source-item:nth-child(5) { animation-delay: 0.5s; }
        .source-item:nth-child(6) { animation-delay: 0.6s; }

        .source-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, rgb(59, 130, 246), rgb(99, 102, 241));
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            animation: subtleGlow 4s ease-in-out infinite;
        }

        .source-item:hover {
            background: rgba(255, 255, 255, 0.18);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
        }

        .source-item:hover::before {
            transform: translateX(0);
        }

        .source-title {
            font-size: 15px;
            font-weight: 600;
            color: rgba(255, 255, 255, 1);
            line-height: 1.4;
            margin-bottom: 8px;
        }

        .source-meta {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.85);
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
            color: rgb(59, 130, 246);
            font-size: 12px;
        }

        .source-authors {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.75);
            line-height: 1.3;
        }


        .history-content {
            display: none;
        }

        .history-content.active {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow-y: auto;
            padding: 16px;
        }

        .history-item {
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 12px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            animation: fadeInUp 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .history-item:hover {
            background: rgba(255, 255, 255, 0.18);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
        }

        .history-title {
            font-size: 15px;
            font-weight: 600;
            color: rgba(255, 255, 255, 1);
            margin-bottom: 8px;
        }

        .history-preview {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.4;
            margin-bottom: 8px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .history-meta {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.4);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .history-empty {
            text-align: center;
            color: rgba(255, 255, 255, 0.5);
            font-size: 14px;
            padding: 40px 20px;
        }


        * {
            font-family: 'Inter', sans-serif;
            cursor: default;
        }

        .response-container {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 12px;
            border-radius: 0;
            font-size: var(--response-font-size, 15px);
            line-height: 1.7;
            background: transparent;
            border: none;
            scroll-behavior: smooth;
            user-select: text;
            cursor: text;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
            letter-spacing: 0.005em;
            word-spacing: 0.02em;
            color: rgba(255, 255, 255, 0.9);
            text-shadow: none;
            min-height: 0;
            max-height: none;
            font-weight: 400;
        }

        .chat-message {
            margin-bottom: 16px;
            padding: 20px 24px;
            border-radius: 12px;
            transition: all 0.2s ease;
            position: relative;
            group: message;
        }

        .chat-message:hover .copy-button {
            opacity: 1;
            transform: translateX(0);
        }

        .chat-message.user {
            background: rgba(59, 130, 246, 0.85);
            border: 1px solid rgba(59, 130, 246, 0.2);
            margin-left: 60px;
            margin-right: 20px;
            backdrop-filter: blur(10px) saturate(120%);
            box-shadow: 0 4px 16px rgba(59, 130, 246, 0.05);
        }

        .chat-message.assistant {
            background: rgba(0, 0, 0, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-left: 0;
            margin-right: 0;
            backdrop-filter: blur(10px) saturate(120%);
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        }

        .chat-message.assistant.streaming-response {
            transition: none; /* Prevent flickering during updates */
        }

        .message-role {
            font-size: 10px;
            font-weight: 500;
            margin-bottom: 4px;
            color: rgba(255, 255, 255, 0.5);
            text-transform: uppercase;
            letter-spacing: 0.8px;
        }

        .message-content {
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.7;
            font-weight: 400;
            letter-spacing: 0.01em;
        }

        .message-timestamp {
            font-size: 9px;
            color: rgba(255, 255, 255, 0.3);
            margin-top: 4px;
        }

        .copy-button {
            position: absolute;
            top: 12px;
            right: 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            padding: 6px;
            cursor: pointer;
            opacity: 0;
            transform: translateX(8px);
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
        }

        .copy-button:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateX(0) scale(1.05);
        }

        .copy-button svg {
            width: 14px;
            height: 14px;
            color: rgba(255, 255, 255, 0.8);
        }

        .copy-button.copied {
            background: rgba(34, 197, 94, 0.2);
            border-color: rgba(34, 197, 94, 0.4);
        }

        .copy-button.copied svg {
            color: rgb(34, 197, 94);
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
        .thinking-indicator {
            padding: 12px 20px;
            background: rgba(255, 255, 255, 0.03);
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(8px);
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
            text-shadow: none;
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
            text-shadow: none;
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
            text-shadow: none;
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
            gap: 8px;
            align-items: stretch;
            background: rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(15px) saturate(130%) brightness(0.9);
            -webkit-backdrop-filter: blur(15px) saturate(130%) brightness(0.9);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            padding: 6px;
            transition: all 0.3s ease;
            flex-shrink: 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.02);
        }

        .text-input-container:focus-within {
            border-color: rgba(59, 130, 246, 0.1);
            background: rgba(59, 130, 246, 0.02);
            box-shadow: 0 4px 20px rgba(59, 130, 246, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.03);
        }

        .input-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: transparent;
            border-radius: 8px;
            transition: all 0.2s ease;
        }

        .input-wrapper:focus-within {
            background: rgba(255, 255, 255, 0.01);
        }

        .text-input-container input {
            flex: 1;
            background: transparent;
            color: rgba(255, 255, 255, 0.9);
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
            color: rgba(255, 255, 255, 0.4);
            font-weight: 400;
        }

        .send-button {
            background: rgba(59, 130, 246, 0.08);
            color: rgba(255, 255, 255, 0.85);
            border: 1px solid rgba(59, 130, 246, 0.15);
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 4px;
            min-width: 50px;
            justify-content: center;
            backdrop-filter: blur(20px);
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.03);
        }

        .send-button:hover {
            background: rgba(59, 130, 246, 0.12);
            border-color: rgba(59, 130, 246, 0.2);
            box-shadow: 0 4px 16px rgba(59, 130, 246, 0.06);
            transform: translateY(-1px);
        }

        .send-button:active {
            transform: translateY(0);
        }

        .send-button:disabled {
            background: rgba(255, 255, 255, 0.03);
            color: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.05);
            cursor: not-allowed;
            transform: none;
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
        chatHistory: { type: Array },
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
        this.systemPrompt = `When generating answers, adhere to the following principles to produce expert-level, trustworthy, and highly relevant responses:

1. Lead with the core answer.
• Identify the user's central question and address it directly in the opening sentence or paragraph.
• Focus on the primary mechanism, cause, or explanation most supported by high-quality evidence.
• Do not preface with phrases like "based on resources" or "according to studies"; integrate evidence seamlessly into the narrative.

2. Prioritize clarity, conciseness, and professional structure.
• Write as if addressing a knowledgeable, professional audience (medical, legal, technical, etc.).
• Use precise terminology and definitions appropriate to the domain.
• Organize the response logically, with clear hierarchies (e.g., primary vs. secondary points), so the reader can quickly grasp the key takeaways.

3. Contextualize intelligently.
• Add relevant context that improves understanding without clutter: comparisons to familiar concepts, distinctions between preclinical and clinical evidence, regulatory or practical implications if applicable.
• Clearly signal the strength or limitations of the evidence without hedging unnecessarily or overstating certainty.

4. Prioritize by relevance and evidentiary strength.
• Emphasize the best-supported explanations first; summarize secondary or emerging findings only if they materially enhance comprehension.
• Avoid giving equal weight to speculative, low-evidence, or tangential mechanisms unless explicitly asked.

5. Synthesize; do not data-dump.
• Extract and integrate insights rather than listing every known pathway, effect, or study detail.
• Translate complexity into an efficient, accurate, and digestible summary.
• Highlight what is most actionable or informative for the likely user intent.

6. Maintain a professional, neutral, and evidence-based tone.
• Be objective and avoid hype, sensationalism, or advocacy unless specifically requested.
• Be transparent about uncertainties or gaps in evidence. Phrases like "evidence is limited" or "primarily observed in animal models" are encouraged where applicable.
• Do not speculate beyond the evidence unless explicitly framed as hypothesis or opinion.

7. Format for readability and rapid comprehension.
• Use headings, bullet points, or brief sections when multiple related mechanisms or concepts must be explained.
• Keep paragraphs focused and avoid unnecessary repetition.
• Present quantitative or technical details only when they enhance clarity.
- ALWAYS get to the point at the beginning - no need to repeat the question. Use easy to read tactics.

Ultimate Goal:
Produce responses that are clear, accurate, and decision-ready—the kind of explanation an expert reference tool, experienced practitioner, or technical reviewer would provide. Every output should empower the user to act or understand with confidence, free from unnecessary speculation or information overload.`;
        this.conversationId = Date.now().toString();
        this.conversationTitle = 'New Chat';
        this.isLoading = false;
        this.chatHistory = [];
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
                
                // Make citations clickable
                rendered = this.makeCitationsClickable(rendered);
                
                return rendered;
            } catch (error) {
                console.warn('Error parsing markdown:', error);
                return this.formatPlainText(content);
            }
        }
        console.log('Marked not available, using plain text formatting');
        return this.makeCitationsClickable(this.formatPlainText(content));
    }

    makeCitationsClickable(content) {
        // Replace citation patterns like [1], [2], [3, 4] with clickable links
        return content.replace(/\[(\d+(?:,\s*\d+)*)\]/g, (match, numbers) => {
            const citationNums = numbers.split(',').map(n => n.trim());
            const links = citationNums.map(num => {
                const sourceIndex = parseInt(num) - 1; // Convert to 0-based index
                const isValidSource = this.sources && sourceIndex >= 0 && sourceIndex < this.sources.length;
                const style = 'color: rgb(59, 130, 246); text-decoration: none; cursor: pointer; padding: 1px 3px; border-radius: 3px; background: rgba(59, 130, 246, 0.1); font-weight: 500;';
                const hoverStyle = 'background: rgba(59, 130, 246, 0.2);';
                
                if (isValidSource) {
                    return `<span class="citation-link" data-source-index="${sourceIndex}" style="${style}" onmouseover="this.style.background='rgba(59, 130, 246, 0.2)'" onmouseout="this.style.background='rgba(59, 130, 246, 0.1)'" onclick="this.getRootNode().host.openSourceByIndex(${sourceIndex})">${num}</span>`;
                } else {
                    return `<span style="${style.replace('cursor: pointer', 'cursor: default')}; opacity: 0.5;">${num}</span>`;
                }
            });
            
            return `[${links.join(', ')}]`;
        });
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

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeForAttribute(text) {
        return text
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r');
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // Less than 1 minute
            return 'Just now';
        } else if (diff < 3600000) { // Less than 1 hour
            const minutes = Math.floor(diff / 60000);
            return `${minutes}m ago`;
        } else if (diff < 86400000) { // Less than 1 day
            const hours = Math.floor(diff / 3600000);
            return `${hours}h ago`;
        } else {
            return date.toLocaleDateString();
        }
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
            
            // Add user message to chat history
            this.chatHistory = [...this.chatHistory, { role: 'user', content: message, timestamp: new Date() }];
            
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


    newChat() {
        // Save current chat to history if it has content
        if (this.responses.length > 0 || this.chatHistory.length > 0) {
            const currentChat = {
                id: this.conversationId,
                title: this.conversationTitle,
                responses: [...this.responses],
                chatHistory: [...this.chatHistory],
                sources: [...this.sources],
                timestamp: new Date()
            };
            
            // Save to localStorage for persistence
            const savedChats = JSON.parse(localStorage.getItem('savedChats') || '[]');
            savedChats.unshift(currentChat); // Add to beginning
            // Keep only last 50 chats
            if (savedChats.length > 50) savedChats.splice(50);
            localStorage.setItem('savedChats', JSON.stringify(savedChats));
        }
        
        // Create new conversation
        this.conversationId = Date.now().toString();
        this.conversationTitle = 'New Chat';
        this.activeTab = 'response';
        this.chatHistory = [];
        
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
        requestAnimationFrame(() => {
            const container = this.shadowRoot.querySelector('#responseContainer');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        });
    }

    scrollToNewAnswer() {
        requestAnimationFrame(() => {
            const container = this.shadowRoot.querySelector('#responseContainer');
            if (container) {
                // Find the streaming assistant message
                const streamingMessage = container.querySelector('.chat-message.assistant.streaming-response');
                if (streamingMessage) {
                    // Get the current position of the streaming message
                    const messageTop = streamingMessage.offsetTop;
                    const containerScrollTop = container.scrollTop;
                    const containerHeight = container.clientHeight;
                    
                    // Only scroll if the top of the message is not visible
                    if (messageTop < containerScrollTop || messageTop > containerScrollTop + 100) {
                        // Scroll to show the top of the streaming answer
                        container.scrollTop = messageTop - 20; // 20px padding from top
                        console.log('Locked to top of streaming response');
                    }
                } else {
                    // Fallback: find the last assistant message
                    const assistantMessages = container.querySelectorAll('.chat-message.assistant');
                    if (assistantMessages.length > 0) {
                        const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
                        const messageTop = lastAssistantMessage.offsetTop;
                        container.scrollTop = messageTop - 20;
                    }
                }
            }
        });
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
        if (changedProperties.has('responses') || changedProperties.has('currentResponseIndex') || changedProperties.has('isLoading') || changedProperties.has('chatHistory')) {
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
                    
                    // Auto-scroll logic - prioritize keeping streaming responses visible
                    if (changedProperties.has('responses') && this.shouldAnimateResponse) {
                        // When a new response is being streamed, stay locked to the top of it
                        setTimeout(() => this.scrollToNewAnswer(), 50);
                    } else if (changedProperties.has('chatHistory')) {
                        // For chat history updates (user messages), scroll to bottom
                        this.scrollToBottom();
                    }
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
            
            // Render chat history and current response
            let chatContent = '';
            
            // Add chat history messages
            this.chatHistory.forEach((message, index) => {
                if (message.role === 'user') {
                    chatContent += `
                        <div class="chat-message user">
                            <div class="message-role">You</div>
                            <div class="message-content">${this.escapeHtml(message.content)}</div>
                            <div class="message-timestamp">${this.formatTimestamp(message.timestamp)}</div>
                        </div>
                    `;
                } else if (message.role === 'assistant') {
                    chatContent += `
                        <div class="chat-message assistant">
                            <button class="copy-button" onclick="this.getRootNode().host.copyToClipboard('${this.escapeForAttribute(message.content)}', this)">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.602-1.43L16.083 2.57A2 2 0 0014.685 2H10a2 2 0 00-2 2z"/>
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2"/>
                                </svg>
                            </button>
                            <div class="message-role">Assistant</div>
                            <div class="message-content">${this.renderMarkdown(message.content)}</div>
                            <div class="message-timestamp">${this.formatTimestamp(message.timestamp)}</div>
                        </div>
                    `;
                }
            });
            
            // Handle current streaming response (only if actively streaming and not in history)
            const currentResponse = this.getCurrentResponse();
            const lastMessage = this.chatHistory[this.chatHistory.length - 1];
            
            // Only show current response if:
            // 1. We have a response
            // 2. It's not the welcome message
            // 3. It's not already in chat history (avoid duplication)
            // 4. We're actively streaming (shouldAnimateResponse is true)
            const shouldShowCurrentResponse = currentResponse && 
                currentResponse !== 'What medical question do you have?' &&
                this.shouldAnimateResponse &&
                (!lastMessage || lastMessage.role !== 'assistant' || lastMessage.content.trim() !== currentResponse.trim());
                
            if (shouldShowCurrentResponse) {
                console.log('Showing streaming response:', currentResponse.substring(0, 50) + '...');
                
                // Show streaming indicator
                container.classList.add('streaming');
                // Remove streaming class after a delay to show completion
                clearTimeout(this._streamingTimeout);
                this._streamingTimeout = setTimeout(() => {
                    container.classList.remove('streaming');
                    this.dispatchEvent(new CustomEvent('response-animation-complete', { bubbles: true, composed: true }));
                }, 2000);
                
                chatContent += `
                    <div class="chat-message assistant streaming-response">
                        <button class="copy-button" onclick="this.getRootNode().host.copyToClipboard('${this.escapeForAttribute(currentResponse)}', this)">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.602-1.43L16.083 2.57A2 2 0 0014.685 2H10a2 2 0 00-2 2z"/>
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2"/>
                            </svg>
                        </button>
                        <div class="message-role">Assistant</div>
                        <div class="message-content">${this.renderMarkdown(currentResponse)}</div>
                    </div>
                `;
            } else if (this.chatHistory.length === 0 && currentResponse === 'What medical question do you have?') {
                // Show welcome message for new chat only
                chatContent = `
                    <div class="chat-message assistant">
                        <div class="message-role">Assistant</div>
                        <div class="message-content">${this.renderMarkdown(currentResponse)}</div>
                    </div>
                `;
            } else if (this.isLoading && this.chatHistory.length > 0) {
                // Show loading state when waiting for new response
                console.log('Waiting for new response...');
            }
            
            // Use requestAnimationFrame for smooth DOM update without flickering
            requestAnimationFrame(() => {
                // Only update if content actually changed to prevent flickering
                if (container.innerHTML !== chatContent) {
                    container.innerHTML = chatContent;
                }
                
                // Auto-scroll based on content type  
                if (this.shouldAnimateResponse && shouldShowCurrentResponse) {
                    // For streaming responses, lock to the top of the new answer
                    setTimeout(() => this.scrollToNewAnswer(), 100);
                } else if (!this.shouldAnimateResponse) {
                    // Only scroll to bottom when not actively streaming
                    this.scrollToBottom();
                }
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

    openSourceByIndex(index) {
        if (this.sources && index >= 0 && index < this.sources.length) {
            const source = this.sources[index];
            console.log(`Opening source ${index + 1}:`, source.title, source.url);
            this.openSource(source.url);
        } else {
            console.warn(`Invalid source index: ${index}`);
        }
    }

    async copyToClipboard(text, buttonElement) {
        try {
            await navigator.clipboard.writeText(text);
            
            // Visual feedback
            buttonElement.classList.add('copied');
            const svg = buttonElement.querySelector('svg');
            if (svg) {
                svg.innerHTML = `
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                `;
            }
            
            // Reset after 2 seconds
            setTimeout(() => {
                buttonElement.classList.remove('copied');
                if (svg) {
                    svg.innerHTML = `
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.602-1.43L16.083 2.57A2 2 0 0014.685 2H10a2 2 0 00-2 2z"/>
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2"/>
                    `;
                }
            }, 2000);
            
            console.log('Text copied to clipboard');
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    }

    renderHistory() {
        try {
            const savedChats = JSON.parse(localStorage.getItem('savedChats') || '[]');
            
            if (savedChats.length === 0) {
                return html`
                    <div class="history-empty">
                        No past conversations yet.<br>
                        Start chatting to see your history here!
                    </div>
                `;
            }
            
            return savedChats.map(chat => {
                const preview = this.getHistoryPreview(chat);
                const messageCount = (chat.chatHistory?.length || 0) + (chat.responses?.length || 0);
                
                return html`
                    <div class="history-item" @click=${() => this.loadChat(chat)}>
                        <div class="history-title">${chat.title}</div>
                        <div class="history-preview">${preview}</div>
                        <div class="history-meta">
                            <span>${this.formatTimestamp(chat.timestamp)}</span>
                            <span>${messageCount} messages</span>
                        </div>
                    </div>
                `;
            });
        } catch (e) {
            return html`<div class="history-empty">Error loading chat history</div>`;
        }
    }

    getHistoryPreview(chat) {
        // Get first user message as preview
        if (chat.chatHistory && chat.chatHistory.length > 0) {
            const firstUserMessage = chat.chatHistory.find(msg => msg.role === 'user');
            if (firstUserMessage) {
                return firstUserMessage.content.substring(0, 100) + (firstUserMessage.content.length > 100 ? '...' : '');
            }
        }
        return 'Empty conversation';
    }

    loadChat(chat) {
        // Load the selected chat
        this.conversationId = chat.id;
        this.conversationTitle = chat.title;
        this.chatHistory = [...(chat.chatHistory || [])];
        this.responses = [...(chat.responses || [])];
        this.sources = [...(chat.sources || [])];
        
        // Switch back to response tab
        this.activeTab = 'response';
        
        // Reset current response index
        this.currentResponseIndex = this.responses.length > 0 ? this.responses.length - 1 : -1;
        
        this.requestUpdate();
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
                                class="tab-button ${this.activeTab === 'history' ? 'active' : ''}"
                                @click=${() => this.switchTab('history')}
                            >
                                📜 History
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
                            ${this.isLoading ? html`
                                <div class="thinking-indicator">
                                    <div class="loading-animation">
                                        <span>Thinking</span>
                                        <div class="thinking-dots">
                                            <div class="dot"></div>
                                            <div class="dot"></div>
                                            <div class="dot"></div>
                                        </div>
                                    </div>
                                </div>
                            ` : ''}
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
                        
                        <div class="history-content ${this.activeTab === 'history' ? 'active' : ''}">
                            ${this.renderHistory()}
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-input-container">
                <div class="input-wrapper">
                    <input type="text" id="textInput" placeholder="Ask a medical question..." @keydown=${this.handleTextKeydown} />
                </div>
                
                <button class="send-button" @click=${this.sendTextMessage}>
                    Send
                </button>
            </div>
        `;
    }
}

customElements.define('assistant-view', AssistantView);
