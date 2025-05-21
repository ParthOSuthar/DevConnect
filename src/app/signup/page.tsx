'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function SignupPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({ name: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })

        const data = await res.json()
        setLoading(false)

        if (res.ok) {
            const loginRes = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            })

            if (loginRes?.ok) {
                router.replace('/dashboard')
            } else {
                setError('Signup succeeded, but login failed.')
            }
        } else {
            setError(data.error || 'Signup failed')
        }
    }

    const handleSigninRedirect = () => {
        router.push('/')
    }

    return (
        <div className="max-w-md mx-auto mt-20">
            <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="w-full border p-2 rounded"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    required
                />
                <input
                    className="w-full border p-2 rounded"
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />
                <input
                    className="w-full border p-2 rounded"
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white p-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
                <button
                    type="button"
                    onClick={handleSigninRedirect}
                    className="w-full bg-blue-600 text-white p-2 rounded"
                >
                    Sign In
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
        </div>
    )
}
