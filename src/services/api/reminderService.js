import mockReminders from '@/services/mockData/reminders.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let reminders = [...mockReminders]

export const getAll = async () => {
  await delay(250)
  return [...reminders]
}

export const getById = async (id) => {
  await delay(200)
  const reminder = reminders.find(r => r.Id === id)
  if (!reminder) {
    throw new Error('Reminder not found')
  }
  return { ...reminder }
}

export const create = async (reminderData) => {
  await delay(350)
  const maxId = reminders.length > 0 ? Math.max(...reminders.map(r => r.Id)) : 0
  const newReminder = {
    Id: maxId + 1,
    completed: false,
    snoozedUntil: null,
    ...reminderData
  }
  reminders.push(newReminder)
  return { ...newReminder }
}

export const update = async (id, reminderData) => {
  await delay(300)
  const index = reminders.findIndex(r => r.Id === id)
  if (index === -1) {
    throw new Error('Reminder not found')
  }
  reminders[index] = { ...reminders[index], ...reminderData }
  return { ...reminders[index] }
}

export const deleteItem = async (id) => {
  await delay(200)
  const index = reminders.findIndex(r => r.Id === id)
  if (index === -1) {
    throw new Error('Reminder not found')
  }
  reminders.splice(index, 1)
  return true
}