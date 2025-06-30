import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding your first item.",
  icon = "Inbox",
  actionLabel = "Add Item",
  onAction,
  showAction = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-64"
    >
      <Card className="text-center max-w-md mx-auto">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name={icon} size={40} className="text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
          
          {showAction && onAction && (
            <Button
              variant="primary"
              onClick={onAction}
              icon="Plus"
              className="w-full"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default Empty