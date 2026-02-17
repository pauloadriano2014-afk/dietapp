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

    // Autenticação via NextAuth utilizando o Provider de Credentials configurado para o Neon
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

    // O NextAuth gerencia a sessão. Após o login, redirecionamos com base no papel (role)
    // Para simplificar no client-side, fazemos um refresh para atualizar o estado da sessão
    router.refresh()
    
    // O redirecionamento inteligente pode ser feito via middleware ou aqui
    // Por padrão, enviamos para o dashboard do aluno, o middleware cuidará da proteção
    router.push('/dashboard-aluno')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 italic tracking-tighter">
            KORE <span className="text-blue-600">FIT</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium uppercase tracking-widest">
            Consultoria Fitness Online
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium bg-slate-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium bg-slate-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 uppercase tracking-widest text-sm"
          >
            {loading ? 'Validando Acesso...' : 'Entrar na Consultoria'}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Uso exclusivo para alunos e parceiros da consultoria.
        </p>
      </div>
    </div>
  )
}