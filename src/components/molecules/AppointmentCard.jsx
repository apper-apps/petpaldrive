import { format } from 'date-fns'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const AppointmentCard = ({ appointment, pet, onEdit, onDelete }) => {
  const appointmentDate = new Date(appointment.dateTime)
  
  const getAppointmentIcon = (type) => {
    const iconMap = {
      checkup: 'Stethoscope',
      vaccination: 'Syringe',
      surgery: 'Scissors',
      dental: 'Smile',
      emergency: 'AlertTriangle'
    }
    return iconMap[type] || 'Calendar'
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg text-white">
            <ApperIcon name={getAppointmentIcon(appointment.type)} size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{appointment.reason}</h3>
            <p className="text-sm text-gray-600">{pet?.name}</p>
          </div>
        </div>
        <Badge variant={appointment.completed ? 'success' : 'warning'}>
          {appointment.completed ? 'Completed' : 'Scheduled'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <ApperIcon name="Calendar" size={16} />
          {format(appointmentDate, 'MMM d, yyyy')}
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <ApperIcon name="Clock" size={16} />
          {format(appointmentDate, 'h:mm a')}
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <ApperIcon name="User" size={16} />
          {appointment.veterinarian || 'Not specified'}
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <ApperIcon name="MapPin" size={16} />
          Vet Clinic
        </div>
      </div>
      
      {appointment.notes && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{appointment.notes}</p>
        </div>
      )}
      
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <Button
          variant="outline"
          size="sm"
          icon="Edit"
          onClick={() => onEdit(appointment)}
          className="flex-1"
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon="Trash2"
          onClick={() => onDelete(appointment.Id)}
          className="text-error hover:bg-error hover:bg-opacity-10"
        >
          Delete
        </Button>
      </div>
    </Card>
  )
}

export default AppointmentCard