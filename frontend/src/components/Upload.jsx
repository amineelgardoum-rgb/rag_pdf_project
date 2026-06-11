import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .page {
    min-height: 100vh;
    background: #FAFAF8;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: monospace;
  }

  /* LEFT PANEL */
  .panel-left {
    background: #fff;
    border-right: 1px solid #EBEBEA;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px;
    min-height: 100vh;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-mark {
    width: 32px;
    height: 32px;
    background: #1A1A1A;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-text {
    font-size: 15px;
    font-weight: 500;
    color: #1A1A1A;
    letter-spacing: -0.01em;
  }
  .text-docs {
  position: relative;
  display: inline-block;
  }
  .text-docs:hover{
  color:green;
  cursor:pointer;
  }
  .text-docs::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: black;
  transition: width 0.3s ease;
}

.text-docs:hover::after {
  width: 100%;
}
  
  .left-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 48px 0;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #888;
    margin-bottom: 24px;
  }

  .tag-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #1A1A1A;
  }

  .hero-title {
    font-size: clamp(36px, 4vw, 52px);
    line-height: 1.08;
    color: #1A1A1A;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
  }

  .hero-title em {
    font-style: italic;
    color: #888;
  }

  .hero-body {
    font-size: 15px;
    font-weight: 300;
    color: #888;
    line-height: 1.7;
    max-width: 340px;
    margin-bottom: 40px;
  }

  .feature-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: #555;
  }

  .feature-icon {
    width: 28px;
    height: 28px;
    background: #F5F5F3;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .left-footer {
    font-size: 12px;
    color: #CCC;
    font-weight: 300;
  }

  /* RIGHT PANEL */
  .panel-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
    background: #FAFAF8;
  }

  .upload-box {
    width: 100%;
    max-width: 420px;
  }

  .upload-box-title {
    font-size: 20px;
    font-weight: 500;
    color: #1A1A1A;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
  }

  .upload-box-sub {
    font-size: 13px;
    color: #AAA;
    margin-bottom: 28px;
    font-weight: 300;
  }

  .dropzone {
    position: relative;
    border: 1.5px dashed #D8D8D4;
    border-radius: 16px;
    padding: 52px 24px;
    text-align: center;
    cursor: pointer;
    background: #fff;
    transition: border-color 0.2s, background 0.2s;
    outline: none;
    margin-bottom: 16px;
  }

  .dropzone:hover, .dropzone.over {
    border-color: #1A1A1A;
    background: #FAFAF8;
  }

  .dropzone.ready {
    border-style: solid;
    border-color: #1A1A1A;
    background: #F7F7F5;
  }

  .dz-icon-wrap {
    width: 56px;
    height: 56px;
    background: #F5F5F3;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 18px;
    transition: background 0.2s;
  }

  .dropzone:hover .dz-icon-wrap,
  .dropzone.over .dz-icon-wrap,
  .dropzone.ready .dz-icon-wrap {
    background: #EAEAE8;
  }

  .dz-title {
    font-size: 14px;
    font-weight: 500;
    color: #1A1A1A;
    margin-bottom: 4px;
  }

  .dz-hint {
    font-size: 12px;
    color: #BBB;
    font-weight: 300;
  }

  .dz-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .file-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    background: #1A1A1A;
    color: #fff;
    font-size: 12px;
    font-weight: 400;
    border-radius: 100px;
    padding: 6px 14px 6px 10px;
    max-width: 280px;
  }

  .file-pill-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .file-pill-size {
    color: #888;
    flex-shrink: 0;
  }

  .progress-wrap {
    height: 2px;
    background: #EBEBEA;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 16px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .progress-wrap.visible { opacity: 1; }

  .progress-bar {
    height: 100%;
    background: #1A1A1A;
    border-radius: 2px;
    width: 0;
    transition: width 0.4s ease;
  }

  .submit-btn {
    width: 100%;
    padding: 14px 24px;
    border-radius: 12px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.15s, transform 0.1s;
    background: #1A1A1A;
    color: #fff;
    letter-spacing: -0.01em;
  }

  .submit-btn:hover:not(:disabled) {
    background: #333;
    transform: translateY(-1px);
  }

  .submit-btn:active:not(:disabled) {
    transform: scale(0.99);
  }

  .submit-btn:disabled {
    background: #E8E8E6;
    color: #BBB;
    cursor: not-allowed;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 1.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .error-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    font-size: 12px;
    color: #D85A30;
  }font-family: 'DM Serif Display', serif;

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 16px 0;
  }

  .divider hr {
    flex: 1;
    border: none;
    border-top: 1px solid #EBEBEA;
  }

  .divider span {
    font-size: 11px;
    color: #CCC;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .note {
    font-size: 11px;
    color: #CCC;
    text-align: center;
    margin-top: 16px;
    font-weight: 300;
  }
  .ending{
  color:black;
  font-size:30;


  }

  @media (max-width: 860px) {
    .page { grid-template-columns: 1fr; }

    .panel-left {
      min-height: auto;
      padding: 32px 28px 40px;
      border-right: none;
      border-bottom: 1px solid #EBEBEA;
    }

    .left-body { padding: 32px 0 0; }
    .feature-list { display: none; }

    .panel-right {
      padding: 40px 28px 48px;
      justify-content: flex-start;
      align-items: flex-start;
    }

    .upload-box { max-width: 100%; }
    .hero-title { font-size: 36px; }
    .dropzone { padding: 44px 20px; }
  }

  @media (max-width: 480px) {
    .panel-left { padding: 24px 20px 32px; }
    .panel-right { padding: 32px 20px 40px; }
    .hero-title { font-size: 30px; }
  }
