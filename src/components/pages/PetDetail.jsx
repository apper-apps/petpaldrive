import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Pets from "@/components/pages/Pets";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import AppointmentCard from "@/components/molecules/AppointmentCard";
import FeedingScheduleCard from "@/components/molecules/FeedingScheduleCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import * as petService from "@/services/api/petService";
import * as feedingService from "@/services/api/feedingService";
import * as reminderService from "@/services/api/reminderService";
import * as vaccinationService from "@/services/api/vaccinationService";
import * as appointmentService from "@/services/api/appointmentService";

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [feedingSchedules, setFeedingSchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [appetite, setAppetite] = useState(5);
  const [energy, setEnergy] = useState(5);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [petData, feedingData, appointmentData, vaccinationData] = await Promise.all([
        petService.getById(parseInt(id)),
        feedingService.getAll(),
        appointmentService.getAll(),
vaccinationService.getAll()
      ]);
      
      setPet(petData);
      setAppetite(petData?.appetite || 5);
      setEnergy(petData?.energy || 5);
      setFeedingSchedules(feedingData.filter(f => f.petId === parseInt(id)));
      setAppointments(appointmentData.filter(a => a.petId === parseInt(id)));
setVaccinations(vaccinationData.filter(v => v.petId === parseInt(id)));
    } catch (err) {
      setError('Failed to load pet details');
      console.error('Error loading pet details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
}, [id]);

  const handleToggleFeedingSchedule = async (scheduleId) => {
    try {
      const schedule = feedingSchedules.find(s => s.Id === scheduleId);
      if (!schedule) return;
      
      const updated = await feedingService.update(scheduleId, { 
        enabled: !schedule.enabled
      });
      setFeedingSchedules(prev =>
        prev.map(s => s.Id === scheduleId ? updated : s)
      );
      toast.success(`Feeding schedule ${updated.enabled ? 'enabled' : 'disabled'}`);
    } catch (err) {
      toast.error('Failed to update feeding schedule');
    }
  };

  const handleDeleteFeedingSchedule = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this feeding schedule?')) {
try {
        await feedingService.deleteItem(scheduleId);
        setFeedingSchedules(prev => prev.filter(s => s.Id !== scheduleId));
        toast.success('Feeding schedule deleted');
      } catch (err) {
        toast.error('Failed to delete feeding schedule');
      }
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentService.deleteItem(appointmentId);
        setAppointments(prev => prev.filter(a => a.Id !== appointmentId));
        toast.success('Appointment deleted');
      } catch (err) {
        toast.error('Failed to delete appointment');
      }
    }
  };

const handleUpdateTracking = async (field, value) => {
    try {
      const updatedData = { [field]: value };
      const updatedPet = await petService.update(parseInt(id), updatedData);
      setPet(updatedPet);
      if (field === 'appetite') setAppetite(value);
      if (field === 'energy') setEnergy(value);
      toast.success(`${field === 'appetite' ? 'Appetite' : 'Energy'} level updated`);
    } catch (err) {
      toast.error(`Failed to update ${field} level`);
    }
  };
const getAgeText = (birthDate) => {
    if (!birthDate) return 'Unknown age';
    const today = new Date();
    const birth = new Date(birthDate);
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} old`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''} old`;
    } else {
      return 'Less than 1 month old';
    }
  };
const getPetIcon = (type) => {
    const iconMap = {
      dog: 'Dog',
      cat: 'Cat',
      bird: 'Bird',
      fish: 'Fish',
      rabbit: 'Rabbit',
      hamster: 'Mouse'
    };
    return iconMap[type?.toLowerCase()] || 'Heart';
  };
const tabs = [
    { key: 'overview', label: 'Overview', icon: 'Info' },
    { key: 'feeding', label: 'Feeding', icon: 'UtensilsCrossed' },
    { key: 'appointments', label: 'Appointments', icon: 'Calendar' },
    { key: 'vaccinations', label: 'Vaccinations', icon: 'Syringe' }
  ];
