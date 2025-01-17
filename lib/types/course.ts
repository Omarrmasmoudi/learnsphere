export interface Course {
  id: string
  title: string
  instructor: string
  price: number
  image: string
  category: string
  level: 'Basic' | 'Mid-level' | 'Advanced'
  duration: '3-6 months' | '6-12 months'
  priceRange: '$40-$100' | '$100+' | '$150'
}

