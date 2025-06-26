import React, { useRef, useState, useCallback } from 'react'

interface CameraCaptureProps {
  onImageCapture: (imageData: string) => void
  isLoading: boolean
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        onImageCapture(imageData)
      }
      reader.readAsDataURL(file)
    }
  }, [onImageCapture])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleCameraClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  if (isLoading) {
    return (
      <div className="card p-8 text-center">
        <div className="loading-spinner mb-4"></div>
        <h3 className="text-xl font-semibold mb-2">Распознаем автомобиль...</h3>
        <p className="text-gray-600">Это займет несколько секунд</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Camera Button */}
      <div className="card p-8 text-center">
        <div className="camera-container mb-6">
          <div className="w-64 h-48 bg-gray-100 rounded-lg mx-auto flex items-center justify-center relative overflow-hidden">
            <div className="camera-overlay"></div>
            <div className="text-6xl text-gray-400">📷</div>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold mb-4 text-gray-800">
          Сфотографируйте автомобиль
        </h3>
        <p className="text-gray-600 mb-6">
          Наведите камеру на автомобиль для распознавания марки и модели
        </p>
        
        <button
          onClick={handleCameraClick}
          className="btn-primary w-full text-lg"
          disabled={isLoading}
        >
          📸 Сделать фото
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Drag & Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`card p-8 text-center border-2 border-dashed transition-all duration-200 ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="text-4xl mb-4">📁</div>
        <h4 className="text-lg font-semibold mb-2">Или загрузите фото</h4>
        <p className="text-gray-600 text-sm">
          Перетащите изображение сюда или нажмите для выбора файла
        </p>
        <button
          onClick={handleCameraClick}
          className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          Выбрать файл
        </button>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">💡 Советы для лучшего распознавания:</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Фотографируйте автомобиль целиком</li>
          <li>• Убедитесь в хорошем освещении</li>
          <li>• Избегайте размытых изображений</li>
          <li>• Снимайте под углом 45° для лучшего результата</li>
        </ul>
      </div>
    </div>
  )
}

export default CameraCapture