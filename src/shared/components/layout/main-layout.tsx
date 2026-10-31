import { Link, Outlet } from 'react-router'
import { ROUTES } from '../../constants/routes'

function MainLayout() {
  return (
    <>
      <nav>
        <Link to={ROUTES.LOGIN}>Login</Link> | <Link to={ROUTES.CHAT}>Chat</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default MainLayout
