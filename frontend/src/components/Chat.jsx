import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .page {
    min-height: 100vh;
    background: #FAFAF8;
    display: grid;
    grid-template-columns: 260px 1fr;
    font-family: monospace;
  }

  /* SIDEBAR */
  .sidebar {
    background: #fff;
    border-right: 1px solid #EBEBEA;
    display: flex;
    flex-direction: column;
    padding: 32px 24px;
    min-height: 100vh;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 40px;
  }

  .logo-mark {
    width: 30px;
    height: 30px;
    background: #1A1A1A;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .logo-text {
    font-size: 15px;
    font-weight: 500;
    color: #1A1A1A;
    letter-spacing: -0.01em;
  }

  .sidebar-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #CCC;
    margin-bottom: 12px;
  }

  .doc-card {
    background: #F5F5F3;
    border-radius: 10px;
    padding: 14px;
    margin-bottom: 24px;
  }

  .doc-card-name {
    font-size: 13px;
    font-weight: 500;
    color: #1A1A1A;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 3px;
  }

  .doc-card-meta {
    font-size: 11px;
    color: #AAA;
    font-weight: 300;
  }

  .sidebar-suggestions-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #CCC;
    margin-bottom: 10px;
  }

  .suggestion-btn {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: 1px solid #EBEBEA;
    border-radius: 8px;
    padding: 10px 12px;
    font-family: monospace;
    font-size: 12px;
    font-weight: 300;
    color: #555;
    cursor: pointer;
    margin-bottom: 8px;
    line-height: 1.4;
    transition: background 0.15s, border-color 0.15s;
  }

  .suggestion-btn:hover {
    background: #F5F5F3;
    border-color: #D8D8D4;
    color: #1A1A1A;
  }

  .sidebar-footer {
    margin-top: auto;
    font-size: 11px;
    color: #CCC;
    font-weight: 300;
    padding-top: 24px;
    border-top: 1px solid #EBEBEA;
  }

  /* MAIN */
  .main {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  /* TOP BAR */
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 32px;
    border-bottom: 1px solid #EBEBEA;
    background: #FAFAF8;
    flex-shrink: 0;
  }

  .topbar-title {
    font-family: monospace;
    font-size: 20px;
    color: #1A1A1A;
    letter-spacing: -0.02em;
  }

  .topbar-title em {
    font-style: italic;
    color: #AAA;
  }

  .new-chat-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: 1px solid #EBEBEA;
    border-radius: 8px;
    padding: 7px 14px;
    font-family: monospace;
    font-size: 12px;
    font-weight: 500;
    color: #888;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }

  .new-chat-btn:hover {
    background: #fff;
    border-color: #1A1A1A;
    color: #1A1A1A;
  }

  /* MESSAGES */
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 28px;
    scroll-behavior: smooth;
  }

  .messages::-webkit-scrollbar { width: 4px; }
  .messages::-webkit-scrollbar-track { background: transparent; }
  .messages::-webkit-scrollbar-thumb { background: #E0E0DC; border-radius: 4px; }

  /* EMPTY STATE */
  .empty {
    margin: auto;
    text-align: center;
    max-width: 320px;
  }

  .empty-icon {
    width: 52px;
    height: 52px;
    background: #F0F0EE;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }

  .empty-title {
    font-family: monospace;
    font-size: 22px;
    color: #1A1A1A;
    letter-spacing: -0.02em;
    margin-bottom: 8px;
  }

  .empty-sub {
    font-size: 13px;
    color: #AAA;
    font-weight: 300;
    line-height: 1.6;
  }

  /* MESSAGE ROW */
  .msg-row {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    max-width: 760px;
    width: 100%;
  }

  .msg-row.user {
    align-self: flex-end;
    flex-direction: row-reverse;
  }

  .msg-avatar {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 500;
  }

  .msg-avatar.ai {
    background: #1A1A1A;
    color: #fff;
  }

  .msg-avatar.user {
    background: #F0F0EE;
    color: #888;
  }

  .msg-bubble {
    padding: 14px 18px;
    border-radius: 14px;
    font-size: 14px;
    line-height: 1.65;
    max-width: calc(100% - 44px);
  }

  .msg-row.ai .msg-bubble {
    background: #fff;
    border: 1px solid #EBEBEA;
    color: #1A1A1A;
    border-radius: 4px 14px 14px 14px;
  }

  .msg-row.user .msg-bubble {
    background: #1A1A1A;
    color: #fff;
    border-radius: 14px 4px 14px 14px;
    font-weight: 300;
  }

  /* MARKDOWN PROSE */
  .msg-markdown p { margin-bottom: 10px; line-height: 1.65; }
  .msg-markdown p:last-child { margin-bottom: 0; }
  .msg-markdown strong { font-weight: 500; color: #1A1A1A; }
  .msg-markdown em { font-style: italic; color: #555; }
  .msg-markdown ul, .msg-markdown ol { padding-left: 18px; margin-bottom: 10px; }
  .msg-markdown li { margin-bottom: 5px; line-height: 1.6; }
  .msg-markdown h1, .msg-markdown h2, .msg-markdown h3 {
    font-family: 'monospace;
    font-weight: 400;
    color: #1A1A1A;
    margin: 14px 0 6px;
    letter-spacing: -0.02em;
  }
  .msg-markdown h1 { font-size: 18px; }
  .msg-markdown h2 { font-size: 16px; }
  .msg-markdown h3 { font-size: 14px; }
  .msg-markdown code {
    background: #F0F0EE;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 12px;
    font-family: monospace;
    color: #1A1A1A;
  }
  .msg-markdown pre {
    background: #F5F5F3;
    border: 1px solid #EBEBEA;
    border-radius: 8px;
    padding: 12px 14px;
    overflow-x: auto;
    margin-bottom: 10px;
  }
  .msg-markdown pre code {
    background: none;
    padding: 0;
    font-size: 12px;
  }
  .msg-markdown blockquote {
    border-left: 2px solid #D8D8D4;
    padding-left: 12px;
    color: #888;
    font-style: italic;
    margin-bottom: 10px;
  }

  /* KATEX */
  .msg-markdown .math-display {
    overflow-x: auto;
    padding: 12px 0;
    margin: 10px 0;
  }
  .msg-markdown .math-inline {
    padding: 0 2px;
  }
  .msg-markdown .katex-display {
    background: #F5F5F3;
    border: 1px solid #EBEBEA;
    border-radius: 8px;
    padding: 14px 18px;
    overflow-x: auto;
    margin: 12px 0;
  }
  .msg-markdown .katex {
    font-size: 1em;
  }

  /* TYPING DOTS */
  .typing {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 14px 18px;
    background: #fff;
    border: 1px solid #EBEBEA;
    border-radius: 4px 14px 14px 14px;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #CCC;
    animation: bounce 1.2s infinite ease-in-out;
  }

  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-5px); }
  }

  /* INPUT BAR */
  .input-bar {
    padding: 20px 32px 28px;
    background: #FAFAF8;
    flex-shrink: 0;
  }

  .input-wrap {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    background: #fff;
    border: 1px solid #EBEBEA;
    border-radius: 14px;
    padding: 12px 12px 12px 18px;
    transition: border-color 0.2s;
  }

  .input-wrap:focus-within {
    border-color: #1A1A1A;
  }

  .chat-input {
    flex: 1;
    border: none;
    outline: none;
    background: none;
    font-family: monospace;
    font-size: 14px;
    font-weight: 300;
    color: #1A1A1A;
    resize: none;
    max-height: 120px;
    line-height: 1.5;
    padding: 2px 0;
  }

  .chat-input::placeholder { color: #CCC; }
  .chat-input.empty { text-align: center; }

  .send-btn {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    border: none;
    background: #1A1A1A;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s, transform 0.1s;
  }

  .send-btn:hover:not(:disabled) {
    background: #333;
    transform: scale(1.04);
  }

  .send-btn:disabled {
    background: #E8E8E6;
    cursor: not-allowed;
  }

  .input-hint {
    font-size: 11px;
    color: #CCC;
    font-weight: 300;
    margin-top: 10px;
    text-align: center;
  }

  /* RESPONSIVE */
  @media (max-width: 860px) {
    .page { grid-template-columns: 1fr; }

    .sidebar {
      display: none;
    }

    .topbar { padding: 16px 20px; }
    .messages { padding: 20px; }
    .input-bar { padding: 16px 20px 24px; }
  }

  @media (max-width: 480px) {
    .topbar { padding: 14px 16px; }
    .messages { padding: 16px; gap: 20px; }
    .input-bar { padding: 12px 16px 20px; }
    .msg-bubble { font-size: 13px; }
  }
`;

const SUGGESTIONS = [
  'Summarize the key points',
  'What are the main conclusions?',
  'List any action items mentioned',
  'Explain the most technical section',
];

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (q) => {
    const text = (q || question).trim();
    if (!text || loading) return;
    setQuestion('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/v1/query', { question: text });
      setMessages(prev => [...prev, { role: 'ai', text: res.data.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="page">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-mark">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h10M3 8h6M3 12h8" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="logo-text">Doc Assistant</span>
          </div>

          <p className="sidebar-label">Active document</p>
          <div className="doc-card">
            <p className="doc-card-name">document.pdf</p>
            <p className="doc-card-meta">Ready to query</p>
          </div>

          <p className="sidebar-suggestions-label">Suggested questions</p>
          {SUGGESTIONS.map(s => (
            <button key={s} className="suggestion-btn" onClick={() => send(s)}>
              {s}
            </button>
          ))}

          {/* <div className="sidebar-footer">© 2025 Docqa</div> */}
        </aside>

        {/* MAIN */}
        <div className="main">

          {/* TOPBAR */}
          <div className="topbar">
            <span className="topbar-title">Chat with your <em>document</em></span>
            <button className="new-chat-btn" onClick={() => setMessages([])}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M6.5 2v9M2 6.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              New chat
            </button>
          </div>

          {/* MESSAGES */}
          <div className="messages">
            {messages.length === 0 && !loading && (
              <div className="empty">
                <div className="empty-icon">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M4 5h14M4 9h9M4 13h11M4 17h7" stroke="#888" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="empty-title">Ask your document</p>
                <p className="empty-sub">Type a question below or pick a suggestion from the sidebar to get started.</p>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`msg-row ${m.role}`}>
                <div className={`msg-avatar ${m.role}`}>
                  {m.role === 'ai'
                    ? <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M3 8h6M3 12h8" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/></svg>
                    : <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="4.5" r="2.5" stroke="#888" strokeWidth="1.2"/><path d="M1 12c0-3 11-3 11 0" stroke="#888" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  }
                </div>
                <div className={`msg-bubble ${m.role === "ai" ? "msg-markdown" : ""}`}>{m.role === "ai" ? <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown> : m.text}</div>
              </div>
            ))}

            {loading && (
              <div className="msg-row ai">
                <div className="msg-avatar ai">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M3 8h6M3 12h8" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/></svg>
                </div>
                <div className="typing">
                  <div className="dot"/><div className="dot"/><div className="dot"/>
                </div>
              </div>
            )}

            <div ref={bottomRef}/>
          </div>

          {/* INPUT BAR */}
          <div className="input-bar">
            <div className="input-wrap">
              <textarea
                ref={textareaRef}
                className={`chat-input ${question ? "" : "empty"}`}
                rows={1}
                placeholder="Ask anything about your document…"
                value={question}
                onChange={(e) => { setQuestion(e.target.value); autoResize(e); }}
                onKeyDown={handleKeyDown}
              />
              <button
                className="send-btn"
                onClick={() => send()}
                disabled={!question.trim() || loading}
                aria-label="Send message"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 11V3M7 3L3 7M7 3l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            {/* <p className="input-hint">Press Enter to send · Shift + Enter for new line</p> */}
          </div>

        </div>
      </div>
    </>
  );
}