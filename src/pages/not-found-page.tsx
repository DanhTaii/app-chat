import { Link } from 'react-router'
import { ROUTES } from '../constants/routes'

function NotFoundPage() {
  return (
    <>
      <h1>404 - Không tìm thấy trang</h1>
      <Link to={ROUTES.ROOT}>Về trang chủ</Link>
    </>
  )
}

export default NotFoundPage
