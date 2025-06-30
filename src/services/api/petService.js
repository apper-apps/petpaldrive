import mockPets from '@/services/mockData/pets.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let pets = [...mockPets]

export const getAll = async () => {
  await delay(300)
  return [...pets]
}

export const getById = async (id) => {
  await delay(200)
  const pet = pets.find(p => p.Id === id)
  if (!pet) {
    throw new Error('Pet not found')
  }
  return { ...pet }
}

export const create = async (petData) => {
  await delay(400)
  const maxId = pets.length > 0 ? Math.max(...pets.map(p => p.Id)) : 0
  const newPet = {
    Id: maxId + 1,
    ...petData
  }
  pets.push(newPet)
  return { ...newPet }
}

export const update = async (id, petData) => {
  await delay(300)
  const index = pets.findIndex(p => p.Id === id)
  if (index === -1) {
    throw new Error('Pet not found')
  }
  pets[index] = { ...pets[index], ...petData }
  return { ...pets[index] }
}

export const deleteItem = async (id) => {
  await delay(200)
  const index = pets.findIndex(p => p.Id === id)
  if (index === -1) {
    throw new Error('Pet not found')
  }
  pets.splice(index, 1)
  return true
}