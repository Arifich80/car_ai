import React, { useState, useEffect } from 'react'
import { Dealer, moscowDealers } from '../data/dealersData'

interface AdminPanelProps {
  onClose: () => void
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [dealers, setDealers] = useState<Dealer[]>(moscowDealers)
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit' | 'analytics'>('list')
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBrand, setFilterBrand] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Форма для нового/редактируемого дилера
  const [formData, setFormData] = useState<Partial<Dealer>>({
    name: '',
    brand: '',
    address: '',
    phone: '',
    website: '',
    coordinates: [55.7558, 37.6176],
    workingHours: '',
    services: [],
    discount: 0,
    discountPercent: 0,
    specialOffer: ''
  })

  const brands = [...new Set(dealers.map(d => d.brand))].sort()
  const filteredDealers = dealers.filter(dealer => {
    const matchesSearch = dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dealer.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBrand = !filterBrand || dealer.brand === filterBrand
    return matchesSearch && matchesBrand
  })

  const handleAddDealer = () => {
    setFormData({
      name: '',
      brand: '',
      address: '',
      phone: '',
      website: '',
      coordinates: [55.7558, 37.6176],
      workingHours: '',
      services: [],
      discount: 0,
      discountPercent: 0,
      specialOffer: ''
    })
    setActiveTab('add')
  }

  const handleEditDealer = (dealer: Dealer) => {
    setSelectedDealer(dealer)
    setFormData(dealer)
    setActiveTab('edit')
  }

  const handleDeleteDealer = (dealerId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого дилера?')) {
      setDealers(prev => prev.filter(d => d.id !== dealerId))
    }
  }

  const handleSaveDealer = () => {
    setIsLoading(true)
    
    setTimeout(() => {
      if (activeTab === 'add') {
        const newDealer: Dealer = {
          ...formData as Dealer,
          id: Date.now().toString()
        }
        setDealers(prev => [...prev, newDealer])
      } else if (activeTab === 'edit' && selectedDealer) {
        setDealers(prev => prev.map(d => 
          d.id === selectedDealer.id ? { ...formData as Dealer, id: selectedDealer.id } : d
        ))
      }
      
      setIsLoading(false)
      setActiveTab('list')
    }, 1000)
  }

  const handleServiceToggle = (service: string) => {
    const currentServices = formData.services || []
    if (currentServices.includes(service)) {
      setFormData(prev => ({
        ...prev,
        services: currentServices.filter(s => s !== service)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        services: [...currentServices, service]
      }))
    }
  }

  const availableServices = [
    'Продажа новых авто',
    'Сервис',
    'Запчасти',
    'Trade-in',
    'Страхование',
    'Лизинг',
    'Кредитование'
  ]

  const getAnalytics = () => {
    const totalDealers = dealers.length
    const dealersWithDiscounts = dealers.filter(d => d.discount && d.discount > 0).length
    const avgDiscount = dealers
      .filter(d => d.discount && d.discount > 0)
      .reduce((sum, d) => sum + (d.discount || 0), 0) / dealersWithDiscounts || 0
    
    const brandStats = brands.map(brand => ({
      brand,
      count: dealers.filter(d => d.brand === brand).length,
      avgDiscount: dealers
        .filter(d => d.brand === brand && d.discount && d.discount > 0)
        .reduce((sum, d) => sum + (d.discount || 0), 0) / 
        dealers.filter(d => d.brand === brand && d.discount && d.discount > 0).length || 0
    }))

    return { totalDealers, dealersWithDiscounts, avgDiscount, brandStats }
  }

  const analytics = getAnalytics()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl h-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">🏢 Панель администратора</h1>
              <p className="text-blue-100">Управление данными дилеров и скидок</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-3xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b bg-gray-50">
          <div className="flex">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'list'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 Список дилеров ({dealers.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Аналитика
            </button>
            <button
              onClick={handleAddDealer}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'add'
                  ? 'border-green-600 text-green-600 bg-white'
                  : 'border-transparent text-green-500 hover:text-green-700'
              }`}
            >
              ➕ Добавить дилера
            </button>
            {activeTab === 'edit' && (
              <button
                className="px-6 py-4 font-medium border-b-2 border-orange-600 text-orange-600 bg-white"
              >
                ✏️ Редактировать дилера
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {/* Dealers List */}
          {activeTab === 'list' && (
            <div className="h-full flex flex-col">
              {/* Search and Filters */}
              <div className="p-6 border-b bg-gray-50">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="🔍 Поиск по названию или адресу..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Все бренды</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dealers Table */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Дилер
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Бренд
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Скидка
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Услуги
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDealers.map((dealer) => (
                        <tr key={dealer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{dealer.name}</div>
                              <div className="text-sm text-gray-500">{dealer.address}</div>
                              <div className="text-sm text-gray-500">{dealer.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {dealer.brand}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {dealer.discount ? (
                              <div>
                                <div className="text-sm font-medium text-red-600">
                                  -{dealer.discount?.toLocaleString()} ₽
                                </div>
                                <div className="text-xs text-gray-500">
                                  -{dealer.discountPercent}%
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">Нет скидки</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {dealer.services.length} услуг
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditDealer(dealer)}
                                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                              >
                                ✏️ Изменить
                              </button>
                              <button
                                onClick={() => handleDeleteDealer(dealer.id)}
                                className="text-red-600 hover:text-red-900 text-sm font-medium"
                              >
                                🗑️ Удалить
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {analytics.totalDealers}
                  </div>
                  <div className="text-blue-800 font-medium">Всего дилеров</div>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {analytics.dealersWithDiscounts}
                  </div>
                  <div className="text-green-800 font-medium">Со скидками</div>
                </div>
                <div className="bg-red-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {Math.round(analytics.avgDiscount / 1000)}к ₽
                  </div>
                  <div className="text-red-800 font-medium">Средняя скидка</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {brands.length}
                  </div>
                  <div className="text-purple-800 font-medium">Брендов</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">Статистика по брендам</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Бренд</th>
                        <th className="text-left py-2">Количество дилеров</th>
                        <th className="text-left py-2">Средняя скидка</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.brandStats.map(stat => (
                        <tr key={stat.brand} className="border-b">
                          <td className="py-2 font-medium">{stat.brand}</td>
                          <td className="py-2">{stat.count}</td>
                          <td className="py-2">
                            {stat.avgDiscount > 0 
                              ? `${Math.round(stat.avgDiscount / 1000)}к ₽`
                              : 'Нет скидок'
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Add/Edit Form */}
          {(activeTab === 'add' || activeTab === 'edit') && (
            <div className="p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-2xl font-bold mb-6">
                    {activeTab === 'add' ? '➕ Добавить нового дилера' : '✏️ Редактировать дилера'}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">Основная информация</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Название дилера *
                        </label>
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="BMW Авилон"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Бренд *
                        </label>
                        <select
                          value={formData.brand || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Выберите бренд</option>
                          {brands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                          ))}
                          <option value="other">Другой бренд</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Адрес *
                        </label>
                        <input
                          type="text"
                          value={formData.address || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Волгоградский пр-т, 43, корп. 1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Телефон *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="+7 (495) 730-77-77"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Веб-сайт
                        </label>
                        <input
                          type="url"
                          value={formData.website || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="https://avilon-bmw.ru"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Время работы
                        </label>
                        <input
                          type="text"
                          value={formData.workingHours || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, workingHours: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Пн-Вс: 09:00-21:00"
                        />
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">Дополнительная информация</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Координаты (широта, долгота)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            step="0.000001"
                            value={formData.coordinates?.[0] || ''}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              coordinates: [parseFloat(e.target.value), prev.coordinates?.[1] || 0]
                            }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="55.7558"
                          />
                          <input
                            type="number"
                            step="0.000001"
                            value={formData.coordinates?.[1] || ''}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              coordinates: [prev.coordinates?.[0] || 0, parseFloat(e.target.value)]
                            }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="37.6176"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Скидка (рубли)
                        </label>
                        <input
                          type="number"
                          value={formData.discount || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, discount: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="500000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Скидка (проценты)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.discountPercent || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, discountPercent: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="15"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Специальное предложение
                        </label>
                        <input
                          type="text"
                          value={formData.specialOffer || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, specialOffer: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Каско в подарок"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Услуги
                        </label>
                        <div className="space-y-2">
                          {availableServices.map(service => (
                            <label key={service} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.services?.includes(service) || false}
                                onChange={() => handleServiceToggle(service)}
                                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm">{service}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                    <button
                      onClick={() => setActiveTab('list')}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={handleSaveDealer}
                      disabled={isLoading || !formData.name || !formData.brand}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Сохранение...</span>
                        </>
                      ) : (
                        <span>{activeTab === 'add' ? 'Добавить дилера' : 'Сохранить изменения'}</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel