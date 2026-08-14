import React, { useState } from 'react';
import { X, Send, Bot, User, AlertCircle, Loader2 } from 'lucide-react';

const ConversationDetail = ({ conversation, onClose, onRespond, respondLoading }) => {
  const [responseText, setResponseText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!responseText.trim() || respondLoading) return;
    onRespond(conversation.id, responseText);
    setResponseText('');
  };

  const formatMessageDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
              {conversation.subject || 'No subject'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {conversation.user?.fullName || conversation.user?.email || `Guest (${conversation.sessionId})`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        </div>

        {conversation.escalated && conversation.escalatedAt && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/50">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Escalated to human support</span>
            </div>
            <p className="text-xs text-red-500 dark:text-red-400/80 mt-1">
              {new Date(conversation.escalatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50 dark:bg-zinc-900/50">
        {conversation.messages?.slice().reverse().map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' || msg.isFromUser ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[80%] ${
              msg.role === 'user' || msg.isFromUser 
                ? 'bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-white rounded-2xl rounded-bl-sm' 
                : msg.role === 'system'
                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-xl border border-amber-200 dark:border-amber-800/50'
                : 'bg-[#7C3AED] text-white rounded-2xl rounded-br-sm shadow-sm'
            } px-4 py-3`}>
              <div className="flex items-center gap-2 mb-1.5">
                {msg.role === 'assistant' || msg.isFromAi ? (
                  <Bot className="w-4 h-4 text-white/80" />
                ) : msg.role === 'system' ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                )}
                <span className={`text-xs font-medium ${
                  msg.role === 'user' || msg.isFromUser ? 'text-gray-600 dark:text-gray-400' : 'text-white/80'
                }`}>
                  {msg.role === 'assistant' || msg.isFromAi ? 'AI Assistant' : 
                   msg.role === 'system' ? 'System' : 'User'}
                </span>
                <span className={`text-xs ${
                  msg.role === 'user' || msg.isFromUser ? 'text-gray-400 dark:text-gray-500' : 'text-white/60'
                }`}>
                  {formatMessageDate(msg.createdAt)}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Response Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800">
        <div className="relative">
          <input
            type="text"
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Type your response..."
            className="w-full pl-4 pr-28 py-3.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#7C3AED] focus:bg-white dark:focus:bg-zinc-800 transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!responseText.trim() || respondLoading}
            style={{ backgroundColor: responseText.trim() && !respondLoading ? '#7C3AED' : '#d1d5db' }}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:opacity-90"
          >
            {respondLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConversationDetail;
