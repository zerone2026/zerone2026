'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ArrowLeft, User as UserIcon, Shield, Wrench } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loginType, setLoginType] = useState<'user' | 'admin' | 'organizer'>('user');
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = loginType === 'user'
        ? '/api/auth/login'
        : loginType === 'admin'
        ? '/api/auth/admin/login'
        : '/api/auth/organizer/login';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store user data based on type
      const storageKey = loginType === 'user' ? 'user' : loginType === 'admin' ? 'admin' : 'organizer';
      localStorage.setItem(storageKey, JSON.stringify(data.user));

      // Redirect based on role
      if (loginType === 'user') {
        router.push('/dashboard');
      } else if (loginType === 'admin') {
        router.push('/admin');
      } else {
        router.push('/organizer');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-grow flex items-center justify-center p-4 relative overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Login to <span className="text-amber-400">Zerone 2026</span>
            </h1>
            <p className="text-gray-400">National Level Tech Fest</p>
          </div>

          {/* Login Type Selector */}
          <div className="flex gap-2 mb-6 bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setLoginType('user')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                loginType === 'user'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              User
            </button>
            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                loginType === 'admin'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => setLoginType('organizer')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                loginType === 'organizer'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Organizer
            </button>
          </div>

          {/* Login Form */}
          <motion.form
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-3xl p-8"
          >
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                {error}
              </div>
            )}

            {/* Email/Phone */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {loginType === 'user' ? 'Email or Phone Number' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.emailOrPhone}
                  onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                  className="w-full bg-white/5 border border-amber-500/30 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  placeholder={loginType === 'user' ? 'Enter email or phone' : 'Enter email'}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/5 border border-amber-500/30 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-500/50"
            >
              {loading ? 'Logging in...' : (
                <>
                  Login
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {/* Register Link */}
            {loginType === 'user' && (
              <div className="mt-6 text-center">
                <span className="text-gray-400">Don't have an account? </span>
                <Link href="/auth/register" className="text-amber-400 hover:text-amber-300 font-medium">
                  Register here
                </Link>
              </div>
            )}

            {/* Back to Home */}
            <Link
              href="/"
              className="mt-4 flex items-center justify-center gap-2 text-gray-400 hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.form>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-lg border-t border-amber-500/20 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            Developed by Murshida P - murshidaprml@gmail.com | MES Ponnani College
          </p>
        </div>
      </footer>
    </div>
  );
}
