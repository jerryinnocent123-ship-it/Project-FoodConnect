/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { buildDefaultUsername } from '../services/profileService'

const AuthContext = createContext({})

const normalizeRole = (role) => {
  if (typeof role !== 'string') return 'client'

  const normalized = role.trim().toLowerCase()
  if (normalized === 'admin') return 'admin'
  if (normalized === 'restaurant') return 'restaurant'
  return 'client'
}

const isDuplicateKeyError = (error) => error?.code === '23505'

const buildFriendlyAuthError = (error) => {
  if (isDuplicateKeyError(error)) {
    return new Error('A restaurant profile already exists for this account.')
  }

  if (error instanceof Error) {
    return error
  }

  return new Error('Unable to create your account right now.')
}

const buildUserWithRole = async (authUser) => {
  if (!authUser) return null

  let profile = null
  let profileError = null

  const profileById = await supabase
    .from('profile')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle()

  profile = profileById.data
  profileError = profileById.error

  if (!profile && authUser.email) {
    const profileByEmail = await supabase
      .from('profile')
      .select('*')
      .eq('email', authUser.email)
      .maybeSingle()

    profile = profileByEmail.data
    profileError = profileByEmail.error
  }

  if (profileError) {
    console.error('Error loading profile:', profileError)
  }

  const roleFromProfile = profile?.role
  const roleFromMetadata = authUser.user_metadata?.role || authUser.app_metadata?.role
  const role = normalizeRole(roleFromProfile || roleFromMetadata)

  return { ...authUser, role, profile }
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const signUpRequestRef = useRef(null)

  const refreshUser = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error('Error refreshing session:', error)
      return
    }

    const nextUser = session?.user ? await buildUserWithRole(session.user) : null
    setUser(nextUser)
  }

  useEffect(() => {
    let mounted = true

    const syncUserFromSession = async (session) => {
      try {
        const nextUser = session?.user ? await buildUserWithRole(session.user) : null

        if (!mounted) return

        setUser(nextUser)
      } catch (error) {
        console.error('Error syncing auth user:', error)
        if (!mounted) return
        setUser(null)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    const loadInitialSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error('Error getting session:', error)
      }

      await syncUserFromSession(session)
    }

    loadInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      window.setTimeout(() => {
        syncUserFromSession(session)
      }, 0)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email, password, full_name, tel, adresse, role) => {
    if (signUpRequestRef.current) {
      return signUpRequestRef.current
    }

    signUpRequestRef.current = (async () => {
      try {
        const normalizedRole = normalizeRole(role)
        const normalizedEmail = email.trim().toLowerCase()
        const normalizedFullName = full_name.trim()
        const normalizedTel = tel.trim()
        const normalizedAdresse = adresse.trim()

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              full_name: normalizedFullName,
              tel: normalizedTel,
              adresse: normalizedAdresse,
              role: normalizedRole,
            },
          },
        })

        if (authError) throw authError

        const authUser = authData?.user
        if (!authUser) {
          throw new Error('Account created without a user session.')
        }

        const profilePayload = {
          id: authUser.id,
          full_name: normalizedFullName,
          username: buildDefaultUsername(normalizedFullName || normalizedEmail.split('@')[0]),
          email: normalizedEmail,
          tel: normalizedTel,
          adresse: normalizedAdresse,
          images_url: null,
          role: normalizedRole,
        }

        const { error: profileError } = await supabase
          .from('profile')
          .upsert([profilePayload], { onConflict: 'id' })

        if (profileError) {
          await supabase.auth.signOut()
          throw profileError
        }

        if (normalizedRole === 'restaurant') {
          const { data: existingRestaurant, error: existingRestaurantError } = await supabase
            .from('restaurants')
            .select('id')
            .eq('owner_id', authUser.id)
            .maybeSingle()

          if (existingRestaurantError) {
            await supabase.auth.signOut()
            throw existingRestaurantError
          }

          if (!existingRestaurant) {
            const { error: restaurantError } = await supabase.from('restaurants').insert({
              name: normalizedFullName,
              owner_id: authUser.id,
              zone: normalizedAdresse.split(',')[0]?.trim() || null,
              status: 'pending',
              verified: false,
            })

            if (restaurantError && !isDuplicateKeyError(restaurantError)) {
              await supabase.auth.signOut()
              throw restaurantError
            }
          }
        }

        const userWithRole = { ...authUser, role: normalizedRole, profile: profilePayload }
        setUser(userWithRole)

        return { data: userWithRole, error: null }
      } catch (error) {
        const friendlyError = buildFriendlyAuthError(error)
        console.error('Sign up error:', friendlyError)
        return { data: null, error: friendlyError }
      } finally {
        signUpRequestRef.current = null
      }
    })()

    return signUpRequestRef.current
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      const authUser = data?.user
      if (!authUser) {
        throw new Error('No user returned after sign in.')
      }

      const userWithRole = await buildUserWithRole(authUser)
      setUser(userWithRole)

      return { data: { ...data, user: userWithRole }, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
    }
    return { error }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}
