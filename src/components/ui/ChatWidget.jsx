import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, MessageCircle, Send, BotMessageSquare } from 'lucide-react';
import { startChatSession, fetchChatRooms, fetchChatMessages, sendChatMessage, addMessage } from '../../features/chat/chatSlice';

const ChatWidget = () => {
  const dispatch = useDispatch();
  const { sessionStarted, roomId, messages: reduxMessages, loading } = useSelector((state) => state.chat);
  
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(reduxMessages);
  const [text, setText] = useState('');
  const panelRef = useRef(null);
  const chatWidgetRef = useRef(null);

  useEffect(() => {
    if (open && panelRef.current) {
      const node = panelRef.current;
      node.scrollTop = node.scrollHeight;
    }
  }, [open, messages]);

  // Sync Redux messages with local state
  useEffect(() => {
    setMessages(reduxMessages);
  }, [reduxMessages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatWidgetRef.current && !chatWidgetRef.current.contains(event.target) && open) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Start chat session API call via Redux
  useEffect(() => {
    const initializeChat = async () => {
      if (open && !sessionStarted) {
        // Start chat session
        const result = await dispatch(startChatSession());
        
        // If session started successfully, fetch chat rooms to get room ID
        if (result.type === 'chat/startSession/fulfilled') {
          const roomsResult = await dispatch(fetchChatRooms());
          
          // If rooms fetched successfully, get messages for the first room
          if (roomsResult.type === 'chat/fetchRooms/fulfilled' && roomsResult.payload?.length > 0) {
            const firstRoomId = roomsResult.payload[0].id;
            dispatch(fetchChatMessages(firstRoomId));
          }
        }
      }
    };

    initializeChat();
  }, [open, sessionStarted, dispatch]);

  const send = async () => {
    if (!text.trim() || !roomId) return;
    
    const messageText = text.trim();
    setText('');
    
    // Send message via Redux
    await dispatch(sendChatMessage({ roomId, message: messageText }));
  };

  // Skeleton Loader Component
  const MessageSkeleton = () => (
    <div className="flex-1 space-y-3 p-4">
      {/* Bot message skeleton */}
      <div className="flex justify-start">
        <div className="max-w-[80%] rounded-xl rounded-tl-none bg-gray-200 dark:bg-zinc-700 px-4 py-3 animate-pulse">
          <div className="h-4 w-48 bg-gray-300 dark:bg-zinc-600 rounded"></div>
        </div>
      </div>
      
      {/* User message skeleton */}
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-xl rounded-tr-none bg-purple-200 dark:bg-purple-900/30 px-4 py-3 animate-pulse">
          <div className="h-4 w-32 bg-purple-300 dark:bg-purple-800 rounded"></div>
        </div>
      </div>
      
      {/* Bot message skeleton */}
      <div className="flex justify-start">
        <div className="max-w-[80%] rounded-xl rounded-tl-none bg-gray-200 dark:bg-zinc-700 px-4 py-3 animate-pulse">
          <div className="h-4 w-40 bg-gray-300 dark:bg-zinc-600 rounded mb-2"></div>
          <div className="h-4 w-24 bg-gray-300 dark:bg-zinc-600 rounded"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Floating Button (small screens still show) */}
      <div className="fixed right-6 bottom-6 z-50">
        {!open && (
          <>
            {/* Mobile-only floating icon: fixed so it sits above bottom bars */}
            <button
              aria-label="Open chat"
              onClick={() => setOpen(true)}
              className="inline-flex md:hidden fixed right-6 bottom-6 z-50 items-center justify-center bg-gradient-to-br from-[#6C3ADC] to-[#8141EE] w-14 h-14 rounded-full text-white shadow-lg hover:scale-105 transition-transform"
            >
              <BotMessageSquare size={20} />
            </button>

            {/* Desktop: pill + overlapped icon */}
            <div className="hidden md:flex relative items-center">
              <button
                aria-label="Chat with admin"
                onClick={() => setOpen(true)}
                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-medium text-gray-900 shadow-md pr-14"
              >
                Chat with admin
              </button>

              <button
                aria-label="Open chat"
                onClick={() => setOpen(true)}
                className="absolute right-0 top-1/2 -translate-y-1/2 transform bg-gradient-to-br from-[#6C3ADC] to-[#8141EE] w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform z-20"
                style={{ marginRight: -12 }}
              >
                <BotMessageSquare size={22} />
              </button>
            </div>
          </>
        )}

        {/* Chat Panel */}
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 "
              onClick={() => setOpen(false)}
            />
            
            <div
              ref={chatWidgetRef}
              className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 flex h-[72vh] w-[80vw] max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:static md:left-auto md:translate-x-0 md:bottom-auto md:h-[60vh] md:w-[92vw] md:max-w-md lg:max-w-lg dark:bg-zinc-800"
              style={{ minHeight: 320 }}
            >
            <div className="flex items-center justify-between bg-[#A586FD] p-3 text-white">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Elyxa.AI" className="w-full" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-white/20 p-2 hover:bg-white/25"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            {loading && messages.length === 0 ? (
              <MessageSkeleton />
            ) : (
              <div
                ref={panelRef}
                className="flex-1 space-y-3 overflow-auto bg-gray-50 p-4 dark:bg-zinc-900"
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`${m.from === 'user' ? 'bg-[#7C3AED] text-white rounded-tr-none' : 'bg-[#EDEDED] text-black dark:bg-zinc-800 dark:text-gray-100 rounded-tl-none'} max-w-[80%] rounded-xl px-4 py-3 shadow-sm`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className=" bg-white p-3 dark:bg-zinc-800">
              <div className="relative flex items-center">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Ask anything..."
                  className="w-full rounded-full border border-gray-200 bg-white pl-4 pr-14 py-4 text-sm text-gray-900 focus:outline-none focus:border-gray-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100"
                />
                <button
                  onClick={send}
                  className="absolute right-2 inline-flex items-center justify-center rounded-full bg-[#7C3AED] p-3 text-white hover:bg-[#6C2DD3] transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWidget;
