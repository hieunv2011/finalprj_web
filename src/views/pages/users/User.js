import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { getAllUser } from '../../../hook/api' // Import API để lấy thông tin người dùng

const User = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    // Lấy thông tin người dùng sau khi component được render
    getAllUser()
      .then(response => {
        // Lưu danh sách người dùng vào state
        setUsers(response.data)
      })
      .catch(error => {
        console.error("Lỗi khi lấy thông tin người dùng:", error)
      })
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            DANH SÁCH NGƯỜI DÙNG TRONG HỆ THỐNG
          </CCardHeader>
          <CCardBody>
            <CTable bordered hover responsive>
              <CTableHead>
                <CTableRow color='dark'>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Tên người dùng</CTableHeaderCell>
                  <CTableHeaderCell>Số điện thoại</CTableHeaderCell>
                  <CTableHeaderCell>Vai trò</CTableHeaderCell>
                  <CTableHeaderCell>Thiết bị</CTableHeaderCell>
                  <CTableHeaderCell>Địa chỉ</CTableHeaderCell>
                  <CTableHeaderCell>Liên hệ khẩn cấp</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <CTableRow key={user._id}>
                      <CTableDataCell>{user.email}</CTableDataCell>
                      <CTableDataCell>{user.username}</CTableDataCell>
                      <CTableDataCell>{user.phone}</CTableDataCell>
                      <CTableDataCell>{user.role}</CTableDataCell>
                      <CTableDataCell>
                        {user.devices && user.devices.length > 0
                          ? user.devices.map(device => (
                              <div key={device._id}>{device.deviceId}</div>
                            ))
                          : 'Chưa có thiết bị'}
                      </CTableDataCell>
                      <CTableDataCell>{user.contact?.address || ''}</CTableDataCell>
                      <CTableDataCell>{user.contact?.emergencyContact || ''}</CTableDataCell>
                      
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="7">Đang tải dữ liệu...</CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default User
