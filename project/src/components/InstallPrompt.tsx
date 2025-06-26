import React, { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('Пользователь установил приложение')
    }
    
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="install-prompt">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto border">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-2xl">📱</span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 mb-2">
              Установить приложение?
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Получите быстрый доступ к распознаванию автомобилей
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleInstallClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Установить
              </button>
              <button
                onClick={handleDismiss}
                className="text-gray-500 hover:text-gray-700 px-4 py-2 text-sm font-medium transition-colors"
              >
                Позже
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstallPrompt