'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-16 bg-black">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <img 
                src="https://static.wixstatic.com/media/c49a9b_ea9e6b716ac844ddbe9bce2485ba6198~mv2.png" 
                alt="MediTrack Logo" 
                className="h-20 w-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your MediTrack account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-700 rounded-lg leading-5 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-[#0e88e9] focus:ring-2 focus:ring-[#0e88e9]/20 transition-colors"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-10 py-3 border-2 border-gray-700 rounded-lg leading-5 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-[#0e88e9] focus:ring-2 focus:ring-[#0e88e9]/20 transition-colors"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#0e88e9] focus:ring-[#0e88e9] border-gray-600 rounded bg-gray-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-[#0e88e9] hover:text-[#0c70c0]">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-900/20 border border-red-800 p-4">
                <div className="text-sm text-red-400">{error}</div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0e88e9] hover:bg-[#0c70c0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0e88e9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Need help? Contact your system administrator
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Decorative Panel */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-[#0e88e9] to-[#0c70c0] relative overflow-hidden">
        <div className="flex flex-col items-center justify-center w-full px-16">
          {/* Large Logo - No container, black for contrast */}
          <div className="mb-8">
            <img 
              src="https://static.wixstatic.com/media/c49a9b_ea9e6b716ac844ddbe9bce2485ba6198~mv2.png" 
              alt="MediTrack" 
              className="h-32 w-auto brightness-0" 
              style={{ filter: 'brightness(0)' }}
            />
          </div>
          
          <h2 className="text-4xl font-bold mb-4 text-black">MediTrack</h2>
          <p className="text-xl text-black/80 mb-8">Medication Inventory Management System</p>
          
          {/* Features */}
          <div className="space-y-4 w-full max-w-md">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span className="text-black">Real-time inventory tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span className="text-black">Multi-pharmacy management</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span className="text-black">Automated reporting & analytics</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span className="text-black">Fulfillment fee tracking</span>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-black/10 rounded-full"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-black/10 rounded-full"></div>
      </div>
    </div>
  );
}