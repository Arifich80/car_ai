import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { moscowDealers } from '../data/dealersData'

export interface AnalyticsEvent {
  id: string
  dealerId: string
  eventType: 'call' | 'website_visit'
  carBrand: string
  carModel: string
  timestamp: Date
  userId?: string
}

interface DealerAnalyticsProps {
  onClose: () => void
}

const DealerAnalytics: React.FC<DealerAnalyticsProps> = ({ onClose }) => {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsEvent[]>([])
  const [filteredAnalytics, setFilteredAnalytics] = useState<AnalyticsEvent[]>([])
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('week')
  const [modelFilter, setModelFilter] = useState<string>('')
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'call' | 'website_visit'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'model' | 'type'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const dealer = moscowDealers.find(d => d.id === user?.dealerId)

  useEffect(() => {
    // Загружаем аналитику для текущего дилера
    const allAnalytics = getAnalyticsData()
    const dealerAnalytics = allAnalytics.filter(event => event.dealerId === user?.dealerId)
    setAnalytics(dealerAnalytics)
  }, [user?.dealerId])

  useEffect(() => {
    // Применяем фильтры
    let filtered = [...analytics]

    // Фильтр по дате
    const now = new Date()
    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.timestamp)
          return eventDate.toDateString() === now.toDateString()
        })
        break
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(event => new Date(event.timestamp) >= weekAgo)
        break
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(event => new Date(event.timestamp) >= monthAgo)
        break
    }

    // Фильтр по модели
    if (modelFilter) {
      filtered = filtered.filter(event => 
        event.carModel.toLowerCase().includes(modelFilter.toLowerCase()) ||
        event.carBrand.toLowerCase().includes(modelFilter.toLowerCase())
      )
    }

    // Фильтр по типу события
    if (eventTypeFilter !== 'all') {
      filtered = filtered.filter(event => event.eventType === eventTypeFilter)
    }

    // Сортировка
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          break
        case 'model':
          comparison = `${a.carBrand} ${a.carModel}`.localeCompare(`${b.carBrand} ${b.carModel}`)
          break
        case 'type':
          comparison = a.eventType.localeCompare(b.eventType)
          break
      }

      return sortOrder === 'desc' ? -comparison : comparison
    })

    setFilteredAnalytics(filtered)
  }, [analytics, dateFilter, modelFilter, eventTypeFilter, sortBy, sortOrder])

  const getAnalyticsData = (): AnalyticsEvent[] => {
    const saved = localStorage.getItem('dealerAnalytics')
    return saved ? JSON.parse(saved) : []
  }

  const getStatistics = () => {
    const totalEvents = filteredAnalytics.length
    const calls = filteredAnalytics.filter(e => e.eventType === 'call').length
    const websiteVisits = filteredAnalytics.filter(e => e.eventType === 'website_visit').length

    // Группировка по моделям
    const modelStats = filteredAnalytics.reduce((acc, event) => {
      const key = `${event.carBrand} ${event.carModel}`
      if (!acc[key]) {
        acc[key] = { calls: 0, websiteVisits: 0, total: 0 }
      }
      if (event.eventType === 'call') acc[key].calls++
      if (event.eventType === 'website_visit') acc[key].websiteVisits++
      acc[key].total++
      return acc
    }, {} as Record<string, { calls: number; websiteVisits: number; total: number }>)

    // Топ-5 моделей
    const topModels = Object.entries(modelStats)
      .sort(([,a], [,b]) => b.total - a.total)
      .slice(0, 5)

    return {
      totalEvents,
      calls,
      websiteVisits,
      modelStats,
      topModels
    }
  }

  const stats = getStatistics()

  if (!dealer) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Ошибка доступа</h3>
          <p className="text-gray-600 mb-6">Дилер не найден</p>
          <button onClick={onClose} className="btn-primary">Закрыть</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl h-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">📊 Аналитика дилера</h1>
              <p className="text-green-100">{dealer.name}</p>
              <p className="text-sm text-green-200">{dealer.address}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-3xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.totalEvents}</div>
              <div className="text-blue-800 font-medium">Всего событий</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{stats.calls}</div>
              <div className="text-green-800 font-medium">Звонков</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.websiteVisits}</div>
              <div className="text-purple-800 font-medium">Переходов на сайт</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">
                {stats.calls > 0 ? Math.round((stats.websiteVisits / stats.calls) * 100) : 0}%
              </div>
              <div className="text-orange-800 font-medium">Конверсия</div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Период</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Сегодня</option>
                <option value="week">Неделя</option>
                <option value="month">Месяц</option>
                <option value="all">Все время</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Модель</label>
              <input
                type="text"
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
                placeholder="Поиск по модели..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тип события</label>
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Все</option>
                <option value="call">Звонки</option>
                <option value="website_visit">Переходы</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Сортировка</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">По дате</option>
                <option value="model">По модели</option>
                <option value="type">По типу</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Порядок</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">По убыванию</option>
                <option value="asc">По возрастанию</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Analytics Table */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="text-lg font-semibold">
                  События ({filteredAnalytics.length})
                </h3>
              </div>
              
              {filteredAnalytics.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    Нет данных
                  </h4>
                  <p className="text-gray-600">
                    События будут отображаться здесь после взаимодействия пользователей
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Дата и время
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Автомобиль
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Действие
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Пользователь
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAnalytics.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(event.timestamp).toLocaleDateString('ru-RU')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(event.timestamp).toLocaleTimeString('ru-RU')}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {event.carBrand} {event.carModel}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              event.eventType === 'call'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {event.eventType === 'call' ? '📞 Звонок' : '🌐 Переход на сайт'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {event.userId || 'Анонимный'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Top Models Sidebar */}
          <div className="w-80 border-l bg-gray-50 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">🏆 Топ моделей</h3>
            <div className="space-y-3">
              {stats.topModels.map(([model, data], index) => (
                <div key={model} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium text-sm">{model}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800">{data.total}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-green-50 rounded px-2 py-1">
                      <span className="text-green-700">📞 {data.calls}</span>
                    </div>
                    <div className="bg-blue-50 rounded px-2 py-1">
                      <span className="text-blue-700">🌐 {data.websiteVisits}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {stats.topModels.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📈</div>
                <p className="text-gray-500 text-sm">
                  Статистика по моделям появится после первых событий
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DealerAnalytics