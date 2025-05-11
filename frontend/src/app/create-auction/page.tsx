"use client";

import { useState } from 'react';
import Link from 'next/link';

// Define types for clarity
type AuctionType = 'professional' | 'quickbid';

type ProfessionalAuctionData = {
  title: string;
  category: string;
  description: string;
  location: string;
  budget_min: string;
  budget_max: string;
  deadline: string;
  requirements: string;
  attachments: File[];
};

type QuickBidData = {
  description: string;
  image?: File | null;
  budget: string; // Example: 'low', 'medium', 'high' or a range
};

export default function CreateRequest() { // Renamed component for clarity
  const [auctionType, setAuctionType] = useState<AuctionType>('professional');

  // State for Professional Auction
  const [professionalData, setProfessionalData] = useState<ProfessionalAuctionData>({
    title: '',
    category: '',
    description: '',
    location: '',
    budget_min: '',
    budget_max: '',
    deadline: '',
    requirements: '',
    attachments: []
  });

  // State for QuickBid
  const [quickBidData, setQuickBidData] = useState<QuickBidData>({
    description: '',
    image: null,
    budget: ''
  });

  // --- Existing constants (categories, cities) remain the same ---
  const categories = [
    { id: 'building', name: 'بناء' },
    { id: 'renovation', name: 'ترميم' },
    { id: 'finishing', name: 'تشطيب' },
    { id: 'design', name: 'تصميم' },
    { id: 'landscaping', name: 'تنسيق حدائق' },
    { id: 'electrical', name: 'أعمال كهربائية' },
    { id: 'plumbing', name: 'أعمال سباكة' },
    { id: 'hvac', name: 'تكييف وتبريد' },
    { id: 'other', name: 'أخرى' }
  ];
  const cities = [
    'الرياض',
    'جدة',
    'مكة المكرمة',
    'المدينة المنورة',
    'الدمام',
    'الخبر',
    'الظهران',
    'الأحساء',
    'الطائف',
    'أبها',
    'بريدة',
    'تبوك',
    'القطيف',
    'خميس مشيط',
    'حائل',
    'نجران',
    'الجبيل',
    'ينبع',
    'أخرى'
  ];
  const quickBidBudgets = [
    { value: '0-500', label: 'أقل من 500 ريال' },
    { value: '500-2000', label: '500 - 2000 ريال' },
    { value: '2000-10000', label: '2000 - 10000 ريال' },
    { value: '10000+', label: 'أكثر من 10000 ريال' },
    { value: 'negotiable', label: 'قابل للتفاوض' },
  ];

  // --- Event Handlers ---
  const handleProfessionalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfessionalData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleProfessionalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setProfessionalData(prevData => ({
        ...prevData,
        attachments: [...prevData.attachments, ...files]
      }));
    }
  };

  const removeProfessionalAttachment = (index: number) => {
    setProfessionalData(prevData => ({
      ...prevData,
      attachments: prevData.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleQuickBidInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuickBidData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleQuickBidFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQuickBidData(prevData => ({
        ...prevData,
        image: e.target.files![0]
      }));
    }
  };

  const removeQuickBidImage = () => {
    setQuickBidData(prevData => ({
      ...prevData,
      image: null
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (auctionType === 'professional') {
      console.log('إرسال بيانات المزاد الاحترافي:', professionalData);
      // TODO: Send professionalData to backend
    } else {
      console.log('إرسال بيانات طلب QuickBid:', quickBidData);
      // TODO: Send quickBidData to backend
    }
    // Optional: Redirect after submission
    // router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 ml-2">Bidex</Link>
            <span className="text-sm text-gray-600">إنشاء طلب جديد</span>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
              العودة للوحة التحكم
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">إنشاء طلب جديد</h1>

            {/* Auction Type Selection */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-4 rtl:space-x-reverse" aria-label="Tabs">
                <button
                  onClick={() => setAuctionType('professional')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${auctionType === 'professional' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  مزاد احترافي (للمشاريع)
                </button>
                <button
                  onClick={() => setAuctionType('quickbid')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${auctionType === 'quickbid' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  طلب سريع (QuickBid)
                </button>
              </nav>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Conditional Rendering based on auctionType */}
              {auctionType === 'professional' && (
                <> {/* Professional Auction Form Fields */}
                  {/* Basic Info */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">معلومات المزاد الأساسية</h2>
                    <div className="grid grid-cols-1 gap-6">
                      {/* Title */}
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">عنوان المزاد <span className="text-red-500">*</span></label>
                        <input type="text" id="title" name="title" value={professionalData.title} onChange={handleProfessionalInputChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="مثال: بناء فيلا سكنية في حي النرجس" required />
                      </div>
                      {/* Category */}
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">التصنيف <span className="text-red-500">*</span></label>
                        <select id="category" name="category" value={professionalData.category} onChange={handleProfessionalInputChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
                          <option value="">اختر التصنيف</option>
                          {categories.map(category => (<option key={category.id} value={category.id}>{category.name}</option>))}
                        </select>
                      </div>
                      {/* Description */}
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">وصف المزاد <span className="text-red-500">*</span></label>
                        <textarea id="description" name="description" value={professionalData.description} onChange={handleProfessionalInputChange} rows={4} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="اكتب وصفاً تفصيلياً للمشروع..." required />
                      </div>
                    </div>
                  </div>
                  {/* Location & Budget */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">الموقع والميزانية</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Location */}
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">الموقع <span className="text-red-500">*</span></label>
                        <select id="location" name="location" value={professionalData.location} onChange={handleProfessionalInputChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
                          <option value="">اختر المدينة</option>
                          {cities.map(city => (<option key={city} value={city}>{city}</option>))}
                        </select>
                      </div>
                      {/* Budget Range */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="budget_min" className="block text-sm font-medium text-gray-700 mb-1">الحد الأدنى للميزانية (ريال) <span className="text-red-500">*</span></label>
                          <input type="number" id="budget_min" name="budget_min" value={professionalData.budget_min} onChange={handleProfessionalInputChange} min="0" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="مثال: 100000" required />
                        </div>
                        <div>
                          <label htmlFor="budget_max" className="block text-sm font-medium text-gray-700 mb-1">الحد الأقصى للميزانية (ريال) <span className="text-red-500">*</span></label>
                          <input type="number" id="budget_max" name="budget_max" value={professionalData.budget_max} onChange={handleProfessionalInputChange} min="0" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="مثال: 150000" required />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Requirements & Deadline */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">المتطلبات والمواعيد</h2>
                    <div className="grid grid-cols-1 gap-6">
                      {/* Deadline */}
                      <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">تاريخ انتهاء المزاد <span className="text-red-500">*</span></label>
                        <input type="datetime-local" id="deadline" name="deadline" value={professionalData.deadline} onChange={handleProfessionalInputChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required />
                        <p className="mt-1 text-sm text-gray-500">بعد هذا التاريخ، لن يتمكن الموردون من تقديم عروض جديدة.</p>
                      </div>
                      {/* Requirements */}
                      <div>
                        <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">متطلبات المشروع</label>
                        <textarea id="requirements" name="requirements" value={professionalData.requirements} onChange={handleProfessionalInputChange} rows={4} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="اكتب المتطلبات الخاصة بالمشروع..." />
                      </div>
                    </div>
                  </div>
                  {/* Attachments */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">الملفات المرفقة</h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">إضافة ملفات (اختياري)</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          {/* SVG Icon */}
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="professional-file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"><span>رفع ملفات</span><input id="professional-file-upload" name="professional-file-upload" type="file" className="sr-only" multiple onChange={handleProfessionalFileChange} /></label>
                            <p className="pr-1">أو اسحب وأفلت الملفات هنا</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, PDF حتى 10 ملفات بحجم أقصى 10 ميجابايت لكل ملف</p>
                        </div>
                      </div>
                    </div>
                    {/* Display Attachments */}
                    {professionalData.attachments.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">الملفات المرفقة:</h3>
                        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                          {professionalData.attachments.map((file, index) => (
                            <li key={index} className="pr-3 pl-4 py-3 flex items-center justify-between text-sm">
                              <div className="w-0 flex-1 flex items-center">
                                {/* SVG Icon */}
                                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" /></svg>
                                <span className="mr-2 flex-1 w-0 truncate">{file.name}</span>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <button type="button" onClick={() => removeProfessionalAttachment(index)} className="font-medium text-red-600 hover:text-red-500">حذف</button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              )}

              {auctionType === 'quickbid' && (
                <> {/* QuickBid Form Fields */}
                  <div className="bg-orange-50 p-4 rounded-md">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">تفاصيل الطلب السريع</h2>
                    {/* Description */}
                    <div>
                      <label htmlFor="quick-description" className="block text-sm font-medium text-gray-700 mb-1">وصف الطلب <span className="text-red-500">*</span></label>
                      <textarea id="quick-description" name="description" value={quickBidData.description} onChange={handleQuickBidInputChange} rows={4} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" placeholder="اكتب وصفاً موجزاً للخدمة المطلوبة..." required />
                    </div>
                    {/* Budget */}
                    <div className="mt-4">
                      <label htmlFor="quick-budget" className="block text-sm font-medium text-gray-700 mb-1">الميزانية التقريبية <span className="text-red-500">*</span></label>
                      <select id="quick-budget" name="budget" value={quickBidData.budget} onChange={handleQuickBidInputChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" required>
                        <option value="">اختر الميزانية</option>
                        {quickBidBudgets.map(budget => (<option key={budget.value} value={budget.value}>{budget.label}</option>))}
                      </select>
                    </div>
                    {/* Image Upload */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">إضافة صورة (اختياري)</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          {/* SVG Icon */}
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="quickbid-file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"><span>رفع صورة</span><input id="quickbid-file-upload" name="quickbid-file-upload" type="file" accept="image/*" className="sr-only" onChange={handleQuickBidFileChange} /></label>
                            <p className="pr-1">أو اسحب وأفلت الصورة هنا</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG حتى 5MB</p>
                        </div>
                      </div>
                    </div>
                    {/* Display Image Preview */}
                    {quickBidData.image && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">الصورة المرفقة:</h3>
                        <div className="relative border border-gray-200 rounded-md p-2 inline-block">
                          <img src={URL.createObjectURL(quickBidData.image)} alt="Preview" className="h-24 w-auto rounded" />
                          <button type="button" onClick={removeQuickBidImage} className="absolute top-0 right-0 -mt-2 -mr-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="pt-5">
                <div className="flex justify-end">
                  <Link href="/dashboard" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    إلغاء
                  </Link>
                  <button
                    type="submit"
                    className={`mr-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${auctionType === 'professional' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  >
                    {auctionType === 'professional' ? 'نشر المزاد' : 'نشر الطلب السريع'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

