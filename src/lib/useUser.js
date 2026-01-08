import { useContext } from 'react'
import { AppContext } from '@/App'

export function useUser() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useUser must be used within an AppContext provider.')
  }

  const { user, setUser, build, setBuild } = context
  return { user, setUser, build, setBuild }
}
