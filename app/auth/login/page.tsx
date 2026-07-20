'use client'

import { FormEvent, useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { LocalizedThemeLogo } from '@/src/components/LocalizedThemeLogo'
import type { Lang } from '@/src/data'

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'fr'
  const saved = window.localStorage.getItem('taallamgo-lang')
  return saved === 'ar' ? 'ar' : 'fr'
}

export default function LoginPage() {
  const [lang, setLang] = useState<Lang>('fr')
  const [email, setEmail] = useState('demo@taallamgo.dz')
  const [password, setPassword] = useState('demo123456')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLang(getInitialLang())
  }, [])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Email ou mot de passe incorrect.')
      return
    }

    const params = new URLSearchParams(window.location.search)
    const callbackUrl = params.get('callbackUrl')
    window.location.href = callbackUrl && callbackUrl.startsWith('/') ? callbackUrl : '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="rounded-lg shadow-lg p-8 max-w-md w-full" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex justify-center mb-6">
          <a href="/" aria-label="TaallamGo">
            <LocalizedThemeLogo lang={lang} />
          </a>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--foreground)' }}>Se connecter a TaallamGo</h1>

        <form className="space-y-4" onSubmit={submit}>
          {error && <div role="alert" className="text-sm font-semibold" style={{ color: 'var(--error)' }}>{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Email</label>
            <input
              type="email"
              placeholder="votre@email.dz"
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Mot de passe</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
              value={password}
              onChange={event => setPassword(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-semibold"
            style={{ backgroundColor: loading ? 'var(--border)' : 'var(--accent)', color: loading ? 'var(--muted-foreground)' : 'var(--accent-foreground)' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--muted-foreground)' }}>
          Pas encore inscrit?{' '}
          <a href="/auth/register" className="hover:underline" style={{ color: 'var(--accent)' }}>
            Creer un compte
          </a>
        </p>
      </div>
    </div>
  )
}
