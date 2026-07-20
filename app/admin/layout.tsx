import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session?.user) {
    redirect('/auth/login')
  }

  // TODO: Check admin permission
  // const isAdmin = await hasPermission(session.user.id, 'admin', 'read')
  // if (!isAdmin) {
  //   redirect('/dashboard')
  // }

  return <div className="min-h-screen bg-gray-900 text-white">{children}</div>
}
