import Link from 'next/link'
import { Twitter, Facebook, Linkedin, Youtube } from 'lucide-react'

const footerLinks = {
  Product: [
    { name: 'Features', href: '#' },
    { name: 'Pricing', href: '#' },
  ],
  Resources: [
    { name: 'Blog', href: '#' },
    { name: 'User guides', href: '#' },
    { name: 'Webinars', href: '#' },
  ],
  Company: [
    { name: 'About us', href: '#' },
    { name: 'Contact us', href: '#' },
  ],
  'Plans & Pricing': [
    { name: 'Personal', href: '#' },
    { name: 'Start up', href: '#' },
    { name: 'Organization', href: '#' },
  ],
}

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
]

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <select
                className="bg-gray-100 rounded-md px-3 py-1.5 text-sm"
                defaultValue="English"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
              <div className="text-sm text-gray-600">
                © 2024 LearnSphere •{' '}
                <Link href="#" className="hover:text-gray-900">
                  Privacy
                </Link>{' '}
                •{' '}
                <Link href="#" className="hover:text-gray-900">
                  Terms
                </Link>{' '}
                •{' '}
                <Link href="#" className="hover:text-gray-900">
                  Sitemap
                </Link>
              </div>
            </div>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

