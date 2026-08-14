import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTicket, getUserTickets, getTicketById, replyToTicket } from '../../../../features/support/supportAPI';
import { clearError, clearSuccess, clearSelectedTicket } from '../../../../features/support/supportSlice';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import CreateTicketForm from './components/CreateTicketForm';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import { getPriorityColor, getStatusBadge, formatDate, formatTime } from './utils/badgeHelpers.jsx';

const Support = () => {
  const dispatch = useDispatch();
  const { tickets, loading, error, success, selectedTicket, detailLoading, replyLoading } = useSelector((state) => state.support);

  // Form states
  const [activeTab, setActiveTab] = useState('create'); // 'create', 'tickets', 'detail'
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'LOW',
  });
  const [replyMessage, setReplyMessage] = useState('');

  // Fetch tickets on mount
  useEffect(() => {
    dispatch(getUserTickets());
  }, [dispatch]);

  // Clear messages after timeout
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      return;
    }

    const result = await dispatch(createTicket(formData));
    
    if (result.type === 'support/createTicket/fulfilled') {
      setFormData({
        subject: '',
        message: '',
        priority: 'LOW',
      });
      setActiveTab('tickets');
    }
  };

  // Handle view ticket details
  const handleViewTicket = async (ticketId) => {
    await dispatch(getTicketById(ticketId));
    setActiveTab('detail');
  };

  // Handle back to tickets
  const handleBackToTickets = () => {
    dispatch(clearSelectedTicket());
    setActiveTab('tickets');
  };

  // Handle reply submit
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    const result = await dispatch(replyToTicket({ 
      ticketId: selectedTicket.ticketId, 
      message: replyMessage 
    }));

    if (result.type === 'support/replyToTicket/fulfilled') {
      setReplyMessage('');
    }
  };

  return (
    <div className='bg-[#EEEEEE] dark:bg-zinc-900 min-h-screen p-4 sm:p-6 lg:p-8 font-sans'>
      <div className='mx-auto'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Support Center
          </h1>
          <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
            Create tickets and track your support requests
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className='mb-6 rounded-lg border border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800 px-4 py-3 flex items-start gap-2'>
            <CheckCircle2 className='text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5' size={20} />
            <span className='text-sm text-green-800 dark:text-green-300 font-medium'>{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className='mb-6 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 flex items-start gap-2'>
            <AlertCircle className='text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5' size={20} />
            <span className='text-sm text-red-800 dark:text-red-300 font-medium'>{error}</span>
          </div>
        )}

        {/* Tabs - Hide when viewing detail */}
        {activeTab !== 'detail' && (
          <div className='mb-6 flex gap-2 sm:gap-4 border-b border-gray-200 dark:border-zinc-700'>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-3 text-sm sm:text-base font-medium transition-colors border-b-2 ${
                activeTab === 'create'
                  ? 'border-[#7C3AED] text-[#7C3AED] dark:text-[#b388fc]'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Create Ticket
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-4 py-3 text-sm sm:text-base font-medium transition-colors border-b-2 ${
                activeTab === 'tickets'
                  ? 'border-[#7C3AED] text-[#7C3AED] dark:text-[#b388fc]'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              My Tickets ({tickets.length})
            </button>
          </div>
        )}

        {/* Content */}
        <div className='bg-white dark:bg-zinc-800 rounded-xl shadow-sm'>
          {activeTab === 'create' ? (
            <CreateTicketForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          ) : activeTab === 'tickets' ? (
            <TicketList
              tickets={tickets}
              loading={loading}
              handleViewTicket={handleViewTicket}
              setActiveTab={setActiveTab}
              getStatusBadge={getStatusBadge}
              getPriorityColor={getPriorityColor}
              formatDate={formatDate}
            />
          ) : (
            <TicketDetail
              selectedTicket={selectedTicket}
              detailLoading={detailLoading}
              replyLoading={replyLoading}
              replyMessage={replyMessage}
              setReplyMessage={setReplyMessage}
              handleBackToTickets={handleBackToTickets}
              handleReplySubmit={handleReplySubmit}
              getStatusBadge={getStatusBadge}
              getPriorityColor={getPriorityColor}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;
