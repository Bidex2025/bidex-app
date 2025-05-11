"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '../../lib/axios'; // Import the configured Axios instance

// Define types based on Backend Entities (adjust as needed)
type AuctionStatus = 'OPEN' | 'CLOSED' | 'IN_PROGRESS' | 'COMPLETED'; // Match backend enum if possible
type AuctionType = 'PROFESSIONAL' | 'QUICKBID'; // Match backend enum if possible

interface Auction {
  auction_uuid: string; // Changed from id to auction_uuid
  title: string;
  description: string;
  budget_min?: number | null; // Use numbers from backend
  budget_max?: number | null;
  budget_negotiable: boolean;
  category: string;
  location: string;
  deadline?: string | null;
  status: AuctionStatus;
  type: AuctionType;
  created_at: string;
  updated_at: string;
  client_uuid: string; // Assuming client UUID is available
  // Add fields that might come from relations or calculations if needed
  clientName?: string; // Need to fetch or include this if required
  clientRating?: number; // Need to fetch or include this if required
  bidsCount?: number; // Need to fetch or include this if required
  lowestBid?: number; // Need to fetch or include this if required
  offersCount?: number; // For QuickBid, need to fetch or include
}

// Helper function to format budget based on backend data
const formatBudget = (auction: Auction): string => {
  if (auction.budget_negotiable) {
    return 'قابل للتفاوض';
  }
  if (auction.budget_min && auction.budget_max) {
    return `${auction.budget_min.toLocaleString()} - ${auction.budget_max.toLocaleString()} ريال`;
  }
  if (auction.budget_min) {
    return `يبدأ من ${auction.budget_min.toLocaleString()} ريال`;
  }
  if (auction.budget_max) {
    return `حتى ${auction.budget_max.toLocaleString()} ريال`;
  }
  return 'غير محدد'; // Fallback
};

// Helper function to format date/time
const formatDateTime = (dateTimeString: string | null | undefined): string => {
  if (!dateTimeString) return 'غير محدد';
  try {
    return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateTimeString));
  } catch (e) {
    return dateTimeString; // Fallback for invalid dates
  }
};

// Map backend status to Arabic display text
const formatStatus = (status: AuctionStatus): string => {
  switch (status) {
    case 'OPEN': return 'مفتوح';
    case 'CLOSED': return 'مغلق';
    case 'IN_PROGRESS': return 'قيد التنفيذ';
    case 'COMPLETED': return 'مكتمل';
    default: return status;
  }
};

