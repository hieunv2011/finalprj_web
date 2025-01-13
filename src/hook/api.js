import axios from 'axios'

const BASE_URL = 'https://fprj-backend.vercel.app/api'

// Đăng nhập và lưu token vào localStorage
const login = (email, password) => {
  return axios.post(`${BASE_URL}/users/login`, {
    email,
    password,
  }).then(response => {
    // Kiểm tra xem response có chứa token hay không
    if (response.data && response.data.token) {
      // Lưu token vào localStorage
      localStorage.setItem('token', response.data.token)
    }
    return response
  })
}
const getAllUser = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${BASE_URL}/users/`, {
    headers: {
      'Authorization': `Bearer ${token}`, // Gửi token trong header
    }
  })
}
const getAllDevice = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${BASE_URL}/devices/`, {
    headers: {
      'Authorization': `Bearer ${token}`, // Gửi token trong header
    }
  })
}

export { login, getAllUser,getAllDevice }

