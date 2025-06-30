import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const QuickStats = ({ title, value, icon, color = 'primary', trend }) => {
  const colorClasses = {
    primary: 'from-primary to-secondary',
    accent: 'from-accent to-pink-500',
    success: 'from-success to-green-500',
    warning: 'from-warning to-orange-500',
    info: 'from-info to-blue-500'
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold gradient-text">{value}</p>
          {trend && (
            <div className="flex items-center text-sm">
              <ApperIcon 
                name={trend.direction === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className={`mr-1 ${trend.direction === 'up' ? 'text-success' : 'text-error'}`}
              />
              <span className={trend.direction === 'up' ? 'text-success' : 'text-error'}>
                {trend.value}
              </span>
              <span className="text-gray-500 ml-1">vs last week</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]} text-white`}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
    </Card>
  )
}

export default QuickStats