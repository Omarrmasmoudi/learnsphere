'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SphereBackground } from '../../components/sphere-background'
import Link from 'next/link'


export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [age,setAge] = useState('')
  const [location, setLocation] = useState('')
  const [countries] = useState<string[]>([
    "United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "India", "China", "Japan", "Brazil", "South Africa", "Egypt", "Saudi Arabia", "Turkey", "Russia", "Italy", "Spain", "Mexico", "Argentina", "Nigeria", "Kenya", "South Korea", "Indonesia", "Pakistan", "Bangladesh", "Vietnam", "Philippines", "Thailand", "Malaysia", "Singapore", "New Zealand", "Sweden", "Norway", "Denmark", "Finland", "Poland", "Netherlands", "Belgium", "Switzerland", "Austria", "Portugal", "Greece", "Ireland", "Czech Republic", "Hungary", "Romania", "Ukraine", "Chile", "Colombia", "Peru", "Venezuela", "Morocco", "Algeria", "Tunisia", "Israel", "UAE", "Qatar", "Kuwait", "Oman", "Jordan", "Lebanon", "Iraq", "Iran", "Afghanistan", "Syria", "Yemen", "Sudan", "Ethiopia", "Tanzania", "Uganda", "Ghana", "Ivory Coast", "Cameroon", "Senegal", "Angola", "Mozambique", "Zimbabwe", "Zambia", "Botswana", "Namibia", "Madagascar", "Mali", "Burkina Faso", "Niger", "Guinea", "Rwanda", "Burundi", "Benin", "Chad", "Somalia", "Libya", "Congo", "DR Congo", "Central African Republic", "Gabon", "Equatorial Guinea", "Sierra Leone", "Liberia", "Togo", "Eritrea", "Mauritania", "Gambia", "Lesotho", "Eswatini", "Malawi", "Cape Verde", "Seychelles", "Comoros", "Sao Tome and Principe"
  ])
  const [interests, setInterests] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()



  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    const requestData = { email, password, name, age: Number(age), location, interests }
    console.log('Sending data:', requestData)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          name, 
          age: Number(age), 
          location, 
          interests: interests || "General" }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Registration successful!')
        router.push('/login')
      } else {
        setError(data.error)
      }
    } catch (_err) {
      setError('An unexpected error occurred.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(139,92,246,0.05)_25%,rgba(139,92,246,0.05)_50%,transparent_50%,transparent_75%,rgba(139,92,246,0.05)_75%)] bg-[length:24px_24px] pointer-events-none" />
      <SphereBackground />

      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors"
        aria-label="Go back to home"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Sign-Up Card */}
      <Card className="w-full max-w-md bg-gray-800/90 backdrop-blur-md shadow-lg rounded-lg relative">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-white">Sign Up</CardTitle>
          <p className="text-sm text-gray-400">Create your account to get started</p>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
       
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

      
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white pr-10 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="age" className='block text-sm font-medium text-gray-300 mb-1'>
                Age
              </label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1"></label>
              <select 
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500 w-full p-2 rounded-lg"
              >
                <option value="" disabled>
                  Select your country
                </option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-gray-300 mb-1">
                Interests
              </label>
              <Input
                id="interests"
                type="text"
                placeholder="Enter your interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Sign Up
            </Button>

            
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
          </form>
          
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-500 hover:underline">
              Log in
            </Link>
          </p>
          
        </CardContent>
      </Card>
    </div>
  )
}