import React, { useState, useEffect } from 'react'
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
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CForm,
  CFormInput,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilPenAlt, cilTrash,cilLocationPin } from '@coreui/icons'
import { getAllDevice } from '../../../hook/api'

const Device = () => {
  const [devices, setDevices] = useState([])
  const [modalVisible, setModalVisible] = useState(false) // State điều khiển modal
  const [selectedDevice, setSelectedDevice] = useState(null) // Thiết bị được chọn để chỉnh sửa

  useEffect(() => {
    getAllDevice()
      .then((response) => {
        setDevices(response.data)
      })
      .catch((error) => {
        console.error('Lỗi khi lấy thông tin thiết bị:', error)
      })
  }, [])

  // Hàm mở modal khi nhấn vào nút chỉnh sửa
  const handleEditClick = (device) => {
    setSelectedDevice(device)
    setModalVisible(true)
  }

  // Hàm đóng modal
  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedDevice(null)
  }

  // Hàm xử lý lưu thay đổi
  const handleSaveChanges = () => {
    // Logic để lưu thay đổi
    console.log('Lưu thay đổi cho thiết bị:', selectedDevice)
    setModalVisible(false)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>DANH SÁCH THIẾT BỊ TRONG HỆ THỐNG</CCardHeader>
          <CCardBody>
            <CTable bordered hover responsive>
              <CTableHead>
                <CTableRow color="dark">
                  <CTableHeaderCell>DeviceID</CTableHeaderCell>
                  <CTableHeaderCell>Tên thiết bị</CTableHeaderCell>
                  <CTableHeaderCell>Địa chỉ lắp đặt</CTableHeaderCell>
                  <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                  <CTableHeaderCell>Toạ độ</CTableHeaderCell>
                  <CTableHeaderCell>Lần cập nhật gần nhất</CTableHeaderCell>
                  <CTableHeaderCell>Thao tác</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {devices.length > 0 ? (
                  devices.map((device) => (
                    <CTableRow key={device._id}>
                      <CTableDataCell>{device.deviceId}</CTableDataCell>
                      <CTableDataCell>{device.name}</CTableDataCell>
                      <CTableDataCell>{device.location}</CTableDataCell>
                      <CTableDataCell>
                        {device.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </CTableDataCell>
                      <CTableDataCell>
                        <a
                          href={`https://www.google.com/maps?q=${device.latitude},${device.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <CIcon icon={cilLocationPin} />
                        </a>
                      </CTableDataCell>

                      <CTableDataCell>
                        {device.lastChecked
                          ? new Date(device.lastChecked).toLocaleString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })
                          : 'Chưa kiểm tra'}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                          <CButton color="primary" onClick={() => handleEditClick(device)}>
                            <CIcon icon={cilPenAlt} />
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

      {/* Modal chỉnh sửa */}
      <CModal visible={modalVisible} onClose={handleCloseModal}>
        <CModalHeader>
          <CModalTitle>Chỉnh sửa thiết bị</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedDevice && (
            <CForm>
              <CFormInput
                label="Tên thiết bị"
                value={selectedDevice.name}
                onChange={(e) => setSelectedDevice({ ...selectedDevice, name: e.target.value })}
              />
              <CFormInput
                label="Địa chỉ lắp đặt"
                value={selectedDevice.location}
                onChange={(e) => setSelectedDevice({ ...selectedDevice, location: e.target.value })}
              />
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Đóng
          </CButton>
          <CButton color="primary" onClick={handleSaveChanges}>
            Lưu thay đổi
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default Device
