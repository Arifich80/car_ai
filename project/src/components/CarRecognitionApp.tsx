import React, { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import CameraCapture from './CameraCapture'
import ResultDisplay from './ResultDisplay'
import HistoryList from './HistoryList'
import AdminPanel from './AdminPanel'
import DealerAnalytics from './DealerAnalytics'
import LoginModal from './LoginModal'
import UserProfile from './UserProfile'
import NotificationSystem from './NotificationSystem'

export interface CarRecognitionResult {
  id: string
  timestamp: Date
  image: string
  make: string
  model: string
  year: string
  confidence: number
  details: {
    bodyType: string
    engine: string
    transmission: string
    fuelType: string
  }
}

const CarRecognitionApp: React.FC = () => {
  const { user, login, isAdmin, isDealer } = useAuth()
  const [currentResult, setCurrentResult] = useState<CarRecognitionResult | null>(null)
  const [history, setHistory] = useState<CarRecognitionResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'camera' | 'history'>('camera')
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [showDealerAnalytics, setShowDealerAnalytics] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)

  const handleImageCapture = useCallback(async (imageData: string) => {
    setIsLoading(true)
    
    // Симуляция API запроса для распознавания
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Генерируем случайный результат для демонстрации
    const mockResults = [
      {
        make: 'BMW',
        model: 'X5',
        year: '2020',
        confidence: 0.95,
        details: {
          bodyType: 'SUV',
          engine: '3.0L I6 Turbo',
          transmission: 'Автоматическая',
          fuelType: 'Бензин'
        }
      },
      {
        make: 'Mercedes-Benz',
        model: 'C-Class',
        year: '2019',
        confidence: 0.92,
        details: {
          bodyType: 'Седан',
          engine: '2.0L I4 Turbo',
          transmission: 'Автоматическая',
          fuelType: 'Бензин'
        }
      },
      {
        make: 'Toyota',
        model: 'Camry',
        year: '2021',
        confidence: 0.88,
        details: {
          bodyType: 'Седан',
          engine: '2.5L I4',
          transmission: 'CVT',
          fuelType: 'Гибрид'
        }
      }
    ]
    
    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
    
    const result: CarRecognitionResult = {
      id: Date.now().toString(),
      timestamp: new Date(),
      image: imageData,
      ...randomResult
    }
    
    setCurrentResult(result)
    setHistory(prev => [result, ...prev])
    setIsLoading(false)
  }, [])

  const handleResultClose = useCallback(() => {
    setCurrentResult(null)
  }, [])

  const handleHistoryItemClick = useCallback((result: CarRecognitionResult) => {
    setCurrentResult(result)
    setActiveTab('camera')
  }, [])

  const handleAdminPanelClick = () => {
    if (!user) {
      setShowLoginModal(true)
    } else if (isAdmin) {
      setShowAdminPanel(true)
    } else {
      alert('Доступ запрещен. Только для администраторов.')
    }
  }

  const handleDealerAnalyticsClick = () => {
    if (!user) {
      setShowLoginModal(true)
    } else if (isDealer) {
      setShowDealerAnalytics(true)
    } else {
      alert('Доступ запрещен. Только для дилеров.')
    }
  }

  const handleUserClick = () => {
    if (!user) {
      setShowLoginModal(true)
    } else {
      setShowUserProfile(true)
    }
  }

  const getRoleDisplay = () => {
    if (isAdmin) return { icon: '👑', text: 'Админ', color: 'bg-purple-600 hover:bg-purple-700' }
    if (isDealer) return { icon: '🏢', text: 'Дилер', color: 'bg-green-600 hover:bg-green-700' }
    return { icon: '🔑', text: 'Вход', color: 'bg-gray-200 hover:bg-gray-300 text-gray-700' }
  }

  const roleDisplay = getRoleDisplay()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🚗</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">CarRecognition</h1>
            </Link>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              {user && user.role === 'user' && (
                <NotificationSystem 
                  userId={user.id}
                  onNotificationClick={(notification) => {
                    // Обработка клика по уведомлению
                    console.log('Notification clicked:', notification)
                  }}
                />
              )}

              {/* User Profile */}
              <button
                onClick={handleUserClick}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <span className="text-2xl">👤</span>
                {user && (
                  <span className="hidden sm:block font-medium">
                    {user.name}
                  </span>
                )}
              </button>

              {/* Dealer Analytics - только для дилеров */}
              {isDealer && (
                <button
                  onClick={handleDealerAnalyticsClick}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <span>📊</span>
                  <span className="hidden sm:block">Аналитика</span>
                </button>
              )}

              {/* Admin Panel - только для администраторов */}
              {(isAdmin || !user) && (
                <button
                  onClick={handleAdminPanelClick}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${roleDisplay.color}`}
                >
                  <span>{roleDisplay.icon}</span>
                  <span className="hidden sm:block">{roleDisplay.text}</span>
                </button>
              )}

              <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                ← На главную
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('camera')}
              className={`py-4 px-6 font-medium border-b-2 transition-colors ${
                activeTab === 'camera'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📸 Камера
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-6 font-medium border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 История ({history.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'camera' && (
          <div className="max-w-md mx-auto">
            <CameraCapture
              onImageCapture={handleImageCapture}
              isLoading={isLoading}
            />
            
            {currentResult && (
              <div className="mt-6">
                <ResultDisplay
                  result={currentResult}
                  onClose={handleResultClose}
                  userId={user?.id}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-2xl mx-auto">
            <HistoryList
              history={history}
              onItemClick={handleHistoryItemClick}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      {showAdminPanel && isAdmin && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}

      {showDealerAnalytics && isDealer && (
        <DealerAnalytics onClose={() => setShowDealerAnalytics(false)} />
      )}

      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={login}
        />
      )}

      {showUserProfile && (
        <UserProfile
          isOpen={showUserProfile}
          onClose={() => setShowUserProfile(false)}
        />
      )}
    </div>
  )
}

export default CarRecognitionApp