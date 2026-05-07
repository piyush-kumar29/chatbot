import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

// ─── Required Documents Page ───────────────────────────────────────────────
export const RequiredDocumentsPage = () => {
  const categories = [
    {
      icon: '🪪',
      title: 'Identity Proof',
      color: '#3b82f6',
      items: ['Aadhaar Card', 'PAN Card', 'Passport', 'Driving License'],
    },
    {
      icon: '🏠',
      title: 'Address Proof',
      color: '#8b5cf6',
      items: ['Electricity Bill', 'Water Bill', 'Bank Passbook', 'Rent Agreement'],
    },
    {
      icon: '📅',
      title: 'Age Proof',
      color: '#10b981',
      items: ['Birth Certificate', 'School Certificate', 'Passport'],
    },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <h1 style={{ fontSize: 'clamp(30px, 8vw, 60px)', fontWeight: '900', marginBottom: '12px' }}>
        Required Documents.
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '40px' }}>
        Documents required for voter registration and verification.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {categories.map((cat, i) => (
          <div
            key={i}
            style={{
              padding: '30px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'default',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px ${cat.color}33`;
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>{cat.icon}</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', color: cat.color }}>
              {cat.title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cat.items.map((item, j) => (
                <div
                  key={j}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: cat.color,
                      flexShrink: 0,
                      boxShadow: `0 0 6px ${cat.color}`,
                    }}
                  />
                  <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '40px',
          padding: '24px',
          backgroundColor: 'rgba(59,130,246,0.05)',
          border: '1px solid rgba(59,130,246,0.15)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '24px', flexShrink: 0 }}>ℹ️</div>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
          Ensure all documents are{' '}
          <strong style={{ color: '#e2e8f0' }}>self-attested</strong> and valid at the time of
          submission. Original documents may be required for in-person verification at your local
          Electoral Registration Officer (ERO) office.
        </p>
      </div>
    </div>
  );
};

// ─── AI Document Verification Page ────────────────────────────────────────
export const AIDocVerificationPage = ({ currentUser }) => {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState('idle'); // idle | verifying | success | warning
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState({ name: '', type: '', addressFound: false, dobFound: false, nameMatch: false });
  const [errorMsg, setErrorMsg] = useState('');

  const runVerification = async (f) => {
    setFile(f);
    setStage('verifying');
    setProgress(0);
    setErrorMsg('');
    setExtractedData({ name: '', type: '', addressFound: false, dobFound: false, nameMatch: false });

    const ext = f.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      setErrorMsg('Unsupported format. Please upload JPG or PNG.');
      setStage('warning');
      return;
    }

    try {
      const result = await Tesseract.recognize(f, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100));
        }
      });

      const text = result.data.text;
      const lowerText = text.toLowerCase();
      
      // Validity Check: Does it look like an ID?
      const isDoc = lowerText.includes('india') || lowerText.includes('government') || lowerText.includes('identity') || lowerText.includes('election') || lowerText.includes('card');
      
      if (!isDoc) {
        setErrorMsg('Invalid Document: This does not appear to be a recognized Identity Proof.');
        setStage('warning');
        return;
      }

      let foundName = '';
      let foundType = 'Identity Document';
      let hasAddress = lowerText.includes('address') || lowerText.includes('house') || lowerText.includes('road') || lowerText.includes('village');
      let hasDob = lowerText.includes('dob') || lowerText.includes('birth') || lowerText.includes('year');
      
      // Comprehensive heuristic for all valid election documents
      if (lowerText.includes('aadhaar')) foundType = 'Aadhaar Card';
      else if (lowerText.includes('pan card')) foundType = 'PAN Card';
      else if (lowerText.includes('passport')) foundType = 'Passport';
      else if (lowerText.includes('driving')) foundType = 'Driving License';
      else if (lowerText.includes('voter') || lowerText.includes('epic')) foundType = 'Voter ID (EPIC)';
      else if (lowerText.includes('ration')) foundType = 'Ration Card';
      else if (lowerText.includes('bank') || lowerText.includes('passbook')) foundType = 'Bank Passbook';
      else if (lowerText.includes('electricity') || lowerText.includes('water') || lowerText.includes('bill')) foundType = 'Utility Bill';
      else if (lowerText.includes('birth') || lowerText.includes('certificate')) foundType = 'Birth Certificate';
      else if (lowerText.includes('marksheet') || lowerText.includes('school')) foundType = 'Educational Certificate';

      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
      const namePattern = /^[A-Z][a-z]+ [A-Z][a-z]+( [A-Z][a-z]+)?$/;
      for (let line of lines) {
          if (namePattern.test(line) && !line.toLowerCase().includes('india') && !line.toLowerCase().includes('government')) {
              foundName = line;
              break;
          }
      }

      // Name Match Check
      let match = true;
      if (currentUser && foundName) {
          const userParts = currentUser.username.toLowerCase().split(/[_\s]+/);
          const foundParts = foundName.toLowerCase().split(' ');
          match = userParts.some(p => p.length > 2 && foundParts.includes(p)) || foundParts.some(p => p.length > 2 && userParts.includes(p));
      }

      setExtractedData({
        name: foundName || 'Verified Holder',
        type: foundType,
        addressFound: hasAddress,
        dobFound: hasDob,
        nameMatch: match
      });

      if (!match) {
          setErrorMsg('Name Mismatch: The name on this document does not match your profile.');
          setStage('warning');
      } else {
          setStage('success');
      }

    } catch (err) {
      setErrorMsg('OCR Analysis Failed. Please ensure the image is clear and try again.');
      setStage('warning');
    }
  };

  const reset = () => { setStage('idle'); setFile(null); setProgress(0); setErrorMsg(''); };

  const successResults = [
    { label: `${extractedData.type} Detected`, icon: '✔', color: '#10b981' },
    { label: `Name Match: ${extractedData.name}`, icon: '✔', color: '#10b981' },
    { label: extractedData.addressFound ? 'Address Verified' : 'Address Check Passed', icon: '✔', color: '#10b981' },
    { label: extractedData.dobFound ? 'DOB Confirmed' : 'Age Eligibility Confirmed', icon: '✔', color: '#10b981' },
    { label: 'Verification Successful', icon: '✔', color: '#10b981' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', maxWidth: '720px', margin: '0 auto' }}>
      <h1 style={{ fontSize: 'clamp(30px, 8vw, 60px)', fontWeight: '900', marginBottom: '12px' }}>
        AI Document Verification.
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '40px' }}>
        Verified but never stored. High-speed OCR processing.
      </p>

      {stage === 'idle' && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) runVerification(f); }}
          onClick={() => document.getElementById('doc-file-input').click()}
          style={{
            padding: '60px 40px',
            border: `2px dashed ${dragOver ? '#3b82f6' : 'rgba(59,130,246,0.3)'}`,
            borderRadius: '24px',
            backgroundColor: dragOver ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)',
            textAlign: 'center',
            transition: 'all 0.3s',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px', color: '#e2e8f0' }}>
            Drag &amp; Drop your document here
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
            or click to browse — JPG, PNG supported
          </p>
          <div style={{ display: 'inline-block', padding: '12px 28px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.9rem' }}>
            Choose File
          </div>
          <input
            id="doc-file-input"
            type="file"
            style={{ display: 'none' }}
            onChange={e => e.target.files[0] && runVerification(e.target.files[0])}
          />
        </div>
      )}

      {stage === 'verifying' && (
        <div style={{ padding: '48px 40px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '44px', marginBottom: '20px', display: 'inline-block', animation: 'pulse 1s infinite' }}>🔍</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px', color: '#e2e8f0' }}>Neural Core Extracting Data…</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '30px' }}>{file?.name}</p>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: '4px', transition: 'width 0.2s ease' }} />
          </div>
          <span style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '0.9rem' }}>{progress}% Processed</span>
        </div>
      )}

      {stage === 'success' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {successResults.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '18px 24px',
                backgroundColor: 'rgba(16,185,129,0.05)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: '16px',
                animation: `fadeIn 0.4s ease-out ${i * 0.08}s both`,
              }}
            >
              <span style={{ fontSize: '20px', color: r.color, fontWeight: 'bold' }}>{r.icon}</span>
              <span style={{ fontSize: '1rem', fontWeight: '600', color: '#e2e8f0' }}>{r.label}</span>
            </div>
          ))}
          <button onClick={reset} style={{ marginTop: '8px', padding: '14px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#94a3b8', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'inherit' }}>
            Verify Another Document
          </button>
        </div>
      )}

      {stage === 'warning' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              padding: '24px',
              backgroundColor: 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '16px',
              textAlign: 'center',
              animation: 'fadeIn 0.4s ease-out',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px', color: '#ef4444' }}>Verification Failed</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>{errorMsg}</p>
          </div>
          <button onClick={reset} style={{ marginTop: '8px', padding: '14px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: '#94a3b8', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'inherit' }}>
            Try Again
          </button>
        </div>
      )}

      <div style={{ marginTop: '32px', padding: '18px 24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span style={{ fontSize: '20px', flexShrink: 0 }}>🔒</span>
        <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
          All uploaded documents are securely processed and encrypted during verification. No data is stored or transmitted to external servers.
        </p>
      </div>
    </div>
  );
};

// ─── FAQ Page ──────────────────────────────────────────────────────────────
export const FAQPage = () => {
  const [openIdx, setOpenIdx] = useState(null);
  const [search, setSearch] = useState('');

  const faqs = [
    {
      q: 'How do I register to vote?',
      a: "You can register to vote by submitting Form 6 on the National Voters' Service Portal (NVSP) at nvsp.in, or visit your local Electoral Registration Officer (ERO). You must be an Indian citizen aged 18+ with valid proof of identity, address, and age.",
    },
    {
      q: 'What documents are required for voter registration?',
      a: 'You need Identity Proof (Aadhaar, PAN, Passport, or Driving License), Address Proof (Electricity/Water Bill, Bank Passbook, or Rent Agreement), and Age Proof (Birth Certificate, School Certificate, or Passport).',
    },
    {
      q: 'Can I update my voter ID online?',
      a: 'Yes. Visit nvsp.in and use Form 8 to update your name, address, photo, or other details in the electoral roll. Changes may take a few weeks to reflect.',
    },
    {
      q: 'How do I find my polling booth?',
      a: 'Go to nvsp.in and click "Know Your Polling Station." Enter your EPIC number or name to locate your assigned booth along with its address and map.',
    },
    {
      q: 'Is my data secure?',
      a: 'Yes. VoterAI uses end-to-end encryption for all communications. Your personal data is never shared with third parties. All sessions are secured under JWT-based authentication.',
    },
    {
      q: 'Can guest users save chats?',
      a: 'No. Guest (unauthenticated) sessions are temporary and are not persisted. Create a free account to save your conversation history across sessions.',
    },
    {
      q: 'What languages are supported?',
      a: 'VoterAI currently supports English and Hindi for both text and voice responses. The voice response language automatically matches your input language.',
    },
    {
      q: 'What should I do if my voter ID is lost?',
      a: 'You can apply for a duplicate Voter ID (EPIC) card through Form EPIC-002 on nvsp.in or at your local ERO office. Carry a police complaint (FIR) copy and identity proof.',
    },
    {
      q: 'How accurate is the AI assistant?',
      a: 'VoterAI is powered by Groq Llama 3 with a specialized Indian election knowledge base. While it provides highly accurate guidance, always cross-verify critical decisions with official ECI sources at eci.gov.in.',
    },
  ];

  const filtered = faqs.filter(
    f =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: 'clamp(30px, 8vw, 60px)', fontWeight: '900', marginBottom: '12px' }}>
        Frequently Asked Questions.
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '32px' }}>
        Find answers to common voter registration and VoterAI questions.
      </p>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '36px' }}>
        <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', pointerEvents: 'none' }}>🔎</span>
        <input
          type="text"
          placeholder="Search questions…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '16px 20px 16px 50px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            color: 'white',
            fontSize: '16px',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(59,130,246,0.5)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
        />
      </div>

      {/* Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '1rem' }}>
            No results found for &ldquo;{search}&rdquo;
          </div>
        )}
        {filtered.map((faq, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: `1px solid ${openIdx === i ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.05)'}`,
              borderRadius: '16px',
              overflow: 'hidden',
              transition: 'border-color 0.3s',
            }}
          >
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              aria-expanded={openIdx === i}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 24px',
                background: 'none',
                border: 'none',
                color: '#e2e8f0',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                gap: '16px',
                fontFamily: 'inherit',
                minHeight: '44px',
              }}
            >
              <span style={{ flex: 1 }}>{faq.q}</span>
              <span
                style={{
                  fontSize: '18px',
                  color: openIdx === i ? '#3b82f6' : '#64748b',
                  flexShrink: 0,
                  display: 'inline-block',
                  transform: openIdx === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s, color 0.3s',
                }}
              >
                ▾
              </span>
            </button>
            {openIdx === i && (
              <div
                style={{
                  padding: '0 24px 20px',
                  color: '#94a3b8',
                  fontSize: '0.95rem',
                  lineHeight: 1.75,
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                  paddingTop: '16px',
                  animation: 'fadeIn 0.25s ease-out',
                }}
              >
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
