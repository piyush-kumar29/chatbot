import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import axios from 'axios';
import { Settings, Moon, Sun, Monitor, Maximize, Copy, Check, Trash2, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ROBUST CONSOLIDATED APP ---
// Eliminates all external component imports to resolve the white screen issue.

const SimulationPage = () => {
  const [votes, setVotes] = useState({
    "Candidate A (Progressive)": 1452,
    "Candidate B (Conservative)": 1320,
    "Candidate C (Independent)": 450
  });
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const sortedVotes = Object.entries(votes).sort((a, b) => b[1] - a[1]);

  const handleVote = () => {
    if (!selectedCandidate) return;
    setVotes(prev => ({
      ...prev,
      [selectedCandidate]: prev[selectedCandidate] + 1
    }));
    setHasVoted(true);
  };

  // Simulate live incoming votes
  useEffect(() => {
    const interval = setInterval(() => {
      const keys = Object.keys(votes);
      const randomCandidate = keys[Math.floor(Math.random() * keys.length)];
      setVotes(prev => ({
        ...prev,
        [randomCandidate]: prev[randomCandidate] + Math.floor(Math.random() * 5)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <h1 style={{ fontSize: 'clamp(32px, 8vw, 60px)', fontWeight: '900', marginBottom: '20px' }}>Live Voting Simulation.</h1>
      <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '40px' }}>Experience a secure, real-time cryptographic voting terminal with live analytics.</p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Voting Terminal */}
        <div style={{ flex: 1, minWidth: 'min(300px, 100%)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#ef4444', animation: 'pulse 2s infinite' }}>●</span> Cast Your Vote</h2>

          {hasVoted ? (
            <div style={{ textAlign: 'center', padding: '40px 0', animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
              <h3 style={{ fontSize: '20px', color: '#10b981', marginBottom: '10px' }}>Vote Successfully Recorded</h3>
              <p style={{ color: '#64748b' }}>Your cryptographic hash has been added to the blockchain ledger.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {Object.keys(votes).map(candidate => (
                <div
                  key={candidate}
                  onClick={() => setSelectedCandidate(candidate)}
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    border: selectedCandidate === candidate ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: selectedCandidate === candidate ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    transform: selectedCandidate === candidate ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{candidate}</div>
                </div>
              ))}
              <button
                onClick={handleVote}
                disabled={!selectedCandidate}
                style={{
                  marginTop: '20px',
                  padding: '20px',
                  backgroundColor: selectedCandidate ? '#3b82f6' : '#1e293b',
                  color: selectedCandidate ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  cursor: selectedCandidate ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s',
                  boxShadow: selectedCandidate ? '0 10px 20px rgba(59,130,246,0.3)' : 'none'
                }}
              >
                AUTHORIZE & SUBMIT
              </button>
            </div>
          )}
        </div>

        {/* Analytics Engine */}
        <div style={{ flex: 1.5, minWidth: 'min(300px, 100%)', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>📊 Live Analytics Hub</h2>
            <div style={{ color: '#3b82f6', fontWeight: 'bold', backgroundColor: 'rgba(59,130,246,0.1)', padding: '5px 15px', borderRadius: '20px' }}>
              {totalVotes.toLocaleString()} Total Votes
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {sortedVotes.map(([candidate, count], index) => {
              const percentage = ((count / totalVotes) * 100).toFixed(1);
              return (
                <div key={candidate}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: index === 0 ? '#10b981' : 'white' }}>{candidate} {index === 0 && '🏆'}</span>
                    <span style={{ color: '#94a3b8' }}>{count.toLocaleString()} ({percentage}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: index === 0 ? '#10b981' : '#3b82f6',
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '40px', padding: '20px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ color: '#94a3b8', marginBottom: '10px', fontSize: '14px' }}>SYSTEM INSIGHTS</h4>
            <p style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.6' }}>
              The leading candidate currently holds a <strong>{((sortedVotes[0][1] / totalVotes) * 100).toFixed(1)}%</strong> majority.
              Live telemetry indicates sustained high turnout. Cryptographic hash rate remains stable.
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

const AdminDashboard = ({ token, currentUser }) => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('https://chatbot-0g7m.onrender.com/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsersList(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await axios.put(`https://chatbot-0g7m.onrender.com/api/auth/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsersList(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to completely remove this user? This action cannot be undone.")) return;
    try {
      await axios.delete(`https://chatbot-0g7m.onrender.com/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsersList(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete user");
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <h1 style={{ fontSize: 'clamp(28px, 7vw, 60px)', fontWeight: '900', marginBottom: '20px' }}>System Administration.</h1>
      <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '40px' }}>Global registry of all verified neural link users.</p>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#3b82f6', fontWeight: 'bold' }}>Scanning Database...</div>
      ) : error ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          Access Denied: {error}
        </div>
      ) : (
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <div style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>👥 User Ledger</h3>
            <span style={{ backgroundColor: 'rgba(59,130,246,0.2)', color: '#3b82f6', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>{usersList.length} Active Nodes</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: '#64748b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <th style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Username</th>
                  <th style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Email</th>
                  <th style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Clearance</th>
                  <th style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Initialization Date</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u, i) => (
                  <tr key={u._id} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: '500' }}>@{u.username}</td>
                    <td style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8' }}>{u.email}</td>
                    <td style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: u.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                          color: u.role === 'admin' ? '#ef4444' : '#10b981',
                          border: `1px solid ${u.role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                        }}>
                          {u.role.toUpperCase()}
                        </span>
                        {currentUser && currentUser.username !== u.username && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleRoleChange(u._id, u.role)}
                              style={{
                                background: 'none',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: '#94a3b8',
                                fontSize: '11px',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={e => e.currentTarget.style.color = '#fff'}
                              onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
                            >
                              {u.role === 'admin' ? 'Revoke' : 'Promote'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#ef4444',
                                fontSize: '11px',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                              onMouseOut={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#64748b', fontSize: '14px' }}>{new Date(u.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const ECIPortal = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    state: '', constituency: '', district: '',
    firstName: '', lastName: '',
    relativeName: '', relativeType: '',
    mobile: '', email: '',
    aadhar: '', epicId: '',
    gender: '', dob: '', dobProof: '',
    address: '', village: '', postOffice: '', pinCode: '',
    addressProof: '', disability: '',
    declarationPlace: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => setStep(prev => Math.min(prev + 1, 9));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const submitForm = () => {
    setSubmitted(true);
    setTimeout(() => {
      setStep(1);
      setFormData({ state: '', constituency: '', name: '', dob: '', relativeName: '', mobile: '', address: '', epicId: '', aadhar: '', document: null });
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', maxWidth: '800px', margin: '0 auto', padding: '0 4px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: 'clamp(26px, 6vw, 48px)', fontWeight: '900', color: '#fff', marginBottom: '10px' }}>
          <span style={{ color: '#3b82f6' }}>ECI</span> National Voter Portal
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Official Simulation for Elector Registration & Verification</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              backgroundColor: step >= num ? '#3b82f6' : 'rgba(255,255,255,0.05)',
              color: step >= num ? 'white' : 'gray',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', border: `2px solid ${step >= num ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`,
              transition: 'all 0.3s', fontSize: '12px'
            }}>
              {num}
            </div>
            {num < 9 && <div style={{ width: '20px', height: '2px', backgroundColor: step > num ? '#3b82f6' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />}
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '40px 0', animation: 'scaleIn 0.5s ease-out' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🇮🇳</div>
            <h3 style={{ fontSize: '24px', color: '#10b981', marginBottom: '10px' }}>Application Submitted Successfully</h3>
            <p style={{ color: '#94a3b8' }}>Your form 6 data has been securely transmitted. A reference ID will be sent to your registered mobile.</p>
          </div>
        ) : (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#e2e8f0' }}>
              {step === 1 && "Step 1: State & Constituency"}
              {step === 2 && "Step 2: Personal Details"}
              {step === 3 && "Step 3: Relatives Details"}
              {step === 4 && "Step 4: Contact Details"}
              {step === 5 && "Step 5: Aadhaar Details"}
              {step === 6 && "Step 6: Gender & Date of Birth"}
              {step === 7 && "Step 7: Present Ordinary Residence"}
              {step === 8 && "Step 8: Disability & Optional Details"}
              {step === 9 && "Step 9: Declaration"}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
              {step === 1 && (
                <>
                  <select value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#0a0a0c', color: 'white', width: '100%', boxSizing: 'border-box', appearance: 'none', cursor: 'pointer' }}>
                    <option value="" disabled>Select State / Union Territory</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                    <optgroup label="Union Territories">
                      <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                      <option value="Chandigarh">Chandigarh</option>
                      <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra & Nagar Haveli & Daman & Diu</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                      <option value="Ladakh">Ladakh</option>
                      <option value="Lakshadweep">Lakshadweep</option>
                      <option value="Puducherry">Puducherry</option>
                    </optgroup>
                  </select>
                  <input type="text" placeholder="District" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                  <input type="text" placeholder="Assembly Constituency" value={formData.constituency} onChange={e => setFormData({ ...formData, constituency: e.target.value })} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                </>
              )}
              {step === 2 && (
                <>
                  <input type="text" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                  <input type="text" placeholder="Surname" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                </>
              )}
              {step === 3 && (
                <>
                  <input type="text" placeholder="Name of Relative" value={formData.relativeName} onChange={e => setFormData({ ...formData, relativeName: e.target.value })} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                  <select value={formData.relativeType} onChange={e => setFormData({ ...formData, relativeType: e.target.value })} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#0a0a0c', color: 'white', width: '100%', boxSizing: 'border-box', appearance: 'none', cursor: 'pointer' }}>
                    <option value="" disabled>Relation Type</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Husband">Husband</option>
                    <option value="Wife">Wife</option>
                    <option value="Legal Guardian">Legal Guardian</option>
                  </select>
                </>
              )}
              {step === 4 && (
                <>
                  <input type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                  <input type="email" placeholder="Email ID (Optional)" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                </>
              )}
              {step === 5 && (
                <>
                  <input type="text" placeholder="12-Digit Aadhaar Number" value={formData.aadhar} onChange={e => setFormData({ ...formData, aadhar: e.target.value })} maxLength="12" style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', letterSpacing: '2px', boxSizing: 'border-box' }} />
                  <p style={{ color: '#64748b', fontSize: '12px', marginTop: '-10px' }}>Providing Aadhaar is voluntary for electoral roll authentication (Form 6B).</p>
                </>
              )}
              {step === 6 && (
                <>
                  <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#0a0a0c', color: 'white', width: '100%', boxSizing: 'border-box', appearance: 'none', cursor: 'pointer' }}>
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Third Gender">Third Gender</option>
                  </select>
                  <input type="date" placeholder="Date of Birth" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', colorScheme: 'dark', boxSizing: 'border-box' }} />
                  <div style={{ border: '1px dashed rgba(59,130,246,0.5)', padding: '20px', borderRadius: '12px', textAlign: 'center', backgroundColor: 'rgba(59,130,246,0.05)' }}>
                    <p style={{ color: '#60a5fa', marginBottom: '10px', fontSize: '14px' }}>Upload Date of Birth Proof (Birth Certificate, Class 10 Marksheet, etc.)</p>
                    <input type="file" style={{ color: '#94a3b8', fontSize: '14px' }} />
                  </div>
                </>
              )}
              {step === 7 && (
                <>
                  <input type="text" placeholder="House/Building/Apartment No." value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                  <input type="text" placeholder="Village / Town" value={formData.village} onChange={e => setFormData({ ...formData, village: e.target.value })} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                  <input type="text" placeholder="PIN Code" value={formData.pinCode} onChange={e => setFormData({ ...formData, pinCode: e.target.value })} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                  <div style={{ border: '1px dashed rgba(59,130,246,0.5)', padding: '20px', borderRadius: '12px', textAlign: 'center', backgroundColor: 'rgba(59,130,246,0.05)' }}>
                    <p style={{ color: '#60a5fa', marginBottom: '10px', fontSize: '14px' }}>Upload Address Proof (Utility Bill, Passport, etc.)</p>
                    <input type="file" style={{ color: '#94a3b8', fontSize: '14px' }} />
                  </div>
                </>
              )}
              {step === 8 && (
                <>
                  <select value={formData.disability} onChange={e => setFormData({ ...formData, disability: e.target.value })} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#0a0a0c', color: 'white', width: '100%', boxSizing: 'border-box', appearance: 'none', cursor: 'pointer' }}>
                    <option value="" disabled>Category of Disability (Optional)</option>
                    <option value="None">None</option>
                    <option value="Locomotive">Locomotive</option>
                    <option value="Visual">Visual</option>
                    <option value="Deaf & Dumb">Deaf & Dumb</option>
                    <option value="Other">Other</option>
                  </select>
                  <input type="text" placeholder="Existing EPIC No. of Family Member (Optional)" value={formData.epicId} onChange={e => setFormData({ ...formData, epicId: e.target.value })} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                </>
              )}
              {step === 9 && (
                <>
                  <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ color: '#e2e8f0', marginBottom: '10px' }}>Declaration</h4>
                    <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', marginBottom: '15px' }}>
                      I hereby declare that to the best of my knowledge and belief: <br />
                      (i) I am a citizen of India and place of my birth is within India. <br />
                      (ii) I am ordinarily a resident at the address given in Step 7. <br />
                      (iii) I have not applied for the inclusion of my name in the electoral roll for any other constituency.
                    </p>
                    <input type="text" placeholder="Place" value={formData.declarationPlace} onChange={e => setFormData({ ...formData, declarationPlace: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box', marginBottom: '15px' }} />
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <input type="checkbox" id="declare" style={{ marginTop: '4px' }} />
                      <label htmlFor="declare" style={{ color: '#3b82f6', fontSize: '14px', fontWeight: 'bold' }}>I Agree and Accept</label>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={handlePrev} disabled={step === 1} style={{ padding: '12px 24px', backgroundColor: step === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', color: step === 1 ? 'rgba(255,255,255,0.2)' : 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: step === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>Back</button>
              {step < 9 ? (
                <button onClick={handleNext} style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Continue</button>
              ) : (
                <button onClick={submitForm} style={{ padding: '12px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Submit Form 6</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('voter_user')) || null);
  const [token, setToken] = useState(localStorage.getItem('voter_token') || null);
  const [authData, setAuthData] = useState({ username: '', email: '', password: '' });
  const [historyList, setHistoryList] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('system');
  const [chatSize, setChatSize] = useState('medium');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('voterai-theme') || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (t) => {
    if (t === 'dark') {
      document.documentElement.removeAttribute('data-theme');
    } else if (t === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      if (prefersLight) document.documentElement.setAttribute('data-theme', 'light');
      else document.documentElement.removeAttribute('data-theme');
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('voterai-theme', newTheme);
    applyTheme(newTheme);
  };

  const handleInputText = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleCopy = (text, idx) => {
      navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    if (isChatOpen && user && token) {
      fetchHistory();
    }
  }, [isChatOpen, user, token]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('https://chatbot-0g7m.onrender.com/api/chat/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistoryList(res.data);
    } catch (e) {
      console.error("History fetch failed");
    }
  };

  const loadConversation = async (conv) => {
    setActiveConvId(conv._id);
    setMessages(conv.messages.map(m => ({
      role: m.role === 'assistant' ? 'bot' : 'user',
      content: m.content,
      thought: m.thought
    })));
  };

  const deleteConversation = async (e, convId) => {
    e.stopPropagation();
    try {
      await axios.delete(`https://chatbot-0g7m.onrender.com/api/chat/${convId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistoryList(prev => prev.filter(c => c._id !== convId));
    } catch (err) {
      console.error("Failed to delete conversation");
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleAuth = async (type) => {
    setIsLoading(true);
    try {
      const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const res = await axios.post(`https://chatbot-0g7m.onrender.com${endpoint}`, authData);
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('voter_token', res.data.token);
      localStorage.setItem('voter_user', JSON.stringify(res.data.user));
      setCurrentPage('home');
    } catch (e) {
      alert(e.response?.data?.error || "Authentication Failed");
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('voter_token');
    localStorage.removeItem('voter_user');
    setCurrentPage('home');
  };

  const handleSend = async (text, isInitial = false) => {
    const msg = text || input;
    if (!msg.trim() && !attachedFile && !isInitial) return;

    let displayContent = msg;
    if (attachedFile && !isInitial) {
      displayContent += (msg ? '\n\n' : '') + `📎 [Document Attached: ${attachedFile.name}]`;
    }

    if (!isInitial) {
      setMessages(prev => [...prev, { role: 'user', content: displayContent }]);
      setInput('');
      setAttachedFile(null);
    }
    setIsLoading(true);

    let payloadMessage = msg;
    if (attachedFile && !isInitial) {
      payloadMessage += `\n\n[System Note: The user has uploaded a document named "${attachedFile.name}". Please simulate a secure document verification process for this file assuming it is related to voter registration (like an ID card, utility bill, etc.) and give them feedback on whether it looks valid or what else might be needed.]`;
    }

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post('https://chatbot-0g7m.onrender.com/api/chat',
        { message: payloadMessage, conversationId: activeConvId },
        { headers }
      );
      const data = res.data;
      setMessages(prev => [...prev, { role: 'bot', content: data.content, thought: data.thought }]);
      if (data.conversationId) setActiveConvId(data.conversationId);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', content: "Neural Core Offline. Please check your connection." }]);
    }
    setIsLoading(false);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative', overflowX: 'hidden', transition: 'background-color 0.3s, color 0.3s' }}>
      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, width: '100%', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-chat)', backdropFilter: 'blur(10px)', zIndex: 100, borderBottom: '1px solid var(--glass-border)', boxSizing: 'border-box', transition: 'background-color 0.3s' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-1px' }}>VOTER AI</div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button onClick={() => setCurrentPage('home')} style={{ background: 'none', border: 'none', color: currentPage === 'home' ? 'var(--accent-blue)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 'bold' }}>CORE</button>
          <button onClick={() => setCurrentPage('features')} style={{ background: 'none', border: 'none', color: currentPage === 'features' ? 'var(--accent-blue)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 'bold' }}>FEATURES</button>
          <button onClick={() => setCurrentPage('simulation')} style={{ background: 'none', border: 'none', color: currentPage === 'simulation' ? 'var(--accent-blue)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 'bold' }}>SIMULATION</button>
          <button onClick={() => setCurrentPage('portal')} style={{ background: 'none', border: 'none', color: currentPage === 'portal' ? 'var(--accent-blue)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 'bold' }}>ECI PORTAL</button>
          {user?.role === 'admin' && (
            <button onClick={() => setCurrentPage('admin')} style={{ background: 'none', border: 'none', color: currentPage === 'admin' ? '#ef4444' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 'bold' }}>ADMIN</button>
          )}
          {user ? (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>@{user.username}</span>
              <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer' }}>EXIT</button>
            </div>
          ) : (
            <>
              <button onClick={() => setCurrentPage('login')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 'bold' }}>LOGIN</button>
              <button onClick={() => setCurrentPage('signup')} style={{ backgroundColor: 'var(--accent-blue)', color: '#ffffff', padding: '10px 20px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>SIGN UP</button>
            </>
          )}
          <button onClick={() => setIsChatOpen(true)} style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--glass-border)', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>CHAT</button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ paddingTop: '100px', paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px', boxSizing: 'border-box' }}>
        {currentPage === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '40px' }}>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: 'clamp(40px, 10vw, 90px)', fontWeight: '900', lineHeight: 0.9, marginBottom: '30px', background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Verify. Register. <br /><span style={{ color: 'var(--accent-blue)', WebkitTextFillColor: 'var(--accent-blue)' }}>Execute.</span></h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '40px', lineHeight: 1.6 }}>The advanced expert system for the Indian Electoral Process. Accurate, fast, and encrypted. Ask any question about voter registration, document proof, or local constituencies.</p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button onClick={() => setIsChatOpen(true)} style={{ padding: '14px 28px', fontSize: '1rem', backgroundColor: 'var(--accent-blue)', color: '#ffffff', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)', transition: 'all 0.3s' }}>Start Neural Session</button>
                  <button onClick={() => setCurrentPage('features')} style={{ padding: '14px 28px', fontSize: '1rem', backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>View Architecture</button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <div style={{ width: 'clamp(200px, 50vw, 320px)', height: 'clamp(200px, 50vw, 320px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(3,3,5,0) 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)', boxShadow: '0 0 40px var(--shadow-color)' }}>
                  <div style={{ fontSize: 'clamp(60px, 15vw, 100px)', filter: 'drop-shadow(0 10px 20px rgba(59,130,246,0.3))' }}>🛡️</div>
                </div>
              </div>
            </div>

            {/* Suggested Queries Section */}
            <div style={{ padding: '40px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '24px', backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px var(--shadow-color)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--text-primary)' }}>Suggested Queries</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                {[
                  "Am I eligible to vote in the upcoming Lok Sabha elections?",
                  "What documents do I need to register as a new voter?",
                  "How can I update my address on my Voter ID card?",
                  "How do I find out where my polling booth is located?",
                  "Can I vote if I am an NRI (Non-Resident Indian)?"
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setIsChatOpen(true);
                      setTimeout(() => handleSend(q, false), 100);
                    }}
                    style={{
                      padding: '15px 20px',
                      backgroundColor: 'rgba(59,130,246,0.05)',
                      border: '1px solid rgba(59,130,246,0.2)',
                      borderRadius: '12px',
                      color: '#60a5fa',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.15)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {currentPage === 'admin' && <AdminDashboard token={token} currentUser={user} />}
        {currentPage === 'simulation' && <SimulationPage />}
        {currentPage === 'portal' && <ECIPortal />}
        {currentPage === 'features' && (
          <div>
            <h1 style={{ fontSize: 'clamp(30px, 8vw, 60px)', fontWeight: '900', marginBottom: '30px' }}>System Architecture.</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              {[
                { title: 'Neural Heuristics', desc: 'Advanced AI-driven expert system providing legally accurate electoral guidance.', icon: '🧠' },
                { title: 'Secure Sessions', desc: 'Encrypted, persistent conversation history tied directly to your profile.', icon: '🔒' },
                { title: 'Groq Llama 3', desc: 'Powered by the ultra-fast Groq LPU inference engine for instant responses.', icon: '⚡' },
                { title: 'Dynamic Fallback', desc: 'Seamless degradation to deterministic rules if the primary AI core is unreachable.', icon: '🛡️' },
                { title: 'Real-time Verification', desc: 'Instantly check eligibility rules, document requirements, and form guides.', icon: '✅' },
                { title: 'Responsive UI', desc: 'Fluid, glassmorphic interface that adapts to any screen size and workflow.', icon: '📱' }
              ].map((feature, i) => (
                <div key={i} style={{ padding: '30px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontSize: '30px', marginBottom: '15px' }}>{feature.icon}</div>
                  <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', fontWeight: 'bold' }}>{feature.title}</h3>
                  <p style={{ color: '#64748b', lineHeight: 1.5 }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {(currentPage === 'login' || currentPage === 'signup') && (
          <div style={{ maxWidth: '400px', margin: '0 auto', padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', boxSizing: 'border-box' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>{currentPage.toUpperCase()}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {currentPage === 'signup' && (
                <input
                  type="text" placeholder="Username"
                  value={authData.username} onChange={e => setAuthData({ ...authData, username: e.target.value })}
                  style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box', fontSize: '16px' }}
                />
              )}
              <input
                type="email" placeholder="Email"
                value={authData.email} onChange={e => setAuthData({ ...authData, email: e.target.value })}
                style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box', fontSize: '16px' }}
              />
              <input
                type="password" placeholder="Password"
                value={authData.password} onChange={e => setAuthData({ ...authData, password: e.target.value })}
                style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box', fontSize: '16px' }}
              />
              <button
                onClick={() => handleAuth(currentPage)}
                style={{ padding: '15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {isLoading ? 'Processing...' : (currentPage === 'login' ? 'Login to Neural Link' : 'Initialize Profile')}
              </button>
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                {currentPage === 'login' ? "New here? " : "Already have a profile? "}
                <span
                  onClick={() => setCurrentPage(currentPage === 'login' ? 'signup' : 'login')}
                  style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {currentPage === 'login' ? 'Create Account' : 'Login'}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Overlay */}
      {isChatOpen && (
        <motion.div 
          className={`chat-window size-${chatSize}`}
          drag={chatSize !== 'fullscreen'}
          dragConstraints={{ left: -500, right: 0, top: -500, bottom: 0 }}
          dragElastic={0.1}
          dragMomentum={false}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          style={{ zIndex: 1000 }}
        >
          <div className="chat-header">
            <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
              <div className="chat-header-avatar" style={{ width: '28px', height: '28px' }}>🤖</div>
              Neural Core V4.0
            </span>
            <div className="chat-header-actions">
              {user && (
                <button
                  onClick={() => { setActiveConvId(null); setMessages([]); }}
                  style={{ background: 'none', border: '1px solid var(--accent-blue)', color: 'var(--accent-blue)', fontSize: '11px', borderRadius: '4px', cursor: 'pointer', padding: '2px 8px', fontWeight: 'bold' }}
                >
                  NEW
                </button>
              )}
              <button onClick={() => setShowSettings(!showSettings)} className="chat-settings-btn" aria-label="Settings" style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Settings size={16} />
              </button>
              <button onClick={() => setIsChatOpen(false)} className="chat-close-btn" aria-label="Close" style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>

          <AnimatePresence>
              {showSettings && (
                  <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="chat-settings-panel"
                  >
                      <div className="setting-item">
                          <span className="setting-label">Theme</span>
                          <div className="setting-btn-group">
                              <button className={`setting-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => handleThemeChange('light')}><Sun size={14} /></button>
                              <button className={`setting-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => handleThemeChange('dark')}><Moon size={14} /></button>
                              <button className={`setting-btn ${theme === 'system' ? 'active' : ''}`} onClick={() => handleThemeChange('system')}><Monitor size={14} /></button>
                          </div>
                      </div>
                      <div className="setting-item">
                          <span className="setting-label">Window Size</span>
                          <div className="setting-btn-group">
                              <button className={`setting-btn ${chatSize === 'small' ? 'active' : ''}`} onClick={() => setChatSize('small')}>S</button>
                              <button className={`setting-btn ${chatSize === 'medium' ? 'active' : ''}`} onClick={() => setChatSize('medium')}>M</button>
                              <button className={`setting-btn ${chatSize === 'fullscreen' ? 'active' : ''}`} onClick={() => setChatSize('fullscreen')}><Maximize size={14} /></button>
                          </div>
                      </div>
                      <div className="setting-item">
                          <span className="setting-label">Language</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Auto-detect ✨</span>
                      </div>
                  </motion.div>
              )}
          </AnimatePresence>

          {!activeConvId && messages.length === 0 && (
            <div className="chat-body custom-scrollbar" style={{ padding: '20px' }}>
              {user ? (
                historyList.length > 0 ? (
                  <>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '11px', marginBottom: '15px', fontWeight: 'bold', letterSpacing: '1px' }}>YOUR PAST SESSIONS</div>
                    {historyList.map(h => (
                      <div
                        key={h._id}
                        onClick={() => loadConversation(h)}
                        style={{ padding: '12px', backgroundColor: 'var(--bg-input)', borderRadius: '12px', marginBottom: '8px', cursor: 'pointer', border: '1px solid var(--glass-border)', transition: 'background 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--bg-input)'}
                      >
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)', fontWeight: '600' }}>{h.title}</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>{new Date(h.updatedAt).toLocaleString()}</div>
                        </div>
                        <button
                          onClick={(e) => deleteConversation(e, h._id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '14px', cursor: 'pointer', padding: '5px', opacity: 0.7, transition: 'opacity 0.2s' }}
                          onMouseOver={e => e.currentTarget.style.opacity = 1}
                          onMouseOut={e => e.currentTarget.style.opacity = 0.7}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    
                    {/* New Chat Suggestions */}
                    <div style={{ marginTop: '30px', borderTop: '1px dashed var(--glass-border)', paddingTop: '20px' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '11px', marginBottom: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>START NEW SESSION</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {[
                              { icon: '📝', label: 'How do I register to vote?' },
                              { icon: '📄', label: 'Documents required for voting' },
                              { icon: '🗓️', label: 'Upcoming elections' },
                          ].map((opt) => (
                              <button
                                  key={opt.label}
                                  className="welcome-option-btn"
                                  onClick={() => { setActiveConvId(null); setMessages([]); handleSend(opt.label, false); }}
                              >
                                  <span className="welcome-option-icon">{opt.icon}</span>
                                  <span className="welcome-option-label">{opt.label}</span>
                              </button>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '50px', marginBottom: '20px' }}>🤖</div>
                    <h3 style={{ marginBottom: '10px', fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Welcome to VoterAI</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '90%', lineHeight: '1.6', marginBottom: '30px' }}>You have no past sessions. Select a query to start!</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                        {[
                            { icon: '📝', label: 'How do I register to vote?' },
                            { icon: '📄', label: 'Documents required for voting' },
                            { icon: '🗓️', label: 'Upcoming elections' },
                        ].map((opt) => (
                            <button
                                key={opt.label}
                                className="welcome-option-btn"
                                onClick={() => handleSend(opt.label, false)}
                            >
                                <span className="welcome-option-icon">{opt.icon}</span>
                                <span className="welcome-option-label">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                  </div>
                )
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ fontSize: '50px', marginBottom: '20px' }}>🛡️</div>
                  <h3 style={{ marginBottom: '10px', fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Guest Session</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '90%', lineHeight: '1.6', marginBottom: '30px' }}>You are unauthenticated. Your session won't be saved.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                      {[
                          { icon: '📝', label: 'How do I register to vote?' },
                          { icon: '📄', label: 'Documents required for voting' },
                          { icon: '🗓️', label: 'Upcoming elections' },
                      ].map((opt) => (
                          <button
                              key={opt.label}
                              className="welcome-option-btn"
                              onClick={() => handleSend(opt.label, false)}
                          >
                              <span className="welcome-option-icon">{opt.icon}</span>
                              <span className="welcome-option-label">{opt.label}</span>
                          </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="chat-body custom-scrollbar" style={{ display: (!activeConvId && messages.length === 0) ? 'none' : 'flex' }}>
            {messages.map((m, i) => (
              <div key={i} className={`msg-row ${m.role === 'user' ? 'msg-row--user' : 'msg-row--bot'}`}>
                {m.role === 'bot' && m.thought && (
                    <div className="thought-pill">
                        <Zap size={9} />
                        <span>{m.thought}</span>
                    </div>
                )}
                <div className={`message-card ${m.role} animate-fade-in`}>
                  {m.role === 'bot' ? (
                      <>
                          <span className="bot-text" style={{ whiteSpace: 'pre-wrap' }}>{m.content}</span>
                          <button className="copy-btn" onClick={() => handleCopy(m.content, i)}>
                              {copiedIndex === i ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                          </button>
                      </>
                  ) : (
                      m.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="msg-row msg-row--bot">
                  <div className="typing-indicator">
                      <span></span><span></span><span></span>
                  </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-footer">
            {attachedFile && (
              <div style={{ marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '12px', color: 'var(--accent-blue)', fontWeight: '600' }}>
                📄 {attachedFile.name}
                <button onClick={() => setAttachedFile(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', marginLeft: '5px', fontSize: '16px', lineHeight: '10px' }}>×</button>
              </div>
            )}
            <div className="chat-input-row" style={{ alignItems: 'flex-end' }}>
              <input
                type="file"
                id="file-upload"
                style={{ display: 'none' }}
                onChange={(e) => setAttachedFile(e.target.files[0])}
              />
              <label htmlFor="file-upload" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', backgroundColor: 'transparent', borderRadius: '10px', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'color 0.2s', marginBottom: '4px' }} title="Attach Document" onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
              </label>
              <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputText}
                  onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (!isLoading) {
                              handleSend();
                              if (textareaRef.current) textareaRef.current.style.height = 'auto';
                          }
                      }
                  }}
                  placeholder="Ask about voting, registration…"
                  className="chat-input custom-scrollbar"
                  disabled={isLoading}
                  rows={1}
              />
              <button
                  onClick={() => {
                      handleSend();
                      if (textareaRef.current) textareaRef.current.style.height = 'auto';
                  }}
                  disabled={isLoading || (!input.trim() && !attachedFile)}
                  className="chat-send-btn"
                  aria-label="Send"
                  style={{ marginBottom: '4px' }}
              >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
            
            <div className="chat-footer-meta" style={{ marginTop: '8px' }}>
                <span className="flex items-center gap-1" style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                    <Shield size={10} /> Secure session
                </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default App;
