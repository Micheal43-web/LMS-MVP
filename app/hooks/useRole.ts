"use client"

// hooks/useRole.ts
import { useEffect, useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { supabase } from '../lib/supabase/client'

export function useRole() {
  const { user } = useUser()
  const [role, setRole] = useState<string | null>(null)
  const [loadingRole, setLoadingRole] = useState(true)

  useEffect(() => {
  if (!user) {
    setRole(null)
    setLoadingRole(false)
    return
  }

  const getRole = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()


    if (error) {
      setRole(null)
      setLoadingRole(false)
      return
    }

    setRole(data?.role ?? null)
    setLoadingRole(false)
  }

  getRole()
}, [user])

  return { role, loadingRole }
}