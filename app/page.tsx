export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Apprenez sans frontières, payez en dinars
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          TaallamGo vous facilite l'accès légal aux meilleures formations mondiales avec un paiement simple en dinars algériens.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/catalog"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
          >
            Explorer les formations
          </a>
          <a
            href="/auth/login"
            className="px-8 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50"
          >
            Se connecter
          </a>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-semibold mb-2">1. Choisissez</h3>
            <p className="text-gray-600 text-sm">Parcourez notre catalogue de formations internationales</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="font-semibold mb-2">2. Prix transparent</h3>
            <p className="text-gray-600 text-sm">Connaissez le prix final en dinars avant le paiement</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🏦</div>
            <h3 className="font-semibold mb-2">3. Payez en dinars</h3>
            <p className="text-gray-600 text-sm">Moyens de paiement locaux disponibles</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="font-semibold mb-2">4. Accédez</h3>
            <p className="text-gray-600 text-sm">Recevez votre accès sur votre propre compte</p>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 TaallamGo. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
