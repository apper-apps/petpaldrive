import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { isToday, isPast, isFuture } from 'date-fns'
import ReminderCard from '@/components/molecules/ReminderCard'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import * as reminderService from '@/services/api/reminderService'
import * as petService from '@/services/api/petService'

const Reminders = () => {
  const [reminders, setReminders] = useState([])
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all') // 'all', 'today', 'overdue', 'upcoming'

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [remindersData, petsData] = await Promise.all([
        reminderService.getAll(),
        petService.getAll()
      ])
      setReminders(remindersData)
      setPets(petsData)
    } catch (err) {
      setError('Failed to load reminders')
      console.error('Error loading reminders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCompleteReminder = async (reminderId) => {
    try {
      await reminderService.update(reminderId, { completed: true })
      setReminders(prev => prev.filter(r => r.Id !== reminderId))
      toast.success('Reminder completed!')
    } catch (err) {
      toast.error('Failed to complete reminder')
    }
  }

  const handleSnoozeReminder = async (reminderId) => {
    try {
      const snoozeUntil = new Date()
      snoozeUntil.setHours(snoozeUntil.getHours() + 1)
      
      await reminderService.update(reminderId, { 
        snoozedUntil: snoozeUntil.toISOString() 
      })
      
      setReminders(prev => 
        prev.map(r => 
          r.Id === reminderId 
            ? { ...r, snoozedUntil: snoozeUntil.toISOString() }
            : r
        )
      )
      toast.success('Reminder snoozed for 1 hour')
    } catch (err) {
      toast.error('Failed to snooze reminder')
    }
  }

  const getFilteredReminders = () => {
    let filtered = reminders.filter(r => !r.completed)
    
    switch (filter) {
      case 'today':
        filtered = filtered.filter(r => isToday(new Date(r.dateTime)))
        break
      case 'overdue':
        filtered = filtered.filter(r => 
          isPast(new Date(r.dateTime)) && !isToday(new Date(r.dateTime))
        )
        break
      case 'upcoming':
        filtered = filtered.filter(r => isFuture(new Date(r.dateTime)))
        break
      default:
        // 'all' - no additional filtering
        break
    }
    
    return filtered.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
  }

  const getCounts = () => {
    const activeReminders = reminders.filter(r => !r.completed)
    return {
      all: activeReminders.length,
      today: activeReminders.filter(r => isToday(new Date(r.dateTime))).length,
      overdue: activeReminders.filter(r => 
        isPast(new Date(r.dateTime)) && !isToday(new Date(r.dateTime))
      ).length,
      upcoming: activeReminders.filter(r => isFuture(new Date(r.dateTime))).length
    }
  }

  const filterOptions = [
    { key: 'all', label: 'All', icon: 'List' },
    { key: 'today', label: 'Today', icon: 'Calendar' },
    { key: 'overdue', label: 'Overdue', icon: 'AlertTriangle' },
    { key: 'upcoming', label: 'Upcoming', icon: 'Clock' }
  ]

  if (loading) return <Loading type="list" count={6} />
  if (error) return <Error message={error} onRetry={loadData} />

  const filteredReminders = getFilteredReminders()
  const counts = getCounts()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display gradient-text">Reminders</h1>
          <p className="text-gray-600 mt-2">Stay on top of your pet care tasks</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon="RefreshCw"
          onClick={loadData}
        >
          Refresh
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map(option => (
          <button
            key={option.key}
            onClick={() => setFilter(option.key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === option.key
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                : 'bg-white text-gray-600 hover:text-primary hover:bg-primary hover:bg-opacity-10 border border-gray-200'
            }`}
          >
            <ApperIcon name={option.icon} size={16} />
            <span>{option.label}</span>
            <Badge 
              variant={filter === option.key ? 'default' : 'primary'}
              className={filter === option.key ? 'bg-white bg-opacity-20 text-white' : ''}
            >
              {counts[option.key]}
            </Badge>
          </button>
        ))}
      </div>

      {/* Reminders List */}
      {filteredReminders.length === 0 ? (
        <Empty
          title={filter === 'all' ? 'No reminders' : `No ${filter} reminders`}
          description={
            filter === 'all' 
              ? 'All your pet care tasks are up to date!'
              : `No ${filter} reminders to show.`
          }
          icon={filter === 'overdue' ? 'CheckCircle' : 'Bell'}
          showAction={false}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReminders.map((reminder, index) => {
            const pet = pets.find(p => p.Id === reminder.petId)
            return (
              <motion.div
                key={reminder.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ReminderCard
                  reminder={reminder}
                  pet={pet}
                  onComplete={handleCompleteReminder}
                  onSnooze={handleSnoozeReminder}
                />
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

export default Reminders