export interface Dealer {
  id: string
  name: string
  brand: string
  address: string
  phone: string
  website: string
  coordinates: [number, number] // [lat, lng]
  workingHours: string
  services: string[]
  hasModel?: boolean // будет устанавливаться динамически
  discount?: number // скидка в рублях
  discountPercent?: number // скидка в процентах
  specialOffer?: string // специальное предложение
}

export const moscowDealers: Dealer[] = [
  // BMW дилеры
  {
    id: 'bmw-1',
    name: 'BMW Авилон',
    brand: 'BMW',
    address: 'Волгоградский пр-т, 43, корп. 1',
    phone: '+7 (495) 730-77-77',
    website: 'https://avilon-bmw.ru',
    coordinates: [55.7158, 37.6615],
    workingHours: 'Пн-Вс: 09:00-21:00',
    services: ['Продажа новых авто', 'Сервис', 'Запчасти', 'Trade-in']
  },
  {
    id: 'bmw-2',
    name: 'BMW Major',
    brand: 'BMW',
    address: 'Ленинградское ш., 25, корп. 2',
    phone: '+7 (495) 777-99-66',
    website: 'https://major-bmw.ru',
    coordinates: [55.8019, 37.5186],
    workingHours: 'Пн-Вс: 09:00-20:00',
    services: ['Продажа новых авто', 'Сервис', 'Запчасти']
  },
  {
    id: 'bmw-3',
    name: 'BMW Рольф',
    brand: 'BMW',
    address: 'Варшавское ш., 132',
    phone: '+7 (495) 730-11-11',
    website: 'https://rolf-bmw.ru',
    coordinates: [55.6234, 37.6089],
    workingHours: 'Пн-Вс: 08:30-21:00',
    services: ['Продажа новых авто', 'Сервис', 'Запчасти', 'Страхование']
  },

  // Mercedes-Benz дилеры
  {
    id: 'mercedes-1',
    name: 'Mercedes-Benz Авилон',
    brand: 'Mercedes-Benz',
    address: 'Волгоградский пр-т, 43, корп. 3',
    phone: '+7 (495) 730-88-88',
    website: 'https://avilon-mercedes.ru',
    coordinates: [55.7165, 37.6625],
    workingHours: 'Пн-Вс: 09:00-21:00',
    services: ['Продажа новых авто', 'Сервис', 'Запчасти', 'Trade-in']
  },
  {
    id: 'mercedes-2',
    name: 'Mercedes-Benz ГК АЦ',
    brand: 'Mercedes-Benz',
    address: 'Ленинградское ш., 39, стр. 2',
    phone: '+7 (495) 788-44-44',
    website: 'https://ac-mercedes.ru',
    coordinates: [55.8156, 37.5089],
    workingHours: 'Пн-Вс: 09:00-20:00',
    services: ['Продажа новых авто', 'Сервис', 'Запчасти']
  },
  {
    id: 'mercedes-3',
    name: 'Mercedes-Benz Инком',
    brand: 'Mercedes-Benz',
    address: 'МКАД, 47-й км, внешняя сторона',
    phone: '+7 (495) 737-77-77',
    website: 'https://incom-mercedes.ru',
    coordinates: [55.6789, 37.8456],
    workingHours: 'Пн-Вс: 09:00-21:00',
    services: ['Продажа новых авто', 'Сервис', 'Запчасти', 'Лизинг']
  },

  // Toyota дилеры
  {
    id: 'toyota-1',
    name: 'Toyota Центр Кунцево',
    brand: 'Toyota',
    address: 'Рябиновая ул., 28, корп. 3',
    phone: '+7 (495) 781-81-81',
    website: 'https://toyota-kuntsevo.ru',
    coordinates: [55.7234, 37.4123],
    workingHours: 'Пн-Вс: 09:00-21:00',
    services: ['Продажа новых авто', 'Сервис', 'Запчасти', 'Trade-in']
  },
  {
    id: 'toyota-2',
    name: 'Toyota Центр Варшавка',
    brand: 'Toyota',
    address: 'Варшавское ш., 170Г',
    phone: '+7 (495) 745-45-45',
    website: 'https://toyota-varshavka.ru',
    coordinates: [55.5987, 37.6234],
    workingHours: 'Пн-Вс: 09:00-20:00',
    services: ['Продажа новых авто', 'Сервис', 'Запчасти']
  },
  {
    id: 'toyota-3',
    name: 'Toyota Центр Медведково',
    brand: 'Toyota',
    address: 'Заревый пр-д, 12',
    phone: '+7 (495) 788-99-99',
    website: 'https://toyota-medvedkovo.ru',
    coordinates: [55.8756, 37.6543],
    workingHours: 'Пн-Вс: 08:30-21:00',
    services: ['Продажа новых авто', 'Сервис', 'Запчасти', 'Страхование']
  },

  // Audi дилеры
  {
    id: 'audi-1',
    name: 'Audi Центр Варшавка',
    brand: 'Audi',
    address: 'Варшавское ш., 125, стр. 1',
    phone: '+7 (495) 730-55-55',
    website: 'https://audi-varshavka.ru',
    coordinates: [55.6345, 37.6123],
    workingHours: 'Пн-Вс: 09:00-21:00',
    services: ['Продажа новых авто', 'Сервис', 'Запчасти', 'Trade-in']
  },
  {
    id: 'audi-2',
    name: 'Audi Центр Север',
    brand: 'Audi',
    address: 'Дмитровское ш., 163А',
    phone: '+7 (495) 777-33-33',
    website: 'https://audi-sever.ru',
    coordinates: [55.8567, 37.5789],
    workingHours: 'Пн-Вс: 09:00-20:00',
    services: ['Продажа новых авто', 'Сервис', 'Запчасти']
  },

  // Volkswagen дилеры
  {
    id: 'vw-1',
    name: 'Volkswagen Центр Юг',
    brand: 'Volkswagen',
    address: 'Каширское ш., 61, корп. 2',
    phone: '+7 (495) 745-77-77',
    website: 'https://vw-yug.ru',
    coordinates: [55.6123, 37.6789],
    workingHours: 'Пн-Вс: 09:00-21:00',
    services: ['Продажа новых авто', 'Сервис', 'Запчасти', 'Trade-in']
  },

  // Hyundai дилеры
  {
    id: 'hyundai-1',
    name: 'Hyundai Центр Восток',
    brand: 'Hyundai',
    address: 'Рязанский пр-т, 2, стр. 2А',
    phone: '+7 (495) 788-66-66',
    website: 'https://hyundai-vostok.ru',
    coordinates: [55.7456, 37.7234],
    workingHours: 'Пн-Вс: 09:00-20:00',
    services: ['Продажа новых авто', 'Сервис', 'Запчасти']
  },

  // Kia дилеры
  {
    id: 'kia-1',
    name: 'Kia Центр Запад',
    brand: 'Kia',
    address: 'Можайское ш., 165, стр. 1',
    phone: '+7 (495) 777-88-88',
    website: 'https://kia-zapad.ru',
    coordinates: [55.7123, 37.3456],
    workingHours: 'Пн-Вс: 09:00-21:00',
    services: ['Продажа новых авто', 'Сервис', 'Запчасти', 'Trade-in']
  }
]

