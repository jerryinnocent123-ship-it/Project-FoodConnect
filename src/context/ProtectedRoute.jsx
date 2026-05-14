import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { LoadingSpinner } from '../components/UI/LoadingSpinner'

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner />

  if (!user) return <Navigate to="/login" replace />

  const role = user?.role

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return children
}