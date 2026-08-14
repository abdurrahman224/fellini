import { useState, useEffect } from 'react';
import { DollarSign, CreditCard, TriangleAlert } from 'lucide-react';
import AllPagination from '../../../../components/common/AllPagination';
import { GET } from '../../../../services/httpMethods';

const TransactionMobileCard = ({ tx }) => (
  <div className="mb-3 rounded-lg border border-gray-400 dark:border-gray-800 bg-white dark:bg-zinc-700 p-4 shadow-sm">
    <div className="mb-3 flex items-start justify-between">
      <div>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-200 uppercase">{tx.id}</div>
        <div className="font-bold text-gray-900 dark:text-white">{(tx.user && (tx.user.fullName || tx.user.email)) || tx.user || '—'}</div>
      </div>
      <span
        className={`rounded px-2 py-1 text-[10px] font-bold tracking-wider ${tx.status === 'SUCCESS'
            ? 'bg-green-100 text-green-600'
            : tx.status === 'FAILED'
              ? 'bg-red-100 text-red-500'
              : 'bg-gray-100 text-gray-500 dark:text-gray-700'
          }`}
      >
        {tx.status}
      </span>
    </div>

    <div className="space-y-2 border-t border-gray-300 dark:border-gray-600 pt-3">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-300">Plan:</span>
        <span className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
          {tx.planImage ? (
            <img src={tx.planImage} alt={tx.plan} className="h-6 w-6 rounded-sm object-contain" />
          ) : null}
          <span>{tx.plan}</span>
        </span>
      </div>
     
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-300">Amount:</span>
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{tx.amount}</span>
      </div>
    </div>
  </div>
);

