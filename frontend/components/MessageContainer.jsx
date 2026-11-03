import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useChat } from '../src/context/ChatContext';
import { useSocket } from '../src/context/SocketContext';
import UserAvatar from './UserAvatar';
import Message from './Message';
import {
  IoSend,
  IoArrowBack,
  IoLockClosedOutline,
  IoHappyOutline,
  IoChatbubbleEllipsesOutline,
  IoSearchOutline,
  IoChevronUp,
  IoChevronDown,
  IoCloseOutline,
  IoPencilOutline,
  IoArrowUndoOutline,
  IoChatbubblesOutline,
} from 'react-icons/io5';

const quickEmojis = [
  '👍',
  '❤️',
  '🔥',
  '😂',
  '🎉',
  '😊',
  '🙌',
  '✨',
  '👏',
  '👀',
  '💯',
  '🚀',
];

const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const formatDateDivider = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const today = new Date();
  if (isSameDay(date, today)) return 'Today';
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (isSameDay(date, yesterday)) return 'Yesterday';
  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
};

const MessageContainer = () => {
  const { authUser } = useAuth();
  const { onlineUsers } = useSocket();
  const {
    selectedUser,
    messages,
    loadingMessages,
    isSending,
    sendMessage,
    closeMobileChat,
    typingUsers,
    sendTyping,
    sendStopTyping,
    replyingTo,
    cancelReply,
    editingMessage,
    cancelEdit,
    editMessage,
  } = useChat();

  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const messagesContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const isRecipientTyping = Boolean(
    selectedUser?._id && typingUsers?.[String(selectedUser._id)]
  );

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  // Matching messages for in-chat search
  const searchMatches = chatSearchQuery.trim()
    ? messages.filter(
        (m) =>
          !m.isDeleted &&
          (m.content || m.message || '')
            .toLowerCase()
            .includes(chatSearchQuery.toLowerCase().trim())
      )
    : [];

  // When editingMessage changes, update inputText
  useEffect(() => {
    if (editingMessage) {
      setInputText(editingMessage.content || '');
      textareaRef.current?.focus();
    }
  }, [editingMessage]);

  // Focus textarea when replying
  useEffect(() => {
    if (replyingTo) {
      textareaRef.current?.focus();
    }
  }, [replyingTo]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isRecipientTyping]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);

    if (!selectedUser?._id) return;

    if (val.trim()) {
      sendTyping(selectedUser._id);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        sendStopTyping(selectedUser._id);
      }, 1800);
    } else {
      sendStopTyping(selectedUser._id);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleSend = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!inputText.trim() || isSending) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (selectedUser?._id) {
      sendStopTyping(selectedUser._id);
    }

    const text = inputText;
    setInputText('');
    setShowEmojiPicker(false);

    if (editingMessage) {
      await editMessage(editingMessage._id, text);
      cancelEdit();
    } else {
      await sendMessage(text, replyingTo);
      cancelReply();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickSend = (text) => {
    setInputText(text);
    textareaRef.current?.focus();
  };

  const isRecipientOnline = onlineUsers.includes(String(selectedUser?._id));

  // EMPTY STATE when no user is selected
  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center select-none bg-[#fafbfc]">
        <div className="max-w-sm flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#fca639] via-[#f47858] to-[#ea5575] flex items-center justify-center text-white mb-4 shadow-lg shadow-orange-500/25">
            <IoChatbubblesOutline className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-[#1e293b] mb-1.5 tracking-tight">
            Your Conversations
          </h2>

          <p className="text-xs text-[#64748b] leading-relaxed mb-6">
            Select a contact from the sidebar to start a real-time conversation.
          </p>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600 shadow-xs font-medium">
            <IoLockClosedOutline className="w-3.5 h-3.5 text-[#f47858]" />
            <span>End-to-end encrypted messaging</span>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE CONVERSATION
  return (
    <div className="flex flex-col h-full w-full min-h-0 bg-[#fafbfc] relative overflow-hidden text-slate-800">
      {/* 1. Chat Top Header */}
      <div className="flex-shrink-0 px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-200/80 bg-white flex items-center justify-between z-10 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back Button */}
          <button
            onClick={closeMobileChat}
            className="md:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition cursor-pointer"
            title="Back to contacts"
          >
            <IoArrowBack className="w-5 h-5" />
          </button>

          {/* Recipient Avatar */}
          <UserAvatar
            user={selectedUser}
            size="md"
            isOnline={isRecipientOnline}
          />

          {/* Recipient Details */}
          <div className="min-w-0">
            <h3 className="font-bold text-[#1e293b] text-sm truncate">
              {selectedUser.fullName}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              {isRecipientTyping ? (
                <div className="flex items-center gap-1 text-[#f47858] font-semibold">
                  <span className="flex gap-0.5 items-center">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#f47858] animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#f47858] animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#f47858] animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </span>
                  <span>typing...</span>
                </div>
              ) : (
                <>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isRecipientOnline ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                  <span
                    className={
                      isRecipientOnline
                        ? 'text-emerald-600 font-medium'
                        : 'text-slate-400'
                    }
                  >
                    {isRecipientOnline ? 'Online' : 'Offline'}
                  </span>
                  <span>•</span>
                  <span className="truncate">@{selectedUser.userName}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Header Icons */}
        <div className="flex items-center gap-1">
          {/* Search Toggle */}
          <button
            onClick={() => setShowSearch((prev) => !prev)}
            title="Search in conversation"
            className={`p-2 rounded-full transition cursor-pointer ${
              showSearch
                ? 'bg-[#f47858]/15 text-[#f47858] border border-[#f47858]/30'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <IoSearchOutline className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* In-Chat Search Bar Overlay */}
      {showSearch && (
        <div className="flex-shrink-0 px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 z-10 animate-in slide-in-from-top-2 duration-100">
          <div className="flex items-center gap-2 flex-1 min-w-0 bg-white border border-slate-200 focus-within:border-[#f47858]/60 focus-within:ring-2 focus-within:ring-[#f47858]/15 rounded-full px-3.5 py-1.5 transition">
            <IoSearchOutline className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={chatSearchQuery}
              onChange={(e) => {
                setChatSearchQuery(e.target.value);
                setCurrentMatchIndex(0);
              }}
              placeholder="Find in chat..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {chatSearchQuery && (
              <button
                onClick={() => setChatSearchQuery('')}
                className="text-slate-400 hover:text-slate-600"
              >
                <IoCloseOutline className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowSearch(false)}
            title="Close search"
            className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 cursor-pointer"
          >
            <IoCloseOutline className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Messages Scroll Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-1.5 bg-[#fafbfc]"
      >
        {/* Subtle Security Badge */}
        <div className="flex justify-center mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/80 text-[11px] font-medium text-slate-500 shadow-2xs">
            <IoLockClosedOutline className="w-3.5 h-3.5 text-[#f47858]" />
            <span>End-to-end encrypted chat</span>
          </div>
        </div>

        {loadingMessages ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-2">
            <div className="w-6 h-6 border-2 border-[#f47858] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          /* Empty Chat Conversation State */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#f47858] mb-3 shadow-xs">
              <IoChatbubbleEllipsesOutline className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              No messages yet
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Say hello to {selectedUser.fullName} to start chatting!
            </p>

            {/* Quick Greeting Chips */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center max-w-sm">
              <button
                onClick={() => handleQuickSend('Hey there! 👋')}
                className="px-3.5 py-1.5 rounded-full text-xs bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-slate-700 hover:text-[#f47858] font-medium transition cursor-pointer shadow-2xs"
              >
                Hey there! 👋
              </button>
              <button
                onClick={() => handleQuickSend("How's it going? 😊")}
                className="px-3.5 py-1.5 rounded-full text-xs bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-slate-700 hover:text-[#f47858] font-medium transition cursor-pointer shadow-2xs"
              >
                How's it going? 😊
              </button>
            </div>
          </div>
        ) : (
          /* Messages list with Day Dividers */
          messages.map((msg, index) => {
            const prevMsg = messages[index - 1];
            const showDateDivider =
              !prevMsg || !isSameDay(prevMsg.createdAt, msg.createdAt);

            return (
              <React.Fragment key={msg._id || index}>
                {showDateDivider && (
                  <div className="flex justify-center my-3 select-none">
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-200/70 px-3 py-0.5 rounded-full shadow-2xs">
                      {formatDateDivider(msg.createdAt)}
                    </span>
                  </div>
                )}
                <Message message={msg} />
              </React.Fragment>
            );
          })
        )}

        {/* Live Typing Indicator */}
        {isRecipientTyping && (
          <div className="flex items-end gap-2 my-2 animate-in fade-in duration-150">
            <UserAvatar
              user={selectedUser}
              size="xs"
              showStatus={false}
              className="mb-1 hidden sm:block"
            />
            <div className="px-3.5 py-2 rounded-2xl rounded-bl-xs bg-white border border-slate-200/90 shadow-xs flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#f47858] animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#f47858] animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#f47858] animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
              <span className="text-xs text-[#f47858] font-semibold ml-1">
                typing...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom Message Box Dock */}
      <div className="flex-shrink-0 p-3 sm:p-4 bg-white border-t border-slate-200/80 relative shadow-xs">
        {/* Floating Emoji Picker */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-full left-4 sm:left-6 mb-2 z-30 p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xl flex flex-wrap gap-1 max-w-[280px] animate-in fade-in duration-100"
          >
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setInputText((prev) => prev + emoji);
                  setShowEmojiPicker(false);
                  textareaRef.current?.focus();
                }}
                className="w-8 h-8 rounded-xl hover:bg-slate-100 hover:scale-115 flex items-center justify-center text-lg transition cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Active Quoted Reply Banner */}
        {replyingTo && (
          <div className="mb-2 px-3.5 py-2 rounded-2xl bg-orange-50/80 border-l-3 border-[#f47858] border-y border-r border-orange-100 flex items-center justify-between gap-2 animate-in slide-in-from-bottom-1 duration-100">
            <div className="flex items-center gap-2 min-w-0">
              <IoArrowUndoOutline className="w-4 h-4 text-[#f47858] flex-shrink-0" />
              <div className="min-w-0 text-xs">
                <span className="font-semibold text-slate-800 block truncate">
                  Replying to {replyingTo.senderName}
                </span>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {replyingTo.content}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={cancelReply}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-orange-100 transition cursor-pointer flex-shrink-0"
              title="Cancel reply"
            >
              <IoCloseOutline className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Active Edit Message Banner */}
        {editingMessage && (
          <div className="mb-2 px-3.5 py-2 rounded-2xl bg-sky-50/80 border-l-3 border-sky-500 border-y border-r border-sky-100 flex items-center justify-between gap-2 animate-in slide-in-from-bottom-1 duration-100">
            <div className="flex items-center gap-2 min-w-0">
              <IoPencilOutline className="w-4 h-4 text-sky-500 flex-shrink-0" />
              <div className="min-w-0 text-xs">
                <span className="font-semibold text-sky-800 block truncate">
                  Editing message
                </span>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {editingMessage.content}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                cancelEdit();
                setInputText('');
              }}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-sky-100 transition cursor-pointer flex-shrink-0"
              title="Cancel edit"
            >
              <IoCloseOutline className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="flex items-end gap-2 bg-[#f1f3f7] focus-within:bg-white border border-transparent focus-within:border-[#f47858]/50 focus-within:ring-2 focus-within:ring-[#f47858]/15 rounded-full p-1.5 transition-all shadow-2xs"
        >
          {/* Emoji Toggle */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className={`p-2 rounded-full transition cursor-pointer mb-0.5 ${
              showEmojiPicker
                ? 'text-[#f47858] bg-orange-100'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
            }`}
            title="Emoji"
          >
            <IoHappyOutline className="w-5 h-5" />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              editingMessage
                ? 'Edit message...'
                : replyingTo
                ? `Reply to ${replyingTo.senderName}...`
                : `Message ${selectedUser.fullName}...`
            }
            className="flex-1 bg-transparent px-1 py-1.5 text-sm text-[#2e384d] placeholder-[#9aa4b2] focus:outline-none resize-none leading-relaxed max-h-[120px] overflow-y-auto font-normal"
          />

          {/* Send Sunset Gradient Capsule Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className={`p-2.5 rounded-full transition flex items-center justify-center flex-shrink-0 cursor-pointer mb-0.5 ${
              inputText.trim() && !isSending
                ? 'bg-gradient-to-r from-[#fca639] via-[#f47858] to-[#ea5575] hover:opacity-95 text-white shadow-md shadow-orange-500/30 active:scale-95'
                : 'text-slate-400 opacity-40 cursor-not-allowed'
            }`}
            title="Send (Enter)"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <IoSend className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageContainer;
