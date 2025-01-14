import React, { useState, useEffect } from 'react';
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
  CFormSelect,
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilPenAlt, cilTrash, cilLocationPin, cilPlus } from '@coreui/icons';
import { getAllDevice, addDevice, updateDevice, deleteDevice } from '../../../hook/api';

const Device = () => {
  const [devices, setDevices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [newDevice, setNewDevice] = useState({
    deviceId: '',
    name: '',
    location: '',
    latitude: '',
    longitude: '',
    status: 'inactive',
  });
  const [isAddMode, setIsAddMode] = useState(false);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [devicesPerPage] = useState(5); // Số thiết bị hiển thị mỗi trang

  useEffect(() => {
    getAllDevice()
      .then((response) => {
        setDevices(response.data);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy thông tin thiết bị:', error);
      });
  }, []);

  // Lấy danh sách thiết bị theo trang
  const indexOfLastDevice = currentPage * devicesPerPage;
  const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
  const currentDevices = devices.slice(indexOfFirstDevice, indexOfLastDevice);

  const handleAddClick = () => {
    setIsAddMode(true);
    setNewDevice({ deviceId: '', name: '', location: '', latitude: '', longitude: '', status: 'inactive' });
    setModalVisible(true);
  };

  const handleEditClick = (device) => {
    setIsAddMode(false);
    setSelectedDevice(device);
    setModalVisible(true);
  };

  const handleDeleteClick = async (deviceId) => {
    try {
      await deleteDevice(deviceId);
      setDevices((prevDevices) => prevDevices.filter(device => device.deviceId !== deviceId));
    } catch (error) {
      console.error('Lỗi khi xóa thiết bị:', error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedDevice(null);
  };

  const handleSaveChanges = async () => {
    if (isAddMode) {
      try {
        await addDevice(newDevice);
        setDevices((prevDevices) => [...prevDevices, newDevice]);
      } catch (error) {
        console.error('Lỗi khi thêm thiết bị mới:', error);
      }
    } else {
      try {
        await updateDevice(selectedDevice.deviceId, selectedDevice);
        getAllDevice()
          .then((response) => {
            setDevices(response.data);
          })
          .catch((error) => {
            console.error('Lỗi khi lấy thông tin thiết bị:', error);
          });
      } catch (error) {
        console.error('Lỗi khi lưu thay đổi thiết bị:', error);
      }
    }
    setModalVisible(false);
  };

  // Hàm thay đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Số trang
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(devices.length / devicesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              DANH SÁCH THIẾT BỊ TRONG HỆ THỐNG
              <CButton color="success" onClick={handleAddClick} className="text-white">
                <CIcon icon={cilPlus} className="text-white" /> Thêm thiết bị
              </CButton>
            </div>
          </CCardHeader>
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
                {currentDevices.map((device) => (
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
                        <CButton color="danger" onClick={() => handleDeleteClick(device.deviceId)}>
                          <CIcon icon={cilTrash} className="text-white" />
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            {/* Phân trang */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              {pageNumbers.map((number) => (
                <CButton
                  key={number}
                  color="secondary"
                  onClick={() => handlePageChange(number)}
                  style={{ margin: '0 5px' }}
                >
                  {number}
                </CButton>
              ))}
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <CModal visible={modalVisible} onClose={handleCloseModal}>
        <CModalHeader>
          <CModalTitle>{isAddMode ? 'Thêm thiết bị mới' : 'Chỉnh sửa thiết bị'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              label="DeviceID"
              value={isAddMode ? newDevice.deviceId : selectedDevice?.deviceId}
              onChange={(e) =>
                isAddMode
                  ? setNewDevice({ ...newDevice, deviceId: e.target.value })
                  : setSelectedDevice({ ...selectedDevice, deviceId: e.target.value })
              }
            />
            <CFormInput
              label="Tên thiết bị"
              value={isAddMode ? newDevice.name : selectedDevice?.name}
              onChange={(e) =>
                isAddMode
                  ? setNewDevice({ ...newDevice, name: e.target.value })
                  : setSelectedDevice({ ...selectedDevice, name: e.target.value })
              }
            />
            <CFormInput
              label="Địa chỉ lắp đặt"
              value={isAddMode ? newDevice.location : selectedDevice?.location}
              onChange={(e) =>
                isAddMode
                  ? setNewDevice({ ...newDevice, location: e.target.value })
                  : setSelectedDevice({ ...selectedDevice, location: e.target.value })
              }
            />
            <CFormInput
              label="Kinh độ"
              value={isAddMode ? newDevice.latitude : selectedDevice?.latitude}
              onChange={(e) =>
                isAddMode
                  ? setNewDevice({ ...newDevice, latitude: e.target.value })
                  : setSelectedDevice({ ...selectedDevice, latitude: e.target.value })
              }
            />
            <CFormInput
              label="Vĩ độ"
              value={isAddMode ? newDevice.longitude : selectedDevice?.longitude}
              onChange={(e) =>
                isAddMode
                  ? setNewDevice({ ...newDevice, longitude: e.target.value })
                  : setSelectedDevice({ ...selectedDevice, longitude: e.target.value })
              }
            />
            <CFormSelect
              label="Trạng thái"
              value={isAddMode ? newDevice.status : selectedDevice?.status}
              onChange={(e) =>
                isAddMode
                  ? setNewDevice({ ...newDevice, status: e.target.value })
                  : setSelectedDevice({ ...selectedDevice, status: e.target.value })
              }
            >
              <option value="inactive">Không hoạt động</option>
              <option value="active">Hoạt động</option>
            </CFormSelect>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Đóng
          </CButton>
          <CButton color="primary" onClick={handleSaveChanges}>
            Lưu
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default Device;
