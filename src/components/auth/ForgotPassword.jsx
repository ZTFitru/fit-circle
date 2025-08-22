'use client'

const { useState } = require("react")


const ForgotPassword = ()=> {
    const [usernameOrEmail, setUsernameOrEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e)=> {
        e.preventDefault()
        setMessage('')
        setError('')

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ usernameOrEmail}),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Something went wrong')

            setMessage('If an account exists, a password reset link has been sent.')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow'>
            <h2 className='text-xl font-bold mb-4'>
                Forgot Password
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="text" 
                    placeholder="Enter your username or email"
                    value={usernameOrEmail}
                    onChange={(e)=> setUsernameOrEmail(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                    Send Reset Link
                </button>
            </form>
            {message && <p className="text-green-600 mt-3">{message}</p>}
            {error && <p className="text-red-600 mt-3">{error}</p>}
        </div>
    )
}

export default ForgotPassword;