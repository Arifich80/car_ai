import React from 'react'
import { Dealer } from '../data/dealersData'

interface DealersDiscountsListProps {
  dealers: Dealer[]
  carBrand: string
  carModel: string
  onClose: () => void
  onDealerCall?: (dealerId: string) => void
  onDealerWebsiteVisit?: (dealerId: string) => void
}

const DealersDiscountsList: React.FC<DealersDiscountsListProps> = ({ 
  dealers, 
  carBrand, 
  carModel, 
  onClose,
  onDealerCall,
  onDealerWebsiteVisit
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  const handleCall = (dealerId: string, phone: string) => {
    onDealerCall?.(dealerId)
    window.open(`tel:${phone}`, '_self')
  }

  const handleWebsiteVisit = (dealerId: string, website: string) => {
    onDealerWebsiteVisit?.(dealerId)
    window.open(website, '_blank')
  }

  if (dealers.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md mx-auto p-8 text-center">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Скидки не найдены
          </h3>
          <p className="text-gray-600 mb-6">
            К сожалению, на модель {carBrand} {carModel} сейчас нет специальных предложений
          </p>
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Закрыть
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                🔥 Максимальные скидки на {carBrand} {carModel}
              </h2>
              <p className="text-gray-600">
                Найдено {dealers.length} дилеров со специальными предложениями
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Dealers List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {dealers.map((dealer, index) => (
              <div
                key={dealer.id}
                className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{dealer.name}</h3>
                      <p className="text-gray-600">{dealer.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ТОП {index + 1}
                    </div>
                  </div>
                </div>

                {/* Discount Info */}
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-3xl font-bold text-red-600 mb-1">
                        -{formatPrice(dealer.discount || 0)} ₽
                      </div>
                      <div className="text-lg text-red-500 font-semibold">
                        или -{dealer.discountPercent}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Дополнительно:</div>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                        🎁 {dealer.specialOffer}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dealer Info */}
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">Телефон:</div>
                    <div className="font-medium">{dealer.phone}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Время работы:</div>
                    <div className="font-medium">{dealer.workingHours}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Наличие:</div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="font-medium text-green-700">В наличии</span>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="mt-4">
                  <div className="text-gray-500 text-sm mb-2">Услуги:</div>
                  <div className="flex flex-wrap gap-2">
                    {dealer.services.map((service, serviceIndex) => (
                      <span
                        key={serviceIndex}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => handleCall(dealer.id, dealer.phone)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <span>📞</span>
                    <span>Позвонить</span>
                  </button>
                  <button
                    onClick={() => handleWebsiteVisit(dealer.id, dealer.website)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <span>🌐</span>
                    <span>Сайт дилера</span>
                  </button>
                </div>

                {/* Urgency indicator */}
                <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-600">⚡</span>
                    <span className="text-sm text-yellow-800 font-medium">
                      Предложение ограничено! Скидка действует до конца месяца
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              💡 Совет: Позвоните дилеру для уточнения актуальных условий
            </p>
            <button
              onClick={onClose}
              className="btn-primary"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DealersDiscountsList