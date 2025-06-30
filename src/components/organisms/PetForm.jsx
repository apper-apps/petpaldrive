import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const PetForm = ({ pet, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    birthDate: '',
    photoUrl: '',
    notes: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '',
        type: pet.type || '',
        breed: pet.breed || '',
        birthDate: pet.birthDate || '',
        photoUrl: pet.photoUrl || '',
        notes: pet.notes || ''
      })
    }
  }, [pet])

  const petTypes = [
    { value: 'dog', label: 'Dog', icon: 'Dog' },
    { value: 'cat', label: 'Cat', icon: 'Cat' },
    { value: 'bird', label: 'Bird', icon: 'Bird' },
    { value: 'fish', label: 'Fish', icon: 'Fish' },
    { value: 'rabbit', label: 'Rabbit', icon: 'Rabbit' },
    { value: 'hamster', label: 'Hamster', icon: 'Mouse' },
    { value: 'other', label: 'Other', icon: 'Heart' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Basic validation
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Pet name is required'
    if (!formData.type) newErrors.type = 'Pet type is required'
    
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
            {pet ? 'Edit Pet' : 'Add New Pet'}
          </h2>
          <p className="text-gray-600 mt-2">
            {pet ? 'Update your pet\'s information' : 'Add a new furry friend to your family'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Pet Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              required
              placeholder="Enter your pet's name"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Pet Type <span className="text-accent ml-1">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {petTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleChange('type', type.value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-1 ${
                      formData.type === type.value
                        ? 'border-primary bg-primary bg-opacity-10 text-primary'
                        : 'border-gray-200 hover:border-primary hover:bg-primary hover:bg-opacity-5'
                    }`}
                  >
                    <ApperIcon name={type.icon} size={20} />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
              {errors.type && <p className="text-sm text-error">{errors.type}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Breed"
              value={formData.breed}
              onChange={(e) => handleChange('breed', e.target.value)}
              placeholder="Enter breed (optional)"
            />

            <Input
              label="Birth Date"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
            />
          </div>

          <Input
            label="Photo URL"
            value={formData.photoUrl}
            onChange={(e) => handleChange('photoUrl', e.target.value)}
            placeholder="Enter photo URL (optional)"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any additional notes about your pet..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              icon="Save"
              className="flex-1"
            >
              {pet ? 'Update Pet' : 'Add Pet'}
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

export default PetForm