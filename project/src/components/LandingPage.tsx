import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import InstallPrompt from './InstallPrompt'

const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="gradient-bg text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚗</span>
              </div>
              <h1 className="text-2xl font-bold">CarRecognition</h1>
            </div>
            <Link to="/app" className="btn-secondary">
              Открыть приложение
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Распознавание автомобилей
              <br />
              <span className="text-yellow-300">по фото</span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Сфотографируйте любой автомобиль и мгновенно узнайте его марку, модель и характеристики
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/app" className="btn-primary text-lg px-8 py-4">
                🚀 Попробовать сейчас
              </Link>
              <button className="btn-secondary text-lg px-8 py-4">
                📱 Установить приложение
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Возможности приложения
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center animate-slide-up">
              <div className="text-5xl mb-4">📸</div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800">Быстрое распознавание</h4>
              <p className="text-gray-600">
                Сфотографируйте автомобиль и получите результат за секунды
              </p>
            </div>
            <div className="card p-8 text-center animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="text-5xl mb-4">🎯</div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800">Высокая точность</h4>
              <p className="text-gray-600">
                Определяем марку, модель, год выпуска и технические характеристики
              </p>
            </div>
            <div className="card p-8 text-center animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="text-5xl mb-4">📱</div>
              <h4 className="text-2xl font-bold mb-4 text-gray-800">Работает офлайн</h4>
              <p className="text-gray-600">
                Приложение работает без интернета после установки
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Как это работает
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-bold mb-2">Сфотографируйте</h4>
              <p className="text-gray-600">Наведите камеру на автомобиль</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-bold mb-2">Обработка</h4>
              <p className="text-gray-600">ИИ анализирует изображение</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-bold mb-2">Результат</h4>
              <p className="text-gray-600">Получите полную информацию</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="text-xl font-bold mb-2">Сохранение</h4>
              <p className="text-gray-600">История всех распознаваний</p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-8">
            Установите приложение на свой телефон
          </h3>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Получите быстрый доступ к распознаванию автомобилей прямо с главного экрана
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="text-2xl font-bold mb-4">📱 На телефоне</h4>
              <p className="mb-4">Откройте сайт в браузере и нажмите "Добавить на главный экран"</p>
              <div className="text-sm text-blue-200">
                Safari: Поделиться → На экран "Домой"<br/>
                Chrome: Меню → Установить приложение
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="text-2xl font-bold mb-4">💻 На компьютере</h4>
              <p className="mb-4">В адресной строке появится значок установки</p>
              <div className="text-sm text-blue-200">
                Chrome/Edge: Значок "+" в адресной строке<br/>
                Firefox: Меню → Установить
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-lg">🚗</span>
            </div>
            <h5 className="text-xl font-bold">CarRecognition</h5>
          </div>
          <p className="text-gray-400 mb-6">
            Приложение для распознавания автомобилей по фотографии
          </p>
          <div className="flex justify-center space-x-6">
            <Link to="/app" className="text-blue-400 hover:text-blue-300 transition-colors">
              Приложение
            </Link>
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              Поддержка
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              О проекте
            </a>
          </div>
        </div>
      </footer>

      <InstallPrompt />
    </div>
  )
}

export default LandingPage