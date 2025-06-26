import React from 'react'
import { CarRecognitionResult } from './CarRecognitionApp'

interface HistoryListProps {
  history: CarRecognitionResult[]
  onItemClick: (result: CarRecognitionResult) => void
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onItemClick }) => {
  if (history.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-2xl font-bold mb-2 text-gray-800">История пуста</h3>
        <p className="text-gray-600">
          Распознанные автомобили будут появляться здесь
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        История распознаваний ({history.length})
      </h2>
      
      {history.map((result) => (
        <div
          key={result.id}
          onClick={() => onItemClick(result)}
          className="card p-4 cursor-pointer hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center space-x-4">
            <img
              src={result.image}
              alt={`${result.make} ${result.model}`}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">
                {result.make} {result.model}
              </h4>
              <p className="text-sm text-gray-600">
                {result.year} • {result.details.bodyType}
              </p>
              <p className="text-xs text-gray-500">
                {result.timestamp.toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-green-600">
                {Math.round(result.confidence * 100)}%
              </div>
              <div className="text-xs text-gray-500">точность</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default HistoryList