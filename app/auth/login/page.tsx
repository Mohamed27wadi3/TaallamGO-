export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Se connecter à TaallamGo</h1>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="votre@email.dz"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
              defaultValue="demo@taallamgo.dz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
              defaultValue="demo123456"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Pas encore inscrit?{' '}
          <a href="/auth/register" className="text-indigo-600 hover:underline">
            Créer un compte
          </a>
        </p>

        <div className="mt-6 pt-6 border-t border-gray-300">
          <p className="text-xs text-gray-500 text-center">
            <strong>Démo:</strong> demo@taallamgo.dz / demo123456
          </p>
        </div>
      </div>
    </div>
  )
}
