import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMsg('')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    if (data.session) {
      navigate('/')
    } else {
      setMsg('Registro creado. Revisa tu correo para confirmar.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <h1 className="mb-1 text-center text-2xl font-bold text-white">💧 AGUAMATIC</h1>
        <p className="mb-6 text-center text-sm text-slate-400">Crea tu cuenta</p>
        {error && <p className="mb-3 rounded-md bg-red-900/40 px-3 py-2 text-sm text-red-300">{error}</p>}
        {msg && <p className="mb-3 rounded-md bg-emerald-900/40 px-3 py-2 text-sm text-emerald-300">{msg}</p>}
        <label className="mb-1 block text-sm text-slate-300">Nombre completo</label>
        <input
          type="text" required value={name} onChange={e => setName(e.target.value)}
          className="mb-3 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-500"
        />
        <label className="mb-1 block text-sm text-slate-300">Correo</label>
        <input
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          className="mb-3 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-500"
        />
        <label className="mb-1 block text-sm text-slate-300">Contraseña (mín. 6)</label>
        <input
          type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
          className="mb-4 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-500"
        />
        <button disabled={loading} className="w-full rounded-md bg-cyan-600 py-2 font-semibold text-white hover:bg-cyan-500 disabled:opacity-50">
          {loading ? 'Creando…' : 'Crear cuenta'}
        </button>
        <p className="mt-4 text-center text-sm text-slate-400">
          ¿Ya tienes cuenta? <Link to="/login" className="text-cyan-400 hover:underline">Entra</Link>
        </p>
      </form>
    </div>
  )
}