import React, { useState } from 'react'
import { createDiscountAlert } from './NotificationSystem'

interface DiscountAlertModalProps {
  isOpen: boolean
  onClose: () => void
  carBrand: string
  carModel: string
  userId: string
}

const DiscountAlertModal: React.FC<DiscountAlertModalProps> = ({
  isOpen,
  onClose,
  carBrand,
  carModel,
  userId
}) => {
  const [targetDiscount, setTargetDiscount] = useState<number>(300000)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateAlert = async () => {
    setIsCreating(true)
    
    try {
      createDiscountAlert(userId, carBrand, carModel, targetDiscount)
      
      // Симулируем задержку
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onClose()
    } catch (error) {
      console.error('Ошибка создания уведомления:', error)
    } finally {
      setIsCreating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">🔔 Настроить уведомление</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                {carBrand} {carModel}
              </h3>
              <p className="text-blue-700 text-sm">
                Мы уведомим вас, когда скидка на эту модель достигнет указанной суммы
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Желаемая скидка (рубли)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={targetDiscount}
                  onChange={(e) => setTargetDiscount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                  placeholder="300000"
                  min="50000"
                  step="50000"
                />
                <span className="absolute right-3 top-2 text-gray-500">₽</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Минимальная сумма: 50,000 ₽
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => setTargetDiscount(200000)}
                className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
              >
                💰 200,000 ₽ - небольшая скидка
              </button>
              <button
                onClick={() => setTargetDiscount(500000)}
                className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
              >
                🔥 500,000 ₽ - хорошая скидка
              </button>
              <button
                onClick={() => setTargetDiscount(800000)}
                className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
              >
                💎 800,000 ₽ - максимальная скидка
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600">⚡</span>
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Как это работает:</p>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• Мы отслеживаем скидки у всех дилеров</li>
                  <li>• Уведомление придет сразу при достижении суммы</li>
                  <li>• Вы можете настроить несколько уведомлений</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleCreateAlert}
              disabled={isCreating || targetDiscount < 50000}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Создание...</span>
                </>
              ) : (
                <>
                  <span>🔔</span>
                  <span>Создать уведомление</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiscountAlertModal