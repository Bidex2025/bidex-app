"use client";

import { useState } from 'react';
import Link from 'next/link';
import apiClient from '../../lib/axios'; // Import the configured Axios instance
import { useRouter } from 'next/navigation';

// Define UserType based on backend enum
type UserType = 'CLIENT' | 'SUPPLIER';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('CLIENT'); // Default to CLIENT
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      setLoading(false);
      return;
    }

    try {
      // Use apiClient which has the base URL configured
      await apiClient.post('/auth/register', {
        name,
        email,
        password,
        user_type: userType, // Send user_type to backend
      });

      // Registration successful, redirect to login page
      alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
      router.push('/login');

    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        // Handle specific error messages from backend (e.g., email already exists)
        if (Array.isArray(err.response.data.message)) {
          setError(err.response.data.message.join(', ')); // Join array of messages
        } else if (typeof err.response.data.message === 'string' && err.response.data.message.includes('already exists')) {
           setError('هذا البريد الإلكتروني مسجل بالفعل.');
        } else if (typeof err.response.data.message === 'string') {
          setError(err.response.data.message);
        } else {
           setError('حدث خطأ غير متوقع من الخادم.');
        }
      } else {
        setError('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">إنشاء حساب جديد</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              الاسم الكامل
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="اسمك الكامل"
            />
          </div>

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
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="********"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              تأكيد كلمة المرور
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="********"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">نوع الحساب</label>
            <div className="mt-2 flex space-x-4 rtl:space-x-reverse">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="CLIENT"
                  checked={userType === 'CLIENT'}
                  onChange={() => setUserType('CLIENT')}
                  className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="mr-2 text-sm text-gray-700">عميل (صاحب طلب)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="SUPPLIER"
                  checked={userType === 'SUPPLIER'}
                  onChange={() => setUserType('SUPPLIER')}
                  className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="mr-2 text-sm text-gray-700">مورد (مقدم خدمة)</span>
              </label>
            </div>
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
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </main>
  );
}

