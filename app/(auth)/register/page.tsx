'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Registration successful! Redirecting to onboarding...')
      router.push('/onboarding/steps/business-profile')
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded-xl shadow">
      <h1 className="text-2xl mb-4 font-semibold">Register</h1>
      <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="mb-3" />
      <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="mb-3" />
      <Button onClick={handleRegister} className="w-full mb-2" disabled={loading}>
        {loading ? (
          <div className="flex items-center gap-2 justify-center">
            <Spinner />
            Registering...
          </div>
        ) : (
          'Register'
        )}
      </Button>
      <Button variant="outline" onClick={handleGoogleLogin} className="w-full">
        Continue with Google
      </Button>
    </div>
  )
}
