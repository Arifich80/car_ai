import { AnalyticsEvent } from '../components/DealerAnalytics'

interface TrackEventParams {
  dealerId: string
  eventType: 'call' | 'website_visit'
  carBrand: string
  carModel: string
  userId?: string
}

export const trackAnalyticsEvent = (params: TrackEventParams) => {
  const event: AnalyticsEvent = {
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    dealerId: params.dealerId,
    eventType: params.eventType,
    carBrand: params.carBrand,
    carModel: params.carModel,
    timestamp: new Date(),
    userId: params.userId
  }

  // Получаем существующие события
  const existingEvents = getAnalyticsEvents()
  
  // Добавляем новое событие
  const updatedEvents = [event, ...existingEvents].slice(0, 1000) // максимум 1000 событий
  
  // Сохраняем в localStorage
  localStorage.setItem('dealerAnalytics', JSON.stringify(updatedEvents))
  
  console.log('Analytics event tracked:', event)
}

export const getAnalyticsEvents = (): AnalyticsEvent[] => {
  const saved = localStorage.getItem('dealerAnalytics')
  return saved ? JSON.parse(saved) : []
}

export const getAnalyticsForDealer = (dealerId: string): AnalyticsEvent[] => {
  return getAnalyticsEvents().filter(event => event.dealerId === dealerId)
}

export const generateMockAnalyticsData = () => {
  const dealers = ['bmw-1', 'mercedes-1', 'toyota-1', 'audi-1', 'vw-1']
  const brands = ['BMW', 'Mercedes-Benz', 'Toyota', 'Audi', 'Volkswagen']
  const models = ['X5', 'C-Class', 'Camry', 'A4', 'Golf']
  const eventTypes: ('call' | 'website_visit')[] = ['call', 'website_visit']
  
  const mockEvents: AnalyticsEvent[] = []
  
  // Генерируем 100 случайных событий за последние 30 дней
  for (let i = 0; i < 100; i++) {
    const randomDate = new Date()
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30))
    
    const event: AnalyticsEvent = {
      id: `mock_${i}_${Date.now()}`,
      dealerId: dealers[Math.floor(Math.random() * dealers.length)],
      eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      carBrand: brands[Math.floor(Math.random() * brands.length)],
      carModel: models[Math.floor(Math.random() * models.length)],
      timestamp: randomDate,
      userId: Math.random() > 0.3 ? `user_${Math.floor(Math.random() * 1000)}` : undefined
    }
    
    mockEvents.push(event)
  }
  
  // Сохраняем моковые данные
  localStorage.setItem('dealerAnalytics', JSON.stringify(mockEvents))
  
  return mockEvents
}

// Инициализируем моковые данные при первом запуске
if (!localStorage.getItem('dealerAnalytics')) {
  generateMockAnalyticsData()
}