import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import { getDiscountAlerts, removeDiscountAlert, DiscountAlert } from './NotificationSystem'

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'alerts'>('profile')
  const [discountAlerts, setDiscountAlerts] = useState<DiscountAlert[]>(
    user ? getDiscountAlerts(user.id) : []
  )

  const handleRemoveAlert = (alertId: string) => {
    if (user && window.confirm('Удалить это уведомление?')) {
      removeDiscountAlert(user.id, alertId)
      setDiscountAlerts(prev => prev.filter(alert => alert.id !== alertId))
    }
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">👤 Профиль пользователя</h1>
              <p className="text-blue-100">Управление аккаунтом и уведомлениями</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b bg-gray-50">
          <div className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              👤 Профиль
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'alerts'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              🔔 Уведомления ({discountAlerts.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-xl font-bold mb-4">Информация об аккаунте</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Имя пользователя
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                      {user.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Роль
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? '👑 Администратор' : '👤 Пользователь'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-red-800 mb-2">Выход из аккаунта</h3>
                <p className="text-red-700 text-sm mb-4">
                  При выходе из аккаунта все несохраненные данные будут потеряны
                </p>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  🚪 Выйти из аккаунта
                </button>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Активные уведомления</h3>
                <span className="text-sm text-gray-500">
                  {discountAlerts.filter(a => a.isActive).length} активных
                </span>
              </div>

              {discountAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔕</div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    Нет активных уведомлений
                  </h4>
                  <p className="text-gray-600">
                    Настройте уведомления о скидках в результатах поиска
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {discountAlerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`border rounded-lg p-4 ${
                        alert.isActive 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">
                            {alert.carBrand} {alert.carModel}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Уведомить при скидке: <span className="font-medium">
                              {alert.targetDiscount.toLocaleString()} ₽
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Создано: {alert.createdAt.toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            alert.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {alert.isActive ? '🟢 Активно' : '⚪ Неактивно'}
                          </span>
                          <button
                            onClick={() => handleRemoveAlert(alert.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile