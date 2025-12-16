import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

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

  useEffect(() => {
    // Check if password is set
    const storedPassword = localStorage.getItem(APP_PASSWORD_KEY);
    const authStatus = sessionStorage.getItem(AUTH_STATUS_KEY);

    if (!storedPassword) {
      setIsSettingPassword(true);
      setLoading(false);
    } else if (authStatus === 'true') {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
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
              ? 'Set your password to protect your data'
              : 'Enter your password to continue'}
          </p>
        </div>

        {isSettingPassword ? (
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div>
              <label className="label">Create Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Enter password"
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
              Set Password & Continue
            </button>

            <p className="text-xs text-gray-500 text-center">
              Remember this password! You'll need it to access your tracker.
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
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
          </form>
        )}
      </div>
    </div>
  );
}

export default PasswordGate;
