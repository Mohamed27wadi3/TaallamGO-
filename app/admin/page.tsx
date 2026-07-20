export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm mb-2">Commandes</h3>
          <p className="text-2xl font-bold">-</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm mb-2">Revenu (DZD)</h3>
          <p className="text-2xl font-bold">-</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm mb-2">Tickets ouverts</h3>
          <p className="text-2xl font-bold">-</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm mb-2">Remboursements en attente</h3>
          <p className="text-2xl font-bold">-</p>
        </div>
      </div>
      <p className="text-gray-400 mt-8">Les écrans admin seront connectés au backend.</p>
    </div>
  )
}