export default function AuctionsPage() {
  const [requests, setRequests] = useState<Auction[]>([]);
  const [viewType, setViewType] = useState<AuctionType | 'all'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [filter, setFilter] = useState({
    category: "الكل",
    status: "الكل",
    sortBy: "newest"
  });

  // Fetch auctions from backend using apiClient
  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use apiClient which includes base URL and interceptors
        const response = await apiClient.get('/auctions');
        // TODO: Add clientName, clientRating, bidsCount, lowestBid, offersCount if needed by joining data in backend or separate requests
        // For now, adding placeholder data for missing fields
        const auctionsWithPlaceholders = response.data.map((auction: Auction) => ({
          ...auction,
          clientName: 'اسم العميل', // Placeholder
          clientRating: 4.5, // Placeholder
          bidsCount: auction.type === 'PROFESSIONAL' ? Math.floor(Math.random() * 15) : undefined, // Placeholder
          lowestBid: auction.type === 'PROFESSIONAL' ? (auction.budget_min || 50000) * (0.9 + Math.random() * 0.2) : undefined, // Placeholder
          offersCount: auction.type === 'QUICKBID' ? Math.floor(Math.random() * 5) : undefined, // Placeholder
        }));
        setRequests(auctionsWithPlaceholders);
      } catch (err) {
        console.error("Error fetching auctions:", err);
        setError("حدث خطأ أثناء جلب الطلبات. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []); // Empty dependency array means this runs once on mount

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  // Filter and sort requests
  const processedRequests = requests
    .filter(req => {
      if (viewType !== 'all' && req.type !== viewType) return false;
      // Map frontend filter status to backend status before comparing
      const backendStatusFilter = filter.status === 'الكل' ? 'الكل' :
                                  filter.status === 'مفتوح' ? 'OPEN' :
                                  filter.status === 'مغلق' ? 'CLOSED' :
                                  filter.status === 'قيد التنفيذ' ? 'IN_PROGRESS' :
                                  filter.status === 'مكتمل' ? 'COMPLETED' : 'الكل';
      if (backendStatusFilter !== "الكل" && req.status !== backendStatusFilter) return false;
      if (req.type === 'PROFESSIONAL' && filter.category !== "الكل" && req.category !== filter.category) return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      switch (filter.sortBy) {
        case "oldest":
          return dateA - dateB;
        case "budget_high":
          const budgetA_high = a.budget_max ?? (a.budget_min ?? (a.budget_negotiable ? 0 : 0));
          const budgetB_high = b.budget_max ?? (b.budget_min ?? (b.budget_negotiable ? 0 : 0));
          return budgetB_high - budgetA_high;
        case "budget_low":
          const budgetA_low = a.budget_min ?? (a.budget_max ?? (a.budget_negotiable ? Infinity : Infinity));
          const budgetB_low = b.budget_min ?? (b.budget_max ?? (b.budget_negotiable ? Infinity : Infinity));
          return budgetA_low - budgetB_low;
        case "bids": // Renaming to offers/bids
          const countA = a.type === 'PROFESSIONAL' ? (a.bidsCount ?? 0) : (a.offersCount ?? 0);
          const countB = b.type === 'PROFESSIONAL' ? (b.bidsCount ?? 0) : (b.offersCount ?? 0);
          return countB - countA;
        case "newest":
        default:
          return dateB - dateA;
      }
    });

  // Categories for filter dropdown (relevant for professional)
  const professionalCategories = [
    "بناء", "ترميم", "تشطيب", "تصميم", "تنسيق حدائق", "أعمال كهربائية", "أعمال سباكة", "تكييف وتبريد", "أخرى"
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gray-50">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">الطلبات المفتوحة</h1>

        {/* View Type Tabs */}
        <div className="mb-6 border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
          <nav className="-mb-px flex space-x-4 rtl:space-x-reverse px-4" aria-label="Tabs">
            <button
              onClick={() => setViewType('all')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${viewType === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              الكل
            </button>
            <button
              onClick={() => setViewType('PROFESSIONAL')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${viewType === 'PROFESSIONAL' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              مزادات احترافية
            </button>
            <button
              onClick={() => setViewType('QUICKBID')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${viewType === 'QUICKBID' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              طلبات سريعة (QuickBid)
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-b-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter (Only show if 'all' or 'professional' view is selected) */}
            {(viewType === 'all' || viewType === 'PROFESSIONAL') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف (للمزادات)</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  value={filter.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  disabled={viewType === 'QUICKBID'} // Disable if only quickbids are shown
                >
                  <option value="الكل">جميع التصنيفات</option>
                  {professionalCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            )}
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                value={filter.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="الكل">جميع الحالات</option>
                <option value="مفتوح">مفتوح</option>
                <option value="قيد التنفيذ">قيد التنفيذ</option>
                <option value="مكتمل">مكتمل</option>
                <option value="مغلق">مغلق</option>
              </select>
            </div>
            {/* Sort By Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الترتيب حسب</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                value={filter.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              >
                <option value="newest">الأحدث</option>
                <option value="oldest">الأقدم</option>
                <option value="budget_high">الميزانية (الأعلى)</option>
                <option value="budget_low">الميزانية (الأقل)</option>
                <option value="bids">عدد العروض</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && <p className="text-center text-gray-500">جاري تحميل الطلبات...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Request List */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6">
            {processedRequests.length > 0 ? (
              processedRequests.map(req => (
                // Use auction_uuid as key
                <div key={req.auction_uuid} className={`bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition border-l-4 ${req.type === 'PROFESSIONAL' ? 'border-blue-500' : 'border-orange-500'}`}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        {req.type === 'PROFESSIONAL' ? (
                          <h2 className="text-xl font-semibold text-gray-900 mb-1">{req.title}</h2>
                        ) : (
                          <h2 className="text-xl font-semibold text-gray-900 mb-1">طلب سريع: {req.description.substring(0, 50)}{req.description.length > 50 ? '...' : ''}</h2>
                        )}
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${req.type === 'PROFESSIONAL' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                          {req.type === 'PROFESSIONAL' ? 'مزاد احترافي' : 'طلب QuickBid'}
                        </span>
                      </div>
                      {/* Use formatStatus helper */}
                      <div className={`text-sm font-medium px-3 py-1 rounded-full ${req.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {formatStatus(req.status)}
                      </div>
                    </div>

                    {/* Display description for both types, maybe truncated for quickbid */}
                    <p className="text-gray-600 mb-4 text-sm">{req.description}</p>
                    {/* TODO: Add image display for QuickBid if image URL is provided by backend */}
                    {/* {req.type === 'QUICKBID' && req.image && ( <img src={req.image} alt="صورة الطلب" className="max-h-40 rounded mb-4" /> )} */}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500 block">الميزانية</span>
                        {/* Use formatBudget helper */}
                        <span className="font-medium">{formatBudget(req)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">الموقع</span>
                        <span className="font-medium">{req.location}</span>
                      </div>
                      {req.type === 'PROFESSIONAL' && (
                        <>
                          <div>
                            <span className="text-gray-500 block">تاريخ الانتهاء</span>
                            {/* Use formatDateTime helper */}
                            <span className="font-medium">{formatDateTime(req.deadline)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">التصنيف</span>
                            <span className="font-medium">{req.category}</span>
                          </div>
                        </>
                      )}
                      {/* Display creation date for both types */}
                      <div>
                        <span className="text-gray-500 block">تاريخ النشر</span>
                        <span className="font-medium">{formatDateTime(req.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-gray-500">
                      {/* Use placeholder client data */}
                      <span>بواسطة: {req.clientName}</span>
                      <span className="mx-2">•</span>
                      <div className="flex items-center">
                        <span className="ml-1">التقييم:</span>
                        <span className="text-yellow-500 font-medium">{req.clientRating?.toFixed(1)}</span>
                        <svg className="w-3 h-3 text-yellow-400 fill-current ml-0.5" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      {req.type === 'PROFESSIONAL' ? (
                        <>
                          <div>
                            <span className="text-sm text-gray-500 block">عدد العروض</span>
                            {/* Use placeholder bidsCount */}
                            <span className="font-medium text-lg">{req.bidsCount ?? 0}</span>
                          </div>
                          {/* Use placeholder lowestBid */}
                          {req.lowestBid !== undefined && (
                            <div>
                              <span className="text-sm text-gray-500 block">أقل عرض (ريال)</span>
                              <span className="font-medium text-lg text-green-600">{Math.round(req.lowestBid).toLocaleString()}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div>
                          <span className="text-sm text-gray-500 block">عدد العروض</span>
                          {/* Use placeholder offersCount */}
                          <span className="font-medium text-lg">{req.offersCount ?? 0}</span>
                        </div>
                      )}
                    </div>
                    {/* Link to auction details page using auction_uuid */}
                    <Link href={`/auctions/${req.auction_uuid}`} className={`px-4 py-2 rounded-md text-sm font-medium transition ${req.type === 'PROFESSIONAL' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
                      {req.type === 'PROFESSIONAL' ? 'عرض التفاصيل وتقديم عرض' : 'عرض التفاصيل وتقديم عرض سريع'}
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-1">لا توجد طلبات تطابق معايير البحث الحالية.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

