import axios from 'axios'

const baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000'
console.log(baseURL)
const apiClient = axios.create({
  baseURL
})

export default apiClient