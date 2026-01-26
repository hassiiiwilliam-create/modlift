/**
 * Browser Notification Utilities
 */

// Check if notifications are supported
export const isNotificationSupported = () => {
  return 'Notification' in window
}

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    console.log('Notifications not supported')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

// Check if notifications are enabled
export const areNotificationsEnabled = () => {
  return isNotificationSupported() && Notification.permission === 'granted'
}

// Show a notification
export const showNotification = (title, options = {}) => {
  if (!areNotificationsEnabled()) {
    return null
  }

  const notification = new Notification(title, {
    icon: '/modlift-icon.png',
    badge: '/modlift-icon.png',
    tag: 'modlift-support',
    renotify: true,
    ...options,
  })

  // Auto close after 5 seconds
  setTimeout(() => {
    notification.close()
  }, 5000)

  return notification
}

// Show support message notification (for customers)
export const showSupportMessageNotification = (message) => {
  return showNotification('New Message from ModLift Support', {
    body: message.length > 100 ? message.substring(0, 100) + '...' : message,
    tag: 'modlift-support-message',
  })
}
