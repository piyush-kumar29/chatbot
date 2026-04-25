import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

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
      <h1 style={{ fontSize: '60px', fontWeight: '900', marginBottom: '20px' }}>Live Voting Simulation.</h1>
      <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '40px' }}>Experience a secure, real-time cryptographic voting terminal with live analytics.</p>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Voting Terminal */}
        <div style={{ flex: 1, minWidth: '300px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
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
        <div style={{ flex: 1.5, minWidth: '400px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
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
        const res = await axios.get('http://localhost:5000/api/auth/users', {
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
      await axios.put(`http://localhost:5000/api/auth/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsersList(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update role");
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <h1 style={{ fontSize: '60px', fontWeight: '900', marginBottom: '20px' }}>System Administration.</h1>
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
    <div style={{ animation: 'fadeIn 0.5s ease-out', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#fff', marginBottom: '10px' }}>
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
                  <select value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#0a0a0c', color: 'white', width: '100%', boxSizing: 'border-box', appearance: 'none', cursor: 'pointer' }}>
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
                  <input type="text" placeholder="District" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                  <input type="text" placeholder="Assembly Constituency" value={formData.constituency} onChange={e => setFormData({...formData, constituency: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                </>
              )}
              {step === 2 && (
                <>
                  <input type="text" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                  <input type="text" placeholder="Surname" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                </>
              )}
              {step === 3 && (
                <>
                  <input type="text" placeholder="Name of Relative" value={formData.relativeName} onChange={e => setFormData({...formData, relativeName: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                  <select value={formData.relativeType} onChange={e => setFormData({...formData, relativeType: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#0a0a0c', color: 'white', width: '100%', boxSizing: 'border-box', appearance: 'none', cursor: 'pointer' }}>
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
                  <input type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                  <input type="email" placeholder="Email ID (Optional)" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                </>
              )}
              {step === 5 && (
                <>
                  <input type="text" placeholder="12-Digit Aadhaar Number" value={formData.aadhar} onChange={e => setFormData({...formData, aadhar: e.target.value})} maxLength="12" style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', letterSpacing: '2px', boxSizing: 'border-box' }} />
                  <p style={{ color: '#64748b', fontSize: '12px', marginTop: '-10px' }}>Providing Aadhaar is voluntary for electoral roll authentication (Form 6B).</p>
                </>
              )}
              {step === 6 && (
                <>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#0a0a0c', color: 'white', width: '100%', boxSizing: 'border-box', appearance: 'none', cursor: 'pointer' }}>
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Third Gender">Third Gender</option>
                  </select>
                  <input type="date" placeholder="Date of Birth" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', colorScheme: 'dark', boxSizing: 'border-box' }} />
                  <div style={{ border: '1px dashed rgba(59,130,246,0.5)', padding: '20px', borderRadius: '12px', textAlign: 'center', backgroundColor: 'rgba(59,130,246,0.05)' }}>
                    <p style={{ color: '#60a5fa', marginBottom: '10px', fontSize: '14px' }}>Upload Date of Birth Proof (Birth Certificate, Class 10 Marksheet, etc.)</p>
                    <input type="file" style={{ color: '#94a3b8', fontSize: '14px' }} />
                  </div>
                </>
              )}
              {step === 7 && (
                <>
                  <input type="text" placeholder="House/Building/Apartment No." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                  <input type="text" placeholder="Village / Town" value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                  <input type="text" placeholder="PIN Code" value={formData.pinCode} onChange={e => setFormData({...formData, pinCode: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                  <div style={{ border: '1px dashed rgba(59,130,246,0.5)', padding: '20px', borderRadius: '12px', textAlign: 'center', backgroundColor: 'rgba(59,130,246,0.05)' }}>
                    <p style={{ color: '#60a5fa', marginBottom: '10px', fontSize: '14px' }}>Upload Address Proof (Utility Bill, Passport, etc.)</p>
                    <input type="file" style={{ color: '#94a3b8', fontSize: '14px' }} />
                  </div>
                </>
              )}
              {step === 8 && (
                <>
                  <select value={formData.disability} onChange={e => setFormData({...formData, disability: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#0a0a0c', color: 'white', width: '100%', boxSizing: 'border-box', appearance: 'none', cursor: 'pointer' }}>
                    <option value="" disabled>Category of Disability (Optional)</option>
                    <option value="None">None</option>
                    <option value="Locomotive">Locomotive</option>
                    <option value="Visual">Visual</option>
                    <option value="Deaf & Dumb">Deaf & Dumb</option>
                    <option value="Other">Other</option>
                  </select>
                  <input type="text" placeholder="Existing EPIC No. of Family Member (Optional)" value={formData.epicId} onChange={e => setFormData({...formData, epicId: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box' }} />
                </>
              )}
              {step === 9 && (
                <>
                  <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ color: '#e2e8f0', marginBottom: '10px' }}>Declaration</h4>
                    <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', marginBottom: '15px' }}>
                      I hereby declare that to the best of my knowledge and belief: <br/>
                      (i) I am a citizen of India and place of my birth is within India. <br/>
                      (ii) I am ordinarily a resident at the address given in Step 7. <br/>
                      (iii) I have not applied for the inclusion of my name in the electoral roll for any other constituency.
                    </p>
                    <input type="text" placeholder="Place" value={formData.declarationPlace} onChange={e => setFormData({...formData, declarationPlace: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', boxSizing: 'border-box', marginBottom: '15px' }} />
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
  const [isExpanded, setIsExpanded] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isChatOpen && user && token) {
      fetchHistory();
    }
  }, [isChatOpen, user, token]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/chat/history', {
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
      await axios.delete(`http://localhost:5000/api/chat/${convId}`, {
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
      const res = await axios.post(`http://localhost:5000${endpoint}`, authData);
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
      const res = await axios.post('http://localhost:5000/api/chat', 
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
    <div style={{ backgroundColor: '#030305', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' }}>
      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, width: '100%', padding: '20px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-1px' }}>VOTER AI</div>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <button onClick={() => setCurrentPage('home')} style={{ background: 'none', border: 'none', color: currentPage === 'home' ? '#3b82f6' : 'gray', cursor: 'pointer', fontWeight: 'bold' }}>CORE</button>
          <button onClick={() => setCurrentPage('features')} style={{ background: 'none', border: 'none', color: currentPage === 'features' ? '#3b82f6' : 'gray', cursor: 'pointer', fontWeight: 'bold' }}>FEATURES</button>
          <button onClick={() => setCurrentPage('simulation')} style={{ background: 'none', border: 'none', color: currentPage === 'simulation' ? '#3b82f6' : 'gray', cursor: 'pointer', fontWeight: 'bold' }}>SIMULATION</button>
          <button onClick={() => setCurrentPage('portal')} style={{ background: 'none', border: 'none', color: currentPage === 'portal' ? '#3b82f6' : 'gray', cursor: 'pointer', fontWeight: 'bold' }}>ECI PORTAL</button>
          {user?.role === 'admin' && (
            <button onClick={() => setCurrentPage('admin')} style={{ background: 'none', border: 'none', color: currentPage === 'admin' ? '#ef4444' : 'gray', cursor: 'pointer', fontWeight: 'bold' }}>ADMIN</button>
          )}
          {user ? (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>@{user.username}</span>
              <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer' }}>EXIT</button>
            </div>
          ) : (
            <>
              <button onClick={() => setCurrentPage('login')} style={{ background: 'none', border: 'none', color: 'gray', cursor: 'pointer', fontWeight: 'bold' }}>LOGIN</button>
              <button onClick={() => setCurrentPage('signup')} style={{ backgroundColor: '#3b82f6', color: 'white', padding: '10px 20px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>SIGN UP</button>
            </>
          )}
          <button onClick={() => setIsChatOpen(true)} style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '10px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold', cursor: 'pointer' }}>CHAT</button>

        </div>
      </nav>

      {/* Main Content */}
      <div style={{ paddingTop: '150px', paddingBottom: '100px', maxWidth: '1200px', margin: '0 auto', paddingLeft: '40px', paddingRight: '40px' }}>
        {currentPage === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '90px', fontWeight: '900', lineHeight: 0.9, marginBottom: '40px', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Verify. Register. <br/><span style={{ color: '#3b82f6', WebkitTextFillColor: '#3b82f6' }}>Execute.</span></h1>
                <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', marginBottom: '40px', lineHeight: 1.6 }}>The advanced expert system for the Indian Electoral Process. Accurate, fast, and encrypted. Ask any question about voter registration, document proof, or local constituencies.</p>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <button onClick={() => setIsChatOpen(true)} style={{ padding: '20px 40px', fontSize: '1.1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.5)', transition: 'all 0.3s' }}>Start Neural Session</button>
                  <button onClick={() => setCurrentPage('features')} style={{ padding: '20px 40px', fontSize: '1.1rem', backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>View Architecture</button>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(3,3,5,0) 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59,130,246,0.1)' }}>
                  <div style={{ fontSize: '100px' }}>🛡️</div>
                </div>
              </div>
            </div>

            {/* Suggested Queries Section */}
            <div style={{ padding: '40px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#e2e8f0' }}>Suggested Queries</h2>
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
            <h1 style={{ fontSize: '60px', fontWeight: '900', marginBottom: '40px' }}>System Architecture.</h1>
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
          <div style={{ maxWidth: '400px', margin: '0 auto', padding: '40px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>{currentPage.toUpperCase()}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {currentPage === 'signup' && (
                <input 
                  type="text" placeholder="Username" 
                  value={authData.username} onChange={e => setAuthData({...authData, username: e.target.value})}
                  style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}
                />
              )}
              <input 
                type="email" placeholder="Email" 
                value={authData.email} onChange={e => setAuthData({...authData, email: e.target.value})}
                style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}
              />
              <input 
                type="password" placeholder="Password" 
                value={authData.password} onChange={e => setAuthData({...authData, password: e.target.value})}
                style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}
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
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', width: isExpanded ? '800px' : '400px', height: isExpanded ? '80vh' : '600px', maxWidth: '95vw', maxHeight: '95vh', backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>Neural Core V4.0</span>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              {user && (
                <button 
                  onClick={() => { setActiveConvId(null); setMessages([]); }}
                  style={{ background: 'none', border: '1px solid #3b82f6', color: '#3b82f6', fontSize: '12px', borderRadius: '4px', cursor: 'pointer', padding: '2px 8px' }}
                >
                  NEW
                </button>
              )}
              <button onClick={() => setIsExpanded(!isExpanded)} style={{ background: 'none', border: 'none', color: 'gray', cursor: 'pointer', display: 'flex', padding: 0 }} title={isExpanded ? "Collapse" : "Expand"}>
                {isExpanded ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                )}
              </button>
              <button onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', color: 'gray', fontSize: '24px', cursor: 'pointer', lineHeight: '18px', padding: 0 }}>×</button>
            </div>
          </div>
          
          {!activeConvId && messages.length === 0 && (
            <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {user ? (
                historyList.length > 0 ? (
                  <>
                    <div style={{ color: 'gray', fontSize: '12px', marginBottom: '15px', fontWeight: 'bold', letterSpacing: '1px' }}>YOUR PAST SESSIONS</div>
                    {historyList.map(h => (
                      <div 
                        key={h._id} 
                        onClick={() => loadConversation(h)}
                        style={{ padding: '15px', backgroundColor: 'rgba(59,130,246,0.05)', borderRadius: '12px', marginBottom: '10px', cursor: 'pointer', border: '1px solid rgba(59,130,246,0.2)', transition: 'background 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.1)'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.05)'}
                      >
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white', fontWeight: '500' }}>{h.title}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '5px' }}>{new Date(h.updatedAt).toLocaleString()}</div>
                        </div>
                        <button 
                          onClick={(e) => deleteConversation(e, h._id)} 
                          style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '16px', cursor: 'pointer', padding: '5px', opacity: 0.7, transition: 'opacity 0.2s' }}
                          onMouseOver={e => e.currentTarget.style.opacity = 1}
                          onMouseOut={e => e.currentTarget.style.opacity = 0.7}
                          title="Delete Session"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '30px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '30px' }}>
                      <div style={{ fontSize: '30px', marginBottom: '10px' }}>✨</div>
                      <h4 style={{ color: '#e2e8f0', marginBottom: '5px' }}>Need something else?</h4>
                      <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center' }}>Type a message below to start a brand new conversation.</p>
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '50px', marginBottom: '20px' }}>🤖</div>
                    <h3 style={{ marginBottom: '10px', fontSize: '1.5rem' }}>Welcome to VoterAI</h3>
                    <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '80%', lineHeight: '1.6' }}>You have no past sessions. Type a query below to initiate a secure neural link and start your first conversation!</p>
                  </div>
                )
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ fontSize: '50px', marginBottom: '20px' }}>🛡️</div>
                  <h3 style={{ marginBottom: '10px', fontSize: '1.5rem' }}>Guest Session</h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '80%', lineHeight: '1.6' }}>You are currently unauthenticated. Your session history will not be saved. Type below to begin!</p>
                </div>
              )}
            </div>
          )}

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: (!activeConvId && messages.length === 0) ? 'none' : 'flex', flexDirection: 'column', gap: '15px' }}>

            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                {m.thought && <div style={{ fontSize: '10px', color: '#8b5cf6', marginBottom: '4px', fontStyle: 'italic' }}>{m.thought}</div>}
                <div style={{ padding: '12px 16px', borderRadius: '16px', backgroundColor: m.role === 'user' ? '#3b82f6' : 'rgba(255,255,255,0.05)', color: 'white' }}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && <div style={{ fontSize: '12px', color: '#3b82f6' }}>Core is thinking...</div>}
            <div ref={chatEndRef} />
          </div>
          <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {attachedFile && (
              <div style={{ marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', fontSize: '13px', color: '#60a5fa' }}>
                📄 {attachedFile.name}
                <button onClick={() => setAttachedFile(null)} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', marginLeft: '5px', fontSize: '16px', lineHeight: '10px' }}>×</button>
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="file" 
                id="file-upload" 
                style={{ display: 'none' }} 
                onChange={(e) => setAttachedFile(e.target.files[0])} 
              />
              <label htmlFor="file-upload" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '45px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', cursor: 'pointer', color: 'gray', transition: 'all 0.2s' }} title="Attach Document" onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'gray'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              </label>
              <input 
                type="text" value={input} onChange={(e) => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a query or upload document..."
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}
              />
              <button onClick={() => handleSend()} style={{ padding: '0 20px', backgroundColor: '#3b82f6', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
