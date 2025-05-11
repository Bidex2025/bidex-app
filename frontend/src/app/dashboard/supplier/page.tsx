"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// --- Reusing Types (Simplified for Dashboard) ---
type RequestType = 'professional' | 'quickbid';

type BaseRequestSummary = {
  id: number;
  type: RequestType;
  description: string; // Used as title for quickbid summary
  location: string;
  status: 'مفتوح' | 'مغلق' | 'قيد التنفيذ' | 'مكتمل';
  createdAt: string;
};

type ProfessionalAuctionSummary = BaseRequestSummary & {
  type: 'professional';
  title: string;
  budget: string;
  deadline: string;
  category: string;
  bids: number;
};

type QuickBidRequestSummary = BaseRequestSummary & {
  type: 'quickbid';
  budget: string;
  offers: number;
};

type AvailableRequestSummary = ProfessionalAuctionSummary | QuickBidRequestSummary;

type SubmittedOfferSummary = {
  id: number;
  requestId: number;
  requestType: RequestType;
  requestTitle: string; // Title or truncated description
  amount: number;
  status: 'قيد المراجعة' | 'مقبول' | 'مرفوض';
  submittedAt: string;
};

type ActiveProjectSummary = {
  id: number; // Project ID (could be same as request ID or different)
  requestId: number;
  requestType: RequestType;
  title: string; // Title or truncated description
  clientName: string;
  amount: number;
  startDate: string;
  endDate?: string;
  progress: number; // Percentage
};

// --- Sample Data for Supplier Dashboard ---
const sampleSupplier = {
  id: 201,
  name: "شركة البناء المتطور",
  email: "info@advanced-construction.com",
  phone: "0555555555",
  location: "الرياض",
  specialization: ["بناء", "ترميم", "تشطيب"], // Array of specializations
  memberSince: "2023-06-15",
  rating: 4.9,
  profileImage: null,
  notifications: [
    { id: 1, type: "new_auction", message: "مزاد جديد: بناء فيلا سكنية", date: "2025-04-27T09:15:00Z", read: false, link: "/auctions/1?type=professional" },
    { id: 5, type: "new_quickbid", message: "طلب سريع جديد: تركيب مكيف سبليت", date: "2025-04-29T10:00:00Z", read: false, link: "/auctions/5?type=quickbid" },
    { id: 2, type: "bid_accepted", message: "تم قبول عرضك لمشروع: تشطيب مكتب إداري", date: "2025-04-25T14:30:00Z", read: true, link: "/active-projects/2001" }, // Link to active project
    { id: 6, type: "offer_accepted", message: "تم قبول عرضك للطلب السريع: إصلاح تسرب", date: "2025-04-28T11:00:00Z", read: true, link: "/active-projects/2002" }, // Link to active project
    { id: 3, type: "system", message: "مرحباً بك في Bidex!", date: "2025-04-15T10:20:00Z", read: true, link: "/profile" }
  ]
};

const sampleAvailableRequests: AvailableRequestSummary[] = [
  {
    id: 1,
    type: 'professional',
    title: "بناء فيلا سكنية في حي النرجس",
    description: "بناء فيلا سكنية مكونة من دورين وملحق بمساحة 400 متر مربع.",
    category: "بناء",
    location: "الرياض - حي النرجس",
    budget: "800000-1000000",
    deadline: "2025-05-15T23:59:59Z",
    bids: 8,
    status: 'مفتوح',
    createdAt: "2025-04-20T10:00:00Z"
  },
  {
    id: 5,
    type: 'quickbid',
    description: "تركيب مكيف سبليت جديد في غرفة النوم",
    location: "جدة - حي السلامة",
    budget: "500-2000",
    offers: 3,
    status: 'مفتوح',
    createdAt: "2025-04-28T14:30:00Z"
  },
  {
    id: 2,
    type: 'professional',
    title: "ترميم مبنى تجاري في وسط المدينة",
    description: "ترميم واجهة وتجديد التشطيبات الداخلية لمبنى تجاري مكون من 3 طوابق",
    category: "ترميم",
    location: "جدة - شارع التحلية",
    budget: "300000-400000",
    deadline: "2025-06-10T23:59:59Z",
    bids: 5,
    status: 'مفتوح',
    createdAt: "2025-04-22T09:15:00Z"
  },
   {
    id: 6,
    type: 'quickbid',
    description: "تنظيف خزان مياه أرضي سعة 5000 لتر",
    location: "الدمام - حي الشاطئ",
    budget: "negotiable",
    offers: 1,
    status: 'مفتوح',
    createdAt: "2025-04-29T08:00:00Z"
  },
];

