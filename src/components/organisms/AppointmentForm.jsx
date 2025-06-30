import { useState, useEffect } from 'react'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const AppointmentForm = ({ appointment, pets, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    petId: '',
    type: '',
    dateTime: '',
    veterinarian: '',
    reason: '',
    notes: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (appointment) {
      setFormData({
        petId: appointment.petId || '',
        type: appointment.type || '',
        dateTime: appointment.dateTime || '',
        veterinarian: appointment.veterinarian || '',
        reason: appointment.reason || '',
        notes: appointment.notes || ''
      })
    }
  }, [appointment])

  const appointmentTypes = [
    { value: 'checkup', label: 'Checkup', icon: 'Stethoscope' },
    { value: 'vaccination', label: 'Vaccination', icon: 'Syringe' },
    { value: 'surgery', label: 'Surgery', icon: 'Scissors' },
    { value: 'dental', label: 'Dental', icon: 'Smile' },
    { value: 'emergency', label: 'Emergency', icon: 'AlertTriangle' },
    { value: 'other', label: 'Other', icon: 'Calendar' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const newErrors = {}
    if (!formData.petId) newErrors.petId = 'Please select a pet'
    if (!formData.type) newErrors.type = 'Please select appointment type'
    if (!formData.dateTime) newErrors.dateTime = 'Date and time are required'
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required'
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      try {
        await onSubmit(formData)
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    }
    
    setIsSubmitting(false)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold gradient-text">
            {appointment ? 'Edit Appointment' : 'Schedule Appointment'}
          </h2>
          <p className="text-gray-600 mt-2">
            {appointment ? 'Update appointment details' : 'Schedule a new vet appointment'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Pet <span className="text-accent ml-1">*</span>
              </label>
              <select
                value={formData.petId}
                onChange={(e) => handleChange('petId', e.target.value)}
                className={`input-field ${errors.petId ? 'border-error focus:ring-error' : ''}`}
              >
                <option value="">Choose a pet</option>
                {pets.map((pet) => (
                  <option key={pet.Id} value={pet.Id}>
                    {pet.name} ({pet.type})
                  </option>
                ))}
              </select>
              {errors.petId && <p className="text-sm text-error">{errors.petId}</p>}
            </div>

            <Input
              label="Date & Time"
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => handleChange('dateTime', e.target.value)}
              error={errors.dateTime}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Appointment Type <span className="text-accent ml-1">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {appointmentTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleChange('type', type.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                    formData.type === type.value
                      ? 'border-primary bg-primary bg-opacity-10 text-primary'
                      : 'border-gray-200 hover:border-primary hover:bg-primary hover:bg-opacity-5'
                  }`}
                >
                  <ApperIcon name={type.icon} size={20} />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>
            {errors.type && <p className="text-sm text-error">{errors.type}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Veterinarian"
              value={formData.veterinarian}
              onChange={(e) => handleChange('veterinarian', e.target.value)}
              placeholder="Dr. Smith"
            />

            <Input
              label="Reason"
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              error={errors.reason}
              required
              placeholder="Annual checkup, vaccination, etc."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any additional notes or instructions..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              icon="Calendar"
              className="flex-1"
            >
              {appointment ? 'Update Appointment' : 'Schedule Appointment'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              icon="X"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}

export default AppointmentForm