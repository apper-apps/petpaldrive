import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'Home' },
    { name: 'My Pets', href: '/pets', icon: 'Heart' },
    { name: 'Schedule', href: '/schedule', icon: 'Calendar' },
    { name: 'Reminders', href: '/reminders', icon: 'Bell' },
  ]

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
<header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-gradient-to-r from-primary to-secondary p-1.5 sm:p-2 rounded-xl">
                <ApperIcon name="Heart" className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-display gradient-text">PetPal</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Pet Care Manager</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
<nav className="hidden md:flex space-x-6 lg:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                      : 'text-gray-600 hover:text-primary hover:bg-primary hover:bg-opacity-10'
                  }`}
                >
                  <ApperIcon name={item.icon} size={16} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

<button
              className="md:hidden p-1.5 rounded-lg text-gray-600 hover:text-primary hover:bg-primary hover:bg-opacity-10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ApperIcon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-t border-gray-200"
>
            <div className="px-3 py-1.5 space-y-0.5">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'text-gray-600 hover:text-primary hover:bg-primary hover:bg-opacity-10'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ApperIcon name={item.icon} size={16} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </header>

{/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout