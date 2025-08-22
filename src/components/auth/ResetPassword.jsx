'use client'

import { useSearchParams } from "next/navigation";
import { useState } from "react";


const ResetPassword = ()=> {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e)=> {
        e.preventDefault()
        setMessage('')
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return;
        }

        try { 
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ token, password}),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Something went wrong')
            setMessage('Password has been reset successfully!')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="text"
                    placeholder="New password"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    className="w-full border px-4 py2 rounded-lg"    
                />
                <input 
                    type="text" 
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e)=> setConfirmPassword(e.target.value)}
                    className="w-full border px-4 py-2 rounded-lg"
                />
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                    ResetPassword
                </button>
            </form>
            {message && <p className="text-green-600 mt-3">{message}</p>}
            {error && <p className="text-red-600 mt-3">{error}</p>}
        </div>
    )
}

export default ResetPassword;