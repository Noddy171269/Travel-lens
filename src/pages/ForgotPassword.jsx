import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found with this email.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        default:
          setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
            <Compass size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">
            Reset password
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            We'll send a reset link to your email
          </p>
        </div>

        {/* Form */}
        <div className="card space-y-5">
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger-light">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center mx-auto">
                <CheckCircle size={28} className="text-success" />
              </div>
              <div>
                <p className="text-text-primary font-semibold">Check your inbox</p>
                <p className="text-sm text-text-secondary mt-1">
                  We've sent a password reset link to{' '}
                  <span className="text-primary-light font-medium">{email}</span>
                </p>
              </div>
              <Link
                to="/login"
                className="btn-primary inline-flex justify-center"
              >
                <ArrowLeft size={16} />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center"
              >
                {loading ? (
                  <div className="spinner !w-5 !h-5 !border-2" />
                ) : (
                  <>
                    Send Reset Link
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-text-secondary">
            <Link
              to="/login"
              className="text-primary-light hover:text-primary font-medium inline-flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
