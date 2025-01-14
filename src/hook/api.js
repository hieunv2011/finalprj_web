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

const addDevice = (deviceData) => {
  const token = localStorage.getItem('token')
  return axios.post(`${BASE_URL}/devices/`, deviceData, {
    headers: {
      'Authorization': `Bearer ${token}`, // Gửi token trong header
    }
  })
}

const updateDevice = (deviceId, deviceData) => {
  const token = localStorage.getItem('token')
  return axios.put(`${BASE_URL}/devices/${deviceId}`, deviceData, {
    headers: {
      'Authorization': `Bearer ${token}`, // Gửi token trong header
    }
  })
}

// Hàm xóa thiết bị
const deleteDevice = (deviceId) => {
  const token = localStorage.getItem('token')
  return axios.delete(`${BASE_URL}/devices/${deviceId}`, {
    headers: {
      'Authorization': `Bearer ${token}`, // Gửi token trong header
    }
  })
}

export { login, getAllUser, getAllDevice, addDevice, updateDevice, deleteDevice }
