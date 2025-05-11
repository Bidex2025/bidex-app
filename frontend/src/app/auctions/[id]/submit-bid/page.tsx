"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function SubmitBid() {
  // نموذج بيانات المزاد
  const [auction, setAuction] = useState({
    id: 1,
    title: "بناء فيلا سكنية في حي النرجس",
    category: "بناء",
    description: "مشروع بناء فيلا سكنية مكونة من دورين وملحق على مساحة 500 متر مربع في حي النرجس بمدينة الرياض. يشمل المشروع أعمال الهيكل الإنشائي والتشطيبات الداخلية والخارجية والأعمال الكهربائية والصحية.",
    location: "الرياض - حي النرجس",
    budget_min: 800000,
    budget_max: 1000000,
    deadline: "2025-05-15T23:59:59",
    client: {
      id: 101,
      name: "محمد العمري",
      rating: 4.8,
      completedProjects: 12
    },
    requirements: "يجب أن يكون المقاول مصنف من الدرجة الثالثة على الأقل. يجب الالتزام بكود البناء السعودي وأنظمة البلدية. يفضل من لديه خبرة سابقة في بناء الفلل السكنية الفاخرة.",
    attachments: [
      { id: 1, name: "المخططات المعمارية.pdf", size: "2.4 MB" },
      { id: 2, name: "المخططات الإنشائية.pdf", size: "3.1 MB" },
      { id: 3, name: "جدول الكميات.xlsx", size: "1.2 MB" }
    ],
    bids: 8,
    lowestBid: 820000,
    createdAt: "2025-04-20"
  });

  // نموذج بيانات العرض
  const [bidData, setBidData] = useState({
    amount: '',
    duration: '',
    description: '',
    payment_terms: '',
    warranty: '',
    attachments: []
  });

  // تحديث بيانات العرض
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBidData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // إضافة ملفات مرفقة
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setBidData(prevData => ({
      ...prevData,
      attachments: [...prevData.attachments, ...files]
    }));
  };

  // حذف ملف مرفق
  const removeAttachment = (index) => {
    setBidData(prevData => ({
      ...prevData,
      attachments: prevData.attachments.filter((_, i) => i !== index)
    }));
  };

  // إرسال نموذج تقديم العرض
  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا سيتم إرسال البيانات إلى الخادم
    console.log('تم إرسال بيانات العرض:', bidData);
    // بعد الإرسال بنجاح، يمكن توجيه المستخدم إلى صفحة تأكيد
    // router.push('/bids/confirmation');
  };

  // حساب الوقت المتبقي للمزاد
  const calculateTimeRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;
    
    if (diff <= 0) return "انتهى";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} يوم ${hours} ساعة`;
    } else {
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours} ساعة ${minutes} دقيقة`;
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      {/* شريط التنقل العلوي */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 ml-2">Bidex</Link>
            <span className="text-sm text-gray-600">تقديم عرض</span>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
              العودة للوحة التحكم
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* معلومات المزاد */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">معلومات المزاد</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{auction.title}</h3>
                    <p className="text-sm text-gray-500">تصنيف: {auction.category}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">الوصف</h4>
                    <p className="text-sm text-gray-600 mt-1">{auction.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">الموقع</h4>
                      <p className="text-sm text-gray-600 mt-1">{auction.location}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">الميزانية</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {auction.budget_min.toLocaleString()} - {auction.budget_max.toLocaleString()} ريال
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">العروض المقدمة</h4>
                      <p className="text-sm text-gray-600 mt-1">{auction.bids}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">أقل عرض</h4>
                      <p className="text-sm text-green-600 font-medium mt-1">
                        {auction.lowestBid.toLocaleString()} ريال
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">الوقت المتبقي</h4>
                    <p className="text-sm text-orange-600 font-medium mt-1">
                      {calculateTimeRemaining(auction.deadline)}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">العميل</h4>
                    <div className="flex items-center mt-1">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {auction.client.name.charAt(0)}
                      </div>
                      <div className="mr-2">
                        <p className="text-sm font-medium text-gray-900">{auction.client.name}</p>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 ml-1">{auction.client.rating}</span>
                          <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <span className="text-xs text-gray-500 mr-1">({auction.client.completedProjects} مشروع)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {auction.requirements && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">المتطلبات</h4>
                      <p className="text-sm text-gray-600 mt-1">{auction.requirements}</p>
                    </div>
                  )}
                  
                  {auction.attachments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">الملفات المرفقة</h4>
                      <ul className="mt-1 space-y-1">
                        {auction.attachments.map(attachment => (
                          <li key={attachment.id} className="text-sm">
                            <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center">
                              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                              </svg>
                              {attachment.name} ({attachment.size})
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* نموذج تقديم العرض */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">تقديم عرض</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* معلومات العرض الأساسية */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">معلومات العرض</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* قيمة العرض */}
                      <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                          قيمة العرض (ريال) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="amount"
                          name="amount"
                          value={bidData.amount}
                          onChange={handleInputChange}
                          min={0}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="مثال: 850000"
                          required
                        />
                        {auction.lowestBid > 0 && (
                          <p className="mt-1 text-xs text-gray-500">
                            أقل عرض حالي: <span className="text-green-600 font-medium">{auction.lowestBid.toLocaleString()} ريال</span>
                          </p>
                        )}
                      </div>
                      
                      {/* مدة التنفيذ */}
                      <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                          مدة التنفيذ (بالأيام) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="duration"
                          name="duration"
                          value={bidData.duration}
                          onChange={handleInputChange}
                          min={1}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="مثال: 90"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* وصف العرض */}
                    <div className="mt-6">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        وصف العرض <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={bidData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="اشرح تفاصيل عرضك، بما في ذلك المواد المستخدمة، طريقة التنفيذ، الميزات الإضافية، إلخ..."
                        required
                      />
                    </div>
                  </div>
                  
                  {/* شروط الدفع والضمان */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">شروط الدفع والضمان</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* شروط الدفع */}
                      <div>
                        <label htmlFor="payment_terms" className="block text-sm font-medium text-gray-700 mb-1">
                          شروط الدفع <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="payment_terms"
                          name="payment_terms"
                          value={bidData.payment_terms}
                          onChange={handleInputChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        >
                          <option value="">اختر شروط الدفع</option>
                          <option value="milestone">دفعات على مراحل (مستخلصات)</option>
                          <option value="percentage">دفعة مقدمة ودفعات على نسب إنجاز</option>
                          <option value="completion">دفعة مقدمة ودفعة عند الاكتمال</option>
                          <option value="custom">شروط مخصصة (يرجى التوضيح في الوصف)</option>
                        </select>
                      </div>
                      
                      {/* فترة الضمان */}
                      <div>
                        <label htmlFor="warranty" className="block text-sm font-medium text-gray-700 mb-1">
                          فترة الضمان <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="warranty"
                          name="warranty"
                          value={bidData.warranty}
                          onChange={handleInputChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        >
                          <option value="">اختر فترة الضمان</option>
                          <option value="6months">6 أشهر</option>
                          <option value="1year">سنة واحدة</option>
                          <option value="2years">سنتان</option>
                          <option value="3years">3 سنوات</option>
                          <option value="5years">5 سنوات</option>
                          <option value="custom">فترة مخصصة (يرجى التوضيح في الوصف)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* الملفات المرفقة */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">الملفات المرفقة</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        إضافة ملفات (اختياري)
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                              <span>تحميل ملف</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} multiple />
                            </label>
                            <p className="pr-1">أو اسحبه وأفلته هنا</p>
                          </div>
                          <p className="text-xs text-gray-500">PDF, DOCX, XLSX, JPG, PNG حتى 10MB</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* عرض الملفات المرفقة */}
                    {bidData.attachments.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">الملفات المرفقة:</h4>
                        <ul className="mt-2 space-y-2">
                          {bidData.attachments.map((file, index) => (
                            <li key={index} className="flex items-center justify-between bg-white p-2 border border-gray-200 rounded-md">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 text-gray-400 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-gray-800">{file.name}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeAttachment(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {/* زر الإرسال */}
                  <div className="pt-5">
                    <div className="flex justify-end">
                      <Link href={`/auctions/${auction.id}`} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        إلغاء
                      </Link>
                      <button
                        type="submit"
                        className="mr-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        تقديم العرض
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

