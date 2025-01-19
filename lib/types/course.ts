export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  image?: string;
  category?: string;
  duration?: string;
  level?: string;
  priceRange?: "$40-$100" | "$100+";
}