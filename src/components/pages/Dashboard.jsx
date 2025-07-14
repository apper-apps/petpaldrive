import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format, isPast, isToday } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Reminders from "@/components/pages/Reminders";
import Schedule from "@/components/pages/Schedule";
import QuickStats from "@/components/molecules/QuickStats";
import ReminderCard from "@/components/molecules/ReminderCard";
import { getAll, update } from "@/services/api/vaccinationService";
import * as petService from "@/services/api/petService";
import * as appointmentService from "@/services/api/appointmentService";
import * as reminderService from "@/services/api/reminderService";
import * as feedingService from "@/services/api/feedingService";

const Dashboard = () => {
  const [pets, setPets] = useState([])
  const [reminders, setReminders] = useState([])
  const [appointments, setAppointments] = useState([])
  const [feedingSchedules, setFeedingSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [petsData, remindersData, appointmentsData, feedingData] = await Promise.all([
        petService.getAll(),
        reminderService.getAll(),
        appointmentService.getAll(),
        feedingService.getAll()
      ])
      
      setPets(petsData)
      setReminders(remindersData)
      setAppointments(appointmentsData)
      setFeedingSchedules(feedingData)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Error loading dashboard:', err)
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

  const getTodaysReminders = () => {
    return reminders.filter(reminder => {
      if (reminder.completed) return false
      if (reminder.snoozedUntil && new Date(reminder.snoozedUntil) > new Date()) return false
      return isToday(new Date(reminder.dateTime)) || isPast(new Date(reminder.dateTime))
    })
  }

  const getUpcomingAppointments = () => {
    return appointments
      .filter(apt => !apt.completed && new Date(apt.dateTime) > new Date())
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
      .slice(0, 3)
  }

  const getActiveFeedings = () => {
    return feedingSchedules.filter(schedule => schedule.enabled).length
  }

  const getOverdueCount = () => {
    return reminders.filter(reminder => 
      !reminder.completed && 
      isPast(new Date(reminder.dateTime)) && 
      !isToday(new Date(reminder.dateTime))
    ).length
  }

  if (loading) return <Loading type="stats" count={4} />
  if (error) return <Error message={error} onRetry={loadData} />

  const todaysReminders = getTodaysReminders()
  const upcomingAppointments = getUpcomingAppointments()

return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:space-y-8 px-4 sm:px-0"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-display gradient-text">Welcome back!</h1>
        <p className="text-sm sm:text-base text-gray-600">Here's what's happening with your pets today</p>
      </div>

{/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <QuickStats
          title="Total Pets"
          value={pets.length}
          icon="Heart"
          color="primary"
        />
        <QuickStats
          title="Today's Reminders"
          value={todaysReminders.length}
          icon="Bell"
          color="info"
        />
        <QuickStats
          title="Active Feedings"
          value={getActiveFeedings()}
          icon="UtensilsCrossed"
          color="success"
        />
        <QuickStats
          title="Overdue Items"
          value={getOverdueCount()}
          icon="AlertTriangle"
          color="warning"
/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Today's Reminders */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Today's Tasks</h2>
            <Button
              variant="ghost"
              size="sm"
              icon="RefreshCw"
              onClick={loadData}
            >
              Refresh
            </Button>
          </div>

          {todaysReminders.length === 0 ? (
            <Empty
              title="All caught up!"
              description="No reminders for today. Great job taking care of your pets!"
              icon="CheckCircle"
              showAction={false}
            />
          ) : (
            <div className="space-y-4">
              {todaysReminders.map((reminder) => {
                const pet = pets.find(p => p.Id === reminder.petId)
                return (
                  <ReminderCard
                    key={reminder.Id}
                    reminder={reminder}
                    pet={pet}
                    onComplete={handleCompleteReminder}
                    onSnooze={handleSnoozeReminder}
                  />
                )
              })}
            </div>
)}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="primary"
                size="md"
                icon="Plus"
                className="w-full justify-start h-12 text-base font-medium"
                onClick={() => window.location.href = '/pets'}
              >
                Add New Pet
              </Button>
              <Button
                variant="outline"
                size="md"
                icon="Calendar"
                className="w-full justify-start h-12 text-base font-medium"
                onClick={() => window.location.href = '/schedule'}
              >
                Schedule Appointment
              </Button>
              <Button
                variant="ghost"
                size="md"
                icon="Bell"
                className="w-full justify-start h-12 text-base font-medium"
                onClick={() => window.location.href = '/reminders'}
              >
                View All Reminders
              </Button>
</div>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-6">
                <ApperIcon name="Calendar" size={32} className="text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No upcoming appointments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => {
                  const pet = pets.find(p => p.Id === appointment.petId)
                  return (
                    <div key={appointment.Id} className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
<div className="p-2 bg-gradient-to-r from-warning to-orange-500 rounded-lg text-white flex-shrink-0">
                        <ApperIcon name="Calendar" size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{appointment.reason}</p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{pet?.name}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(appointment.dateTime), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard