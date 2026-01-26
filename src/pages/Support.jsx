import { useState, useEffect, useRef, useContext } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  Send,
  Loader2,
  ArrowLeft,
  Headphones,
  Clock,
  CheckCircle2,
  Bell,
  BellOff,
  Plus,
  ChevronLeft,
  Sparkles,
} from 'lucide-react'
import { AppContext } from '../App'
import {
  getOrCreateConversation,
  sendMessage,
  subscribeToMessages,
  subscribeToUserConversations,
  markMessagesAsRead,
  subscribeToSupportStatus,
} from '../services/chatService'
import {
  requestNotificationPermission,
  areNotificationsEnabled,
  showSupportMessageNotification,
} from '../utils/notifications'

export default function Support() {
  const { user } = useContext(AppContext)
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [startingNew, setStartingNew] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(areNotificationsEnabled())
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [supportStatus, setSupportStatus] = useState('offline')
  const messagesEndRef = useRef(null)
  const prevMessagesRef = useRef([])
  const isInitialLoadRef = useRef(true)

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Scroll to bottom of messages container (not the whole page)
  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto'
        })
      }
    }
  }

  useEffect(() => {
    if (messages.length > 0) {
      if (isInitialLoadRef.current) {
        // On initial load, scroll instantly without animation
        setTimeout(() => scrollToBottom(false), 50)
        isInitialLoadRef.current = false
      } else {
        // On new messages, scroll smoothly
        scrollToBottom(true)
      }
    }
  }, [messages])

  // Subscribe to user's conversations
  useEffect(() => {
    if (!user?.id) return

    setLoading(true)
    const unsubscribe = subscribeToUserConversations(user.id, (convos) => {
      setConversations(convos)
      setLoading(false)

      // Auto-select first open conversation if none selected
      if (!activeConversation && convos.length > 0) {
        const openConvo = convos.find((c) => c.status === 'open')
        if (openConvo) {
          setActiveConversation(openConvo)
        }
      }
    })

    return () => unsubscribe()
  }, [user?.id])

  // Handle notification toggle
  const handleToggleNotifications = async () => {
    if (notificationsEnabled) {
      alert('To disable notifications, please use your browser settings.')
      return
    }
    const granted = await requestNotificationPermission()
    setNotificationsEnabled(granted)
  }

  // Subscribe to support status
  useEffect(() => {
    const unsubscribe = subscribeToSupportStatus((status) => {
      setSupportStatus(status.status)
    })
    return () => unsubscribe()
  }, [])

  // Subscribe to messages when a conversation is selected
  useEffect(() => {
    if (!activeConversation?.id) {
      setMessages([])
      return
    }

    const unsubscribe = subscribeToMessages(activeConversation.id, (msgs) => {
      // Check for new admin messages and show notification
      if (notificationsEnabled && prevMessagesRef.current.length > 0) {
        const newAdminMessages = msgs.filter(
          (msg) =>
            msg.senderType === 'admin' &&
            !prevMessagesRef.current.find((prev) => prev.id === msg.id)
        )
        if (newAdminMessages.length > 0) {
          const latestMsg = newAdminMessages[newAdminMessages.length - 1]
          showSupportMessageNotification(latestMsg.text)
        }
      }
      prevMessagesRef.current = msgs
      setMessages(msgs)
      markMessagesAsRead(activeConversation.id, 'customer')
    })

    return () => unsubscribe()
  }, [activeConversation?.id, notificationsEnabled])

  const handleStartNewConversation = async () => {
    setStartingNew(true)
    try {
      const convo = await getOrCreateConversation(
        user.id,
        user.email,
        user.user_metadata?.full_name || user.user_metadata?.name
      )
      setActiveConversation(convo)
      setShowMobileChat(true)
    } catch (error) {
      console.error('Failed to start conversation:', error)
    } finally {
      setStartingNew(false)
    }
  }

  const handleSelectConversation = (convo) => {
    setActiveConversation(convo)
    setShowMobileChat(true)
    isInitialLoadRef.current = true // Reset for new conversation
  }

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConversation?.id || sending) return

    const messageText = newMessage.trim()
    setNewMessage('')
    setSending(true)

    try {
      await sendMessage(activeConversation.id, user.id, 'customer', messageText)
    } catch (error) {
      console.error('Failed to send message:', error)
      setNewMessage(messageText)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const diff = now - d
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return d.toLocaleDateString([], { weekday: 'short' })
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadByCustomer || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-night-950 via-night-950 to-night-900">
      {/* Header */}
      <div className="border-b border-night-800/50 bg-night-950/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showMobileChat ? (
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="lg:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-night-800/50 text-slate-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              ) : (
                <Link
                  to="/account"
                  className="flex items-center justify-center h-10 w-10 rounded-xl bg-night-800/50 text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              )}
              <div>
                <h1 className="text-lg font-bold text-white">Support</h1>
                <p className="text-xs text-slate-500 hidden sm:block">
                  We're here to help
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {totalUnread > 0 && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime-500/10 text-lime-400 text-xs font-medium">
                  {totalUnread} new
                </span>
              )}
              <button
                onClick={handleToggleNotifications}
                className={`flex items-center justify-center h-10 w-10 rounded-xl transition-colors ${
                  notificationsEnabled
                    ? 'bg-lime-500/10 text-lime-400'
                    : 'bg-night-800/50 text-slate-400 hover:text-white'
                }`}
                title={notificationsEnabled ? 'Notifications on' : 'Enable notifications'}
              >
                {notificationsEnabled ? (
                  <Bell className="h-5 w-5" />
                ) : (
                  <BellOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-night-900/50 border border-night-800/50 rounded-3xl overflow-hidden h-[calc(100vh-180px)] min-h-[500px]">
          <div className="flex h-full">
            {/* Conversations List - Hidden on mobile when chat is open */}
            <div className={`w-full lg:w-80 border-r border-night-800/50 flex flex-col ${showMobileChat ? 'hidden lg:flex' : 'flex'}`}>
              {/* List Header */}
              <div className="p-4 border-b border-night-800/50">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-white">Messages</h2>
                  <button
                    onClick={handleStartNewConversation}
                    disabled={startingNew}
                    className="flex items-center justify-center h-8 w-8 rounded-lg bg-lime-500 text-night-950 hover:bg-lime-400 transition-colors disabled:opacity-50"
                  >
                    {startingNew ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-6 w-6 text-lime-500 animate-spin" />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-night-800/50 mb-4">
                      <MessageCircle className="h-8 w-8 text-slate-600" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-1">No messages yet</p>
                    <p className="text-slate-500 text-xs mb-4">
                      Start a conversation with our team
                    </p>
                    <button
                      onClick={handleStartNewConversation}
                      disabled={startingNew}
                      className="inline-flex items-center gap-2 bg-lime-500 text-night-950 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-lime-400 transition-colors disabled:opacity-50"
                    >
                      {startingNew ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MessageCircle className="h-4 w-4" />
                      )}
                      New Message
                    </button>
                  </div>
                ) : (
                  <div>
                    {conversations.map((convo) => (
                      <button
                        key={convo.id}
                        onClick={() => handleSelectConversation(convo)}
                        className={`w-full p-4 text-left transition-all ${
                          activeConversation?.id === convo.id
                            ? 'bg-lime-500/5 border-l-2 border-lime-500'
                            : 'hover:bg-night-800/30 border-l-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 ${
                            convo.status === 'open' ? 'bg-lime-500/10' : 'bg-night-800/50'
                          }`}>
                            <Headphones className={`h-5 w-5 ${
                              convo.status === 'open' ? 'text-lime-500' : 'text-slate-500'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className={`text-xs font-medium flex items-center gap-1 ${
                                convo.status === 'open' ? 'text-lime-500' : 'text-slate-500'
                              }`}>
                                {convo.status === 'open' ? (
                                  <>
                                    <span className="h-1.5 w-1.5 rounded-full bg-lime-500"></span>
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="h-3 w-3" />
                                    Resolved
                                  </>
                                )}
                              </span>
                              <span className="text-xs text-slate-500">
                                {formatTime(convo.updatedAt)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300 truncate">
                              {convo.lastMessage || 'Start chatting...'}
                            </p>
                            {convo.unreadByCustomer > 0 && (
                              <span className="inline-flex mt-2 items-center gap-1 px-2 py-0.5 rounded-full bg-lime-500 text-night-950 text-xs font-bold">
                                {convo.unreadByCustomer} new
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${!showMobileChat ? 'hidden lg:flex' : 'flex'}`}>
              {!activeConversation ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-lime-500/20 to-lime-500/5 mb-6">
                      <Headphones className="h-12 w-12 text-lime-500" />
                    </div>
                    <div className={`absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full ${
                      supportStatus === 'online' ? 'bg-lime-500' :
                      supportStatus === 'away' ? 'bg-amber-500' : 'bg-slate-600'
                    }`}>
                      <Sparkles className={`h-4 w-4 ${supportStatus === 'offline' ? 'text-white' : 'text-night-950'}`} />
                    </div>
                  </motion.div>

                  {/* Status Badge */}
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                    supportStatus === 'online'
                      ? 'bg-lime-500/10 text-lime-400'
                      : supportStatus === 'away'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-slate-500/10 text-slate-400'
                  }`}>
                    <span className={`h-2 w-2 rounded-full ${
                      supportStatus === 'online' ? 'bg-lime-500 animate-pulse' :
                      supportStatus === 'away' ? 'bg-amber-500' : 'bg-slate-500'
                    }`}></span>
                    {supportStatus === 'online' ? 'Support Online' : supportStatus === 'away' ? 'Support Away' : 'Support Offline'}
                  </span>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    How can we help?
                  </h3>
                  <p className="text-slate-400 max-w-sm mb-8">
                    {supportStatus === 'online'
                      ? 'Our team is online and ready to assist with orders, fitment questions, or anything else.'
                      : supportStatus === 'away'
                      ? 'Our team is currently away but will respond to your message as soon as possible.'
                      : 'Our team is offline, but leave a message and we\'ll get back to you.'}
                  </p>
                  <button
                    onClick={handleStartNewConversation}
                    disabled={startingNew}
                    className="inline-flex items-center gap-2 bg-lime-500 text-night-950 px-6 py-3.5 rounded-2xl font-semibold hover:bg-lime-400 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {startingNew ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-5 w-5" />
                        Start a Conversation
                      </>
                    )}
                  </button>
                  <p className="text-xs text-slate-500 mt-4">
                    {supportStatus === 'online'
                      ? 'Average response time: under 5 minutes'
                      : supportStatus === 'away'
                      ? 'Response time may be longer than usual'
                      : 'We\'ll respond when we\'re back online'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-night-800/50 bg-night-900/50">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-lime-500/20 to-lime-500/5">
                          <Headphones className="h-5 w-5 text-lime-500" />
                        </div>
                        {activeConversation.status === 'open' && (
                          <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-night-900 ${
                            supportStatus === 'online' ? 'bg-lime-500' :
                            supportStatus === 'away' ? 'bg-amber-500' : 'bg-slate-500'
                          }`}></span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">ModLift Support</h3>
                        <p className="text-xs text-slate-500">
                          {activeConversation.status !== 'open'
                            ? 'Conversation resolved'
                            : supportStatus === 'online'
                            ? 'Typically replies in minutes'
                            : supportStatus === 'away'
                            ? 'May take longer to respond'
                            : 'We\'ll respond when back online'}
                        </p>
                      </div>
                      {activeConversation.status === 'open' && (
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          supportStatus === 'online'
                            ? 'bg-lime-500/10 text-lime-400'
                            : supportStatus === 'away'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-slate-500/10 text-slate-400'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            supportStatus === 'online' ? 'bg-lime-500 animate-pulse' :
                            supportStatus === 'away' ? 'bg-amber-500' : 'bg-slate-500'
                          }`}></span>
                          {supportStatus === 'online' ? 'Online' : supportStatus === 'away' ? 'Away' : 'Offline'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-night-800/50 mb-3">
                          <MessageCircle className="h-7 w-7 text-slate-600" />
                        </div>
                        <p className="text-slate-400 text-sm">
                          Send a message to start
                        </p>
                      </div>
                    ) : (
                      <AnimatePresence initial={false}>
                        {messages.map((msg, index) => {
                          const isCustomer = msg.senderType === 'customer'
                          const showAvatar = !isCustomer && (index === 0 || messages[index - 1]?.senderType === 'customer')

                          return (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className={`flex gap-2 ${isCustomer ? 'justify-end' : 'justify-start'}`}
                            >
                              {!isCustomer && (
                                <div className={`flex-shrink-0 ${showAvatar ? 'visible' : 'invisible'}`}>
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-500/10">
                                    <Headphones className="h-4 w-4 text-lime-500" />
                                  </div>
                                </div>
                              )}
                              <div
                                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                                  isCustomer
                                    ? 'bg-lime-500 text-night-950 rounded-br-md'
                                    : 'bg-night-800 text-white rounded-bl-md'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                                  {msg.text}
                                </p>
                                <p
                                  className={`text-[10px] mt-1 ${
                                    isCustomer ? 'text-night-950/50' : 'text-slate-500'
                                  }`}
                                >
                                  {formatTime(msg.createdAt)}
                                </p>
                              </div>
                            </motion.div>
                          )
                        })}
                      </AnimatePresence>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  {activeConversation.status === 'open' ? (
                    <div className="p-4 border-t border-night-800/50 bg-night-900/30">
                      <div className="flex items-end gap-2">
                        <div className="flex-1 relative">
                          <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Type a message..."
                            rows={1}
                            className="w-full bg-night-800/50 border border-night-700/50 rounded-2xl px-4 py-3 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-500/30 focus:border-lime-500/50 resize-none max-h-32"
                            style={{ minHeight: '48px' }}
                          />
                        </div>
                        <button
                          onClick={handleSend}
                          disabled={!newMessage.trim() || sending}
                          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-500 text-night-950 hover:bg-lime-400 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
                        >
                          {sending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Send className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border-t border-night-800/50 bg-night-800/20">
                      <div className="flex items-center justify-center gap-3 py-2">
                        <CheckCircle2 className="h-5 w-5 text-slate-500" />
                        <p className="text-slate-400 text-sm">
                          This conversation was resolved.
                        </p>
                        <button
                          onClick={handleStartNewConversation}
                          disabled={startingNew}
                          className="text-lime-400 text-sm font-medium hover:text-lime-300 transition-colors"
                        >
                          Start new
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
