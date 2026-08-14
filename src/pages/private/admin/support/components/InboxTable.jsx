import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Clock, Send, X } from 'lucide-react';
import {
  fetchAdminChatRooms,
  fetchChatMessages,
  sendChatMessage,
} from '../../../../../features/chat/chatSlice';
import AllPagination from '../../../../../components/common/AllPagination';

const SkeletonItem = ({ className }) => (
  <div className={`animate-pulse rounded bg-gray-300 dark:bg-gray-600 ${className}`} />
);

const UserListSkeleton = () => (
  <>
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <SkeletonItem className="h-10 w-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <SkeletonItem className="h-4 w-24" />
              <SkeletonItem className="h-4 w-10" />
            </div>
            <SkeletonItem className="h-3 w-32" />
            <SkeletonItem className="h-3 w-20" />
          </div>
        </div>
      </div>
    ))}
  </>
);

const MessagesSkeleton = () => (
  <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4 dark:bg-zinc-900">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
        <div
          className={`max-w-[70%] rounded-xl px-4 py-3 ${
            i % 2 === 0 ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <SkeletonItem className="mb-2 h-4 w-32" />
          <SkeletonItem className="h-3 w-16" />
        </div>
      </div>
    ))}
  </div>
);

const formatTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getTimeAgo = (dateString) => {
  if (!dateString) return 'No messages';
  const diffMs = Date.now() - new Date(dateString);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} Minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} Hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} Day${diffDays > 1 ? 's' : ''} ago`;
};

const Avatar = ({ char, size = 'w-10 h-10' }) => (
  <div
    className={`${size} flex shrink-0 items-center justify-center rounded-full bg-[#7C3AED]/20 dark:bg-[#7C3AED]/30`}
  >
    <span className="text-sm font-medium text-[#7C3AED] dark:text-[#A78BFA]">{char}</span>
  </div>
);

export default function InboxTable() {
  const dispatch = useDispatch();
  const { adminChatRooms, pagination, loading, messages } = useSelector((state) => state.chat);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAdminChatRooms({ page: currentPage, limit: 20, status: 'ACTIVE' }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (selectedUser) dispatch(fetchChatMessages(selectedUser.id));
  }, [dispatch, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const transformedData = adminChatRooms.map((room) => ({
    id: room.id,
    name: room.user?.fullName || room.user?.email?.split('@')[0] || 'Anonymous',
    email: room.user?.email || '',
    avatar: (room.user?.fullName?.[0] || room.user?.email?.[0] || 'A').toUpperCase(),
    lastMessage: getTimeAgo(room.updatedAt),
    isNew: room.unreadCount > 0,
    unreadCount: room.unreadCount,
  }));

  const filteredData = transformedData
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return 0;
    });

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedUser) return;
    try {
      await dispatch(sendChatMessage({ roomId: selectedUser.id, message: messageText })).unwrap();
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="px-6 py-4 md:px-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Inbox</h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm dark:border-gray-700 dark:bg-zinc-800">
        {/* ✅ FIX: min-h-0 (and remove invalid min-h-125) */}
        <div className="grid h-[calc(100vh-250px)] min-h-0 grid-cols-1 lg:grid-cols-12">
          {/* Users List */}
          {/* ✅ FIX: min-h-0 */}
          <div
            className={`flex min-h-0 flex-col border-r border-gray-300 lg:col-span-4 dark:border-gray-700 ${
              selectedUser ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div className="border-b border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-zinc-900">
              <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Users</h3>
              <div className="relative">
                <Search
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#7C3AED] focus:outline-none dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-500"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {loading && !filteredData.length ? (
                <UserListSkeleton />
              ) : filteredData.length ? (
                filteredData.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`cursor-pointer border-b border-gray-200 p-4 transition-colors dark:border-gray-700 ${
                      selectedUser?.id === user.id
                        ? 'border-l-4 border-l-[#7C3AED] bg-[#7C3AED]/10 dark:bg-[#7C3AED]/20'
                        : 'hover:bg-gray-50 dark:hover:bg-zinc-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar char={user.avatar} />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          {user.isNew && (
                            <span className="rounded-sm bg-[#FEE2E2] px-2 py-0.5 text-xs font-semibold text-[#B91C1C] dark:bg-[#B91C1C]/20 dark:text-[#FCA5A5]">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="mb-1 truncate text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock size={12} />
                          <span>{user.lastMessage}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No users found
                </div>
              )}
            </div>

            {pagination?.totalCount > 2 && (
              <div className="border-t border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-zinc-900">
                <AllPagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>

          {/* Chat Panel */}
          {/* ✅ FIX: min-h-0 */}
          <div
            className={`flex min-h-0 flex-col overflow-hidden lg:col-span-8 ${
              !selectedUser ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {selectedUser ? (
              <>
                <div className="shrink-0 bg-gray-50 p-4 dark:bg-zinc-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar char={selectedUser.avatar} />
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {selectedUser.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedUser.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="rounded-full p-2 transition-colors hover:bg-gray-200 dark:hover:bg-zinc-700"
                    >
                      <X size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                {loading ? (
                  <MessagesSkeleton />
                ) : (
                  <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4 dark:bg-zinc-900">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.from === 'user' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-xl px-4 py-3 ${
                            msg.from === 'user'
                              ? 'rounded-tl-none bg-white text-gray-900 shadow-sm dark:bg-zinc-800 dark:text-gray-100'
                              : 'rounded-tr-none bg-[#7C3AED] text-white'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p
                            className={`mt-1 text-xs ${
                              msg.from === 'user'
                                ? 'text-gray-500 dark:text-gray-400'
                                : 'text-purple-200'
                            }`}
                          >
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}

                <div className="shrink-0 border-t border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-zinc-800">
                  <div className="relative flex items-center gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type your message..."
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#7C3AED] focus:outline-none dark:border-gray-600 dark:bg-zinc-900 dark:text-gray-100 dark:placeholder-gray-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="flex items-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-3 text-white transition-colors hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-600"
                    >
                      <Send size={18} />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-0 flex-1 items-center justify-center bg-gray-50 dark:bg-zinc-900">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#7C3AED]/10 dark:bg-[#7C3AED]/20">
                    <Search size={32} className="text-[#7C3AED] dark:text-[#A78BFA]" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                    Select a conversation
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose a user from the list to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
