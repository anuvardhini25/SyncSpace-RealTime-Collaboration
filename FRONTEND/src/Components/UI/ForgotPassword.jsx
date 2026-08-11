import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <div className="grid grid-cols-2 gap-1">
              <span className="w-2.5 h-2.5 border-2 border-white rounded-sm" />
              <span className="w-2.5 h-2.5 border-2 border-white rounded-sm" />
              <span className="w-2.5 h-2.5 border-2 border-white rounded-sm" />
              <span className="w-2.5 h-2.5 border-2 border-white rounded-sm" />
            </div>
          </div>

          <span className="text-2xl font-bold text-slate-900">
            SyncSpace
          </span>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60 p-8 sm:p-10">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center">
              <span className="text-3xl">🔑</span>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#11183d]">
              Forgot Password?
            </h1>

            <p className="mt-3 text-slate-500 leading-6">
              No worries! Enter your email address and we'll
              send you a link to reset your password.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="mt-8">

              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Email address
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  ✉
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full h-14 mt-5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-500/20 hover:from-violet-700 hover:to-indigo-700 transition"
              >
                Send Reset Link
              </button>

            </form>
          ) : (
            <div className="mt-8 text-center">

              <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                Check your email
              </h2>

              <p className="mt-2 text-sm text-slate-500 leading-6">
                If an account exists for{" "}
                <span className="font-medium text-slate-700">
                  {email}
                </span>
                , you'll receive a password reset link shortly.
              </p>

            </div>
          )}

          {/* Back to login */}
          <div className="text-center mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              className="text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              ← Back to Login
            </button>
          </div>

        </div>

        {/* Security */}
        <p className="text-center text-sm text-slate-400 mt-6">
          🔒 Your data is secure and encrypted
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;