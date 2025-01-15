import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://github.com/hieunv2011" target="_blank" rel="noopener noreferrer">
          Hệ thống quản lý thiết bị cảnh báo cháy
        </a>
        <span className="ms-1">&copy; 2025</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Nguyễn Việt Hiếu- 20192849</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
