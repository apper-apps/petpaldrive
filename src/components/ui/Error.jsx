import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  message = "Something went wrong", 
  description = "We encountered an error while loading your data. Please try again.",
  onRetry,
  showRetry = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center min-h-64"
    >
      <Card className="text-center max-w-md mx-auto">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-error to-pink-500 rounded-full flex items-center justify-center">
              <ApperIcon name="AlertTriangle" size={32} className="text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">{message}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
          
          {showRetry && onRetry && (
            <Button
              variant="primary"
              onClick={onRetry}
              icon="RefreshCw"
              className="w-full"
            >
              Try Again
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default Error