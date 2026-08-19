import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LeftUP from './LeftUP';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* LEFT SIDE */}
      <LeftUP />

      {/* RIGHT SIDE */}
      <section className="w-full lg:w-1/2 min-h-screen flex items-center justify-center bg-slate-50 px-6 py-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-xl">⌘</span>
            </div>
            <span className="text-2xl font-bold text-slate-900">SyncSpace</span>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 px-7 sm:px-10 py-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#11183d]">Login to your account</h2>
              <p className="text-slate-500 mt-3">Enter your credentials to access your workspace</p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}

            <form className="space-y-5 color-black" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-800 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 pl-12 pr-12 rounded-xl border border-slate-200 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-violet-600" />
                  Remember me
                </label>

                <Link to="/forgot-password" className="font-medium text-violet-600 hover:text-violet-700 transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Login */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-violet-500/30 transition disabled:opacity-60"
              >
                {loading ? 'Logging in…' : 'Login'}
              </button>
            </form>

            {/* Register */}
            <div className="mt-7 text-center text-sm">
              <span className="text-slate-500">Don't have an account? </span>
              <Link to="/signup" className="font-semibold text-violet-600 hover:text-violet-700 transition-colors">
                Create one
              </Link>
            </div>
          </div>

          {/* Security */}
          <div className="flex justify-center items-center gap-2 mt-6 text-sm text-slate-400">
            <ShieldCheck size={16} />
            Your data is secure and encrypted
          </div>
        </div>
      </section>
    </div>
  );
}
