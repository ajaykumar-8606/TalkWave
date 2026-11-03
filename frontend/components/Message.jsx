import React, { useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useChat } from '../src/context/ChatContext';
import UserAvatar from './UserAvatar';
import {
  IoCheckmarkDone,
  IoCopyOutline,
  IoCheckmark,
  IoArrowUndoOutline,
  IoHappyOutline,
  IoPencilOutline,
  IoTrashOutline,
} from 'react-icons/io5';

const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

const Message = ({ message }) => {
  const { authUser } = useAuth();
  const {
    selectedUser,
    setReplyingTo,
    setEditingMessage,
    reactToMessage,
    deleteMessage,
  } = useChat();

  const [copied, setCopied] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  if (!message) return null;

  const authUserId = authUser?._id || authUser?.id;
  const senderId = message.senderId?._id || message.senderId;
  const isMe = Boolean(
    authUserId && senderId && String(senderId) === String(authUserId)
  );
  const textContent = message.content || message.message || '';
  const isDeleted = Boolean(message.isDeleted);
  const isEdited = Boolean(message.isEdited);

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const handleCopy = () => {
    if (!textContent || isDeleted) return;
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReaction = (emoji) => {
    reactToMessage(message._id, emoji);
    setShowReactionPicker(false);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this message for everyone?')) {
      deleteMessage(message._id);
    }
  };

  const isSeen = Boolean(message.seen);
  const isDelivered = Boolean(message.delivered || isSeen);

  const renderDeliveryStatus = () => {
    if (isSeen) {
      return (
        <span className="flex items-center text-white" title="Seen">
          <IoCheckmarkDone className="w-3.5 h-3.5" />
        </span>
      );
    }
    if (isDelivered) {
      return (
        <span className="flex items-center text-white/80" title="Delivered">
          <IoCheckmarkDone className="w-3.5 h-3.5" />
        </span>
      );
    }
    return (
      <span className="flex items-center text-white/70" title="Sent">
        <IoCheckmark className="w-3.5 h-3.5" />
      </span>
    );
  };

  // Aggregate reactions by emoji
  const reactionsMap = (message.reactions || []).reduce((acc, r) => {
    if (!acc[r.emoji]) {
      acc[r.emoji] = { count: 0, hasReacted: false };
    }
    acc[r.emoji].count += 1;
    if (String(r.user?._id || r.user) === String(authUserId)) {
      acc[r.emoji].hasReacted = true;
    }
    return acc;
  }, {});

  const reactionsList = Object.entries(reactionsMap).map(([emoji, data]) => ({
    emoji,
    count: data.count,
    hasReacted: data.hasReacted,
  }));

  return (
    <div
      id={`message-${message._id}`}
      className={`group relative flex items-end gap-2 w-full my-1 transition-all duration-150 ${
        isMe ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Recipient avatar on the left (only for incoming messages) */}
      {!isMe && (
        <UserAvatar
          user={selectedUser}
          size="xs"
          showStatus={false}
          className="mb-1 flex-shrink-0 hidden sm:block"
        />
      )}

      {/* Bubble + Reactions Wrapper */}
      <div
        className={`relative flex flex-col max-w-[85%] sm:max-w-[68%] ${
          isMe ? 'items-end' : 'items-start'
        }`}
      >
        {/* Floating Quick Action Toolbar on Hover */}
        {!isDeleted && (
          <div
            className={`absolute -top-7 z-10 hidden group-hover:flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-md animate-in fade-in duration-100 ${
              isMe ? 'right-0' : 'left-0'
            }`}
          >
            {/* Quick Reaction Button */}
            <div className="relative">
              <button
                onClick={() => setShowReactionPicker((prev) => !prev)}
                title="React"
                className="p-1 rounded-full text-slate-500 hover:text-amber-500 hover:bg-slate-100 transition cursor-pointer text-xs"
              >
                <IoHappyOutline className="w-3.5 h-3.5" />
              </button>

              {/* Reaction Popup */}
              {showReactionPicker && (
                <div className="absolute bottom-8 left-0 z-30 flex items-center gap-1 p-1 rounded-2xl bg-white border border-slate-200 shadow-xl animate-in fade-in duration-100">
                  {quickReactions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className="w-7 h-7 rounded-xl hover:bg-slate-100 hover:scale-115 flex items-center justify-center text-sm transition cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reply Button */}
            <button
              onClick={() =>
                setReplyingTo({
                  _id: message._id,
                  content: textContent,
                  senderName: isMe
                    ? 'You'
                    : selectedUser?.fullName || 'Contact',
                  senderId: message.senderId,
                })
              }
              title="Reply"
              className="p-1 rounded-full text-slate-500 hover:text-[#f47858] hover:bg-slate-100 transition cursor-pointer text-xs"
            >
              <IoArrowUndoOutline className="w-3.5 h-3.5" />
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              title="Copy text"
              className="p-1 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer text-xs"
            >
              {copied ? (
                <IoCheckmark className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <IoCopyOutline className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Edit Button (Sender only) */}
            {isMe && (
              <button
                onClick={() =>
                  setEditingMessage({
                    _id: message._id,
                    content: textContent,
                  })
                }
                title="Edit message"
                className="p-1 rounded-full text-slate-500 hover:text-sky-500 hover:bg-slate-100 transition cursor-pointer text-xs"
              >
                <IoPencilOutline className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Delete Button (Sender only) */}
            {isMe && (
              <button
                onClick={handleDelete}
                title="Delete message"
                className="p-1 rounded-full text-slate-500 hover:text-rose-500 hover:bg-slate-100 transition cursor-pointer text-xs"
              >
                <IoTrashOutline className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Message Bubble Container */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed transition-all select-text ${
            isDeleted
              ? 'bg-slate-100 border border-slate-200 text-slate-400 italic rounded-2xl'
              : isMe
              ? 'bg-gradient-to-r from-[#fca639] via-[#f47858] to-[#ea5575] text-white rounded-br-xs shadow-md shadow-orange-500/20'
              : 'bg-white text-[#2e384d] border border-slate-200/90 rounded-bl-xs shadow-xs'
          }`}
        >
          {/* Quoted Reply Card */}
          {message.replyTo?.content && !isDeleted && (
            <div
              onClick={() => {
                const target = document.getElementById(
                  `message-${message.replyTo._id}`
                );
                if (target) {
                  target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  });
                  target.classList.add('ring-2', 'ring-[#f47858]');
                  setTimeout(
                    () => target.classList.remove('ring-2', 'ring-[#f47858]'),
                    1500
                  );
                }
              }}
              className={`mb-1.5 p-2 rounded-xl text-xs cursor-pointer transition text-left border-l-3 ${
                isMe
                  ? 'bg-black/15 border-white/80 hover:bg-black/25'
                  : 'bg-orange-50 border-[#f47858] text-slate-700 hover:bg-orange-100/60'
              }`}
            >
              <p
                className={`font-semibold text-[11px] truncate ${
                  isMe ? 'text-white' : 'text-[#f47858]'
                }`}
              >
                {message.replyTo.senderName || 'Message'}
              </p>
              <p
                className={`text-[11px] truncate mt-0.5 ${
                  isMe ? 'text-white/80' : 'text-slate-600'
                }`}
              >
                {message.replyTo.content}
              </p>
            </div>
          )}

          {/* Text Content and Inline Timestamp */}
          <div className="flex flex-wrap items-end justify-end gap-x-2 gap-y-0.5">
            <span className="whitespace-pre-wrap break-words flex-1 min-w-[60px]">
              {isDeleted ? 'This message was deleted' : textContent}
            </span>

            {/* Time & Delivery Status inside bubble */}
            <span
              className={`inline-flex items-center gap-1 text-[10px] select-none leading-none flex-shrink-0 ml-auto pt-1 ${
                isMe ? 'text-white/80' : 'text-slate-400'
              }`}
            >
              <span>{formatTime(message.createdAt)}</span>
              {isEdited && !isDeleted && (
                <span className="text-[9px] opacity-75">(edited)</span>
              )}
              {isMe && !isDeleted && renderDeliveryStatus()}
            </span>
          </div>
        </div>

        {/* Reaction Badges on bubble corner */}
        {reactionsList.length > 0 && !isDeleted && (
          <div
            className={`flex flex-wrap gap-1 mt-1 ${
              isMe ? 'justify-end' : 'justify-start'
            }`}
          >
            {reactionsList.map(({ emoji, count, hasReacted }) => (
              <button
                key={emoji}
                onClick={() => reactToMessage(message._id, emoji)}
                className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 border transition cursor-pointer shadow-2xs ${
                  hasReacted
                    ? 'bg-orange-50 border-[#f47858] text-[#f47858]'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title={hasReacted ? 'Remove reaction' : `React with ${emoji}`}
              >
                <span>{emoji}</span>
                <span className="text-[10px] font-bold">{count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
