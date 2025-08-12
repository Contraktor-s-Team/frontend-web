import React, { useState, useEffect, useRef } from 'react';
import { TextInput } from '../../../components/Form';
import {
  SearchIcon,
  ChevronLeft,
  Plus,
  Smile,
  Send,
  MessageSquare,
  CheckCheck,
  ListFilter,
  Mic,
  Paperclip,
  X
} from 'lucide-react';
import Button from '../../../components/Button';
import messagesData from '../../../../public/msg.json';
import EmojiPicker from 'emoji-picker-react';
import FallbackImage from '../../../components/FallbackImage';

// Format message timestamp
const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffInMinutes = Math.floor((now - messageDate) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  if (diffInHours < 3) return `${diffInHours} hr${diffInHours > 1 ? 's' : ''} ago`;
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diffInHours < 48) return 'Yesterday';
  if (diffInHours < 168) return messageDate.toLocaleDateString([], { weekday: 'short' });
  return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

// Avatar component
const Avatar = ({ name, avatar, className = '', online = false, showOnlineStatus = true, radSize = 'full' }) => {
  // If avatar is provided, use it, otherwise fall back to initials
  if (avatar) {
    return (
      <div className={`relative ${className}`}>
        <FallbackImage src={avatar} alt={name || 'User'} className={`w-full h-full rounded-${radSize} object-cover`} />
        {showOnlineStatus && online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
    );
  }

  // Fallback to initials if no avatar
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '';
  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
    'bg-green-100 text-green-600',
    'bg-yellow-100 text-yellow-600',
    'bg-red-100 text-red-600'
  ];
  const colorIndex = name ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length : 0;

  return (
    <div className={`relative ${className}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${colors[colorIndex]}`}>
        {initials}
      </div>
      {showOnlineStatus && online && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      )}
    </div>
  );
};

