import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import PetCard from '@/components/molecules/PetCard'
import PetForm from '@/components/organisms/PetForm'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import * as petService from '@/services/api/petService'

const Pets = () => {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingPet, setEditingPet] = useState(null)

  const loadPets = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await petService.getAll()
      setPets(data)
    } catch (err) {
      setError('Failed to load pets')
      console.error('Error loading pets:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPets()
  }, [])

  const handleAddPet = () => {
    setEditingPet(null)
    setShowForm(true)
  }

  const handleEditPet = (pet) => {
    setEditingPet(pet)
    setShowForm(true)
  }

  const handleSubmitPet = async (petData) => {
    try {
      if (editingPet) {
        const updatedPet = await petService.update(editingPet.Id, petData)
        setPets(prev => prev.map(p => p.Id === editingPet.Id ? updatedPet : p))
        toast.success('Pet updated successfully!')
      } else {
        const newPet = await petService.create(petData)
        setPets(prev => [...prev, newPet])
        toast.success('Pet added successfully!')
      }
      setShowForm(false)
      setEditingPet(null)
    } catch (err) {
      toast.error('Failed to save pet')
      console.error('Error saving pet:', err)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingPet(null)
  }

  if (loading) return <Loading type="cards" count={6} />
  if (error) return <Error message={error} onRetry={loadPets} />

  if (showForm) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <PetForm
          pet={editingPet}
          onSubmit={handleSubmitPet}
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
          <h1 className="text-3xl font-display gradient-text">My Pets</h1>
          <p className="text-gray-600 mt-2">Manage your furry friends and their information</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={handleAddPet}
        >
          Add Pet
        </Button>
      </div>

      {/* Pets Grid */}
      {pets.length === 0 ? (
        <Empty
          title="No pets yet"
          description="Add your first pet to start tracking their care schedule and health records."
          icon="Heart"
          actionLabel="Add Your First Pet"
          onAction={handleAddPet}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet, index) => (
            <motion.div
              key={pet.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PetCard pet={pet} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default Pets