const sampleSubmittedOffers: SubmittedOfferSummary[] = [
  {
    id: 1001,
    requestId: 3,
    requestType: 'professional',
    requestTitle: "تشطيب مكتب إداري في برج الفيصلية",
    amount: 195000,
    status: "مقبول",
    submittedAt: "2025-04-19T10:00:00Z"
  },
  {
    id: 1002,
    requestId: 1,
    requestType: 'professional',
    requestTitle: "بناء فيلا سكنية في حي النرجس",
    amount: 920000,
    status: "قيد المراجعة",
    submittedAt: "2025-04-21T11:00:00Z"
  },
  {
    id: 2001, // New ID for quick bid offer
    requestId: 5,
    requestType: 'quickbid',
    requestTitle: "تركيب مكيف سبليت جديد في غرفة النوم",
    amount: 600,
    status: "قيد المراجعة",
    submittedAt: "2025-04-28T15:00:00Z"
  }
];

const sampleActiveProjects: ActiveProjectSummary[] = [
  {
    id: 2001, // Project ID
    requestId: 3,
    requestType: 'professional',
    title: "تشطيب مكتب إداري في برج الفيصلية",
    clientName: "شركة المستقبل للاستشارات",
    amount: 195000,
    startDate: "2025-04-25",
    endDate: "2025-06-25",
    progress: 15
  },
  {
    id: 2002, // Project ID
    requestId: 103, // Assuming this was the ID of the completed quick bid request
    requestType: 'quickbid',
    title: "إصلاح تسرب مياه في المطبخ",
    clientName: "فاطمة علي", // Example client name
    amount: 450, // Example amount
    startDate: "2025-04-29",
    // endDate might not be applicable or TBD for quick bids
    progress: 50 // Example progress
  }
];

// --- Helper Functions (formatDateTime, calculateTimeRemaining) ---
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

