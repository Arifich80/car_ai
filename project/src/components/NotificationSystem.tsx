import React, { useState, useEffect } from 'react'
import { CarRecognitionResult } from './CarRecognitionApp'

export interface DiscountAlert {
  id: string
  userId: string
  carBrand: string
  carModel: string
  targetDiscount: number
  isActive: boolean
  createdAt: Date
}

export interface Notification {
  id: string
  type: 'discount_alert' | 'info' | 'success'
  title: string
  message: string
  carBrand?: string
  carModel?: string
  discount?: number
  dealerName?: string
  isRead: boolean
  createdAt: Date
}

interface NotificationSystemProps {
  userId: string
  onNotificationClick?: (notification: Notification) => void
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ 
  userId, 
  onNotificationClick 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // Загружаем уведомления пользователя
    const savedNotifications = localStorage.getItem(`notifications_${userId}`)
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }

    // Симулируем периодическую проверку новых скидок
    const interval = setInterval(() => {
      checkForDiscountAlerts()
    }, 30000) // каждые 30 секунд

    return () => clearInterval(interval)
  }, [userId])

  const checkForDiscountAlerts = () => {
    const alerts = getActiveDiscountAlerts(userId)
    
    alerts.forEach(alert => {
      // Симулируем проверку скидок
      const hasNewDiscount = Math.random() > 0.8 // 20% вероятность новой скидки
      
      if (hasNewDiscount) {
        const discount = Math.floor(Math.random() * 500000) + alert.targetDiscount
        const dealerNames = ['BMW Авилон', 'Mercedes-Benz ГК АЦ', 'Toyota Центр Кунцево']
        const dealerName = dealerNames[Math.floor(Math.random() * dealerNames.length)]
        
        const notification: Notification = {
          id: `notif_${Date.now()}`,
          type: 'discount_alert',
          title: '🔥 Новая скидка!',
          message: `Скидка на ${alert.carBrand} ${alert.carModel} достигла ${discount.toLocaleString()} ₽`,
          carBrand: alert.carBrand,
          carModel: alert.carModel,
          discount: discount,
          dealerName: dealerName,
          isRead: false,
          createdAt: new Date()
        }
        
        addNotification(notification)
      }
    })
  }

  const addNotification = (notification: Notification) => {
    setNotifications(prev => {
      const updated = [notification, ...prev].slice(0, 50) // максимум 50 уведомлений
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(updated))
      return updated
    })
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(updated))
      return updated
    })
  }

  const clearAllNotifications = () => {
    setNotifications([])
    localStorage.removeItem(`notifications_${userId}`)
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Уведомления</h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Очистить все
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">🔕</div>
                <p>Нет уведомлений</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => {
                    markAsRead(notification.id)
                    onNotificationClick?.(notification)
                  }}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">
                      {notification.type === 'discount_alert' ? '🔥' : 
                       notification.type === 'success' ? '✅' : 'ℹ️'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {notification.message}
                      </p>
                      {notification.dealerName && (
                        <p className="text-blue-600 text-xs mt-1">
                          Дилер: {notification.dealerName}
                        </p>
                      )}
                      <p className="text-gray-400 text-xs mt-2">
                        {notification.createdAt.toLocaleString('ru-RU')}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Вспомогательные функции для работы с алертами
export const createDiscountAlert = (
  userId: string, 
  carBrand: string, 
  carModel: string, 
  targetDiscount: number
): DiscountAlert => {
  const alert: DiscountAlert = {
    id: `alert_${Date.now()}`,
    userId,
    carBrand,
    carModel,
    targetDiscount,
    isActive: true,
    createdAt: new Date()
  }

  const existingAlerts = getDiscountAlerts(userId)
  const updatedAlerts = [...existingAlerts, alert]
  localStorage.setItem(`discountAlerts_${userId}`, JSON.stringify(updatedAlerts))

  return alert
}

export const getDiscountAlerts = (userId: string): DiscountAlert[] => {
  const saved = localStorage.getItem(`discountAlerts_${userId}`)
  return saved ? JSON.parse(saved) : []
}

export const getActiveDiscountAlerts = (userId: string): DiscountAlert[] => {
  return getDiscountAlerts(userId).filter(alert => alert.isActive)
}

export const removeDiscountAlert = (userId: string, alertId: string) => {
  const alerts = getDiscountAlerts(userId)
  const updated = alerts.filter(alert => alert.id !== alertId)
  localStorage.setItem(`discountAlerts_${userId}`, JSON.stringify(updated))
}

export default NotificationSystem