const FinanceAndSubscriptions = () => {
  // --- Pagination Logic Start ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [transactions, setTransactions] = useState([]);
  const [planImages, setPlanImages] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        // Admin endpoint returns payments under /api/v1/admin/payments (see Postman)
        const res = await GET('/api/v1/admin/payments');
        let list = [];
        // normalize a variety of possible response shapes
        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res.data)) list = res.data;
        else if (Array.isArray(res.data?.data)) list = res.data.data;
        else if (Array.isArray(res.payments)) list = res.payments;
        else if (Array.isArray(res.paymentsHistory)) list = res.paymentsHistory;
        else if (Array.isArray(res.data?.payments)) list = res.data.payments;
        // fetch plan images to map by plan name/id
        let localPlanMap = {};
        try {
          const plansRes = await GET('/api/v1/payments/plans');
          let plansList = [];
          if (Array.isArray(plansRes)) plansList = plansRes;
          else if (plansRes && Array.isArray(plansRes.data?.data?.plans)) plansList = plansRes.data.data.plans;
          else if (plansRes && Array.isArray(plansRes.data?.plans)) plansList = plansRes.data.plans;
          else if (plansRes && Array.isArray(plansRes.plans)) plansList = plansRes.plans;

          plansList.forEach((p) => {
            const key = (p.id || p.name || '').toString().toLowerCase();
            if (p.image || p.imageRoute || p.imageURL || p.image_url) localPlanMap[key] = p.image || p.imageRoute || p.imageURL || p.image_url;
          });
          if (mounted) setPlanImages(localPlanMap);
        } catch (err) {
          // ignore plan images errors
        }

        if (mounted) {
          // attach planImage to each tx when possible (use localPlanMap fallback)
          const enriched = list.map((tx) => {
            const key = (tx.plan || tx.description || '').toString().toLowerCase();
            return { ...tx, planImage: (localPlanMap[key] || planImages[key]) || null };
          });
          setTransactions(enriched);
        }
      } catch (err) {
        if (mounted) setError(err?.message || 'Failed to load transactions');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPayments();
    return () => {
      mounted = false;
    };
  }, []);

  const totalResults = transactions.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="w-full p-4 md:p-8">
      {/* Stats Cards Section */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:mb-8 md:grid-cols-3 md:gap-6">
        <div className="relative rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-zinc-800 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-lg bg-[#F0FDF4] p-2">
              <DollarSign className="h-5 w-5 text-[#22A853]" />
            </div>
            <span className="rounded-full bg-[#F0FDF4] px-2 py-1 text-xs font-normal text-[#22A853]">
              +8.2%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-semibold text-black dark:text-white">$0</h3>
            <p className="text-base font-normal text-[#666B74] dark:text-gray-300">Monthly Recurring Revenue</p>
          </div>
        </div>

        <div className="relative rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-zinc-800 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-lg bg-[#EFF6FF] p-2">
              <CreditCard className="h-5 w-5 text-[#2563EB]" />
            </div>
            <span className="rounded-full bg-[#EFF6FF] px-2 py-1 text-xs font-normal text-[#2563EB]">
              +120
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-semibold text-black dark:text-white ">0</h3>
            <p className="text-base font-normal text-[#666B74] dark:text-gray-300">Active Subscriptions</p>
          </div>
        </div>

        <div className="relative rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-zinc-800  p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-lg bg-[#FFF7ED] p-2">
              <TriangleAlert className="h-5 w-5 text-[#FF5902]" />
            </div>
            <span className="rounded-xl bg-[#F9FAFB] px-2 py-1 text-[10px] font-medium text-[#6B7280]">
              Needs Attention
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-semibold text-black dark:text-white">0</h3>
            <p className="text-base font-normal text-[#666B74] dark:text-white">Failed Payments</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-zinc-800 shadow-sm">
        <div className="flex items-center justify-between  dark:border-gray-700 px-6 py-4 text-base font-medium text-black">
          <h2 className="text-base md:text-lg dark:text-white">Recent Transaction</h2>
          {/* <button className="text-base dark:text-white">View All</button> */}
        </div>

        {/* --- Mobile Card View --- */}
        <div className="p-4 lg:hidden">
          {!loading && !error && transactions.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-gray-200">No transactions found.</div>
          ) : (
            currentTransactions.map((tx, idx) => (
              <TransactionMobileCard key={`${tx.id}-${idx}`} tx={tx} />
            ))
          )}
        </div>

        {/* --- Desktop Table View --- */}
        <div className="hidden overflow-hidden lg:block">
          <div className="overflow-x-auto">
            {!loading && !error && transactions.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500 dark:text-gray-200">No transactions found.</div>
            ) : (
              <table className="w-full text-left">
                <thead className="border-y border-gray-200 bg-[#F8FBFE] dark:bg-zinc-700 text-base font-semibold text-[#666B74] uppercase transition hover:bg-gray-50 dark:hover:bg-zinc-700">
                  <tr>
                    <th className="px-6 py-3 text-sm font-medium text-gray-400 dark:text-gray-200 uppercase xl:pl-11">
                      ID
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-400 dark:text-gray-200 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-400 dark:text-gray-200 uppercase">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-400 dark:text-gray-200 uppercase">
                      Amount
                    </th>
                    
                    <th className="px-6 py-3 pr-11 text-end text-sm font-medium text-gray-400 dark:text-gray-200 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentTransactions.map((tx, idx) => (
                    <tr
                      key={`${tx.id}-${idx}`}
                      className="border-b border-gray-200 text-base font-normal text-[#3A4C65] transition hover:bg-gray-50 dark:hover:bg-zinc-700"
                    >
                      <td className="truncate px-6 py-5 text-base dark:text-gray-300">{tx.id}</td>
                      <td className="truncate px-6 py-5 text-center text-base dark:text-gray-300">{(tx.user && (tx.user.fullName || tx.user.email)) || tx.user || '—'}</td>
                      <td className="truncate px-6 py-5 text-center text-base dark:text-gray-300">
                        <div className="flex items-center justify-center gap-2">
                          {tx.planImage ? (
                            <img src={tx.planImage} alt={tx.plan} className="h-6 w-6 rounded-sm object-contain" />
                          ) : null}
                          <span>{tx.plan}</span>
                        </div>
                      </td>
                      <td className="truncate px-6 py-5 text-center text-base font-medium text-[#3A4C65] dark:text-gray-300">
                        {tx.amount}
                      </td>
                    
                      <td className="truncate px-6 py-5 text-end">
                        <span
                          className={`rounded px-3 py-1 text-sm tracking-wider ${tx.status === 'SUCCESS'
                              ? 'bg-green-100 text-green-600'
                              : tx.status === 'FAILED'
                                ? 'bg-red-100 text-red-500'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pagination Component */}
        <div className="pb-4 lg:p-4">
          {!loading && !error && transactions.length > 0 && (
            <AllPagination
              currentPage={currentPage}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={Math.min(indexOfLastItem, totalResults)}
              totalPages={totalPages}
              totalResults={totalResults}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceAndSubscriptions;
