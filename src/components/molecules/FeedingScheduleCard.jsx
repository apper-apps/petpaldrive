import { format } from 'date-fns'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const FeedingScheduleCard = ({ schedule, pet, onToggle, onEdit, onDelete }) => {
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return format(date, 'h:mm a')
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-gradient-to-r from-info to-blue-500 rounded-lg text-white">
            <ApperIcon name="UtensilsCrossed" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Feeding Time</h3>
            <p className="text-sm text-gray-600">{pet?.name}</p>
          </div>
        </div>
        <Badge variant={schedule.enabled ? 'success' : 'default'}>
          {schedule.enabled ? 'Active' : 'Disabled'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <ApperIcon name="Clock" size={16} />
          {formatTime(schedule.time)}
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <ApperIcon name="Scale" size={16} />
          {schedule.amount || 'Not specified'}
        </div>
      </div>
      
      {schedule.notes && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{schedule.notes}</p>
        </div>
      )}
      
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <Button
          variant={schedule.enabled ? 'outline' : 'primary'}
          size="sm"
          icon={schedule.enabled ? 'Pause' : 'Play'}
          onClick={() => onToggle(schedule.Id)}
          className="flex-1"
        >
          {schedule.enabled ? 'Disable' : 'Enable'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon="Edit"
          onClick={() => onEdit(schedule)}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon="Trash2"
          onClick={() => onDelete(schedule.Id)}
          className="text-error hover:bg-error hover:bg-opacity-10"
        >
          Delete
        </Button>
      </div>
    </Card>
  )
}

export default FeedingScheduleCard