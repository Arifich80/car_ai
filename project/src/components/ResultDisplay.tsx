import React, { useState } from 'react'
import { CarRecognitionResult } from './CarRecognitionApp'
import DealersMap from './DealersMap'
import DealersDiscountsList from './DealersDiscountsList'
import DiscountAlertModal from './DiscountAlertModal'
import { getDealersWithDiscounts } from '../data/dealersData'
import { trackAnalyticsEvent } from '../utils/analytics'

interface ResultDisplayProps {
  result: CarRecognitionResult
  onClose: () => void
  userId?: string
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onClose, userId }) => {
  const [showMap, setShowMap] = useState(false)
  const [showDiscounts, setShowDiscounts] = useState(false)
  const [showDiscountAlert, setShowDiscountAlert] = useState(false)
  const [discountDealers, setDiscountDealers] = useState<any[]>([])
  const [loadingDiscounts, setLoadingDiscounts] = useState(false)
  
  const confidencePercentage = Math.round(result.confidence * 100)
  
  const handleShowDealers = () => {
    setShowMap(true)
  }

  const handleCloseMap = () => {
    setShowMap(false)
  }

  const handleShowDiscounts = async () => {
    setLoadingDiscounts(true)
    
    // Симулируем загрузку данных о скидках
    setTimeout(() => {
      const dealers = getDealersWithDiscounts(result.make, result.model)
      setDiscountDealers(dealers)
      setShowDiscounts(true)
      setLoadingDiscounts(false)
    }, 1500)
  }

  const handleCloseDiscounts = () => {
    setShowDiscounts(false)
  }

  const handleCreateDiscountAlert = () => {
    if (!userId) {
      alert('Войдите в систему для настройки уведомлений')
      return
    }
    setShowDiscountAlert(true)
  }

  const handleDealerCall = (dealerId: string) => {
    trackAnalyticsEvent({
      dealerId,
      eventType: 'call',
      carBrand: result.make,
      carModel: result.model,
      userId
    })
  }

  const handleDealerWebsiteVisit = (dealerId: string) => {
    trackAnalyticsEvent({
      dealerId,
      eventType: 'website_visit',
      carBrand: result.make,
      carModel: result.model,
      userId
    })
  }
  
  return (
    <>
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="result-card p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold">
                {result.make} {result.model}
              </h3>
              <p className="text-blue-100">{result.year} год</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${confidencePercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{confidencePercentage}%</span>
          </div>
        </div>

        {/* Image */}
        <div className="p-6 border-b">
          <img
            src={result.image}
            alt="Распознанный автомобиль"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        {/* Details */}
        <div className="p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Характеристики:</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Тип кузова</span>
              <p className="font-medium">{result.details.bodyType}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Двигатель</span>
              <p className="font-medium">{result.details.engine}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Коробка передач</span>
              <p className="font-medium">{result.details.transmission}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Топливо</span>
              <p className="font-medium">{result.details.fuelType}</p>
            </div>
          </div>
        </div>

        {/* Dealers Section */}
        <div className="p-6 bg-blue-50 border-t">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-gray-800">Официальные дилеры</h4>
              <p className="text-sm text-gray-600">
                Найдите ближайший дилер {result.make} в Москве
              </p>
            </div>
            <div className="text-2xl">🗺️</div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleShowDealers}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>📍</span>
              <span>Показать дилеров на карте</span>
            </button>

            <button
              onClick={handleShowDiscounts}
              disabled={loadingDiscounts}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loadingDiscounts ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Поиск скидок...</span>
                </>
              ) : (
                <>
                  <span>🔥</span>
                  <span>Показать дилеров с максимальными скидками</span>
                </>
              )}
            </button>

            {/* Discount Alert Button */}
            <button
              onClick={handleCreateDiscountAlert}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>🔔</span>
              <span>Уведомить о скидках на эту модель</span>
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            Информация о наличии и скидках обновляется в реальном времени
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 flex space-x-3">
          <button className="btn-primary flex-1">
            📤 Поделиться
          </button>
          <button className="btn-secondary flex-1">
            💾 Сохранить
          </button>
        </div>
      </div>

      {/* Dealers Map Modal */}
      {showMap && (
        <DealersMap
          carBrand={result.make}
          carModel={result.model}
          onClose={handleCloseMap}
          onDealerCall={handleDealerCall}
          onDealerWebsiteVisit={handleDealerWebsiteVisit}
        />
      )}

      {/* Dealers Discounts Modal */}
      {showDiscounts && (
        <DealersDiscountsList
          dealers={discountDealers}
          carBrand={result.make}
          carModel={result.model}
          onClose={handleCloseDiscounts}
          onDealerCall={handleDealerCall}
          onDealerWebsiteVisit={handleDealerWebsiteVisit}
        />
      )}

      {/* Discount Alert Modal */}
      {showDiscountAlert && userId && (
        <DiscountAlertModal
          isOpen={showDiscountAlert}
          onClose={() => setShowDiscountAlert(false)}
          carBrand={result.make}
          carModel={result.model}
          userId={userId}
        />
      )}
    </>
  )
}

export default ResultDisplay