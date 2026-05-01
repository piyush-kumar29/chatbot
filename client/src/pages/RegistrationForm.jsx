import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, CheckCircle2, ChevronRight, ChevronLeft, Upload, Info } from 'lucide-react';

const RegistrationForm = () => {
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
      setFormData({ state: '', constituency: '', district: '', firstName: '', lastName: '', relativeName: '', relativeType: '', mobile: '', email: '', aadhar: '', epicId: '', gender: '', dob: '', dobProof: '', address: '', village: '', postOffice: '', pinCode: '', addressProof: '', disability: '', declarationPlace: '' });
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <div className="text-center mb-16">
        <h1 className="text-50 font-black leading-none mb-4">
          <span className="text-blue-500 uppercase tracking-tighter">ECI</span> <br />
          Voter Service Portal
        </h1>
        <p className="text-gray-400 font-medium italic">Official Form 6 Registration Simulation (New Elector)</p>
      </div>

      {/* Progress Bar */}
      <div className="flex justify-center gap-2 mb-16 flex-wrap">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <div key={num} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${step >= num ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-600'}`}>
              {num}
            </div>
            {num < 9 && <div className={`w-4 h-[2px] transition-all ${step > num ? 'bg-blue-600' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <div className="glass p-10 rounded-40 border border-white-5 relative shadow-2xl">
        {submitted ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-20">
            <div className="text-6xl mb-8">🇮🇳</div>
            <h3 className="text-3xl font-black text-green-500 mb-4">Application Submitted</h3>
            <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
              Your Form 6 data has been processed successfully. In a real scenario, this would be transmitted to the ECI Atlas database for verification.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black uppercase tracking-widest text-blue-400">
                {step === 1 && "State & Constituency"}
                {step === 2 && "Personal Details"}
                {step === 3 && "Relatives Details"}
                {step === 4 && "Contact Details"}
                {step === 5 && "Aadhaar Details"}
                {step === 6 && "Gender & Date of Birth"}
                {step === 7 && "Ordinary Residence"}
                {step === 8 && "Optional Details"}
                {step === 9 && "Declaration"}
              </h3>
              <span className="text-xs font-bold text-gray-600 bg-white-5 px-3 py-1 rounded-full uppercase tracking-widest">Step {step} of 9</span>
            </div>

            <div className="grid gap-6">
              {step === 1 && (
                <div className="space-y-6">
                  <select value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} className="input-field w-full">
                    <option value="" disabled>Select State / Union Territory</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                    {/* Simplified for brevity */}
                  </select>
                  <input type="text" placeholder="District" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} className="input-field w-full" />
                  <input type="text" placeholder="Assembly Constituency" value={formData.constituency} onChange={e => setFormData({ ...formData, constituency: e.target.value })} className="input-field w-full" />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <input type="text" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="input-field w-full" />
                  <input type="text" placeholder="Surname" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="input-field w-full" />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <input type="text" placeholder="Name of Relative" value={formData.relativeName} onChange={e => setFormData({ ...formData, relativeName: e.target.value })} className="input-field w-full" />
                  <select value={formData.relativeType} onChange={e => setFormData({ ...formData, relativeType: e.target.value })} className="input-field w-full">
                    <option value="" disabled>Relation Type</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Husband">Husband</option>
                  </select>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <input type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} className="input-field w-full" />
                  <input type="email" placeholder="Email ID (Optional)" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="input-field w-full" />
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <input type="text" placeholder="12-Digit Aadhaar Number" value={formData.aadhar} onChange={e => setFormData({ ...formData, aadhar: e.target.value })} maxLength="12" className="input-field w-full tracking-05 text-center text-2xl font-black" />
                  <p className="text-10 text-gray-500 uppercase tracking-widest text-center">Providing Aadhaar is voluntary for electoral roll authentication.</p>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-6">
                  <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="input-field w-full">
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <input type="date" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="input-field w-full color-scheme-dark" />
                </div>
              )}

              {step === 7 && (
                <div className="space-y-6">
                  <input type="text" placeholder="House/Building/Apartment No." value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="input-field w-full" />
                  <input type="text" placeholder="Village / Town" value={formData.village} onChange={e => setFormData({ ...formData, village: e.target.value })} className="input-field w-full" />
                  <input type="text" placeholder="PIN Code" value={formData.pinCode} onChange={e => setFormData({ ...formData, pinCode: e.target.value })} className="input-field w-full" />
                </div>
              )}

              {step === 8 && (
                <div className="space-y-6">
                  <select value={formData.disability} onChange={e => setFormData({ ...formData, disability: e.target.value })} className="input-field w-full">
                    <option value="" disabled>Category of Disability (Optional)</option>
                    <option value="None">None</option>
                    <option value="Visual">Visual</option>
                    <option value="Locomotive">Locomotive</option>
                  </select>
                  <input type="text" placeholder="EPIC No. of Family Member (Optional)" value={formData.epicId} onChange={e => setFormData({ ...formData, epicId: e.target.value })} className="input-field w-full" />
                </div>
              )}

              {step === 9 && (
                <div className="p-8 rounded-3xl bg-blue-600/5 border border-blue-500-20">
                  <h4 className="text-white font-bold mb-4">Declaration</h4>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    I hereby declare that I am a citizen of India and ordinarily resident at the address given. I have not applied for inclusion in the electoral roll for any other constituency.
                  </p>
                  <div className="flex items-center gap-4">
                    <input type="checkbox" id="agree" className="w-5 h-5 rounded accent-blue-600" />
                    <label htmlFor="agree" className="text-sm font-bold text-blue-400">I Agree to the declaration</label>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-10">
              <button onClick={handlePrev} disabled={step === 1} className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all bg-white-5 border border-white-10 text-gray-500 hover:text-white disabled-opacity-20">
                <ChevronLeft size={16} /> Back
              </button>
              {step < 9 ? (
                <button onClick={handleNext} className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all bg-blue-600 text-white shadow-xl shadow-blue-600-20 hover-scale-105 active-scale-95">
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={submitForm} className="px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all bg-green-600 text-white shadow-xl shadow-green-600-20 hover-scale-105 active-scale-95">
                  Submit Form 6
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-12 flex items-center justify-center gap-4 text-gray-600">
        <Info size={14} />
        <p className="text-10 font-bold uppercase tracking-02">Data encrypted and stored on MongoDB Atlas Secure Nodes</p>
      </div>
    </div>
  );
};

export default RegistrationForm;
