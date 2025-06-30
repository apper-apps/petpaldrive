import mockFeedings from '@/services/mockData/feedingSchedules.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let feedingSchedules = [...mockFeedings]

export const getAll = async () => {
  await delay(250)
  return [...feedingSchedules]
}

export const getById = async (id) => {
  await delay(200)
  const schedule = feedingSchedules.find(s => s.Id === id)
  if (!schedule) {
    throw new Error('Feeding schedule not found')
  }
  return { ...schedule }
}

export const create = async (scheduleData) => {
  await delay(350)
  const maxId = feedingSchedules.length > 0 ? Math.max(...feedingSchedules.map(s => s.Id)) : 0
  const newSchedule = {
    Id: maxId + 1,
    ...scheduleData
  }
  feedingSchedules.push(newSchedule)
  return { ...newSchedule }
}

export const update = async (id, scheduleData) => {
  await delay(300)
  const index = feedingSchedules.findIndex(s => s.Id === id)
  if (index === -1) {
    throw new Error('Feeding schedule not found')
  }
  feedingSchedules[index] = { ...feedingSchedules[index], ...scheduleData }
  return { ...feedingSchedules[index] }
}

export const deleteItem = async (id) => {
  await delay(200)
  const index = feedingSchedules.findIndex(s => s.Id === id)
  if (index === -1) {
    throw new Error('Feeding schedule not found')
  }
  feedingSchedules.splice(index, 1)
  return true
}