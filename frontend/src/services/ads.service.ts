import { Ad } from '@/types/ad'

const ADS: Ad[] = [
  {
    id: '1',
    title: 'BMW X5 2017',
    price: '$28,000',
    image: '/images/car-1.jpg',
    location: 'Beirut',
    category: 'cars',
  },
  {
    id: '2',
    title: 'Apartment for Sale in Verdun',
    price: '$150,000',
    image: '/images/apartment-1.jpg',
    location: 'Verdun',
    category: 'apartments',
  },
  {
    id: '3',
    title: 'iPhone 13 Pro Max',
    price: '$900',
    image: '/images/mobile-1.jpg',
    location: 'Tripoli',
    category: 'mobiles',
  },
]

export const fetchHomeAds = (): Promise<Ad[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ADS)
    }, 800)
  })
}
