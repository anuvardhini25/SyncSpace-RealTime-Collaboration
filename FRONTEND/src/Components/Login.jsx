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
      setError(
        err.response?.data?.message ||
          'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Force login input text to stay dark,
          including browser autofill */}
      <style>{`
        .login-input {
          color: #0f172a !important;
          background-color: #ffffff !important;
          -webkit-text-fill-color: #0f172a !important;
          caret-color: #0f172a !important;
        }

        .login-input::placeholder {
          color: #94a3b8 !important;
          opacity: 1 !important;
          -webkit-text-fill-color: #94a3b8 !important;
        }

        .login-input:-webkit-autofill,
        .login-input:-webkit-autofill:hover,
        .login-input:-webkit-autofill:focus,
        .login-input:-webkit-autofill:active {
          -webkit-text-fill-color: #0f172a !important;
          color: #0f172a !important;
          -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
          box-shadow: 0 0 0 1000px #ffffff inset !important;
          background-color: #ffffff !important;
          caret-color: #0f172a !important;
        }
      `}</style>

      <div className="min-h-screen bg-white flex">

        {/* LEFT SIDE */}
        <LeftUP />

        {/* RIGHT SIDE */}
        <section className="w-full lg:w-1/2 min-h-screen flex items-center justify-center bg-slate-50 px-6 py-10">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="flex lg:hidden justify-center items-center gap-3 mb-10">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-xl">
                  ⌘
                </span>
              </div>

              <span className="text-2xl font-bold text-slate-900">
                SyncSpace
              </span>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 px-7 sm:px-10 py-10">

              {/* Heading */}
              <div className="text-center mb-8">

                <h2 className="text-3xl font-bold text-slate-900">
                  Login to your account
                </h2>

                <p className="text-slate-500 mt-3">
                  Enter your credentials to access your workspace
                </p>

              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Form */}
              <form
                className="space-y-5"
                onSubmit={handleSubmit}
              >

                {/* EMAIL */}
                <div>

                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-800 mb-2"
                  >
                    Email address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="
                        login-input
                        w-full
                        h-14
                        pl-12
                        pr-4
                        rounded-xl
                        border
                        border-slate-200
                        outline-none
                        transition
                        focus:border-violet-500
                        focus:ring-4
                        focus:ring-violet-500/10
                      "
                    />

                  </div>

                </div>

                {/* PASSWORD */}
                <div>

                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-800 mb-2"
                  >
                    Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="
                        login-input
                        w-full
                        h-14
                        pl-12
                        pr-12
                        rounded-xl
                        border
                        border-slate-200
                        outline-none
                        transition
                        focus:border-violet-500
                        focus:ring-4
                        focus:ring-violet-500/10
                      "
                    />

                    {/* Show / Hide Password */}
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        hover:text-violet-600
                        transition-colors
                      "
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                </div>

                {/* REMEMBER + FORGOT */}
                <div className="flex items-center justify-between text-sm">

                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">

                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-violet-600"
                    />

                    <span>
                      Remember me
                    </span>

                  </label>

                  <Link
                    to="/forgot-password"
                    className="font-medium text-violet-600 hover:text-violet-700 transition-colors"
                  >
                    Forgot password?
                  </Link>

                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    flex
                    w-full
                    justify-center
                    items-center
                    rounded-xl
                    bg-gradient-to-r
                    from-violet-600
                    to-indigo-600
                    py-3.5
                    px-4
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-violet-600/25
                    hover:shadow-violet-600/40
                    hover:brightness-110
                    focus:outline-none
                    focus:ring-4
                    focus:ring-violet-500/30
                    transition
                    disabled:opacity-60
                  "
                >
                  {loading
                    ? 'Logging in…'
                    : 'Login'}
                </button>

              </form>

              {/* REGISTER */}
              <div className="mt-7 text-center text-sm">

                <span className="text-slate-500">
                  Don't have an account?{' '}
                </span>

                <Link
                  to="/signup"
                  className="font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                >
                  Create one
                </Link>

              </div>

            </div>

            {/* SECURITY */}
            <div className="flex justify-center items-center gap-2 mt-6 text-sm text-slate-400">

              <ShieldCheck size={16} />

              <span>
                Your data is secure and encrypted
              </span>

            </div>

          </div>
        </section>

      </div>
    </>
  );
}