`;

function fmt(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(1) + ' MB';
}

export default function Upload() {
  const [file, setFile] = useState(null);
  const [over, setOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const accept = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') { setError('Only PDF files are accepted.'); return; }
    setError('');
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(10);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    try {
      await axios.post('http://127.0.0.1:8000/api/v1/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded / e.total) * 90) + 5),
      });
      setProgress(100);
      setTimeout(() => navigate('/chat'), 300);
    } catch {
      setError('Upload failed. Make sure the server is running and try again.');
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="page">

        {/* LEFT */}
        <div className="panel-left">
          <div className="logo">
            <div className="logo-mark">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h10M3 8h6M3 12h8" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="logo-text">Doc Assistant</span>
          </div>

          <div className="left-body">
            <span className="tag"><span className="tag-dot"/> No Hallucination From the LLM Again!</span>
            <h1 className="hero-title">
              Ask anything<br/>about your <strong className='text-docs'>docs.</strong>
            </h1>
            <p className="hero-body">
              Drop a PDF and start a conversation. Extract facts, get summaries, or drill into the details — all from a single chat window.
            </p>
            <ul className="feature-list">
              {[
                ['⚡', 'Fast Answer about your PDF files!'],
                // ['"', 'Source-cited responses'],
                // ['🌐', 'Multilingual document support'],
              ].map(([icon, text]) => (
                <li key={text} className="feature-item">
                  <span className="feature-icon" style={{fontSize: 13}}>{icon}</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* <p className="left-footer">© 2025 Docqa — All rights reserved</p> */}
        </div>

        {/* RIGHT */}
        <div className="panel-right">
          <div className="upload-box">
            <p className="upload-box-title">Upload your document</p>
            <p className="upload-box-sub">PDF files only · max 50 MB</p>

            <div
              className={['dropzone', over ? 'over' : '', file ? 'ready' : ''].filter(Boolean).join(' ')}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setOver(true); }}
              onDragLeave={() => setOver(false)}
              onDrop={(e) => { e.preventDefault(); setOver(false); accept(e.dataTransfer.files[0]); }}
              onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload PDF"
            >
              <input
                ref={inputRef}
                className="dz-input"
                type="file"
                accept=".pdf"
                tabIndex={-1}
                onChange={(e) => accept(e.target.files[0])}
                onClick={(e)=>e.stopPropagation()}
                
              />

              <div className="dz-icon-wrap">
                {file ? (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M4 12l5 5L18 6" stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M11 15V7M11 7L7 11M11 7l4 4" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 17h14" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                )}
              </div>

              {file ? (
                <>
                  <p className="dz-title">File selected</p>
                  <p className="dz-hint">Click to choose a different file</p>
                  <div className="file-pill">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 1.5h5l3 3v6H2v-9z" stroke="#fff" strokeWidth="1.1" strokeLinejoin="round"/>
                    </svg>
                    <span className="file-pill-name">{file.name}</span>
                    <span className="file-pill-size">{fmt(file.size)}</span>
                  </div>
                </>
              ) : (
                <>
                  <p className="dz-title">{over ? 'Release to upload' : 'Drop your PDF here'}</p>
                  <p className="dz-hint">or click to browse files</p>
                </>
              )}
            </div>

            {error && (
              <div className="error-row" role="alert">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.1"/>
                  <path d="M6.5 3.5v3.5M6.5 9v.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <div className="divider">
              <hr/><span>then</span><hr/>
            </div>

            <div className={`progress-wrap${loading ? ' visible' : ''}`}>
              <div className="progress-bar" style={{ width: `${progress}%` }}/>
            </div>

            <button
              className="submit-btn"
              onClick={handleUpload}
              disabled={!file || loading}
            >
              {loading ? (
                <><div className="spinner"/> Uploading…</>
              ) : (
                <>
                  Start chatting
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>

            <p className="note"><span className='ending'>Upload</span> & < span className='ending'>Enjoy Your exploration Journey</span></p>
          </div>
        </div>

      </div>
    </>
  );
}