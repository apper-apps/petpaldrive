import mockVaccinations from '@/services/mockData/vaccinations.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let vaccinations = [...mockVaccinations]

export const getAll = async () => {
  await delay(250)
  return [...vaccinations]
}

export const getById = async (id) => {
  await delay(200)
  const vaccination = vaccinations.find(v => v.Id === id)
  if (!vaccination) {
    throw new Error('Vaccination not found')
  }
  return { ...vaccination }
}

export const create = async (vaccinationData) => {
  await delay(350)
  const maxId = vaccinations.length > 0 ? Math.max(...vaccinations.map(v => v.Id)) : 0
  const newVaccination = {
    Id: maxId + 1,
    ...vaccinationData
  }
  vaccinations.push(newVaccination)
  return { ...newVaccination }
}

export const update = async (id, vaccinationData) => {
  await delay(300)
  const index = vaccinations.findIndex(v => v.Id === id)
  if (index === -1) {
    throw new Error('Vaccination not found')
  }
  vaccinations[index] = { ...vaccinations[index], ...vaccinationData }
  return { ...vaccinations[index] }
}

export const deleteItem = async (id) => {
  await delay(200)
  const index = vaccinations.findIndex(v => v.Id === id)
  if (index === -1) {
    throw new Error('Vaccination not found')
  }
  vaccinations.splice(index, 1)
  return true
}