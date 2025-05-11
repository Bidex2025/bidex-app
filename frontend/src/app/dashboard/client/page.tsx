"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// --- Reusing Types from auctions/page.tsx ---
type RequestType = 'professional' | 'quickbid';

type BaseRequest = {
  id: number;
  type: RequestType;
  description: string; // Used as title for quickbid summary
  status: 'مفتوح' | 'مغلق' | 'قيد التنفيذ' | 'مكتمل';
  createdAt: string;
};

type ProfessionalAuctionSummary = BaseRequest & {
  type: 'professional';
  title: string;
  bids: number;
  lowestBid?: number;
  deadline: string;
};

type QuickBidRequestSummary = BaseRequest & {
  type: 'quickbid';
  offers: number;
  budget: string; // For display
};

type ClientRequestSummary = ProfessionalAuctionSummary | QuickBidRequestSummary;

// --- Sample Data for Client Dashboard ---
const sampleClient = {
  id: 101,
  name: "محمد العمري",
  email: "mohammed@example.com",
  phone: "0555555555",
  company: "شركة العمري للاستثمار العقاري",
  location: "الرياض",
  memberSince: "2023-05-10",
  rating: 4.8,
  profileImage: null,
  notifications: [
    { id: 1, type: "bid", message: "عرض جديد على مزادك: بناء فيلا سكنية", date: "2025-04-27T10:30:00Z", read: false, link: "/auctions/1?type=professional" },
    { id: 4, type: "offer", message: "عرض جديد على طلبك السريع: تركيب مكيف", date: "2025-04-29T09:00:00Z", read: false, link: "/auctions/5?type=quickbid" },
    { id: 2, type: "auction_ending", message: "مزادك: ترميم مبنى تجاري سينتهي قريباً", date: "2025-04-28T15:45:00Z", read: true, link: "/auctions/2?type=professional" },
    { id: 3, type: "system", message: "مرحباً بك في Bidex!", date: "2025-04-20T09:15:00Z", read: true, link: "/profile" }
  ]
};

const sampleActiveRequests: ClientRequestSummary[] = [
  {
    id: 1,
    type: 'professional',
    title: "بناء فيلا سكنية في حي النرجس",
    description: "بناء فيلا سكنية مكونة من دورين وملحق بمساحة 400 متر مربع.",
    status: "مفتوح",
    bids: 8,
    lowestBid: 820000,
    deadline: "2025-05-15T23:59:59Z",
    createdAt: "2025-04-20T10:00:00Z"
  },
  {
    id: 5,
    type: 'quickbid',
    description: "تركيب مكيف سبليت جديد في غرفة النوم",
    status: "مفتوح",
    offers: 3,
    budget: "500-2000",
    createdAt: "2025-04-28T14:30:00Z"
  },
  {
    id: 2,
    type: 'professional',
    title: "ترميم مبنى تجاري في وسط المدينة",
    description: "ترميم واجهة وتجديد التشطيبات الداخلية لمبنى تجاري مكون من 3 طوابق",
    status: "مفتوح",
    bids: 5,
    lowestBid: 310000,
    deadline: "2025-06-10T23:59:59Z",
    createdAt: "2025-04-22T09:15:00Z"
  }
];

const sampleCompletedRequests: ClientRequestSummary[] = [
  {
    id: 101,
    type: 'professional',
    title: "تصميم وتنفيذ مكتب إداري",
    description: "تصميم وتنفيذ مكتب إداري بمساحة 150 متر مربع",
    status: "مكتمل",
    bids: 15, // Example data
    lowestBid: 180000, // Example data (final bid)
    deadline: "2025-02-01T23:59:59Z", // Example data
    createdAt: "2025-01-10T12:00:00Z", // Example data
    // Add final supplier info if needed
  },
  {
    id: 103, // New ID for completed quick bid
    type: 'quickbid',
    description: "إصلاح تسرب مياه في المطبخ",
    status: "مكتمل",
    offers: 4, // Example data
    budget: "negotiable", // Example data
    createdAt: "2025-04-15T08:00:00Z", // Example data
    // Add final supplier info if needed
  }
];

// --- Helper Functions ---
const formatDateTime = (dateTimeString: string): string => {
  try {
    return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dateTimeString));
  } catch (e) {
    return dateTimeString;
  }
};

