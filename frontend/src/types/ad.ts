export interface Ad {
  id: string
  title: string
  price: string
  image: string
  location: string
  category: 'cars' | 'apartments' | 'mobiles'
}
