import React, { useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useChat } from '../src/context/ChatContext';
import { useSocket } from '../src/context/SocketContext';
import UserAvatar from './UserAvatar';
import ProfileModal from './ProfileModal';
import { TalkWaveIcon } from './TalkWaveLogo';
import {
  IoSearchOutline,
  IoCloseCircle,
  IoChatbubblesOutline,
  IoLogOutOutline,
  IoRefreshOutline,
  IoPersonOutline,
  IoSparkles,
  IoCheckmarkDone,
  IoCheckmark,
  IoCameraOutline,
  IoSettingsOutline,
} from 'react-icons/io5';

const Sidebar = () => {
  const { authUser, logout, loading: authLoading } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const {
    filteredUsers,
    loadingUsers,
    selectedUser,
    selectUser,
    searchQuery,
    setSearchQuery,
    fetchUsers,
    unreadCounts,
    typingUsers,
  } = useChat();

  const [activeTab, setActiveTab] = useState('all');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const totalUnread = Object.values(unreadCounts || {}).reduce(
    (acc, count) => acc + count,
    0
  );

  const formatLastMessageTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      if (isToday) {
        return date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      }

      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

      if (isYesterday) {
        return 'Yesterday';
      }

      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const displayedUsers = filteredUsers
    .filter((u) => {
      if (activeTab === 'unread') {
        return (unreadCounts?.[u._id] || 0) > 0;
      }
      return true;
    })
    .sort((a, b) => {
      const timeA = a.lastMessage?.createdAt
        ? new Date(a.lastMessage.createdAt).getTime()
        : 0;
      const timeB = b.lastMessage?.createdAt
        ? new Date(b.lastMessage.createdAt).getTime()
        : 0;
      if (timeA && timeB) return timeB - timeA;
      if (timeA) return -1;
      if (timeB) return 1;
      return (a.fullName || '').localeCompare(b.fullName || '');
    });

  return (
    <div className="flex flex-col h-full w-full min-h-0 bg-[#fafbfc] select-none text-slate-800">
      {/* 1. Top Header & Branding */}
      <div className="flex-shrink-0 p-3.5 sm:p-4 border-b border-slate-200/80 flex items-center justify-between bg-white/90">
        <div className="flex items-center gap-3">
          <TalkWaveIcon className="w-10 h-10 shrink-0 shadow-md shadow-orange-500/25" />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-base sm:text-lg tracking-tight text-[#1e293b] flex items-center leading-none">
                <span>Talk</span>
                <span className="bg-gradient-to-r from-[#f47858] to-[#ea5575] bg-clip-text text-transparent">Wave</span>
              </h2>
              <IoSparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
              <span
                className={`w-2 h-2 rounded-full ${
                  socket ? 'bg-emerald-500' : 'bg-amber-500'
                } relative flex`}
              >
                {socket && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
              </span>
              <span>
                {socket ? `${onlineUsers.length} Online` : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          title="Refresh Contacts"
          disabled={loadingUsers}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all disabled:opacity-50 active:scale-95 cursor-pointer shadow-xs"
        >
          <IoRefreshOutline
            className={`w-4 h-4 ${
              loadingUsers ? 'animate-spin text-[#f47858]' : ''
            }`}
          />
        </button>
      </div>

      {/* 2. Search Bar */}
      <div className="flex-shrink-0 p-3 pb-2 bg-white/60">
        <div className="relative flex items-center">
          <IoSearchOutline className="absolute left-4 w-4 h-4 text-[#9aa4b2] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="w-full bg-[#f1f3f7] border border-transparent focus:border-[#f47858]/50 focus:bg-white rounded-full pl-11 pr-9 py-2 text-sm text-[#2e384d] placeholder-[#9aa4b2] focus:outline-none focus:ring-2 focus:ring-[#f47858]/15 transition-all font-normal"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <IoCloseCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex-shrink-0 px-3.5 py-1.5 flex items-center justify-between border-b border-slate-200/60 bg-white/40">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <span>All Users</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {filteredUsers.length}
            </span>
          </button>

          {totalUnread > 0 && (
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'unread'
                  ? 'bg-gradient-to-r from-[#fca639] to-[#ea5575] text-white shadow-xs shadow-orange-500/30'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <span>Unread</span>
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-white text-[#ea5575]">
                {totalUnread}
              </span>
            </button>
          )}
        </div>

        <span className="text-[11px] text-slate-400 font-medium">
          {displayedUsers.length} contact{displayedUsers.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* 4. User / Conversation List */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2.5 py-2 space-y-1">
        {loadingUsers ? (
          /* Loading Skeletons */
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 animate-pulse shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-slate-200 rounded-full w-2/3" />
                <div className="h-2.5 bg-slate-100 rounded-full w-1/3" />
              </div>
            </div>
          ))
        ) : displayedUsers.length === 0 ? (
          /* Empty Search / Filter State */
          <div className="h-44 flex flex-col items-center justify-center text-center p-4">
            <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-2.5 text-slate-400">
              <IoPersonOutline className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              {activeTab === 'unread'
                ? 'No unread messages'
                : searchQuery
                ? 'No contacts found'
                : 'No contacts available'}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
              {activeTab === 'unread'
                ? 'You are all caught up!'
                : searchQuery
                ? `No user matching "${searchQuery}"`
                : 'Registered accounts will appear here automatically.'}
            </p>
            {(searchQuery || activeTab === 'unread') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                }}
                className="mt-3 text-xs text-[#3b66de] hover:text-[#254fc7] font-semibold cursor-pointer"
              >
                Show all contacts
              </button>
            )}
          </div>
        ) : (
          /* User Items */
          displayedUsers.map((user) => {
            const isSelected = selectedUser?._id === user._id;
            const isOnline = onlineUsers.includes(String(user._id));
            const unreadCount = unreadCounts?.[user._id] || 0;
            const isTyping = Boolean(typingUsers?.[String(user._id)]);

            const authUserId = authUser?._id || authUser?.id;
            const lastMsgSenderId =
              user.lastMessage?.senderId?._id || user.lastMessage?.senderId;
            const isLastMessageByMe = Boolean(
              authUserId &&
                lastMsgSenderId &&
                String(lastMsgSenderId) === String(authUserId)
            );

            return (
              <button
                key={user._id}
                onClick={() => selectUser(user)}
                className={`w-full text-left p-2.5 sm:p-3 rounded-2xl flex items-center gap-3 transition-all duration-150 border cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-50/90 via-amber-50/50 to-white border-[#f47858]/40 shadow-xs text-slate-900'
                    : 'bg-white hover:bg-slate-50/80 border-slate-200/60 hover:border-slate-300/80 text-slate-700 shadow-xs'
                }`}
              >
                {/* Modern Avatar with gradient fallback */}
                <UserAvatar user={user} size="md" isOnline={isOnline} />

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3
                      className={`text-sm font-bold truncate ${
                        isSelected ? 'text-[#1e293b]' : 'text-[#334155]'
                      }`}
                    >
                      {user.fullName}
                    </h3>
                    {user.lastMessage?.createdAt ? (
                      <span className="text-[11px] text-slate-400 font-normal flex-shrink-0 ml-1">
                        {formatLastMessageTime(user.lastMessage.createdAt)}
                      </span>
                    ) : (
                      <span
                        className={`text-[10px] font-medium flex-shrink-0 ml-1 ${
                          isOnline ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      >
                        {isOnline ? 'Online' : 'Offline'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-1.5 text-xs text-slate-500 min-h-[18px]">
                    {/* Left: Typing indicator OR Last Message snippet OR Username */}
                    {isTyping ? (
                      <div className="flex items-center gap-1.5 text-[#f47858] font-semibold text-xs min-w-0">
                        <span className="flex gap-0.5 items-center">
                          <span
                            className="w-1 h-1 rounded-full bg-[#f47858] animate-bounce"
                            style={{ animationDelay: '0ms' }}
                          />
                          <span
                            className="w-1 h-1 rounded-full bg-[#f47858] animate-bounce"
                            style={{ animationDelay: '150ms' }}
                          />
                          <span
                            className="w-1 h-1 rounded-full bg-[#f47858] animate-bounce"
                            style={{ animationDelay: '300ms' }}
                          />
                        </span>
                        <span className="animate-pulse">typing...</span>
                      </div>
                    ) : user.lastMessage ? (
                      <div className="flex items-center gap-1 min-w-0 flex-1 mr-1">
                        {isLastMessageByMe && (
                          <span className="flex-shrink-0 text-slate-400 text-xs">
                            {user.lastMessage.seen ? (
                              <IoCheckmarkDone
                                className="w-3.5 h-3.5 text-sky-500 inline"
                                title="Seen"
                              />
                            ) : user.lastMessage.delivered ? (
                              <IoCheckmarkDone
                                className="w-3.5 h-3.5 text-slate-400 inline"
                                title="Delivered"
                              />
                            ) : (
                              <IoCheckmark
                                className="w-3.5 h-3.5 text-slate-400 inline"
                                title="Sent"
                              />
                            )}
                          </span>
                        )}
                        <p
                          className={`truncate text-xs ${
                            unreadCount > 0
                              ? 'font-bold text-slate-900'
                              : 'text-slate-500'
                          }`}
                        >
                          {isLastMessageByMe
                            ? `You: ${user.lastMessage.content}`
                            : user.lastMessage.content}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 min-w-0 text-xs text-slate-400">
                        <span className="truncate">@{user.userName}</span>
                        {user.gender && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-500 capitalize">
                            {user.gender}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Right: Unread Badge or subtle presence dot */}
                    {unreadCount > 0 ? (
                      <span className="flex-shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-gradient-to-r from-[#fca639] via-[#f47858] to-[#ea5575] text-white text-[11px] font-bold flex items-center justify-center shadow-xs shadow-orange-500/40 animate-in zoom-in-75 duration-150">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    ) : isOnline && !user.lastMessage ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* 5. Bottom Current User Profile & Logout Bar */}
      <div className="flex-shrink-0 p-3 sm:p-3.5 bg-white border-t border-slate-200/80 flex items-center justify-between gap-3 shadow-xs">
        <div
          onClick={() => setIsProfileModalOpen(true)}
          className="flex items-center gap-2.5 min-w-0 cursor-pointer p-1.5 -m-1.5 rounded-2xl hover:bg-slate-50 transition-all group flex-1"
          title="Edit profile"
        >
          <div className="relative">
            <UserAvatar user={authUser} size="md" isOnline={true} />
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
              <IoCameraOutline className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#1e293b] truncate leading-tight group-hover:text-[#f47858] transition-colors">
              {authUser?.fullName || 'My Account'}
            </p>
            <p className="text-xs text-slate-500 truncate leading-tight flex items-center gap-1">
              <span>@{authUser?.userName || 'user'}</span>
              <span className="text-[10px] text-[#f47858] opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                • Edit profile
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            title="Edit profile"
            className="flex-shrink-0 p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 border border-slate-200/70 transition-all active:scale-95 cursor-pointer"
          >
            <IoSettingsOutline className="w-4 h-4" />
          </button>

          <button
            onClick={logout}
            disabled={authLoading}
            title="Sign out"
            className="flex-shrink-0 p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/70 hover:border-rose-200 transition-all active:scale-95 cursor-pointer"
          >
            <IoLogOutOutline className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Profile & Avatar Customization Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
