'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Autenticação via NextAuth
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      alert('Erro ao entrar: Credenciais inválidas ou usuário não encontrado.')
      setLoading(false)
      return
    }

    // Após o login, usamos o redirecionamento inteligente que criamos
    router.refresh()
    router.push('/dashboard-redirect')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      {/* Glow de fundo para profundidade */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-slate-900/40 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-sm relative z-10">
        <header className="text-center mb-12">
          <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em] mb-2 italic">
            Acesso Exclusivo
          </p>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            Shape Natural<br/><span className="text-blue-600">de Elite</span>
          </h1>
        </header>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-3">
            <div>
              <input
                type="email"
                placeholder="SEU E-MAIL"
                className="w-full p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white font-bold outline-none focus:border-blue-600 transition-all placeholder:text-slate-700 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="SUA SENHA"
                className="w-full p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white font-bold outline-none focus:border-blue-600 transition-all placeholder:text-slate-700 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-6 rounded-[30px] shadow-2xl shadow-blue-900/20 hover:bg-blue-500 active:scale-95 transition-all uppercase tracking-[0.3em] text-[10px]"
          >
            {loading ? 'Validando Acesso...' : 'Entrar no Team'}
          </button>
        </form>

        <footer className="mt-16 text-center space-y-2">
          <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.2em] italic">
            Paulo Adriano Team • Performance & Resultados
          </p>
          <div className="h-px w-8 bg-slate-800 mx-auto"></div>
        </footer>
      </div>
    </div>
  )
}