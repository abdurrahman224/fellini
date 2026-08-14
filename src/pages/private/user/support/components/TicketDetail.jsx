import React from 'react';
import { ArrowLeft, Send, User } from 'lucide-react';

const TicketDetail = ({ 
  selectedTicket, 
  detailLoading, 
  replyLoading,
  replyMessage,
  setReplyMessage,
  handleBackToTickets, 
  handleReplySubmit,
  getStatusBadge,
  getPriorityColor,
  formatDate,
  formatTime
}) => {
  if (detailLoading) {
    return (
      <div className='p-4 sm:p-6 lg:p-8'>
        <button
          onClick={handleBackToTickets}
          className='flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition'
        >
          <ArrowLeft size={18} />
          Back to Tickets
        </button>
        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#7C3AED] border-r-transparent'></div>
            <p className='mt-4 text-sm text-gray-600 dark:text-gray-400'>Loading ticket details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedTicket) {
    return (
      <div className='p-4 sm:p-6 lg:p-8'>
        <button
          onClick={handleBackToTickets}
          className='flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition'
        >
          <ArrowLeft size={18} />
          Back to Tickets
        </button>
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Ticket not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      {/* Back Button */}
      <button
        onClick={handleBackToTickets}
        className='flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition'
      >
        <ArrowLeft size={18} />
        Back to Tickets
      </button>

      <div className='space-y-6'>
        {/* Ticket Header */}
        <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-gray-200 dark:border-zinc-700'>
          <div>
            <span className='text-sm font-medium text-[#7C3AED] dark:text-[#b388fc]'>
              {selectedTicket.ticketId}
            </span>
            <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1'>
              Subject : {selectedTicket.subject}
            </h2>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
              Created on {formatDate(selectedTicket.createdAt)} at {formatTime(selectedTicket.createdAt)}
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            {getStatusBadge(selectedTicket.status)}
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
              {selectedTicket.priority}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            Conversation
          </h3>
          <div className='space-y-4 max-h-[400px] overflow-y-auto pr-2'>
            {selectedTicket.messages?.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${!msg.isFromAdmin ? 'flex-row-reverse' : ''}`}
              >
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  !msg.isFromAdmin 
                    ? 'bg-[#7C3AED]/20 text-[#7C3AED]' 
                    : 'bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-400'
                }`}>
                  <User size={16} />
                </div>
                <div className={`flex-1 ${!msg.isFromAdmin ? 'text-right' : ''}`}>
                  <div className={`inline-block rounded-lg px-4 py-3 max-w-[85%] ${
                    !msg.isFromAdmin 
                      ? 'bg-[#7C3AED] text-white' 
                      : 'bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-white'
                  }`}>
                    <p className='text-sm'>{msg.message}</p>
                  </div>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    {msg.isFromAdmin ? 'Support Team' : 'You'} • {formatDate(msg.createdAt)} {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reply Form - Only show if ticket is not closed */}
        {selectedTicket.status !== 'CLOSED' && (
          <div className='pt-6 border-t border-gray-200 dark:border-zinc-700'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Send Reply
            </h3>
            <form onSubmit={handleReplySubmit} className='space-y-4'>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder='Type your message here...'
                rows={4}
                required
                className='w-full rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition resize-none'
              />
              <div className='flex justify-end'>
                <button
                  type='submit'
                  disabled={replyLoading || !replyMessage.trim()}
                  className='flex items-center gap-2 rounded-lg bg-[#7C3AED] px-6 py-3 text-base font-normal text-white transition-all duration-200 hover:bg-[#b388fc] disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {replyLoading ? (
                    <>
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent'></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Reply
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {selectedTicket.status === 'CLOSED' && (
          <div className='pt-6 border-t border-gray-200 dark:border-zinc-700'>
            <div className='rounded-lg bg-gray-100 dark:bg-zinc-700 px-4 py-3 text-center'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                This ticket has been closed. Create a new ticket if you need further assistance.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;
