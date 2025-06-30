import { motion } from 'framer-motion'
import { format, isPast, isToday } from 'date-fns'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const ReminderCard = ({ reminder, pet, onComplete, onSnooze }) => {
  const reminderDate = new Date(reminder.dateTime)
  const isOverdue = isPast(reminderDate) && !isToday(reminderDate)
  const isTodays = isToday(reminderDate)
  
  const getReminderIcon = (type) => {
    const iconMap = {
      feeding: 'UtensilsCrossed',
      appointment: 'Calendar',
      vaccination: 'Syringe',
      medication: 'Pill'
    }
    return iconMap[type] || 'Bell'
  }
  
  const getReminderColor = (type) => {
    const colorMap = {
      feeding: 'info',
      appointment: 'warning',
      vaccination: 'success',
      medication: 'error'
    }
    return colorMap[type] || 'default'
  }

  return (
    <Card className={`${isOverdue ? 'ring-2 ring-error ring-opacity-50 overdue-pulse' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isOverdue ? 'bg-error bg-opacity-10' : 'bg-primary bg-opacity-10'}`}>
              <ApperIcon 
                name={getReminderIcon(reminder.type)} 
                size={20} 
                className={isOverdue ? 'text-error' : 'text-primary'} 
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
              <p className="text-sm text-gray-600">{pet?.name}</p>
            </div>
            <Badge 
              variant={isOverdue ? 'error' : getReminderColor(reminder.type)}
              className="capitalize"
            >
              {reminder.type}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <ApperIcon name="Clock" size={16} />
              {format(reminderDate, 'h:mm a')}
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Calendar" size={16} />
              {isTodays ? 'Today' : format(reminderDate, 'MMM d')}
            </div>
            {isOverdue && (
              <Badge variant="error" icon="AlertTriangle">
                Overdue
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
        <Button
          variant="primary"
          size="sm"
          icon="Check"
          onClick={() => onComplete(reminder.Id)}
          className="flex-1"
        >
          Complete
        </Button>
        <Button
          variant="outline"
          size="sm"
          icon="Clock"
          onClick={() => onSnooze(reminder.Id)}
        >
          Snooze
        </Button>
      </div>
    </Card>
  )
}

export default ReminderCard