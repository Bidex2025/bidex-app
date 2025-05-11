"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation'; // Use useParams to get the id
import apiClient from '../../lib/axios'; // Import the configured Axios instance

// --- Define Types based on Backend Entities ---
type AuctionStatus = 'OPEN' | 'CLOSED' | 'IN_PROGRESS' | 'COMPLETED';
type AuctionType = 'PROFESSIONAL' | 'QUICKBID';

// Define Bid type based on Bid entity
interface Bid {
  bid_uuid: string;
  amount: number;
  description?: string | null;
  delivery_time?: string | null; // For professional bids
  notes?: string | null; // For quickbid offers
  created_at: string;
  supplier_uuid: string;
  auction_uuid: string;
  // Add supplier details if needed (fetched separately or joined in backend)
  supplierName?: string;
  supplierRating?: number;
}

// Define Auction type based on Auction entity
interface Auction {
  auction_uuid: string;
  title: string;
  description: string;
  budget_min?: number | null;
  budget_max?: number | null;
  budget_negotiable: boolean;
  category: string;
  location: string;
  deadline?: string | null;
  status: AuctionStatus;
  type: AuctionType;
  created_at: string;
  updated_at: string;
  client_uuid: string;
  attachments?: { name: string; size: string; url: string }[]; // Keep as placeholder for now
  requirements?: string[]; // Keep as placeholder for now
  timeline?: string; // Keep as placeholder for now
  // Add client and bids/offers data (needs backend adjustment or separate fetches)
  client?: { uuid: string; name: string; rating: number; projectsCount: number; memberSince: string; verified: boolean };
  bids?: Bid[]; // Array of bids/offers
}

// --- Helper Functions ---
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
  return 'غير محدد';
};

const formatDateTime = (dateTimeString: string | null | undefined): string => {
  if (!dateTimeString) return 'غير محدد';
  try {
    return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateTimeString));
  } catch (e) {
    return dateTimeString;
  }
};

const formatStatus = (status: AuctionStatus): string => {
  switch (status) {
    case 'OPEN': return 'مفتوح';
    case 'CLOSED': return 'مغلق';
    case 'IN_PROGRESS': return 'قيد التنفيذ';
    case 'COMPLETED': return 'مكتمل';
    default: return status;
  }
};

