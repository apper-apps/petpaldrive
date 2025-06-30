import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const PetCard = ({ pet }) => {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate(`/pets/${pet.Id}`)
  }

  const getAgeText = (birthDate) => {
    if (!birthDate) return 'Unknown age'
    const today = new Date()
    const birth = new Date(birthDate)
    const years = today.getFullYear() - birth.getFullYear()
    const months = today.getMonth() - birth.getMonth()
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} old`
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''} old`
    } else {
      return 'Less than 1 month old'
    }
  }

  const getPetIcon = (type) => {
    const iconMap = {
      dog: 'Dog',
      cat: 'Cat',
      bird: 'Bird',
      fish: 'Fish',
      rabbit: 'Rabbit',
      hamster: 'Mouse'
    }
    return iconMap[type?.toLowerCase()] || 'Heart'
  }

  return (
    <Card hover onClick={handleClick} className="relative overflow-hidden">
      <div className="absolute top-4 right-4">
        <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-full text-white">
          <ApperIcon name={getPetIcon(pet.type)} size={20} />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-display text-xl">
            {pet.photoUrl ? (
              <img 
                src={pet.photoUrl} 
                alt={pet.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              pet.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{pet.name}</h3>
            <p className="text-gray-600">{pet.breed || pet.type}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Calendar" size={16} className="mr-2" />
            {getAgeText(pet.birthDate)}
          </div>
          
          {pet.notes && (
            <div className="flex items-start text-sm text-gray-600">
              <ApperIcon name="FileText" size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <p className="line-clamp-2">{pet.notes}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <Badge variant="primary" icon="Clock">
            Next feeding
          </Badge>
          <span className="text-sm text-gray-500">2 hours</span>
        </div>
      </div>
    </Card>
  )
}

export default PetCard