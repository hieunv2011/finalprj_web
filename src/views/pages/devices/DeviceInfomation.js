import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDeviceInfomation } from '../../../hook/api' // Đảm bảo bạn đã import đúng đường dẫn
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
} from '@coreui/react'
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'
import { DocsLink } from 'src/components'

const DeviceInfomation = () => {
  const { deviceId } = useParams()
  const [deviceInfo, setDeviceInfo] = useState(null)
  const random = () => Math.round(Math.random() * 100)

  useEffect(() => {
    if (deviceId) {
      getDeviceInfomation(deviceId)
        .then((response) => {
          setDeviceInfo(response.data)
        })
        .catch((error) => {
          console.error('Lỗi khi lấy thông tin thiết bị:', error)
        })
    }
  }, [deviceId])

  if (!deviceInfo) return <div>Loading...</div>

  return (
    <div>
      <CCard>
        <CCardHeader>
          <h3>Thông tin Thiết bị</h3>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="6">
              <CRow>
                <CCol sm="12" md="6">
                  <h5>{deviceInfo.name}</h5>
                </CCol>
                <CCol sm="12" md="6">
                  <p>{deviceInfo.location}</p>
                </CCol>
              </CRow>

              <CRow>
                <CCol sm="12" md="6">
                  <p>{deviceInfo.status === 'active' ? 'Hoạt Động' : 'Không hoạt động'}</p>
                </CCol>
                <CCol sm="12" md="6">
                  <a
                    href={`https://www.google.com/maps?q=${deviceInfo.latitude},${deviceInfo.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Vị trí thiết bị
                  </a>
                </CCol>
              </CRow>
              <CTable striped bordered>
                <CTableHead>
                  <CTableRow></CTableRow>
                </CTableHead>
                <CTableBody>
                  {/* Tiêu đề cho Temperature */}
                  <CTableRow>
                    <CTableDataCell colSpan="2" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      Temperature (°C)
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell colSpan="2">
                      <CChartLine
                        data={{
                          labels: ['Sensor 1', 'Sensor 2', 'Sensor 3', 'Sensor 4', 'Sensor 5'],
                          datasets: [
                            {
                              label: 'Temperature (°C)',
                              backgroundColor: 'rgba(75, 192, 192, 0.2)',
                              borderColor: 'rgba(75, 192, 192, 1)',
                              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                              pointBorderColor: '#fff',
                              data: deviceInfo.sensorData.map((sensor) => sensor.temperature),
                            },
                          ],
                        }}
                      />
                    </CTableDataCell>
                  </CTableRow>

                  {/* Tiêu đề cho Humidity */}
                  <CTableRow>
                    <CTableDataCell colSpan="2" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      Humidity (%)
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell colSpan="2">
                      <CChartLine
                        data={{
                          labels: ['Sensor 1', 'Sensor 2', 'Sensor 3', 'Sensor 4', 'Sensor 5'],
                          datasets: [
                            {
                              label: 'Humidity (%)',
                              backgroundColor: 'rgba(153, 102, 255, 0.2)',
                              borderColor: 'rgba(153, 102, 255, 1)',
                              pointBackgroundColor: 'rgba(153, 102, 255, 1)',
                              pointBorderColor: '#fff',
                              data: deviceInfo.sensorData.map((sensor) => sensor.humidity),
                            },
                          ],
                        }}
                      />
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCol>
            <CCol sm="6">
              <CTable striped bordered>
                <CTableHead>
                  <CTableRow></CTableRow>
                </CTableHead>
                <CTableBody>
                  {/* Tiêu đề cho Gas PPM Data */}
                  <CTableRow>
                    <CTableDataCell colSpan="2" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      Gas PPM Data
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell colSpan="2">
                      <CChartLine
                        data={{
                          labels: ['Sensor 1', 'Sensor 2', 'Sensor 3', 'Sensor 4', 'Sensor 5'],
                          datasets: [
                            {
                              label: 'Gas PPM Data',
                              backgroundColor: 'rgba(220, 220, 220, 0.2)',
                              borderColor: 'rgba(220, 220, 220, 1)',
                              pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                              pointBorderColor: '#fff',
                              data: deviceInfo.sensorData.map((sensor) => sensor.gas_ppm),
                            },
                          ],
                        }}
                      />
                    </CTableDataCell>
                  </CTableRow>

                  {/* Tiêu đề cho Flame Detected */}
                  <CTableRow>
                    <CTableDataCell colSpan="2" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      Flame Detected
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell colSpan="2" style={{ height: '250px' }}>
                      <CChartDoughnut
                        data={{
                          labels: ['Flame Detected', 'No Flame'],
                          datasets: [
                            {
                              data: [
                                deviceInfo.sensorData.filter((sensor) => sensor.flame_detected)
                                  .length, // Số lượng sensor có lửa
                                deviceInfo.sensorData.filter((sensor) => !sensor.flame_detected)
                                  .length, // Số lượng sensor không có lửa
                              ],
                              backgroundColor: ['#ff0000', '#00ff00'],
                              hoverBackgroundColor: ['#ff4d4d', '#66ff66'],
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                            tooltip: {
                              callbacks: {
                                label: (tooltipItem) => {
                                  return tooltipItem.raw === 1 ? 'Flame Detected' : 'No Flame'
                                },
                              },
                            },
                          },
                        }}
                      />
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default DeviceInfomation
