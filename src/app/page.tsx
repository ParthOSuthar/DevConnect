'use client'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const router = useRouter()

	const searchParams = useSearchParams();

    useEffect(() => {
        const unauthorized = searchParams.get("unauthorized");

        if (unauthorized === "login") {
            toast.error("Please login first", { duration: 3000 });
        }

        if (unauthorized === "forbidden") {
            toast.error("You are not authorized to view this page", { duration: 3000 });
        }
    }, [searchParams]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const res = await signIn('credentials', {
			redirect: false,
			email,
			password,
		})

		if (res?.ok) {
			setTimeout(() => {
				router.push('/dashboard')
			}, 1000)
		} else {
			setError('Invalid email or password')
		}
	}

	const handleSignupRedirect = () => {
		router.push('/signup')
	}

	return (
		<div className="max-w-md mx-auto mt-20">
			<h1 className="text-2xl font-bold mb-4">Login</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					className="w-full border p-2 rounded"
					type="email"
					placeholder="Email"
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					className="w-full border p-2 rounded"
					type="password"
					placeholder="Password"
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button
					type="submit"
					className="w-full bg-green-600 text-white p-2 rounded"
				>
					Login
				</button>
				<button
					type="button"
					onClick={handleSignupRedirect}
					className="w-full bg-blue-600 text-white p-2 rounded"
				>
					Sign Up
				</button>
				{error && <p className="text-red-500 text-sm">{error}</p>}
			</form>
		</div>
	)
}
