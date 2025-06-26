import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  role: 'user' | 'admin' | 'dealer'
  name: string
  dealerId?: string // для дилеров
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAdmin: boolean
  isDealer: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Проверяем сохраненную сессию при загрузке
    const savedUser = localStorage.getItem('carRecognitionUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Симуляция проверки учетных данных
    const adminCredentials = {
      email: 'admin@carrecognition.ru',
      password: 'admin123'
    }

    // Учетные данные дилеров
    const dealerCredentials = [
      {
        email: 'bmw.avilon@dealer.ru',
        password: 'dealer123',
        dealerId: 'bmw-1',
        name: 'BMW Авилон'
      },
      {
        email: 'mercedes.avilon@dealer.ru',
        password: 'dealer123',
        dealerId: 'mercedes-1',
        name: 'Mercedes-Benz Авилон'
      },
      {
        email: 'toyota.kuntsevo@dealer.ru',
        password: 'dealer123',
        dealerId: 'toyota-1',
        name: 'Toyota Центр Кунцево'
      }
    ]

    if (email === adminCredentials.email && password === adminCredentials.password) {
      const adminUser: User = {
        id: 'admin-1',
        email: email,
        role: 'admin',
        name: 'Администратор'
      }
      setUser(adminUser)
      localStorage.setItem('carRecognitionUser', JSON.stringify(adminUser))
      return true
    }

    // Проверяем дилеров
    const dealerMatch = dealerCredentials.find(d => d.email === email && password === 'dealer123')
    if (dealerMatch) {
      const dealerUser: User = {
        id: `dealer-${dealerMatch.dealerId}`,
        email: email,
        role: 'dealer',
        name: dealerMatch.name,
        dealerId: dealerMatch.dealerId
      }
      setUser(dealerUser)
      localStorage.setItem('carRecognitionUser', JSON.stringify(dealerUser))
      return true
    }

    // Для обычных пользователей создаем аккаунт автоматически
    if (email && password) {
      const regularUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        role: 'user',
        name: email.split('@')[0]
      }
      setUser(regularUser)
      localStorage.setItem('carRecognitionUser', JSON.stringify(regularUser))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('carRecognitionUser')
  }

  const isAdmin = user?.role === 'admin'
  const isDealer = user?.role === 'dealer'

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isDealer }}>
      {children}
    </AuthContext.Provider>
  )
}