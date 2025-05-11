"use client";

import { useState } from 'react';
import Link from 'next/link';
import apiClient from '../../lib/axios'; // Import the configured Axios instance
import { useRouter } from 'next/navigation'; // Import useRouter for redirection

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize router

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use apiClient which has the base URL configured
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      // Assuming the backend returns an access_token
      const { access_token } = response.data;

      if (access_token) {
        // Store the token (e.g., in localStorage)
        // Ensure this runs only on the client side
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', access_token);
        }
        // Redirect to a protected page (e.g., dashboard or home)
        router.push('/'); // Redirect to home page after login
      } else {
        setError('لم يتم استلام رمز المصادقة.');
      }

    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        // Use error message from backend if available
        setError(err.response.data.message === 'Unauthorized' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : err.response.data.message);
      } else {
        setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">تسجيل الدخول</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              كلمة المرور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="********"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          ليس لديك حساب؟{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
    </main>
  );
}

