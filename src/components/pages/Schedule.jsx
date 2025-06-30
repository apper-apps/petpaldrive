import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth } from 'date-fns'
import AppointmentCard from '@/components/molecules/AppointmentCard'
import AppointmentForm from '@/components/organisms/AppointmentForm'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import * as appointmentService from '@/services/api/appointmentService'
import * as petService from '@/services/api/petService'

const Schedule = () => {
  const [appointments, setAppointments] = useState([])
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('list') // 'list' or 'calendar'

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [appointmentsData, petsData] = await Promise.all([
        appointmentService.getAll(),
        petService.getAll()
      ])
      setAppointments(appointmentsData)
      setPets(petsData)
    } catch (err) {
      setError('Failed to load schedule data')
      console.error('Error loading schedule:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddAppointment = () => {
    setEditingAppointment(null)
    setShowForm(true)
  }

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment)
    setShowForm(true)
  }

  const handleSubmitAppointment = async (appointmentData) => {
    try {
      if (editingAppointment) {
        const updated = await appointmentService.update(editingAppointment.Id, appointmentData)
        setAppointments(prev => prev.map(a => a.Id === editingAppointment.Id ? updated : a))
        toast.success('Appointment updated successfully!')
      } else {
        const newAppointment = await appointmentService.create(appointmentData)
        setAppointments(prev => [...prev, newAppointment])
        toast.success('Appointment scheduled successfully!')
      }
      setShowForm(false)
      setEditingAppointment(null)
    } catch (err) {
      toast.error('Failed to save appointment')
      console.error('Error saving appointment:', err)
    }
  }

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentService.deleteItem(appointmentId)
        setAppointments(prev => prev.filter(a => a.Id !== appointmentId))
        toast.success('Appointment deleted successfully!')
      } catch (err) {
        toast.error('Failed to delete appointment')
        console.error('Error deleting appointment:', err)
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingAppointment(null)
  }

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.dateTime)
      return format(aptDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    })
  }

  const renderCalendarView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon="ChevronLeft"
              onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
            />
            <Button
              variant="ghost"
              size="sm"
              icon="ChevronRight"
              onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
            />
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map(day => {
            const dayAppointments = getAppointmentsForDate(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            
            return (
              <div
                key={day.toISOString()}
                className={`min-h-24 p-2 border rounded-lg ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isToday(day) ? 'ring-2 ring-primary' : ''}`}
              >
                <div className={`text-sm font-medium ${
                  isToday(day) ? 'text-primary' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1 mt-1">
                  {dayAppointments.slice(0, 2).map(apt => {
                    const pet = pets.find(p => p.Id === apt.petId)
                    return (
                      <div
                        key={apt.Id}
                        className="text-xs p-1 bg-primary bg-opacity-10 text-primary rounded truncate"
                        title={`${apt.reason} - ${pet?.name}`}
                      >
                        {format(new Date(apt.dateTime), 'h:mm a')} {pet?.name}
                      </div>
                    )
                  })}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayAppointments.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    )
  }

  if (loading) return <Loading type="cards" count={4} />
  if (error) return <Error message={error} onRetry={loadData} />

  if (showForm) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AppointmentForm
          appointment={editingAppointment}
          pets={pets}
          onSubmit={handleSubmitAppointment}
          onCancel={handleCancel}
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display gradient-text">Schedule</h1>
          <p className="text-gray-600 mt-2">Manage vet appointments and important dates</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              <ApperIcon name="List" size={16} className="mr-1 inline" />
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'calendar'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              <ApperIcon name="Calendar" size={16} className="mr-1 inline" />
              Calendar
            </button>
          </div>
          <Button
            variant="primary"
            icon="Plus"
            onClick={handleAddAppointment}
          >
            Schedule Appointment
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'calendar' ? (
        renderCalendarView()
      ) : (
        <div>
          {appointments.length === 0 ? (
            <Empty
              title="No appointments scheduled"
              description="Schedule your first vet appointment to keep track of your pet's health."
              icon="Calendar"
              actionLabel="Schedule Appointment"
              onAction={handleAddAppointment}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {appointments
                .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
                .map((appointment, index) => {
                  const pet = pets.find(p => p.Id === appointment.petId)
                  return (
                    <motion.div
                      key={appointment.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AppointmentCard
                        appointment={appointment}
                        pet={pet}
                        onEdit={handleEditAppointment}
                        onDelete={handleDeleteAppointment}
                      />
                    </motion.div>
                  )
                })}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default Schedule