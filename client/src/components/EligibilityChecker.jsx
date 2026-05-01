import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, ArrowRight, User, Calendar, MapPin } from 'lucide-react';

const EligibilityChecker = ({ setPage }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    age: '',
    citizen: true,
    resident: true
  });
  const [result, setResult] = useState(null);

  const checkEligibility = () => {
    if (parseInt(data.age) >= 18 && data.citizen && data.resident) {
      setResult('eligible');
    } else {
      setResult('ineligible');
    }
  };

  const reset = () => {
    setStep(1);
    setData({ age: '', citizen: true, resident: true });
    setResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto py-20 px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4">Eligibility Checker</h2>
        <p className="text-gray-400">Answer 3 simple questions to check if you can register to vote.</p>
      </div>

      <div className="glass p-12 rounded-[40px] border border-white/5 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div 
              key="questions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-blue-400">
                  <Calendar size={18} /> What is your age?
                </label>
                <input 
                  type="number" 
                  value={data.age} 
                  onChange={(e) => setData({...data, age: e.target.value})}
                  placeholder="Enter your age"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xl text-white outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              <div className="space-y-6">
                <label className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-purple-400">
                  <User size={18} /> Are you an Indian Citizen?
                </label>
                <div className="flex gap-4">
                  {[true, false].map((val) => (
                    <button
                      key={val ? 'yes' : 'no'}
                      onClick={() => setData({...data, citizen: val})}
                      className={`flex-1 py-4 rounded-xl font-bold border transition-all ${data.citizen === val ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
                    >
                      {val ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <label className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-green-400">
                  <MapPin size={18} /> Are you a resident of India?
                </label>
                <div className="flex gap-4">
                  {[true, false].map((val) => (
                    <button
                      key={val ? 'yes' : 'no'}
                      onClick={() => setData({...data, resident: val})}
                      className={`flex-1 py-4 rounded-xl font-bold border transition-all ${data.resident === val ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
                    >
                      {val ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={checkEligibility}
                disabled={!data.age}
                className="w-full py-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify Eligibility
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              {result === 'eligible' ? (
                <>
                  <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8 border border-green-500/30">
                    <CheckCircle2 size={48} className="text-green-500" />
                  </div>
                  <h3 className="text-3xl font-black mb-4">You are Eligible!</h3>
                  <p className="text-gray-400 mb-10 leading-relaxed">
                    Great news! You meet all the requirements to register as a voter in India. 
                    You can now proceed to fill Form 6.
                  </p>
                  <div className="flex flex-col gap-4">
                    <button onClick={() => setPage('eci')} className="w-full py-5 rounded-2xl bg-green-600 text-white font-black uppercase tracking-widest">
                      Start Registration
                    </button>
                    <button onClick={reset} className="text-gray-500 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors">
                      Check Again
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-8 border border-red-500/30">
                    <AlertCircle size={48} className="text-red-500" />
                  </div>
                  <h3 className="text-3xl font-black mb-4">Not Eligible Yet</h3>
                  <p className="text-gray-400 mb-10 leading-relaxed">
                    Based on your input, you may not be eligible to register at this time. 
                    {parseInt(data.age) < 18 ? ` You must be at least 18 years old.` : ''}
                    {!data.citizen ? ` Only Indian citizens can register.` : ''}
                  </p>
                  <button onClick={reset} className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest">
                    Try Again
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EligibilityChecker;
