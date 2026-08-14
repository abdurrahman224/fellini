import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Send, User } from 'lucide-react';
import { getAdminTicketById, adminReplyToTicket, updateTicketStatus } from '../../../../../features/adminSupport/adminSupportAPI';
import { clearMessages } from '../../../../../features/adminSupport/adminSupportSlice';

const ReplyModal = ({ open, onClose, onSave, ticket }) => {
  const dispatch = useDispatch();
  const { selectedTicket, detailLoading, replyLoading, statusLoading } = useSelector((state) => state.adminSupport);
  
  const [replyMessage, setReplyMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch ticket details when modal opens
  useEffect(() => {
    if (open && ticket?.ticketId) {
      dispatch(getAdminTicketById(ticket.ticketId));
    }
  }, [open, ticket?.ticketId, dispatch]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.messages]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setReplyMessage('');
      dispatch(clearMessages());
    }
  }, [open, dispatch]);

  if (!open) return null;

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket?.ticketId) return;

    try {
      await dispatch(adminReplyToTicket({ 
        ticketId: selectedTicket.ticketId, 
        message: replyMessage.trim() 
      })).unwrap();

      setReplyMessage('');
      
      if (onSave) onSave();
      
      // Refresh ticket details
      dispatch(getAdminTicketById(selectedTicket.ticketId));
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      URGENT: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[priority] || colors.LOW;
  };

  const getStatusColor = (status) => {
    const colors = {
      OPEN: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      IN_PROGRESS: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      RESOLVED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      CLOSED: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return colors[status] || colors.OPEN;
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 p-4">
      {/* Modal Container */}
      <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-gray-700">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              {selectedTicket?.user?.fullName || ticket?.user?.fullName || 'User'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedTicket?.user?.email || ticket?.user?.email}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Loading State */}
        {detailLoading ? (
          <>
            {/* Skeleton Ticket Info */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Skeleton Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-zinc-900">
              {/* User Message Skeleton */}
              <div className="flex gap-3 flex-row">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="flex-1 max-w-[75%] mr-auto">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-3 animate-pulse">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 mt-1 animate-pulse"></div>
                </div>
              </div>

              {/* Admin Message Skeleton */}
              <div className="flex gap-3 flex-row-reverse">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="flex-1 max-w-[75%] ml-auto">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-3 animate-pulse">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 mt-1 ml-auto animate-pulse"></div>
                </div>
              </div>

              {/* User Message Skeleton */}
              <div className="flex gap-3 flex-row">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="flex-1 max-w-[75%] mr-auto">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-3 animate-pulse">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 mt-1 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Skeleton Reply Form */}
            <div className="px-6 py-4 bg-white dark:bg-zinc-800 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2 animate-pulse"></div>
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="flex justify-end space-x-3">
                  <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </>
        ) : selectedTicket ? (
          <>
            {/* Ticket Info */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedTicket.subject}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                    Ticket ID: {selectedTicket.ticketId}
                  </p>
                </div>
                <div className="flex gap-2 ml-auto">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-zinc-900">
              {selectedTicket.messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.isFromAdmin ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.isFromAdmin 
                      ? 'bg-purple-100 dark:bg-purple-900/30' 
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    <User size={16} className={msg.isFromAdmin ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'} />
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex-1 max-w-[75%] ${msg.isFromAdmin ? 'ml-auto' : 'mr-auto'}`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      msg.isFromAdmin
                        ? 'bg-purple-600 dark:bg-purple-700 text-white'
                        : 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700'
                    }`}>
                      <p className={`text-sm whitespace-pre-wrap break-words ${
                        msg.isFromAdmin ? 'text-white' : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {msg.message}
                      </p>
                    </div>
                    <div className={`mt-1 text-xs text-gray-500 dark:text-gray-400 ${msg.isFromAdmin ? 'text-right' : 'text-left'}`}>
                      {formatDate(msg.createdAt)} at {formatTime(msg.createdAt)}
                      {msg.isFromAdmin && <span className="ml-2 font-medium text-purple-600 dark:text-purple-400">Admin</span>}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Form */}
            <div className="px-6 py-4 bg-white dark:bg-zinc-800 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                {/* Reply Textarea */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Your Reply</label>
                  <textarea
                    rows={3}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900 rounded-lg p-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    placeholder="Type your response here..."
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3">
                    <button 
                      onClick={onClose} 
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim() || replyLoading}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      {replyLoading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Reply
                        </>
                      )}
                    </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <p className="text-gray-500 dark:text-gray-400">No ticket data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReplyModal;