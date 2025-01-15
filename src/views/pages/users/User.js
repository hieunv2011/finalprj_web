import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CFormInput,
  CTableDataCell
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilPenAlt, cilTrash, cilDevices } from '@coreui/icons'
import { getAllUser, assignDeviceToUser, removeDeviceFromUser } from '../../../hook/api'

const User = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalState, setModalState] = useState({
    visible: false,
    assignVisible: false,
    deleteVisible: false,
    message: '',
    messageType: '', // success | error
  })
  const [deviceId, setDeviceId] = useState('')
  const [deviceToDelete, setDeviceToDelete] = useState(null)

  useEffect(() => {
    getAllUser()
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Lỗi khi lấy thông tin người dùng:', error))
  }, [])

  const handleModalState = (type, value) => {
    setModalState((prevState) => ({
      ...prevState,
      [type]: value,
    }))
  }

  const handleDeviceClick = (user) => {
    setSelectedUser(user)
    handleModalState('visible', true)
  }

  const handleAssignDeviceClick = () => {
    if (selectedUser && deviceId) {
      assignDeviceToUser(selectedUser._id, [deviceId])
        .then(() => {
          setModalState({
            visible: false,
            assignVisible: false,
            message: 'Thiết bị được gắn thành công',
            messageType: 'success',
          })
          setUsers((prevUsers) => {
            return prevUsers.map((user) =>
              user._id === selectedUser._id
                ? { ...user, devices: [...user.devices, { deviceId }] }
                : user
            )
          })
        })
        .catch((error) => {
          setModalState({
            ...modalState,
            message: 'Lỗi khi gắn thiết bị: ' + error.message,
            messageType: 'error',
          })
        })
    }
  }

  const handleDeleteDeviceClick = (device) => {
    setDeviceToDelete(device)
    handleModalState('deleteVisible', true)
  }

  const handleDeleteDeviceConfirm = () => {
    if (selectedUser && deviceToDelete) {
      removeDeviceFromUser(selectedUser._id, deviceToDelete.deviceId)
        .then(() => {
          setModalState({
            ...modalState,
            message: 'Thiết bị đã được xoá thành công',
            messageType: 'success',
            deleteVisible: false,
            visible: false,
          })
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === selectedUser._id
                ? {
                    ...user,
                    devices: user.devices.filter((device) => device.deviceId !== deviceToDelete.deviceId),
                  }
                : user
            )
          )
        })
        .catch((error) => {
          setModalState({
            ...modalState,
            message: 'Lỗi khi xoá thiết bị: ' + error.message,
            messageType: 'error',
          })
        })
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>DANH SÁCH NGƯỜI DÙNG TRONG HỆ THỐNG</CCardHeader>
          <CCardBody>
            <CTable bordered hover responsive>
              <CTableHead>
                <CTableRow color="dark">
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Tên người dùng</CTableHeaderCell>
                  <CTableHeaderCell>Số điện thoại</CTableHeaderCell>
                  <CTableHeaderCell>Vai trò</CTableHeaderCell>
                  <CTableHeaderCell>Thiết bị</CTableHeaderCell>
                  <CTableHeaderCell>Địa chỉ</CTableHeaderCell>
                  <CTableHeaderCell>Liên hệ khẩn cấp</CTableHeaderCell>
                  <CTableHeaderCell>Thao tác</CTableHeaderCell>
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
                          ? user.devices.map((device) => (
                              <div key={device._id}>{device.deviceId}</div>
                            ))
                          : 'Chưa có thiết bị'}
                      </CTableDataCell>
                      <CTableDataCell>{user.contact?.address || ''}</CTableDataCell>
                      <CTableDataCell>{user.contact?.emergencyContact || ''}</CTableDataCell>
                      <CTableDataCell>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                          <CButton color="primary">
                            <CIcon icon={cilPenAlt} />
                          </CButton>
                          <CButton color="info" onClick={() => handleDeviceClick(user)}>
                            <CIcon icon={cilDevices} className="text-white" />
                          </CButton>
                          <CButton color="danger">
                            <CIcon icon={cilTrash} className="text-white" />
                          </CButton>
                        </div>
                      </CTableDataCell>
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

      {/* Modal thông báo */}
      <CModal visible={modalState.message} onClose={() => setModalState({ ...modalState, message: '' })}>
        <CModalHeader>
          <CModalTitle>{modalState.messageType === 'success' ? 'Thành công' : 'Lỗi'}</CModalTitle>
        </CModalHeader>
        <CModalBody>{modalState.message}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalState({ ...modalState, message: '' })}>
            Đóng
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal hiển thị danh sách thiết bị */}
      <CModal visible={modalState.visible} onClose={() => handleModalState('visible', false)}>
        <CModalHeader>
          <CModalTitle>Danh sách thiết bị</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedUser && selectedUser.devices.length > 0 ? (
            <CTable bordered hover responsive>
              <CTableHead>
                <CTableRow color="dark">
                  <CTableHeaderCell>Device ID</CTableHeaderCell>
                  <CTableHeaderCell>Thao tác</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {selectedUser.devices.map((device) => (
                  <CTableRow key={device._id}>
                    <CTableDataCell>{device.deviceId}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="danger" onClick={() => handleDeleteDeviceClick(device)}>
                        <CIcon icon={cilTrash} className="text-white" />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          ) : (
            <p>Người dùng này chưa có thiết bị.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => handleModalState('visible', false)}>
            Đóng
          </CButton>
          <CButton color="primary" onClick={() => handleModalState('assignVisible', true)}>
            Gắn thiết bị
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal gắn thiết bị */}
      <CModal visible={modalState.assignVisible} onClose={() => handleModalState('assignVisible', false)}>
        <CModalHeader>
          <CModalTitle>Gắn thiết bị cho người dùng</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="Nhập Device ID"
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => handleModalState('assignVisible', false)}>
            Hủy
          </CButton>
          <CButton color="primary" onClick={handleAssignDeviceClick}>
            Gắn thiết bị
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal xác nhận xóa thiết bị */}
      <CModal visible={modalState.deleteVisible} onClose={() => handleModalState('deleteVisible', false)}>
        <CModalHeader>
          <CModalTitle>Xác nhận xóa thiết bị</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Bạn có chắc chắn muốn xóa thiết bị này không?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => handleModalState('deleteVisible', false)}>
            Hủy
          </CButton>
          <CButton color="danger" onClick={handleDeleteDeviceConfirm}>
            Xóa
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default User