export default function RequestDetailPage() {
  const params = useParams();
  const auctionUuid = params?.id as string; // Get UUID from route params

  const [request, setRequest] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for new bid/offer
  const [newBidAmount, setNewBidAmount] = useState("");
  const [newBidDelivery, setNewBidDelivery] = useState(""); // For professional
  const [newBidDescription, setNewBidDescription] = useState(""); // For professional
  const [newOfferAmount, setNewOfferAmount] = useState(""); // For quickbid
  const [newOfferNotes, setNewOfferNotes] = useState(""); // For quickbid

  const [showBidForm, setShowBidForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!auctionUuid) {
      setError("معرف الطلب غير موجود.");
      setLoading(false);
      return;
    }

    const fetchAuctionDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use apiClient to fetch auction details
        const response = await apiClient.get(`/auctions/${auctionUuid}`);
        // TODO: Fetch related client info and bids/offers separately or adjust backend endpoint
        // Adding placeholder data for now
        const fetchedAuction = response.data as Auction;
        fetchedAuction.client = {
          uuid: fetchedAuction.client_uuid,
          name: "اسم العميل", // Placeholder
          rating: 4.8, // Placeholder
          projectsCount: 10, // Placeholder
          memberSince: "2023-01-01", // Placeholder
          verified: true // Placeholder
        };
        // Placeholder bids/offers - ideally fetched from /auctions/:uuid/bids or /bids?auctionUuid=...
        // Let's simulate fetching bids for this auction
        try {
            const bidsResponse = await apiClient.get(`/bids?auctionUuid=${auctionUuid}`);
            // Assuming bidsResponse.data is an array of bids
            // We need to add placeholder supplier info for display
            fetchedAuction.bids = bidsResponse.data.map((bid: Bid) => ({
                ...bid,
                supplierName: `مورد ${bid.supplier_uuid.substring(0, 4)}`, // Placeholder name
                supplierRating: 4.5 + Math.random() * 0.5 // Placeholder rating
            }));
        } catch (bidsError) {
            console.warn("Could not fetch bids for auction:", bidsError);
            fetchedAuction.bids = []; // Default to empty array if bids fetch fails
        }

        setRequest(fetchedAuction);
      } catch (err: any) {
        console.error("Error fetching auction details:", err);
        if (err.response && err.response.status === 404) {
          setError("لم يتم العثور على الطلب المطلوب.");
        } else {
          setError("حدث خطأ أثناء جلب تفاصيل الطلب.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionDetails();
  }, [auctionUuid]);

  const handleBidSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!request) return;

    setSubmitLoading(true);
    setSubmitError(null);

    // apiClient will automatically include the token from localStorage

    let bidData: any;
    if (request.type === 'PROFESSIONAL') {
      bidData = {
        amount: parseFloat(newBidAmount),
        delivery_time: newBidDelivery,
        description: newBidDescription,
        auction_uuid: request.auction_uuid,
      };
    } else { // QUICKBID
      bidData = {
        amount: parseFloat(newOfferAmount),
        notes: newOfferNotes,
        auction_uuid: request.auction_uuid,
      };
    }

    try {
      // Use apiClient to submit the bid
      const response = await apiClient.post('/bids', bidData);

      // Add the new bid/offer to the list locally (or refetch)
      // Assuming the backend returns the created bid object
      // We need user info to display 'أنت' - this requires fetching user profile or decoding token
      // For now, using a simple placeholder
      const newBid = { ...response.data, supplierName: 'أنت (عرض جديد)', supplierRating: null };
      setRequest(prev => prev ? { ...prev, bids: [...(prev.bids || []), newBid] } : null);

      alert("تم تقديم العرض بنجاح!");
      setShowBidForm(false);
      // Clear form fields
      setNewBidAmount("");
      setNewBidDelivery("");
      setNewBidDescription("");
      setNewOfferAmount("");
      setNewOfferNotes("");

    } catch (err: any) {
      console.error("Error submitting bid:", err);
      if (err.response?.status === 401) {
          setSubmitError("يرجى تسجيل الدخول لتقديم عرض.");
          // Optionally redirect to login page
          // router.push('/login');
      } else {
          setSubmitError(err.response?.data?.message || "حدث خطأ أثناء تقديم العرض. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-10">جاري تحميل تفاصيل الطلب...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">{error}</div>;
  }

  if (!request) {
    // This case should ideally be covered by the error state from fetch
    return <div className="text-center p-10 text-red-600">لم يتم العثور على الطلب المطلوب.</div>;
  }

  // Determine border color based on type
  const borderColor = request.type === 'PROFESSIONAL' ? 'border-blue-500' : 'border-orange-500';
  const headerBgColor = request.type === 'PROFESSIONAL' ? 'bg-blue-50' : 'bg-orange-50';
  const buttonBgColor = request.type === 'PROFESSIONAL' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700';
  const statusBgColor = request.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gray-50">
      <div className="w-full max-w-7xl">
        <div className="mb-6">
          <Link href="/auctions" className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            العودة إلى قائمة الطلبات
          </Link>
        </div>

        {/* Request Details Card */}
        <div className={`bg-white rounded-lg shadow-lg overflow-hidden mb-8 border-t-4 ${borderColor}`}>
          {/* Header Section */}
          <div className={`p-6 ${headerBgColor}`}>
            <div className="flex flex-col md:flex-row justify-between md:items-start">
              <div className="mb-4 md:mb-0">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full mb-2 inline-block ${request.type === 'PROFESSIONAL' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                  {request.type === 'PROFESSIONAL' ? 'مزاد احترافي' : 'طلب QuickBid'}
                </span>
                <h1 className="text-2xl font-bold text-gray-900">
                  {request.type === 'PROFESSIONAL' ? request.title : `طلب سريع: ${request.description.substring(0, 50)}...`}
                </h1>
              </div>
              <div className={`text-sm font-medium px-3 py-1 rounded-full ${statusBgColor} self-start`}>
                {formatStatus(request.status)}
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="p-6">
            {/* Description */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">الوصف</h3>
            <p className="text-gray-700 mb-6 whitespace-pre-wrap">{request.description}</p>

            {/* TODO: Image for QuickBid - Add logic if backend provides image URL */}
            {/* {request.type === 'QUICKBID' && request.image && (...) } */}

            {/* Key Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 border-t border-b border-gray-200 py-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">الميزانية</h3>
                <p className="mt-1 text-lg font-semibold">{formatBudget(request)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">الموقع</h3>
                <p className="mt-1 text-lg font-semibold">{request.location}</p>
              </div>
              {request.type === 'PROFESSIONAL' && (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">تاريخ الانتهاء</h3>
                    <p className="mt-1 text-lg font-semibold">{formatDateTime(request.deadline)}</p>
                  </div>
                  {/* TODO: Add timeline if provided by backend */}
                  {/* {request.timeline && (...) } */}
                  {request.category && (
                     <div>
                      <h3 className="text-sm font-medium text-gray-500">التصنيف</h3>
                      <p className="mt-1 text-lg font-semibold">{request.category}</p>
                    </div>
                  )}
                </>
              )}
              <div>
                 <h3 className="text-sm font-medium text-gray-500">تاريخ النشر</h3>
                 <p className="mt-1 text-lg font-semibold">{formatDateTime(request.created_at)}</p>
              </div>
            </div>

            {/* TODO: Requirements (Professional Only) - Add if provided by backend */}
            {/* {request.type === 'PROFESSIONAL' && request.requirements && (...) } */}

            {/* TODO: Attachments (Professional Only) - Add if provided by backend */}
            {/* {request.type === 'PROFESSIONAL' && request.attachments && (...) } */}

            {/* Client Info (Using Placeholder Data) */}
            {request.client && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">معلومات العميل</h3>
                <div className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-xl ml-4 flex-shrink-0">
                    {request.client.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <p className="text-lg font-medium text-gray-900">{request.client.name}</p>
                      {request.client.verified && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 fill-current ml-1" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                        <span>{request.client.rating.toFixed(1)} تقييم</span>
                      </div>
                      <span>{request.client.projectsCount} طلبات سابقة</span>
                      <span>عضو منذ {formatDateTime(request.client.memberSince)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bids/Offers Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">العروض المقدمة ({request.bids?.length ?? 0})</h2>
          </div>
          <div className="p-6">
            {request.bids && request.bids.length > 0 ? (
              <div className="space-y-6">
                {request.bids.map((bid) => (
                  <div key={bid.bid_uuid} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{bid.supplierName || 'مقدم العرض'}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          {bid.supplierRating != null && (
                              <>
                                  <svg className="w-3 h-3 text-yellow-400 fill-current ml-1" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                  <span>{bid.supplierRating.toFixed(1)} تقييم</span>
                                  <span className="mx-2">•</span>
                              </>
                          )}
                          <span>{formatDateTime(bid.created_at)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{bid.amount.toLocaleString()} ريال</p>
                        {request.type === 'PROFESSIONAL' && bid.delivery_time && (
                          <p className="text-xs text-gray-500 mt-1">مدة التنفيذ: {bid.delivery_time}</p>
                        )}
                      </div>
                    </div>
                    {(request.type === 'PROFESSIONAL' && bid.description) && (
                      <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{bid.description}</p>
                    )}
                    {(request.type === 'QUICKBID' && bid.notes) && (
                      <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">ملاحظات: {bid.notes}</p>
                    )}
                    {/* TODO: Add Accept/Reject/Chat buttons based on user role and auction status */}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">لم يتم تقديم أي عروض بعد.</p>
            )}
          </div>
        </div>

        {/* Submit Bid/Offer Section */}
        {request.status === 'OPEN' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">تقديم عرض جديد</h2>
            </div>
            <div className="p-6">
              {!showBidForm ? (
                <button
                  onClick={() => setShowBidForm(true)}
                  className={`w-full ${buttonBgColor} text-white font-bold py-3 px-4 rounded transition duration-150 ease-in-out`}
                >
                  {request.type === 'PROFESSIONAL' ? 'تقديم عرض احترافي' : 'تقديم عرض QuickBid'}
                </button>
              ) : (
                <form onSubmit={handleBidSubmit}>
                  {request.type === 'PROFESSIONAL' ? (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700">مبلغ العرض (ريال)</label>
                        <input
                          type="number"
                          id="bidAmount"
                          value={newBidAmount}
                          onChange={(e) => setNewBidAmount(e.target.value)}
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="مثال: 850000"
                        />
                      </div>
                      <div>
                        <label htmlFor="bidDelivery" className="block text-sm font-medium text-gray-700">مدة التنفيذ المتوقعة</label>
                        <input
                          type="text"
                          id="bidDelivery"
                          value={newBidDelivery}
                          onChange={(e) => setNewBidDelivery(e.target.value)}
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="مثال: 6 أشهر"
                        />
                      </div>
                      <div>
                        <label htmlFor="bidDescription" className="block text-sm font-medium text-gray-700">وصف العرض / ملاحظات</label>
                        <textarea
                          id="bidDescription"
                          rows={4}
                          value={newBidDescription}
                          onChange={(e) => setNewBidDescription(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="اشرح تفاصيل عرضك هنا..."
                        ></textarea>
                      </div>
                    </div>
                  ) : ( // QuickBid Offer Form
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="offerAmount" className="block text-sm font-medium text-gray-700">مبلغ العرض (ريال)</label>
                        <input
                          type="number"
                          id="offerAmount"
                          value={newOfferAmount}
                          onChange={(e) => setNewOfferAmount(e.target.value)}
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                          placeholder="مثال: 500"
                        />
                      </div>
                      <div>
                        <label htmlFor="offerNotes" className="block text-sm font-medium text-gray-700">ملاحظات (اختياري)</label>
                        <textarea
                          id="offerNotes"
                          rows={3}
                          value={newOfferNotes}
                          onChange={(e) => setNewOfferNotes(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                          placeholder="أي تفاصيل إضافية تود ذكرها..."
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <p className="mt-4 text-sm text-red-600">{submitError}</p>
                  )}

                  <div className="mt-6 flex justify-end space-x-3 rtl:space-x-reverse">
                    <button
                      type="button"
                      onClick={() => setShowBidForm(false)}
                      disabled={submitLoading}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${buttonBgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
                    >
                      {submitLoading ? 'جاري الإرسال...' : 'إرسال العرض'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

