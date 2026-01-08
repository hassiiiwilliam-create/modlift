import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { supabase } from '../supabaseClient'
import { Mail, Lock, ArrowRight, Loader2, CheckCircle2, User } from 'lucide-react'
import ModLiftLogo from '../components/ModLiftLogo'

export default function Signup() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            display_name: `${firstName.trim()} ${lastName.trim().charAt(0)}.`,
          },
        },
      })
      if (signUpError) throw signUpError
      setSuccess(true)
      toast.success('Account created! Check your inbox to verify your email.')
    } catch (err) {
      console.error(err)
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider) => {
    try {
      const redirectTo = `${window.location.origin}/account`
      const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } })
      if (oauthError) throw oauthError
    } catch (err) {
      console.error(err)
      toast.error(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-auth-gradient">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-flame-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-volt-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <Link to="/" className="group transition-transform hover:scale-105">
            <ModLiftLogo size="lg" />
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="auth-card"
        >
          {success ? (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-torque-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-torque-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
              <p className="text-steel-400 mb-6">
                We've sent a verification link to <span className="text-white font-medium">{email}</span>
              </p>
              <Link to="/login" className="btn-secondary">
                Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="space-y-2 text-center mb-8">
                <h1 className="text-3xl font-bold text-white">Create Account</h1>
                <p className="text-steel-400">Join ModLift to save builds and track orders</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-3 rounded-xl bg-redline-500/10 border border-redline-500/30 text-sm text-redline-400"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-steel-500" />
                      <input
                        type="text"
                        placeholder="First name"
                        className="input input-icon"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        required
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Last name"
                        className="input pl-4"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-steel-500" />
                    <input
                      type="email"
                      placeholder="Email address"
                      className="input input-icon"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-steel-500" />
                    <input
                      type="password"
                      placeholder="Create a password"
                      className="input input-icon"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Password Requirements */}
                <p className="text-xs text-steel-500">
                  Password must be at least 6 characters
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-steel-800" />
                <span className="text-xs uppercase tracking-wider text-steel-500 font-medium">or continue with</span>
                <div className="flex-1 h-px bg-steel-800" />
              </div>

              {/* OAuth */}
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                className="btn-secondary w-full"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <p className="text-center text-sm text-steel-500 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-flame-400 hover:text-flame-300 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-steel-600 mt-8"
        >
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-steel-500 hover:text-steel-400 underline">Terms</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-steel-500 hover:text-steel-400 underline">Privacy Policy</Link>
        </motion.p>
      </motion.div>
    </div>
  )
}
