import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email') // Store email in localStorage
    if (token && email) {
      setUser({ token, email })
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      console.log('Login attempt:', { email, body: JSON.stringify({ email, password }) })
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      })
      console.log('Login response:', { status: response.status, data: response.data, url: response.config.url })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('email', email) // Store email
      setUser({ token: response.data.token, email })
      return true
    } catch (err) {
      console.error('Login error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
        stack: err.stack
      })
      throw err.response?.data?.error || err.message || 'Login failed'
    }
  }

  const register = async (email, password) => {
    try {
      console.log('Register attempt:', { email, body: JSON.stringify({ email, password }) })
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      })
      console.log('Register response:', { status: response.status, data: response.data, url: response.config.url })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('email', email) // Store email
      setUser({ token: response.data.token, email })
      return true
    } catch (err) {
      console.error('Register error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
        stack: err.stack
      })
      throw err.response?.data?.error || err.message || 'Registration failed'
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email') // Remove email
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}