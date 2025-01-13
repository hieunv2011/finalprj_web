import React from 'react'
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton, CModalTitle } from '@coreui/react'

const EditDeviceModal = ({ visible, onClose, device, onSave }) => {
  if (!device) return null

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Chỉnh sửa thiết bị</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div>
          <label>Tên thiết bị:</label>
          <input
            type="text"
            defaultValue={device.name}
            placeholder="Nhập tên thiết bị"
          />
        </div>
        <div>
          <label>Trạng thái:</label>
          <select defaultValue={device.status}>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Đóng
        </CButton>
        <CButton color="primary" onClick={() => onSave(device)}>
          Lưu thay đổi
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default EditDeviceModal
