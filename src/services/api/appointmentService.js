import mockAppointments from '@/services/mockData/appointments.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let appointments = [...mockAppointments]

export const getAll = async () => {
  await delay(300)
  return [...appointments]
}

export const getById = async (id) => {
  await delay(200)
  const appointment = appointments.find(a => a.Id === id)
  if (!appointment) {
    throw new Error('Appointment not found')
  }
  return { ...appointment }
}

export const create = async (appointmentData) => {
  await delay(400)
  const maxId = appointments.length > 0 ? Math.max(...appointments.map(a => a.Id)) : 0
  const newAppointment = {
    Id: maxId + 1,
    completed: false,
    ...appointmentData
  }
  appointments.push(newAppointment)
  return { ...newAppointment }
}

export const update = async (id, appointmentData) => {
  await delay(300)
  const index = appointments.findIndex(a => a.Id === id)
  if (index === -1) {
    throw new Error('Appointment not found')
  }
  appointments[index] = { ...appointments[index], ...appointmentData }
  return { ...appointments[index] }
}

export const deleteItem = async (id) => {
  await delay(200)
  const index = appointments.findIndex(a => a.Id === id)
  if (index === -1) {
    throw new Error('Appointment not found')
  }
  appointments.splice(index, 1)
  return true
}