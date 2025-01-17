import { Course } from '@/lib/types/course'

export const courses: Course[] = [
  {
    id: '1',
    title: 'Advanced Logo Design Trainer Of Apple',
    instructor: 'Payton Hensley',
    price: 52,
    image: '/placeholder.svg?height=200&width=300',
    category: 'Logo Design',
    level: 'Advanced',
    duration: '3-6 months',
    priceRange: '$40-$100'
  },
  {
    id: '2',
    title: 'Sustainable Course Design Trainer of Google',
    instructor: 'Lindsay Marsh',
    price: 80,
    image: '/placeholder.svg?height=200&width=300',
    category: 'Course Design',
    level: 'Mid-level',
    duration: '6-12 months',
    priceRange: '$40-$100'
  },
  {
    id: '3',
    title: 'Brand Identity Design Trainer Of Meta',
    instructor: 'Carmen King',
    price: 95,
    image: '/placeholder.svg?height=200&width=300',
    category: 'Brand Identity',
    level: 'Basic',
    duration: '3-6 months',
    priceRange: '$40-$100'
  },
  {
    id: '4',
    title: 'Data Science',
    instructor: 'Payton Hensley',
    price: 65,
    image: '/placeholder.svg?height=200&width=300',
    category: 'Data Science',
    level: 'Mid-level',
    duration: '6-12 months',
    priceRange: '$40-$100'
  },
  {
    id: '5',
    title: 'Advanced UI Design Mastery in Figma',
    instructor: 'Luz Mooney',
    price: 120,
    image: '/placeholder.svg?height=200&width=300',
    category: 'UI Design',
    level: 'Advanced',
    duration: '6-12 months',
    priceRange: '$100+'
  },
  {
    id: '6',
    title: 'Motion Graphics in Adobe After Effects',
    instructor: 'Urijah Rios',
    price: 110,
    image: '/placeholder.svg?height=200&width=300',
    category: 'Motion Graphics',
    level: 'Advanced',
    duration: '6-12 months',
    priceRange: '$100+'
  }
]

