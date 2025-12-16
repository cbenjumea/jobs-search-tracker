import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';

const APP_PASSWORD_KEY = 'jobs-tracker-app-password';
const AUTH_STATUS_KEY = 'jobs-tracker-authenticated';

function PasswordGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasExistingPassword, setHasExistingPassword] = useState(false);

  useEffect(() => {
    // Check if password is set
    const storedPassword = localStorage.getItem(APP_PASSWORD_KEY);
    const authStatus = sessionStorage.getItem(AUTH_STATUS_KEY);

    if (!storedPassword) {
      setIsSettingPassword(true);
      setHasExistingPassword(false);
      setLoading(false);
    } else {
      setHasExistingPassword(true);
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      }
      setLoading(false);
    }
  }, []);

  const handleSetPassword = (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Store password hash (simple hash for demo - in production use proper hashing)
    localStorage.setItem(APP_PASSWORD_KEY, btoa(password));
    sessionStorage.setItem(AUTH_STATUS_KEY, 'true');
    setIsAuthenticated(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const storedPassword = localStorage.getItem(APP_PASSWORD_KEY);
    const enteredPasswordHash = btoa(password);

    if (enteredPasswordHash === storedPassword) {
      sessionStorage.setItem(AUTH_STATUS_KEY, 'true');
      setIsAuthenticated(true);
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const handleResetPassword = () => {
    if (window.confirm('Reset password? This will clear your current password. You can create a new one after.')) {
      localStorage.removeItem(APP_PASSWORD_KEY);
      setIsSettingPassword(true);
      setHasExistingPassword(false);
      setPassword('');
      setConfirmPassword('');
      setError('');
    }
  };

  const switchToLogin = () => {
    setIsSettingPassword(false);
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const switchToSignup = () => {
    setIsSettingPassword(true);
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return children;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary-600 p-4 rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Jobs Search Tracker
          </h1>
          <p className="text-gray-600 text-center">
            {isSettingPassword
              ? hasExistingPassword
                ? 'Create a new password'
                : 'Welcome! Set your password to get started'
              : 'Welcome back! Enter your password'}
          </p>
        </div>

        {isSettingPassword ? (
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <UserPlus className="w-5 h-5 text-primary-600" />
              <span className="font-semibold text-primary-600">Sign Up</span>
            </div>

            <div>
              <label className="label">Create Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Enter password (min 4 characters)"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="Confirm password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button type="submit" className="w-full btn-primary py-3">
              Create Password & Start Tracking
            </button>

            {hasExistingPassword && (
              <button
                type="button"
                onClick={switchToLogin}
                className="w-full text-sm text-primary-600 hover:text-primary-700 py-2"
              >
                Already have a password? Sign In
              </button>
            )}

            <p className="text-xs text-gray-500 text-center mt-4">
              Your password is stored locally in your browser
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <LogIn className="w-5 h-5 text-primary-600" />
              <span className="font-semibold text-primary-600">Sign In</span>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button type="submit" className="w-full btn-primary py-3">
              Unlock Tracker
            </button>

            <div className="flex flex-col space-y-2 mt-4">
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-sm text-gray-600 hover:text-gray-800 py-2"
              >
                Forgot password? Reset it
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PasswordGate;