export const getDealersByBrand = (brand: string): Dealer[] => {
  return moscowDealers.filter(dealer => 
    dealer.brand.toLowerCase() === brand.toLowerCase()
  )
}

export const getDealersWithDiscounts = (brand: string, model: string): Dealer[] => {
  const brandDealers = getDealersByBrand(brand)
  
  // Генерируем случайные скидки для демонстрации
  const dealersWithDiscounts = brandDealers.map(dealer => {
    const hasDiscount = Math.random() > 0.3 // 70% вероятность скидки
    
    if (hasDiscount) {
      const discountAmount = Math.floor(Math.random() * 800000) + 100000 // от 100к до 900к рублей
      const discountPercent = Math.floor(Math.random() * 15) + 5 // от 5% до 20%
      
      const specialOffers = [
        'Трейд-ин с доплатой',
        'Кредит 0.1%',
        'Каско в подарок',
        'Зимние шины в подарок',
        'Расширенная гарантия',
        'Бесплатное ТО на 3 года'
      ]
      
      return {
        ...dealer,
        discount: discountAmount,
        discountPercent: discountPercent,
        specialOffer: specialOffers[Math.floor(Math.random() * specialOffers.length)],
        hasModel: Math.random() > 0.2 // 80% вероятность наличия при скидке
      }
    }
    
    return {
      ...dealer,
      hasModel: Math.random() > 0.5
    }
  })
  
  // Сортируем по размеру скидки (по убыванию)
  return dealersWithDiscounts
    .filter(dealer => dealer.discount)
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
}