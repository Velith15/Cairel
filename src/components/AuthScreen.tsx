import React, { useState } from 'react';
import bgVideo from '../assets/bg.mp4';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google authentication failed. Please try again.';
      setError(message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="auth-canvas">
      {/* Fullscreen background video with ambient blur */}
      <div className="auth-canvas-bg">
        <video
          className="canvas-bg-video"
          src={bgVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="canvas-bg-overlay" />
      </div>

      {/* Floating Center Modal Card */}
      <div className="auth-modal-card">
        {/* Left Side: Video Artwork / Visual Frame */}
        <div className="modal-art-frame">
          <video
            className="modal-art-video"
            src={bgVideo}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        {/* Right Side: Editorial Form */}
        <div className="modal-form-frame">
          {/* Top Back Nav */}
          <div className="modal-top-nav">
            <button
              type="button"
              className="modal-back-btn"
              onClick={() => {
                setEmail('');
                setPassword('');
                setName('');
                setError(null);
              }}
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              <span>Back</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="modal-form-body">
            <div className="modal-heading-group">
              <span className="modal-pre-title">
                {mode === 'login' ? 'Login to' : 'Join'}
              </span>
              <h1 className="modal-title-editorial">
                Where Knowledge<br />
                Comes Alive
              </h1>
            </div>

            {/* Error Message */}
            {error && (
              <div className="modal-error-message">
                {error}
              </div>
            )}

            {/* Google OAuth Action Button */}
            <button
              type="button"
              className="modal-google-btn"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <Loader2 size={16} strokeWidth={1.5} className="modal-spinner" />
              ) : (
                <svg className="google-svg" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
              )}
              <span>{isGoogleLoading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>

            {/* Subtle Divider */}
            <div className="modal-divider-row">
              <span className="modal-divider-line" />
              <span className="modal-divider-text">or with email</span>
              <span className="modal-divider-line" />
            </div>

            <form onSubmit={handleSubmit} className="modal-inputs-form">
              {mode === 'signup' && (
                <div className="modal-input-wrap">
                  <input
                    type="text"
                    placeholder="Enter name"
                    className="modal-text-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="modal-input-wrap">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="modal-text-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="modal-input-wrap password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  className="modal-text-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="modal-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={14} strokeWidth={1.5} />
                  ) : (
                    <Eye size={14} strokeWidth={1.5} />
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="modal-submit-action"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} strokeWidth={1.5} className="modal-spinner" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign in' : 'Create account'}</span>
                    <ArrowRight size={14} strokeWidth={1.5} />
                  </>
                )}
              </button>
            </form>

            <div className="modal-mode-toggle">
              <span>
                {mode === 'login'
                  ? "Don't have an account? "
                  : 'Already have an account? '}
              </span>
              <button
                type="button"
                className="modal-mode-link"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError(null);
                }}
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </div>
          </div>

          {/* Bottom Brand Mark & Tagline */}
          <div className="modal-brand-footer">
            <div className="modal-brand-logo">
              <div className="brand-logo-mark" />
              <span className="brand-logo-text">CAIREL</span>
            </div>
            <div className="modal-brand-divider" />
            <span className="modal-brand-tagline">
              Shared Knowledge for a Responsible AI Future.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
