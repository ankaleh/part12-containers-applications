import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000'//process.env.REACT_APP_BACKEND_URL,
})

export default apiClient