export default function SupplierDashboard() {
  const [supplier, setSupplier] = useState(sampleSupplier);
  const [availableRequests, setAvailableRequests] = useState<AvailableRequestSummary[]>(sampleAvailableRequests);
  const [submittedOffers, setSubmittedOffers] = useState<SubmittedOfferSummary[]>(sampleSubmittedOffers);
  const [activeProjects, setActiveProjects] = useState<ActiveProjectSummary[]>(sampleActiveProjects);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Filter available requests based on supplier specialization
  const relevantRequests = availableRequests.filter(req => {
    if (req.type === 'professional') {
      // Check if professional auction category matches any specialization
      return supplier.specialization.includes(req.category);
    } else {
      // Assume all quick bids are potentially relevant for now, or add specific logic
      return true;
    }
  });

  const toggleNotificationRead = (id: number) => {
    setSupplier(prevSupplier => ({
      ...prevSupplier,
      notifications: prevSupplier.notifications.map(notification =>
        notification.id === id ? { ...notification, read: !notification.read } : notification
      )
    }));
  };

  const unreadNotificationsCount = supplier.notifications.filter(n => !n.read).length;

  return (
    <main className="flex min-h-screen flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">Bidex</Link>
              <span className="hidden sm:inline-block text-sm text-gray-500 mr-4 border-r border-gray-200 pr-4">لوحة تحكم المورد</span>
            </div>

            {/* Right Side: Notifications & User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
              {/* Notifications */}
              <div className="relative">
                 <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 relative"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
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
                        {supplier.notifications.length > 0 ? supplier.notifications.map(notification => (
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
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm">
                    {supplier.name.charAt(0)}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">{supplier.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 hidden md:block" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 border border-gray-200">
                    <div className="py-1">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">الملف الشخصي</Link>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">الإعدادات</Link>
                      <Link href="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">تسجيل الخروج</Link>
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
            <Link href="/dashboard/supplier" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-100 text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              لوحة التحكم
            </Link>
            <Link href="/available-requests" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              تصفح الطلبات
            </Link>
            <Link href="/my-offers" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              عروضي المقدمة
            </Link>
            <Link href="/active-projects" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
              المشاريع الجارية
            </Link>
            {/* Add other links as needed */}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {/* Welcome & Summary */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">مرحباً، {supplier.name}!</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">طلبات متاحة لك</h3>
                <p className="text-2xl font-bold text-blue-600">{relevantRequests.length}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">العروض المقدمة</h3>
                <p className="text-2xl font-bold text-orange-600">{submittedOffers.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">المشاريع الجارية</h3>
                <p className="text-2xl font-bold text-green-600">{activeProjects.length}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">التقييم</h3>
                <div className="flex items-center mt-1">
                  <p className="text-2xl font-bold text-yellow-600 ml-1">{supplier.rating}</p>
                  <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Available Requests Table */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">أحدث الطلبات المتاحة لك</h2>
              <Link href="/available-requests" className="text-sm text-blue-600 hover:text-blue-800">
                عرض الكل
              </Link>
            </div>
            {relevantRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الطلب</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النوع</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الموقع</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الميزانية / أقل عرض</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الوقت المتبقي</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {relevantRequests.slice(0, 5).map(req => ( // Show first 5
                      <tr key={req.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {req.type === 'professional' ? req.title : req.description}
                          </div>
                          <div className="text-xs text-gray-500">{req.type === 'professional' ? `التصنيف: ${req.category}` : `تاريخ النشر: ${formatDateTime(req.createdAt)}`}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${req.type === 'professional' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                            {req.type === 'professional' ? 'مزاد' : 'سريع'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{req.location}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {req.budget === 'negotiable' ? 'قابل للتفاوض' : req.budget}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {req.type === 'professional' ? calculateTimeRemaining(req.deadline) : '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/auctions/${req.id}?type=${req.type}`} className="text-blue-600 hover:text-blue-800">
                            عرض التفاصيل
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">لا توجد طلبات متاحة تطابق تخصصك حالياً.</p>
            )}
          </div>

          {/* Submitted Offers Table */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
             <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">أحدث عروضي المقدمة</h2>
              <Link href="/my-offers" className="text-sm text-blue-600 hover:text-blue-800">
                عرض الكل
              </Link>
            </div>
             {submittedOffers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الطلب</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النوع</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">قيمة عرضي</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ التقديم</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submittedOffers.slice(0, 5).map(offer => (
                      <tr key={offer.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                           <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{offer.requestTitle}</div>
                        </td>
                         <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${offer.requestType === 'professional' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                            {offer.requestType === 'professional' ? 'مزاد' : 'سريع'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">{offer.amount.toLocaleString()} ر.س</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                           <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${offer.status === 'مقبول' ? 'bg-green-100 text-green-800' : (offer.status === 'مرفوض' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800')}`}>
                            {offer.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(offer.submittedAt)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/auctions/${offer.requestId}?type=${offer.requestType}`} className="text-blue-600 hover:text-blue-800">
                            عرض الطلب
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">لم تقم بتقديم أي عروض بعد.</p>
            )}
          </div>

          {/* Active Projects Table */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
             <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">المشاريع الجارية</h2>
              <Link href="/active-projects" className="text-sm text-blue-600 hover:text-blue-800">
                عرض الكل
              </Link>
            </div>
             {activeProjects.length > 0 ? (
              <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المشروع</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النوع</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">القيمة</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التقدم</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeProjects.map(project => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{project.title}</div>
                          <div className="text-xs text-gray-500">بدأ في: {formatDateTime(project.startDate)}</div>
                        </td>
                         <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${project.requestType === 'professional' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                            {project.requestType === 'professional' ? 'احترافي' : 'سريع'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{project.clientName}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">{project.amount.toLocaleString()} ر.س</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 text-center">{project.progress}% مكتمل</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/active-projects/${project.id}`} className="text-blue-600 hover:text-blue-800">
                            إدارة المشروع
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">لا توجد مشاريع جارية حالياً.</p>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

