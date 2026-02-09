import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { loginAPI } from '../api/index'
import { fetchUser } from '../store/reducers/userReducer'
import { useDispatch } from 'react-redux'
import { FaRegEye } from "react-icons/fa"
import { FaRegEyeSlash } from "react-icons/fa"
import toast from 'react-hot-toast'

const Login = () => {
    const { register, handleSubmit } = useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const backendBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8181"
    const googleAuthUrl = `${backendBaseUrl}/oauth2/authorization/google`

    const handlePassword = () => {
        setShowPassword(prev => !prev)
    }

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            // Clear any stale OAuth token so cookie-based auth is used
            localStorage.removeItem("authToken")
            await loginAPI(data)
            await dispatch(fetchUser()).unwrap()
            toast.success("Login successful! Welcome back.")
            navigate("/dashboard")
        } catch (err) {
            console.error("Login error", err)

            // ✅ DISPLAY ERROR TO USER
            const backend = err.response?.data
            const errorMessage =
                backend?.message ||
                backend?.error ||
                "Invalid username/email or password"

            toast.error(errorMessage, {
                icon: '❌',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <Link
                to={"/"}
                className='cursor-pointer m-3 hover:bg-black hover:text-white duration-300 transition-all bg-white p-3 shadow-2xl absolute top-2 left-2 rounded-2xl'
            >
                ← Back to Landing Page
            </Link>

            <div className='w-full max-w-md bg-white rounded-lg shadow-2xl p-8'>
                <h1 className='text-2xl font-semibold text-center mb-7'>
                    Login to Sync data
                </h1>

                <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
                    <button
                        type="button"
                        onClick={() => window.location.assign(googleAuthUrl)}
                        className="w-full border border-gray-300 py-2 rounded-md transition-all duration-250 hover:bg-gray-100"
                    >
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-200"></div>
                        <span className="text-xs text-gray-500">OR</span>
                        <div className="h-px flex-1 bg-gray-200"></div>
                    </div>

                    <label
                        className='block text-sm font-medium text-gray-700 mb-1'
                        htmlFor="identifier"
                    >
                        Email/Username:
                    </label>

                    <input
                        className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200'
                        placeholder='Enter Email or Username'
                        id='identifier'
                        {...register('identifier', { required: true })}
                    />

                    <label htmlFor="password">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("password", { required: true })}
                            placeholder='Enter Password'
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200"
                        />

                        <button
                            type="button"
                            tabIndex={-1}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={handlePassword}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                    </div>

                    <div className="mt-1 text-center">
                        <p className="text-sm text-gray-600">
                            Don't Have an Account?{' '}
                            <Link
                                to="/register"
                                className="text-green-600 hover:text-green-700 font-medium"
                            >
                                Register now!
                            </Link>
                        </p>
                    </div>

                    <button
                        disabled={loading}
                        className={`w-full border border-green-600 border-2 py-2 mt-1 rounded-md transition-all duration-250 ${
                            loading
                                ? 'opacity-50 cursor-not-allowed bg-gray-300'
                                : 'cursor-pointer hover:bg-green-400 hover:text-white'
                        }`}
                        type='submit'
                    >
                        {loading ? 'Logging in...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
