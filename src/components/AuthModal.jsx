import React, { useState } from 'react';
import { Lock, Mail, User, ArrowRight, X, Satellite, AlertCircle, Loader2 } from 'lucide-react';
import { loginApi, registerApi } from '../services/api';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleModeSwitch = (mode) => {
    setAuthMode(mode);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim();

    // 1. Email format validation
    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // 2. Password presence check
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === 'login') {
        const res = await loginApi(cleanEmail, password);
        if (res && res.success && res.user) {
          onLoginSuccess(res.user);
          if (onClose) onClose();
        } else {
          setErrorMsg(res?.message || 'Invalid email or password.');
        }
      } else {
        // Register mode validation
        if (password.length < 4) {
          setErrorMsg('Password must be at least 4 characters long.');
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match. Please re-type your password.');
          setIsLoading(false);
          return;
        }

        const res = await registerApi(cleanEmail, password, fullName);
        if (res && res.success && res.user) {
          onLoginSuccess(res.user);
          if (onClose) onClose();
        } else {
          setErrorMsg(res?.message || 'Failed to create account.');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-[#020509]/90 backdrop-blur-md overflow-y-auto">
      
      {/* Container Box */}
      <div className="relative w-full max-w-4xl bg-[#0a111a] border border-[#152232] rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden grid grid-cols-1 md:grid-cols-12 my-8 tech-corners">
        
        {/* Close Modal Control */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-1.5 rounded bg-[#060b12] hover:bg-[#0e1824] text-slate-400 hover:text-white border border-[#152232] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* LEFT COLUMN: Panoramic Earth Horizon Branding */}
        <div className="md:col-span-6 bg-gradient-to-b from-[#060b12] via-[#08111b] to-[#020509] p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#152232] relative overflow-hidden">
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#060b12] border border-[#00f0ff]/40 shadow-[0_0_10px_rgba(0,240,255,0.2)] flex items-center justify-center">
                <Satellite className="w-4 h-4 text-[#00f0ff]" />
              </div>
              <div>
                <span className="text-base font-extrabold text-white font-heading tracking-tight">
                  TERRASCOPE <span className="text-[#00f0ff]">AI</span>
                </span>
                <p className="text-[10px] font-mono-tech text-[#00f0ff] uppercase tracking-wider font-bold">
                  SCIENTIFIC EARTH OBSERVATION
                </p>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <span className="badge-telemetry badge-telemetry-cyan text-[10px]">PRIVATE AGENCY ACCESS</span>
              <h2 className="text-3xl font-extrabold text-white font-heading leading-tight tracking-tight">
                SEE A CLEARER <br />
                <span className="text-[#00f0ff]">TOMORROW.</span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-body">
                Advanced satellite intelligence for a more resilient and sustainable planet.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-6 relative z-10 border-t border-[#152232] mt-8">
            <p className="text-xs font-mono-tech text-[#00f0ff] font-bold tracking-widest uppercase">
              REAL DATA. REAL INSIGHTS. A BRIGHTER TOMORROW.
            </p>
            <p className="text-[10px] text-slate-500 font-mono-tech">TERRASCOPE AI V2.4</p>
          </div>

        </div>

        {/* RIGHT COLUMN: Clean Authentication Form */}
        <div className="md:col-span-6 p-6 sm:p-10 flex flex-col justify-center space-y-6 bg-[#060b12]">
          
          {/* Header & Mode Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-[#152232] pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-heading tracking-tight">
                  TERRASCOPE <span className="text-[#00f0ff]">AI</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-mono-tech">
                  {authMode === 'login' ? 'Sign in to continue to TerraScope AI' : 'Create analyst workspace account'}
                </p>
              </div>

              <div className="flex items-center gap-1 bg-[#020509] p-1 rounded border border-[#152232]">
                <button
                  type="button"
                  onClick={() => handleModeSwitch('login')}
                  className={`px-2.5 py-1 text-[10px] font-mono-tech rounded transition-all ${
                    authMode === 'login' ? 'bg-[#0c1622] text-[#00f0ff] font-bold border border-[#00f0ff]/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SIGN IN
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSwitch('register')}
                  className={`px-2.5 py-1 text-[10px] font-mono-tech rounded transition-all ${
                    authMode === 'register' ? 'bg-[#0c1622] text-[#00f0ff] font-bold border border-[#00f0ff]/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  REGISTER
                </button>
              </div>
            </div>
          </div>

          {/* Validation Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded flex items-start gap-2.5 text-xs text-red-400 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="font-mono-tech leading-tight">{errorMsg}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {authMode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-mono-tech text-slate-300 block">
                  FULL NAME
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); setErrorMsg(''); }}
                    placeholder="cibinjool08"
                    className="w-full input-aerospace py-2.5 pl-9 pr-3 text-xs"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-mono-tech text-slate-300 block">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                  placeholder="cibinjool08@gmail.com"
                  className="w-full input-aerospace py-2.5 pl-9 pr-3 text-xs font-mono-tech"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono-tech text-slate-300 block">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                  placeholder="••••••••••••"
                  className="w-full input-aerospace py-2.5 pl-9 pr-3 text-xs"
                />
              </div>
            </div>

            {authMode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-mono-tech text-slate-300 block">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrorMsg(''); }}
                    placeholder="••••••••••••"
                    className="w-full input-aerospace py-2.5 pl-9 pr-3 text-xs"
                  />
                </div>
              </div>
            )}

            {authMode === 'login' && (
              <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-[#020509] border-[#152232] text-[#00f0ff] focus:ring-0"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-slate-400 hover:text-[#00f0ff] transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 btn-cyan-solid text-xs flex items-center justify-center gap-2 mt-2 uppercase font-mono-tech tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#00f0ff]" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span>{authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Toggle Link */}
          <div className="text-center pt-2 text-xs font-mono-tech text-slate-400 border-t border-[#152232]">
            {authMode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('register')}
                  className="text-[#00f0ff] hover:underline font-bold ml-1"
                >
                  Create account
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('login')}
                  className="text-[#00f0ff] hover:underline font-bold ml-1"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
