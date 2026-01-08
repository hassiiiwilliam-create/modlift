import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/useUser'

export function useAdminCheck() {
  const navigate = useNavigate()
  const { user } = useUser()
  const [state, setState] = useState({ loading: true, isAdmin: false })

  useEffect(() => {
    let isMounted = true

    if (!user?.id) {
      navigate('/login', { replace: true })
      return
    }

    const verifyAdmin = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', user.id)
          .single()

        if (!isMounted) return

        if (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to verify admin status', error)
          navigate('/account', { replace: true })
          return
        }

        if (data?.is_admin) {
          setState({ loading: false, isAdmin: true })
        } else {
          navigate('/account', { replace: true })
        }
      } catch (err) {
        if (!isMounted) return
        // eslint-disable-next-line no-console
        console.error('Unexpected error during admin check', err)
        navigate('/account', { replace: true })
      } finally {
        if (isMounted) {
          setState((prev) => ({ ...prev, loading: false }))
        }
      }
    }

    verifyAdmin()

    return () => {
      isMounted = false
    }
  }, [navigate, user])

  return state
}
