import React from 'react'
import { Dealer, getDealersByBrand } from '../data/dealersData'

interface DealersMapProps {
  carBrand?: string
  carModel?: string
  onClose: () => void
  onDealerCall?: (dealerId: string) => void
  onDealerWebsiteVisit?: (dealerId: string) => void
}

const DealersMap: React.FC<DealersMapProps> = ({ 
  carBrand, 
  carModel, 
  onClose, 
  onDealerCall, 
  onDealerWebsiteVisit 
}) => {
  const dealers = carBrand ? getDealersByBrand(carBrand) : []

  const handleCall = (dealerId: string, phone: string) => {
    onDealerCall?.(dealerId)
    window.open(`tel:${phone}`, '_self')
  }

  const handleWebsiteVisit = (dealerId: string, website: string) => {
    onDealerWebsiteVisit?.(dealerId)
    window.open(website, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Дилеры {carBrand} в Москве
              </h2>
              {carModel && (
                <p className="text-gray-600">
                  Поиск модели: <span className="font-semibold">{carModel}</span>
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                📍 Список официальных дилеров с контактной информацией
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
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{dealer.name}</h3>
                    <p className="text-gray-600">{dealer.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      #{index + 1}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Телефон:</div>
                    <div className="font-medium">{dealer.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Время работы:</div>
                    <div className="font-medium">{dealer.workingHours}</div>
                  </div>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Услуги:</div>
                  <div className="flex flex-wrap gap-2">
                    {dealer.services.map((service, serviceIndex) => (
                      <span
                        key={serviceIndex}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
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
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Найдено {dealers.length} официальных дилеров {carBrand}
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

export default DealersMap