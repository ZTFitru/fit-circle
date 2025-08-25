'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  // const searchParams = useSearchParams()
  // const token = searchParams.get('token')

  useEffect(()=> {
    const params = new URLSearchParams(window.location.search)
    setToken(params.get('token'))
  }, [])

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to reset password')

      setMessage('Password reset successful! Redirecting to login...')
      setTimeout(() => router.push('/auth/login'), 2000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow'>
      <h2 className='text-xl font-bold mb-4'>Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="password" 
          placeholder="New password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input 
          type="password" 
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e)=> setConfirmPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Reset Password
        </button>
      </form>
      {message && <p className="text-green-600 mt-3">{message}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  )
}