import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
  limit,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Collection references
const conversationsRef = collection(db, 'conversations')
const messagesRef = collection(db, 'messages')

/**
 * Create or get existing conversation for a user
 */
export const getOrCreateConversation = async (userId, userEmail, userName) => {
  // Check if user already has an open conversation
  const q = query(
    conversationsRef,
    where('userId', '==', userId),
    where('status', '==', 'open'),
    limit(1)
  )

  const snapshot = await getDocs(q)

  if (!snapshot.empty) {
    const existingConvo = snapshot.docs[0]
    return { id: existingConvo.id, ...existingConvo.data() }
  }

  // Create new conversation
  const newConvo = await addDoc(conversationsRef, {
    userId,
    userEmail,
    userName: userName || userEmail?.split('@')[0] || 'Customer',
    status: 'open', // open, resolved, archived
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastMessage: null,
    unreadByAdmin: 0,
    unreadByCustomer: 0,
  })

  return {
    id: newConvo.id,
    userId,
    userEmail,
    userName: userName || userEmail?.split('@')[0] || 'Customer',
    status: 'open',
  }
}

/**
 * Send a message in a conversation
 */
export const sendMessage = async (conversationId, senderId, senderType, text) => {
  // Add the message
  const messageDoc = await addDoc(messagesRef, {
    conversationId,
    senderId,
    senderType, // 'customer' or 'admin'
    text,
    createdAt: serverTimestamp(),
    read: false,
  })

  // Update conversation with last message info
  const convoRef = doc(db, 'conversations', conversationId)
  const updateData = {
    lastMessage: text.substring(0, 100),
    updatedAt: serverTimestamp(),
  }

  // Increment unread count for the other party
  if (senderType === 'customer') {
    updateData.unreadByAdmin = 1 // Will be incremented by trigger or manually tracked
  } else {
    updateData.unreadByCustomer = 1
  }

  await updateDoc(convoRef, updateData)

  return { id: messageDoc.id }
}

/**
 * Subscribe to messages in a conversation (real-time)
 */
export const subscribeToMessages = (conversationId, callback) => {
  const q = query(
    messagesRef,
    where('conversationId', '==', conversationId),
    orderBy('createdAt', 'asc')
  )

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }))
    callback(messages)
  })
}

/**
 * Subscribe to user's conversations (real-time)
 */
export const subscribeToUserConversations = (userId, callback) => {
  const q = query(
    conversationsRef,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  )

  return onSnapshot(q, (snapshot) => {
    const conversations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    }))
    callback(conversations)
  })
}

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (conversationId, readerType) => {
  const convoRef = doc(db, 'conversations', conversationId)

  if (readerType === 'customer') {
    await updateDoc(convoRef, { unreadByCustomer: 0 })
  } else {
    await updateDoc(convoRef, { unreadByAdmin: 0 })
  }
}

/**
 * Close/resolve a conversation
 */
export const closeConversation = async (conversationId) => {
  const convoRef = doc(db, 'conversations', conversationId)
  await updateDoc(convoRef, {
    status: 'resolved',
    resolvedAt: serverTimestamp(),
  })
}

/**
 * Support availability - subscribe to status changes
 */
const supportStatusRef = doc(db, 'settings', 'supportStatus')

export const subscribeToSupportStatus = (callback) => {
  return onSnapshot(supportStatusRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data()
      callback({
        status: data.status || 'offline',
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      })
    } else {
      callback({ status: 'offline', updatedAt: new Date() })
    }
  })
}
