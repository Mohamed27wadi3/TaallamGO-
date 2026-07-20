export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="rounded-lg shadow-lg p-8 max-w-md w-full" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--foreground)' }}>Créer un compte TaallamGo</h1>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Email</label>
            <input
              type="email"
              placeholder="votre@email.dz"
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Confirmer le mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}
          >
            Créer mon compte
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--muted-foreground)' }}>
          Vous avez un compte?{' '}
          <a href="/auth/login" className="hover:underline" style={{ color: 'var(--accent)' }}>
            Se connecter
          </a>
        </p>
      </div>
    </div>
  )
}
