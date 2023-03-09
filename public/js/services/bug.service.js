// בס"ד

// import { storageService } from './async-storage.service.js'

// const STORAGE_KEY = 'bugDB'

export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
}

function query(filter) {
  return axios.get('/api/bug', { params: filter })
    .then(res => res.data)

  // return storageService.query(STORAGE_KEY)
}

function getById(bugId) {
  return axios.get(`/api/bug/${bugId}`)
    .then(res => res.data)


  // return storageService.get(STORAGE_KEY, bugId)
}

function getEmptyBug() {
  return {
    title: '',
    severity: '',
  }
}

function remove(bugId) {
  return axios.delete(`/api/bug/${bugId}`)
    .then(res => res.data)

  // return storageService.remove(STORAGE_KEY, bugId)
}

function save(bug) {
  if (bug._id) {
    return axios.put(`/api/bug/${bug._id}`, bug).then(res => {
      res.data
    })
  } else {
    return axios.post(`/api/bug`, bug).then(res => {
      res.data
    })
  }
  // const queryParams = `title=${bug.title}&description=${bug.description}&severity=${bug.severity}&_id=${bug._id || ''}`


  // if (bug._id) {
  //   return storageService.put(STORAGE_KEY, bug)
  // }
  // return storageService.post(STORAGE_KEY, bug)
}