const calculateTimeRemaining = (deadline?: string): string => {
  if (!deadline) return "-";
  try {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();

    if (diff <= 0) return "انتهى";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} يوم`;
    if (hours > 0) return `${hours} ساعة`;
    return `${minutes} دقيقة`;
  } catch (e) {
    return "-";
  }
};

export default function ClientDashboard() {
  const [client, setClient] = useState(sampleClient);
  const [activeRequests, setActiveRequests] = useState<ClientRequestSummary[]>(sampleActiveRequests);
  const [completedRequests, setCompletedRequests] = useState<ClientRequestSummary[]>(sampleCompletedRequests);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleNotificationRead = (id: number) => {
    setClient(prevClient => ({
      ...prevClient,
      notifications: prevClient.notifications.map(notification =>
        notification.id === id ? { ...notification, read: !notification.read } : notification
      )
    }));
  };

  const unreadNotificationsCount = client.notifications.filter(n => !n.read).length;

  const totalCompletedProjects = completedRequests.length; // Simplified count

  return (
    <main className="flex min-h-screen flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">Bidex</Link>
              <span className="hidden sm:inline-block text-sm text-gray-500 mr-4 border-r border-gray-200 pr-4">لوحة تحكم العميل</span>
            </div>

            {/* Right Side: Notifications & User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 relative"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-0 right-0 block h-5 w-5 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 border border-gray-200">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900">الإشعارات</h3>
                        <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {client.notifications.length > 0 ? client.notifications.map(notification => (
                          <Link href={notification.link || '#'} key={notification.id} legacyBehavior>
                            <a
                              className={`block px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                              onClick={() => toggleNotificationRead(notification.id)}
                            >
                              <p className="text-sm text-gray-800">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatDateTime(notification.date)}</p>
                            </a>
                          </Link>
                        )) : (
                          <p className="text-sm text-gray-500 text-center py-4">لا توجد إشعارات جديدة.</p>
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200 text-center">
                        <Link href="/notifications" className="text-sm text-blue-600 hover:text-blue-800">
                          عرض جميع الإشعارات
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 rtl:space-x-reverse focus:outline-none p-1 rounded-md hover:bg-gray-100"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                    {client.name.charAt(0)}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">{client.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 hidden md:block" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 border border-gray-200">
                    <div className="py-1">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        الملف الشخصي
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        الإعدادات
                      </Link>
                      <Link href="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        تسجيل الخروج
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md hidden md:block border-l border-gray-200">
          <nav className="mt-5 px-2 space-y-1">
            <Link href="/dashboard/client" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-100 text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              لوحة التحكم
            </Link>
            <Link href="/my-requests" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              طلباتي
            </Link>
            <Link href="/create-auction" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              إنشاء طلب جديد
            </Link>
            <Link href="/messages" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              الرسائل
            </Link>
            {/* Add other links as needed */}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {/* Welcome & Summary */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">مرحباً، {client.name}!</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">الطلبات النشطة</h3>
                <p className="text-2xl font-bold text-blue-600">{activeRequests.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">المشاريع المكتملة</h3>
                <p className="text-2xl font-bold text-green-600">{totalCompletedProjects}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">التقييم</h3>
                <div className="flex items-center mt-1">
                  <p className="text-2xl font-bold text-yellow-600 ml-1">{client.rating}</p>
                  <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                </div>
              </div>
               <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">إشعارات غير مقروءة</h3>
                <p className="text-2xl font-bold text-red-600">{unreadNotificationsCount}</p>
              </div>
            </div>
          </div>

          {/* Active Requests Table */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">الطلبات النشطة</h2>
              <Link href="/my-requests" className="text-sm text-blue-600 hover:text-blue-800">
                عرض الكل
              </Link>
            </div>
            {activeRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الطلب</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النوع</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العروض</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">أقل عرض / الميزانية</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الوقت المتبقي / تاريخ الإنشاء</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {req.type === 'professional' ? req.title : req.description.substring(0, 30) + '...'}
                          </div>
                          <div className="text-xs text-gray-500">ID: {req.id}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${req.type === 'professional' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                            {req.type === 'professional' ? 'مزاد احترافي' : 'طلب QuickBid'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${req.status === 'مفتوح' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {req.type === 'professional' ? req.bids : req.offers}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {req.type === 'professional' && req.lowestBid ? `${req.lowestBid.toLocaleString()} ريال` : (req.type === 'quickbid' ? req.budget : '-')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {req.type === 'professional' ? calculateTimeRemaining(req.deadline) : formatDateTime(req.createdAt)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/auctions/${req.id}?type=${req.type}`} className="text-blue-600 hover:text-blue-900 ml-2">
                            عرض
                          </Link>
                          {/* Add Edit/Cancel buttons if applicable */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">لا توجد طلبات نشطة حالياً.</p>
            )}
          </div>

          {/* Completed Requests Table */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">المشاريع المكتملة</h2>
              <Link href="/my-requests?status=completed" className="text-sm text-blue-600 hover:text-blue-800">
                عرض الكل
              </Link>
            </div>
            {completedRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المشروع</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النوع</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المورد الفائز</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">القيمة النهائية</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الاكتمال</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {completedRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {req.type === 'professional' ? req.title : req.description.substring(0, 30) + '...'}
                          </div>
                          <div className="text-xs text-gray-500">ID: {req.id}</div>
                        </td>
                         <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${req.type === 'professional' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                            {req.type === 'professional' ? 'مزاد احترافي' : 'طلب QuickBid'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {req.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {/* Placeholder for winning supplier */} {req.type === 'professional' ? 'شركة البناء المتقدم' : 'فني تكييف ممتاز'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {/* Placeholder for final amount */} {req.type === 'professional' ? '180,000 ريال' : '600 ريال'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {/* Placeholder for completion date */} {formatDateTime(req.createdAt)} {/* Using createdAt as placeholder */}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/auctions/${req.id}?type=${req.type}`} className="text-blue-600 hover:text-blue-900 ml-2">
                            عرض
                          </Link>
                          {/* Add Rate Supplier button */} 
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">لا توجد مشاريع مكتملة بعد.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