if (loading) return <Loading type="cards" count={4} />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!pet) return <Error message="Pet not found" />;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon="ArrowLeft"
            onClick={() => navigate('/pets')}
          >
            Back to Pets
          </Button>
        </div>
      </div>

      {/* Pet Info Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-4 right-4">
          <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-full text-white">
            <ApperIcon name={getPetIcon(pet.type)} size={24} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-display text-2xl">
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
            <div>
              <h1 className="text-3xl font-display gradient-text">{pet.name}</h1>
              <p className="text-gray-600">{pet.breed || pet.type}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <ApperIcon name="Calendar" size={18} className="mr-3" />
              <span>{getAgeText(pet.birthDate)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <ApperIcon name="Heart" size={18} className="mr-3" />
              <Badge variant="primary" className="capitalize">
                {pet.type}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <strong>Quick Stats</strong>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Feeding Schedules</span>
                <p className="font-semibold">{feedingSchedules.length}</p>
              </div>
              <div>
                <span className="text-gray-500">Appointments</span>
                <p className="font-semibold">{appointments.length}</p>
              </div>
            </div>
          </div>
        </div>
        
        {pet.notes && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
            <p className="text-gray-700">{pet.notes}</p>
          </div>
        )}
      </Card>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                : 'bg-white text-gray-600 hover:text-primary hover:bg-primary hover:bg-opacity-10 border border-gray-200'
            }`}
          >
            <ApperIcon name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

{/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Daily Tracking */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ApperIcon name="UtensilsCrossed" size={20} className="text-accent" />
                  Appetite Level
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Didn't eat</span>
                    <span>Full appetite</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={appetite}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        setAppetite(value)
                        handleUpdateTracking('appetite', value)
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      {[0, 2, 4, 6, 8, 10].map(num => (
                        <span key={num}>{num}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-accent to-orange-500 text-white">
                      {appetite}/10
                    </span>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ApperIcon name="Zap" size={20} className="text-warning" />
                  Energy Level
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Very low</span>
                    <span>Very active</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={energy}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        setEnergy(value)
                        handleUpdateTracking('energy', value)
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      {[0, 2, 4, 6, 8, 10].map(num => (
                        <span key={num}>{num}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-warning to-yellow-500 text-white">
                      {energy}/10
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Activity Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {appointments
                    .filter(apt => apt.completed)
                    .slice(0, 3)
                    .map(apt => (
                      <div key={apt.Id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <ApperIcon name="CheckCircle" size={16} className="text-success" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{apt.reason}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(apt.dateTime), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    ))}
                  {appointments.filter(apt => apt.completed).length === 0 && (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </Card>
              
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h3>
                <div className="space-y-3">
                  {appointments
                    .filter(apt => !apt.completed && new Date(apt.dateTime) > new Date())
                    .slice(0, 3)
                    .map(apt => (
                      <div key={apt.Id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <ApperIcon name="Clock" size={16} className="text-warning" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{apt.reason}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(apt.dateTime), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                  {appointments.filter(apt => !apt.completed && new Date(apt.dateTime) > new Date()).length === 0 && (
                    <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'feeding' && (
          <div>
            {feedingSchedules.length === 0 ? (
              <Empty
                title="No feeding schedules"
                description="Create feeding schedules to track your pet's meal times."
                icon="UtensilsCrossed"
                actionLabel="Add Feeding Schedule"
                showAction={false}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {feedingSchedules.map((schedule, index) => (
                  <motion.div
                    key={schedule.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FeedingScheduleCard
                      schedule={schedule}
                      pet={pet}
                      onToggle={handleToggleFeedingSchedule}
                      onEdit={() => {}}
                      onDelete={handleDeleteFeedingSchedule}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div>
            {appointments.length === 0 ? (
              <Empty
                title="No appointments"
                description="Schedule vet appointments to keep track of your pet's health."
                icon="Calendar"
                actionLabel="Schedule Appointment"
                showAction={false}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {appointments
                  .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
                  .map((appointment, index) => (
                    <motion.div
                      key={appointment.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AppointmentCard
                        appointment={appointment}
                        pet={pet}
                        onEdit={() => {}}
                        onDelete={handleDeleteAppointment}
                      />
                    </motion.div>
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'vaccinations' && (
          <div>
            {vaccinations.length === 0 ? (
              <Empty
                title="No vaccination records"
                description="Keep track of your pet's vaccination history and due dates."
                icon="Syringe"
                actionLabel="Add Vaccination"
                showAction={false}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {vaccinations.map((vaccination, index) => (
                  <motion.div
                    key={vaccination.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-success to-green-500 rounded-lg text-white">
                            <ApperIcon name="Syringe" size={20} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{vaccination.name}</h3>
                            <p className="text-sm text-gray-600">Dr. {vaccination.veterinarian}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <ApperIcon name="Calendar" size={16} />
                          Given: {format(new Date(vaccination.dateGiven), 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <ApperIcon name="Clock" size={16} />
                          Next: {format(new Date(vaccination.nextDueDate), 'MMM d, yyyy')}
                        </div>
                      </div>
                      
                      {vaccination.notes && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{vaccination.notes}</p>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
</motion.div>
  );
};

export default PetDetail;