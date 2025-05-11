import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-medium text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <div className="flex items-center justify-center gap-2 p-8 lg:p-0">
            <div className="text-2xl font-bold text-blue-600">Bidex</div>
            <p className="text-sm text-gray-600">منصة المزادات العكسية</p>
          </div>
        </div>
        <div className="fixed top-0 left-0 right-0 flex justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <nav className="flex gap-4">
            <Link href="/" className="hover:text-blue-600">الرئيسية</Link>
            <Link href="/auctions" className="hover:text-blue-600">المزادات</Link>
            <Link href="/dashboard" className="hover:text-blue-600">لوحة التحكم</Link>
            <Link href="/about" className="hover:text-blue-600">من نحن</Link>
            <Link href="/contact" className="hover:text-blue-600">اتصل بنا</Link>
          </nav>
        </div>
      </div>

      <div className="relative flex place-items-center my-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Bidex</h1>
          <h2 className="text-2xl font-semibold mb-8">منصة المزادات العكسية لقطاع المقاولات</h2>
          <p className="text-xl mb-8 max-w-2xl">
            منصة ذكية تربط بين العملاء والموردين بطريقة مبتكرة من خلال نظام المزادات العكسية
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register-client" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              تسجيل كعميل
            </Link>
            <Link href="/register-supplier" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition">
              تسجيل كمورد
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-3 lg:text-left gap-8">
        <div className="group rounded-lg border border-gray-300 px-5 py-4 transition-colors hover:border-blue-500">
          <h2 className="mb-3 text-2xl font-semibold text-blue-600">
            للعملاء
          </h2>
          <p className="m-0 text-sm opacity-80">
            انشر طلباتك واحصل على أفضل العروض من موردين مؤهلين. وفر الوقت والجهد والمال من خلال نظام المزادات العكسية.
          </p>
        </div>

        <div className="group rounded-lg border border-gray-300 px-5 py-4 transition-colors hover:border-orange-500">
          <h2 className="mb-3 text-2xl font-semibold text-orange-500">
            للموردين
          </h2>
          <p className="m-0 text-sm opacity-80">
            اكتشف فرص أعمال جديدة وقدم عروضك لعملاء محتملين. وسع نطاق أعمالك وزد من مبيعاتك من خلال منصتنا.
          </p>
        </div>

        <div className="group rounded-lg border border-gray-300 px-5 py-4 transition-colors hover:border-green-500">
          <h2 className="mb-3 text-2xl font-semibold text-green-600">
            مميزاتنا
          </h2>
          <p className="m-0 text-sm opacity-80">
            نظام مزادات عكسية شفاف، تقييمات موثوقة، نظام دفع آمن، وتوثيق للعقود والاتفاقيات.
          </p>
        </div>
      </div>

      <div className="w-full max-w-5xl mt-16">
        <h2 className="text-2xl font-semibold mb-8 text-center">كيف تعمل المنصة</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">1</div>
            <h3 className="font-semibold mb-2">نشر الطلبات</h3>
            <p className="text-sm">يقوم العملاء بنشر طلباتهم مع تحديد المواصفات والميزانية</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">2</div>
            <h3 className="font-semibold mb-2">تقديم العروض</h3>
            <p className="text-sm">يقوم الموردون المؤهلون بتقديم عروضهم التنافسية</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">3</div>
            <h3 className="font-semibold mb-2">اختيار العرض</h3>
            <p className="text-sm">يختار العميل العرض المناسب بناءً على السعر والتقييمات</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">4</div>
            <h3 className="font-semibold mb-2">إتمام الصفقة</h3>
            <p className="text-sm">يتم توثيق الاتفاق وإتمام العمل مع ضمان حقوق الطرفين</p>
          </div>
        </div>
      </div>

      <footer className="w-full border-t border-gray-300 py-8 mt-16">
        <div className="flex justify-between items-center max-w-5xl mx-auto px-4">
          <div>
            <p className="text-sm text-gray-600">© 2025 Bidex - جميع الحقوق محفوظة</p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600">الشروط والأحكام</Link>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600">سياسة الخصوصية</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