// Date separator
const DateSeparator = ({ date }) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let displayDate = date;
  const messageDate = new Date(date);

  if (messageDate.toDateString() === today.toDateString()) {
    displayDate = 'Today';
  } else if (messageDate.toDateString() === yesterday.toDateString()) {
    displayDate = 'Yesterday';
  } else {
    displayDate = messageDate.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  }

  return (
    <div className="flex items-center my-4">
      <div className="flex-1 border-t border-gray-200"></div>
      <span className="px-3 text-xs text-gray-500 font-medium">{displayDate}</span>
      <div className="flex-1 border-t border-gray-200"></div>
    </div>
  );
};

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showConversationList, setShowConversationList] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [conversations, setConversations] = useState(messagesData.messages || []);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // const conversations = messagesData.messages || [];

  useEffect(() => {
    if (conversations.length > 0 && !activeConversation && !isMobileView) {
      setActiveConversation(conversations[0]);
    }
  }, [conversations, activeConversation, isMobileView]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (!mobile) setShowConversationList(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation]);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.thread.some((msg) => msg.message.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !imagePreview) || !activeConversation) return;

    const newMsg = {
      id: Date.now().toString(),
      message: newMessage,
      fromUser: true,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: imagePreview ? 'image' : 'text',
      ...(imagePreview && { imageUrl: imagePreview })
    };

    // Update the conversation
    const updatedConversations = conversations.map((conv) =>
      conv.contact === activeConversation.contact
        ? {
            ...conv,
            thread: [...conv.thread, newMsg],
            lastMessage: newMsg.message || 'Image',
            timestamp: new Date().toISOString()
          }
        : conv
    );

    // Update both conversations and activeConversation
    setConversations(updatedConversations);
    setActiveConversation((prev) => ({
      ...prev,
      thread: [...prev.thread, newMsg],
      lastMessage: newMsg.message || 'Image',
      timestamp: new Date().toISOString()
    }));
    setNewMessage('');
    setImagePreview(null);
    setShowEmojiPicker(false);

    // Simulate reply after a delay
    setTimeout(() => {
      const replyMsg = {
        id: (Date.now() + 1).toString(),
        message: `yo, ${newMessage || 'your image'}`,
        fromUser: false,
        timestamp: new Date().toISOString(),
        isRead: true,
        type: 'text'
      };

      // Update the conversations state with the reply
      setConversations((prev) =>
        prev.map((conv) =>
          conv.contact === activeConversation.contact
            ? {
                ...conv,
                thread: [...conv.thread, replyMsg],
                lastMessage: replyMsg.message,
                timestamp: replyMsg.timestamp
              }
            : conv
        )
      );

      // Update the active conversation if it's the same one
      setActiveConversation((prevConv) => ({
        ...prevConv,
        thread: [...prevConv.thread, replyMsg],
        lastMessage: replyMsg.message,
        timestamp: replyMsg.timestamp
      }));
    }, 1000);
  };

  const handleEmojiSelect = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
    // Keep the picker open for multiple selections
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImagePreview = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Update MessageBubble to handle image messages
  const MessageBubble = ({ message, fromUser }) => (
    <div className={`flex ${fromUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs md:max-w-md p-4 rounded-2xl ${
          fromUser ? 'bg-pri-light-1 rounded-br-none' : 'bg-neu-light-1 rounded-bl-none'
        }`}
      >
        {message.type === 'image' && message.imageUrl && (
          <div className="mb-2 relative">
            <FallbackImage src={message.imageUrl} alt="Uploaded content" className="max-w-full rounded-lg" />
          </div>
        )}
        {message.message && <p className="text-sm">{message.message}</p>}
        <div className="flex items-center justify-end mt-2 text-xs text-neu-norm-1">
          <span className="mr-1">{formatMessageTime(message.timestamp)}</span>
          {fromUser && message.isRead && <CheckCheck size={14} className="inline" />}
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-inter font-medium h-full">
      <div className="mb-6">
        <h1 className="font-manrope text-2xl font-semibold">Messages</h1>
        <p className="text-neu-dark-1 mt-1">View and manage messages from artisans.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-180px)]">
        {/* Conversation List */}
        <div
          className={`bg-white rounded-xl shadow-sm p-4 ${
            isMobileView && !showConversationList ? 'hidden' : 'w-full'
          } md:w-1/3 lg:w-7/20 flex flex-col h-full`}
        >
          <div className="flex items-center gap-2 mb-4">
            <TextInput
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leadingIcon={<SearchIcon size={18} className="text-gray-400" />}
              inputClassName="rounded-full"
              className="mb-0"
            />
            <Button variant="text-sec" iconOnly leftIcon={<ListFilter size={20} />} />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hidden">
            {filteredConversations.map((conversation, index) => {
              const lastMessage = conversation.thread[conversation.thread.length - 1];
              const isActive = activeConversation?.contact === conversation.contact;
              return (
                <div
                  key={index}
                  className={`flex items-center p-3 rounded-xl cursor-pointer mb-2 transition-colors ${
                    isActive ? 'bg-pri-light-1/70' : 'hover:bg-pri-light-1/50'
                  }`}
                  onClick={() => {
                    setActiveConversation(conversation);
                    if (isMobileView) setShowConversationList(false);
                  }}
                >
                  <div className="relative">
                    <Avatar
                      name={conversation.contact}
                      avatar={conversation.avatar}
                      className="mr-3 w-14 h-14"
                      radSize="[10px]"
                      online={conversation.online}
                      showOnlineStatus={false}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="truncate">{conversation.contact}</h3>

                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {formatMessageTime(lastMessage.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 mt-1">
                      <p className="text-sm text-gray-500 truncate">
                        {lastMessage.message.length > 30
                          ? `${lastMessage.message.substring(0, 30)}...`
                          : lastMessage.message}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <div className="w-5.5 h-5.5 bg-sec-norm-1 font-manrope text-white flex flex-col items-center justify-center rounded-full">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`bg-white rounded-xl shadow-sm flex-1 flex flex-col ${
            isMobileView && showConversationList ? 'hidden' : 'flex'
          }`}
        >
          {activeConversation ? (
            <>
              <div className="p-4 flex items-center shadow-sm">
                {isMobileView && (
                  <button
                    onClick={() => setShowConversationList(true)}
                    className="mr-2 p-1 rounded-full hover:bg-gray-100"
                  >
                    <ChevronLeft size={20} className="text-gray-600" />
                  </button>
                )}
                <Avatar
                  name={activeConversation.contact}
                  avatar={activeConversation.avatar}
                  className="mr-3 w-9 h-9"
                  online={activeConversation.online}
                  showOnlineStatus={false}
                />
                <div>
                  <h2 className="font-semibold">{activeConversation.contact}</h2>
                  <p className="text-xs text-gray-500 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                    Online
                  </p>
                </div>
              </div>

              <div className="flex-1 px-4 overflow-y-auto scrollbar-hidden">
                <DateSeparator date={activeConversation.thread[0].timestamp} />
                {activeConversation.thread.map((message, index) => (
                  <MessageBubble key={index} message={message} fromUser={message.fromUser} />
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-neu-light-1 relative">
                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-4 z-10">
                    <EmojiPicker onEmojiClick={handleEmojiSelect} theme="light" width={300} height={400} />
                  </div>
                )}
                {imagePreview && (
                  <div className="bg-neu-light-2 w-full">
                    <div className="relative w-fit mb-4">
                      <FallbackImage src={imagePreview} alt="Preview" className="rounded-lg max-h-40 object-cover" />
                      <button
                        type="button"
                        onClick={removeImagePreview}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Button
                    variant="text-sec"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<Paperclip size={20} />}
                    className="text-gray-500 hover:text-primary"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex-1">
                    <TextInput
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      inputClassName="rounded-full"
                      className="mb-0"
                      trailingIcon={<Smile size={20} />}
                      onTrailingIconClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    />
                  </div>
                  <Button variant="text-sec" type="button" leftIcon={<Mic size={20} />} className="" />
                  <Button
                    type="submit"
                    variant="primary"
                    iconOnly
                    leftIcon={<Send size={20} />}
                    className="p-3"
                    disabled={!newMessage.trim() && !imagePreview}
                  />
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="bg-blue-50 p-4 rounded-full mb-4">
                <MessageSquare size={32} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
              <p className="text-gray-500 text-sm max-w-md">
                Select a conversation from the list or start a new one to begin messaging.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
