import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = not yet checked, null = signed out
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)

  const loadProfile = useCallback(async (userId) => {
    if (!userId) { setProfile(null); return }
    setProfileLoading(true)
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (!error) setProfile(data)
    setProfileLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      if (s?.user) loadProfile(s.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      if (s?.user) loadProfile(s.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [loadProfile])

  const signUp = useCallback(async ({ email, password, firstName, lastName, grade, schoolId }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: 'student',
          grade: String(grade),
          school_id: schoolId,
        },
      },
    })
    return { data, error }
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }, [])

  const signInAsGuest = useCallback(async (meta = {}) => {
    const { data, error } = await supabase.auth.signInAnonymously({ options: { data: meta } })
    return { data, error }
  }, [])

  // Converts the current anonymous session into a full account in place —
  // same user id, so progress/points/streaks tied to it carry straight over.
  const upgradeGuest = useCallback(async ({ email, password, firstName, lastName, grade, schoolId }) => {
    const { data, error } = await supabase.auth.updateUser({
      email,
      password,
      data: { first_name: firstName, last_name: lastName, grade: String(grade), school_id: schoolId },
    })
    if (error) return { data, error }
    if (data?.user) {
      await supabase.from('profiles').update({
        first_name: firstName,
        last_name: lastName,
        grade: Number(grade),
        school_id: schoolId,
      }).eq('id', data.user.id)
      await loadProfile(data.user.id)
    }
    return { data, error }
  }, [loadProfile])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const resetPasswordForEmail = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }, [])

  const updatePassword = useCallback(async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    return { data, error }
  }, [])

  const refreshProfile = useCallback(() => {
    if (session?.user) return loadProfile(session.user.id)
  }, [session, loadProfile])

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    isAuthenticated: !!session,
    isGuest: !!session?.user?.is_anonymous,
    loading: session === undefined || (!!session && profileLoading && !profile),
    signUp,
    signIn,
    signInAsGuest,
    upgradeGuest,
    signOut,
    refreshProfile,
    resetPasswordForEmail,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
