'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            alert(error.message)
        } else {
            router.push('/dashboard') // adjust this route later
        }
        setLoading(false)
    }

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({ provider: 'google' })
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-4 border rounded-xl shadow">
            <h1 className="text-2xl mb-4 font-semibold">Log In</h1>
            <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="mb-3" />
            <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="mb-3" />
            <Button onClick={handleLogin} className="w-full mb-2" disabled={loading}>
                {loading ? (
                    <div className="flex items-center gap-2 justify-center">
                        <Spinner />
                        Loading...
                    </div>
                ) : (
                    'Login'
                )}
            </Button>
            <Button variant="outline" onClick={handleGoogleLogin} className="w-full">
                Continue with Google
            </Button>
        </div>
    )
}
