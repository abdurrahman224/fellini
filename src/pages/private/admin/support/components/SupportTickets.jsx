import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminTickets, updateTicketStatus } from '../../../../../features/adminSupport/adminSupportAPI';
import { clearMessages } from '../../../../../features/adminSupport/adminSupportSlice';
import ReplyModal from '../../operation/components/ReplyModal.jsx';
import AllPagination from '../../../../../components/common/AllPagination.jsx';

/* ===================== DATA ===================== */

export default function SupportTickets() {
  const dispatch = useDispatch();
  const { tickets, loading, pagination, statistics } = useSelector((state) => state.adminSupport);
  
  const [modle, setModle] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const handleOpenModal = (ticket) => {
    setSelectedTicket(ticket);
    setModle(true);
  };
  const handleCloseModal = () => {
    setModle(false);
    setSelectedTicket(null);
  };

  const handleSavePlan = (data) => {
    console.log('Saved plan:', data);
  };

  // Fetch tickets on component mount
  useEffect(() => {
    dispatch(getAdminTickets({ page: currentPage, limit: pageSize }));
  }, [dispatch]);

  // Clear messages on unmount
  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalResults = pagination.total;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const indexOfFirstItem = (currentPage - 1) * pageSize;
  const indexOfLastItem = Math.min(indexOfFirstItem + pageSize, totalResults);
  const paginated = tickets.slice(indexOfFirstItem, Math.min(indexOfFirstItem + pageSize, tickets.length));

  const handlePrevious = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handlePageChange = (page) => setCurrentPage(page);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await dispatch(updateTicketStatus({ ticketId, status: newStatus })).unwrap();
      // Refresh tickets list
      dispatch(getAdminTickets({ page: currentPage, limit: pageSize }));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  /* ===================== HELPERS ===================== */
  const getPriorityColor = (p) =>
    p === 'HIGH' ? 'text-[#DC2626] bg-[#FEF2F2]' : p === 'MEDIUM' ? 'text-[#CD8A04] bg-[#FEFCE8]' : p === 'URGENT' ? 'text-[#DC2626] bg-[#FEF2F2]' : 'text-[#16A34A] bg-[#F0FDF4]';

  const getStatusBg = (s) =>
    s === 'OPEN'
      ? 'text-[#B91C3B] bg-[#FEE2E2]'
      : s === 'RESOLVED'
        ? 'bg-gray-200 text-gray-700'
        : s === 'IN_PROGRESS'
          ? 'bg-blue-100 text-blue-700'
          : s === 'CLOSED'
            ? 'bg-gray-200 text-gray-700'
            : 'bg-blue-100 text-blue-700';

  const formatStatus = (status) => {
    return status?.replace('_', ' ') || status;
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="p-6 md:p-8 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className=" hidden md:block">
        <div className="rounded-xl bg-white dark:bg-zinc-800 dark:text-white  shadow-sm border border-gray-300 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E5ED] dark:border-gray-700 dark:bg-zinc-800 dark:text-white">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tickets</h2>
            <span className="text-xs font-semibold bg-[#FEE2E2] text-[#B91C1C] px-2 py-1 rounded-sm">
              {statistics.open} Open
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e0e5ed] dark:bg-zinc-700  dark:text-white dark:border-gray-700  ">
                  {['ID', 'SUBJECT', 'USER', 'PRIORITY', 'STATUS', 'ACTION'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-100 ">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-500 ">
                {paginated.map((t) => (
                  <tr key={t.id} className="hover:bg-[#F8FBFE] dark:hover:bg-zinc-700  ">
                    <td className="px-6 py-4 text-base text-gray-600 dark:text-gray-200">{t.ticketId}</td>
                    <td className="px-6 py-4 text-base text-gray-600 dark:text-gray-200">{t.subject}</td>
                    <td className="px-6 py-4 text-base text-gray-600 dark:text-gray-200">{t.user?.fullName || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <samp className={`rounded-sm px-3 py-1 text-sm  ${getPriorityColor(t.priority)}`}>{t.priority}</samp>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={t.status}
                        onChange={(e) => handleStatusChange(t.ticketId, e.target.value)}
                        className={`rounded-sm px-3 py-1 text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-purple-500 ${getStatusBg(t.status)}`}
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleOpenModal(t)}
                        className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination inside the same rounded container to avoid gap */}
          <div className="border-t border-[#E0E5ED] dark:border-gray-700 bg-white dark:bg-zinc-800">
            <AllPagination
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
              totalResults={totalResults}
              handlePrevious={handlePrevious}
              currentPage={currentPage}
              handleNext={handleNext}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      <div className=" space-y-4 md:hidden">
        {paginated.map((t) => (
          <div key={t.id} className="space-y-3 rounded-xl  p-4 shadow-sm dark:bg-zinc-800">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-300">{t.subject}</h3>
              <span className={`rounded-sm   px-3 py-1 text-xs ${getPriorityColor(t.priority)}`}>
                {t.priority}
              </span>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-300">ID: {t.ticketId}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">User: {t.user?.fullName || 'N/A'}</p>

            <div className="flex items-center justify-between pt-2">
              <select
                value={t.status}
                onChange={(e) => handleStatusChange(t.ticketId, e.target.value)}
                className={`rounded-sm px-3 py-1 text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-purple-500 ${getStatusBg(t.status)}`}
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
              <button onClick={() => handleOpenModal(t)} className="text-sm font-medium text-purple-600 dark:text-purple-400">Reply</button>
            </div>
          </div>
        ))}
      </div>


      <ReplyModal 
        open={modle}
        onClose={handleCloseModal}
        onSave={handleSavePlan}
        ticket={selectedTicket}
      />
      {/* Compact pagination for mobile list */}
      <div className="mt-4 md:hidden">
        <div className="mx-auto w-full max-w-xs bg-white dark:bg-zinc-800 rounded-md p-3 shadow-sm">
          <AllPagination
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            totalResults={totalResults}
            handlePrevious={handlePrevious}
            currentPage={currentPage}
            handleNext={handleNext}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
