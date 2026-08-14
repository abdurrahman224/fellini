import { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  X,
  Send,
  Sparkles,
  MessageCircle,
  Headphones,
  ChevronLeft,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Loader2,
  RefreshCw,
  User,
  Bot
} from 'lucide-react';
import {
  toggleWidget,
  closeWidget,
  setActiveView,
  addUserMessage,
  clearConversation,
  clearRatingSuccess,
  selectAiSupport
} from '../../features/aiSupport/aiSupportSlice';
import {
  startSupportChat,
  continueSupportChat,
  escalateToHuman,
  getQuickHelp,
  getKnowledgeArticle,
  rateKnowledgeArticle
} from '../../features/aiSupport/aiSupportAPI';
import { selectUser } from '../../features/auth/authSlice';

// Auth routes where widget should be hidden
const AUTH_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/verify-otp',
  '/reset-password',
  '/forgot-password-verify-otp'
];

const AISupportWidget = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectUser);
  
  const {
    isOpen,
    activeView,
    conversationId,
    sessionId,
    messages,
    isEscalated,
    chatLoading,
    quickHelpLoading,
    articleLoading,
    quickHelpArticles,
    selectedArticle,
    error,
    ratingSuccess
  } = useSelector(selectAiSupport);

  const [inputText, setInputText] = useState('');
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when widget opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, activeView]);

  // Load quick help on first open
  useEffect(() => {
    if (isOpen && quickHelpArticles.length === 0) {
      dispatch(getQuickHelp());
    }
  }, [isOpen, quickHelpArticles.length, dispatch]);

  // Clear rating success after delay
  useEffect(() => {
    if (ratingSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearRatingSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [ratingSuccess, dispatch]);

  // Hide widget for logged-in users OR on auth pages
  const isAuthPage = AUTH_ROUTES.some(route => location.pathname.startsWith(route));
  if (user || isAuthPage) {
    return null;
  }

  // Handle send message
  const handleSendMessage = async () => {
    if (!inputText.trim() || chatLoading) return;

    const message = inputText.trim();
    setInputText('');

    // Add user message to UI immediately
    dispatch(addUserMessage(message));

    // Send to API
    if (!conversationId) {
      // Start new conversation
      dispatch(startSupportChat({
        message,
        sessionId: user ? undefined : sessionId
      }));
    } else {
      // Continue existing conversation
      dispatch(continueSupportChat({
        conversationId,
        message
      }));
    }
  };

  // Handle escalate to human
  const handleEscalate = () => {
    if (!escalateReason.trim()) return;
    
    dispatch(escalateToHuman({
      conversationId,
      reason: escalateReason
    }));
    setShowEscalateModal(false);
    setEscalateReason('');
  };

  // Handle article click
  const handleArticleClick = (articleId) => {
    dispatch(getKnowledgeArticle(articleId));
  };

  // Handle article rating
  const handleRateArticle = (helpful) => {
    if (selectedArticle) {
      dispatch(rateKnowledgeArticle({
        articleId: selectedArticle.id,
        helpful
      }));
    }
  };

  // Handle new chat
  const handleNewChat = () => {
    dispatch(clearConversation());
  };

  // Format message with markdown-like styling
  const formatMessage = (text) => {
    if (!text) return '';
    
    // Convert **bold** to styled spans
    let formatted = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>');
    
    // Convert newlines to <br>
    formatted = formatted.replace(/\n/g, '<br/>');
    
    return formatted;
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      billing: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      account: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      features: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      troubleshooting: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      general: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      dashboard: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
    };
    return colors[category] || colors.general;
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Mobile button */}
        <button
          onClick={() => dispatch(toggleWidget())}
          className="md:hidden flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] rounded-full shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
          aria-label="Open AI Support"
        >
          <Sparkles className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full" />
        </button>

        {/* Desktop button with label */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => dispatch(toggleWidget())}
            className="flex items-center bg-gray-800 dark:bg-white rounded-full pl-5 pr-14 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
          >
            <span className="text-sm font-medium  text-white dark:text-gray-700">
              Need Help?
            </span>
          </button>
          <button
            onClick={() => dispatch(toggleWidget())}
            className="absolute right-0 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] rounded-full shadow-lg hover:scale-105 transition-all duration-300"
            aria-label="Open AI Support"
          >
            <Sparkles className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
        onClick={() => dispatch(closeWidget())}
      />

      {/* Main Widget Container */}
      <div className="fixed inset-x-0 bottom-0 md:inset-auto md:bottom-6 md:right-6 z-50 w-full md:w-[420px] h-[85vh] md:h-[600px] md:max-h-[85vh] bg-white dark:bg-gray-900 rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-0 md:border border-gray-200 dark:border-gray-700">
        
        {/* Mobile drag handle */}
        <div className="md:hidden flex justify-center pt-3 pb-1 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9]">
          <div className="w-12 h-1.5 bg-white/40 rounded-full" />
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] px-4 pb-4 pt-2 md:p-5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {activeView !== 'chat' && activeView !== 'quickHelp' && (
                <button
                  onClick={() => dispatch(setActiveView(activeView === 'article' ? 'quickHelp' : 'chat'))}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
              )}
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base md:text-lg">
                  AI Support
                </h3>
                <p className="text-white/80 text-xs md:text-sm">
                  How can we help?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(closeWidget())}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => dispatch(setActiveView('chat'))}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition ${
                activeView === 'chat'
                  ? 'bg-white text-[#7C3AED]'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => dispatch(setActiveView('quickHelp'))}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition ${
                activeView === 'quickHelp' || activeView === 'article'
                  ? 'bg-white text-[#7C3AED]'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>FAQ</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          
          {/* Chat View */}
          {activeView === 'chat' && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-[#7C3AED]" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                      Welcome to AI Support!
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-[280px]">
                      Ask me anything about your account, billing, features, or any issues you're facing.
                    </p>
                    
                    {/* Quick suggestions */}
                    <div className="mt-6 space-y-2 w-full max-w-[300px]">
                      {['How do I upgrade my plan?', 'What features are included?', 'How to reset password?'].map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInputText(suggestion);
                            inputRef.current?.focus();
                          }}
                          className="w-full text-left px-4 py-3 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-700 transition"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <div
                        key={msg.id || idx}
                        className={`flex ${msg.role === 'user' || msg.isFromUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {/* Avatar for AI/System */}
                        {(msg.role === 'assistant' || msg.role === 'system') && (
                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${
                            msg.role === 'system' 
                              ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                              : 'bg-purple-100 dark:bg-purple-900/30'
                          }`}>
                            {msg.role === 'system' ? (
                              <Headphones className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            ) : (
                              <Bot className="w-4 h-4 text-[#7C3AED]" />
                            )}
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            msg.role === 'user' || msg.isFromUser
                              ? 'bg-[#7C3AED] text-white rounded-tr-sm'
                              : msg.role === 'system'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-tl-sm'
                              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-100 dark:border-gray-700 rounded-tl-sm'
                          }`}
                        >
                          <div 
                            className="text-sm leading-relaxed whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: formatMessage(msg.message) }}
                          />
                          <div className={`text-[10px] mt-1 ${
                            msg.role === 'user' || msg.isFromUser 
                              ? 'text-white/70' 
                              : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </div>
                        </div>

                        {/* Avatar for User */}
                        {(msg.role === 'user' || msg.isFromUser) && (
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center ml-2">
                            <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Loading indicator */}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-2">
                          <Bot className="w-4 h-4 text-[#7C3AED]" />
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Escalate & New Chat Actions */}
              {messages.length > 0 && !isEscalated && (
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <button
                    onClick={() => setShowEscalateModal(true)}
                    className="flex items-center gap-2 text-sm text-[#7C3AED] hover:text-[#6D28D9] font-medium transition"
                  >
                    <Headphones className="w-4 h-4" />
                    Talk to human
                  </button>
                  <button
                    onClick={handleNewChat}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    New chat
                  </button>
                </div>
              )}

              {/* Escalated notice */}
              {isEscalated && (
                <div className="px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                    ✨ Escalated to human support. We'll respond soon!
                  </p>
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 md:p-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shrink-0 safe-area-bottom">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isEscalated ? 'Waiting for human support...' : 'Type your message...'}
                    disabled={chatLoading || isEscalated}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-900 border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={chatLoading || !inputText.trim() || isEscalated}
                    className="shrink-0 w-11 h-11 md:w-12 md:h-12 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl flex items-center justify-center disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                  >
                    {chatLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Quick Help / FAQ View */}
          {activeView === 'quickHelp' && (
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#7C3AED]" />
                Frequently Asked Questions
              </h4>
              
              {quickHelpLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#7C3AED] animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {quickHelpArticles.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => handleArticleClick(article.id)}
                      className="w-full text-left p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#7C3AED] dark:hover:border-[#7C3AED] hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${getCategoryColor(article.category)}`}>
                            {article.category}
                          </span>
                          <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#7C3AED] transition">
                            {article.question}
                          </p>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-gray-400 transform rotate-180 group-hover:text-[#7C3AED] group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Article View */}
          {activeView === 'article' && selectedArticle && (
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              {articleLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#7C3AED] animate-spin" />
                </div>
              ) : (
                <>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium mb-3 ${getCategoryColor(selectedArticle.category)}`}>
                      {selectedArticle.category}
                    </span>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                      {selectedArticle.question}
                    </h4>
                    <div 
                      className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: formatMessage(selectedArticle.answer) }}
                    />
                    
                    {/* Keywords */}
                    {selectedArticle.keywords && selectedArticle.keywords.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-wrap gap-2">
                          {selectedArticle.keywords.map((keyword, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rating Section */}
                  <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-3 text-center">
                      Was this article helpful?
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleRateArticle(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 rounded-xl font-medium text-sm transition"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Yes
                      </button>
                      <button
                        onClick={() => handleRateArticle(false)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-xl font-medium text-sm transition"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        No
                      </button>
                    </div>
                    {ratingSuccess && (
                      <p className="text-sm text-green-600 dark:text-green-400 text-center mt-3">
                        {ratingSuccess}
                      </p>
                    )}
                  </div>

                  {/* Still need help */}
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        dispatch(setActiveView('chat'));
                        setInputText(`I have a question about: ${selectedArticle.question}`);
                      }}
                      className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-medium text-sm transition flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Still need help? Chat with AI
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Escalate Modal */}
      {showEscalateModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setShowEscalateModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[70] w-[90%] max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Talk to Human Support
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Please tell us why you need human assistance so we can help you better.
            </p>
            <textarea
              value={escalateReason}
              onChange={(e) => setEscalateReason(e.target.value)}
              placeholder="e.g., I need help with a refund request..."
              className="w-full h-24 px-4 py-3 bg-gray-100 dark:bg-gray-900 border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowEscalateModal(false)}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEscalate}
                disabled={!escalateReason.trim()}
                className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl font-medium text-sm transition disabled:cursor-not-allowed"
              >
                Escalate
              </button>
            </div>
          </div>
        </>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-24 right-6 z-[80] bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg max-w-sm">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </>
  );
};

export default AISupportWidget;
