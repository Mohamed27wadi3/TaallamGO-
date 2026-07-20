import { useEffect, useState } from 'react'
import type { Lang } from '../data'
import { t } from '../data'
import { useIsMobile } from '../hooks/useIsMobile'
import { formatDzd } from '../format'

type ProfileData = {
  email: string
  emailVerified: string | null
  name: string | null
  image: string | null
  createdAt: string
  profile: {
    firstName: string | null
    lastName: string | null
    phone: string | null
    wilaya: string | null
    language: string
  } | null
  orders: Array<{
    id: string
    publicId: string
    status: string
    totalDzd: number
    createdAt: string
  }>
  sessions: Array<{
    id: string
    expires: string
    updatedAt: string
  }>
}

interface Props {
  lang: Lang
  navigate: (page: string) => void
  dir: 'ltr' | 'rtl'
}

export function ProfilePage({ lang, navigate, dir }: Props) {
  const isMobile = useIsMobile()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    wilaya: '',
    language: lang,
    currentPassword: '',
    newPassword: '',
  })

  useEffect(() => {
    let active = true

    async function loadProfile() {
      setLoading(true)
      setError('')
      const response = await fetch('/api/profile')
      if (!active) return

      if (response.status === 401) {
        navigate('auth-login')
        return
      }

      const result = await response.json()
      if (!response.ok || !result.success) {
        setError(result.error || t('Impossible de charger le profil.', 'تعذر تحميل الملف.', lang))
        setLoading(false)
        return
      }

      const data = result.data as ProfileData
      setProfile(data)
      setForm({
        firstName: data.profile?.firstName || '',
        lastName: data.profile?.lastName || '',
        phone: data.profile?.phone || '',
        wilaya: data.profile?.wilaya || '',
        language: data.profile?.language === 'ar' ? 'ar' : 'fr',
        currentPassword: '',
        newPassword: '',
      })
      setLoading(false)
    }

    loadProfile()
    return () => {
      active = false
    }
  }, [lang, navigate])

  const inputStyle = {
    width: '100%',
    height: 44,
    border: '1.5px solid var(--border)',
    borderRadius: 10,
    padding: '0 14px',
    fontSize: 14,
    color: 'var(--foreground)',
    backgroundColor: 'var(--surface)',
    outline: 'none',
    direction: dir,
    fontFamily: lang === 'ar' ? "'IBM Plex Sans Arabic'" : "'Plus Jakarta Sans'",
  }

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      wilaya: form.wilaya,
      language: form.language,
      currentPassword: form.currentPassword || undefined,
      newPassword: form.newPassword || undefined,
    }

    const response = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const result = await response.json()
    setSaving(false)

    if (!response.ok || !result.success) {
      setError(result.error || t('Enregistrement impossible.', 'تعذر الحفظ.', lang))
      return
    }

    setMessage(t('Profil mis à jour.', 'تم تحديث الملف.', lang))
    setForm(current => ({ ...current, currentPassword: '', newPassword: '' }))
  }

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', backgroundColor: 'var(--background)', display: 'grid', placeItems: 'center', color: 'var(--muted-foreground)' }}>
        {t('Chargement...', 'جاري التحميل...', lang)}
      </div>
    )
  }

  const initials = `${form.firstName[0] || ''}${form.lastName[0] || ''}`.toUpperCase() || (profile?.email[0] || 'T').toUpperCase()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', padding: isMobile ? '28px 14px' : '44px 24px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>
              {t('Mon profil', 'ملفي الشخصي', lang)}
            </h1>
            <p style={{ color: 'var(--muted-foreground)', margin: '8px 0 0', fontSize: 15 }}>
              {t('Informations du compte et sécurité.', 'معلومات الحساب والأمان.', lang)}
            </p>
          </div>
          <button onClick={() => navigate('dashboard')} style={{ backgroundColor: 'var(--surface)', color: 'var(--primary)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', fontWeight: 700 }}>
            {t('Mes commandes', 'طلباتي', lang)}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '320px minmax(0, 1fr)', gap: 20 }}>
          <aside style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
            <div style={{ width: 76, height: 76, borderRadius: '50%', backgroundColor: 'var(--soft-accent)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, overflow: 'hidden', marginBottom: 16 }}>
              {profile?.image ? <img src={profile.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 4px' }}>
              {[form.firstName, form.lastName].filter(Boolean).join(' ') || profile?.name || profile?.email}
            </h2>
            <p style={{ color: 'var(--muted-foreground)', margin: '0 0 12px', fontSize: 14 }}>{profile?.email}</p>
            <span style={{ display: 'inline-flex', borderRadius: 999, padding: '5px 10px', backgroundColor: 'var(--surface-secondary)', color: 'var(--foreground)', fontSize: 12, fontWeight: 700 }}>
              {profile?.emailVerified ? t('Email vérifié', 'بريد مؤكد', lang) : t('Email non vérifié', 'بريد غير مؤكد', lang)}
            </span>
            <div style={{ marginTop: 18, color: 'var(--muted-foreground)', fontSize: 13 }}>
              {t('Inscrit le', 'تاريخ التسجيل', lang)} {profile ? new Date(profile.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'fr-DZ') : ''}
            </div>
          </aside>

          <main style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <form onSubmit={saveProfile} style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: isMobile ? 18 : 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 18px' }}>
                {t('Informations personnelles', 'المعلومات الشخصية', lang)}
              </h2>
              {message && <div role="status" style={{ color: 'var(--success)', fontWeight: 700, marginBottom: 14 }}>{message}</div>}
              {error && <div role="alert" style={{ color: 'var(--error)', fontWeight: 700, marginBottom: 14 }}>{error}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
                {[
                  ['firstName', t('Prénom', 'الاسم', lang)],
                  ['lastName', t('Nom', 'اللقب', lang)],
                  ['phone', t('Téléphone', 'الهاتف', lang)],
                  ['wilaya', t('Wilaya', 'الولاية', lang)],
                ].map(([key, label]) => (
                  <label key={key} style={{ display: 'block' }}>
                    <span style={{ display: 'block', color: 'var(--foreground)', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{label}</span>
                    <input value={form[key as keyof typeof form]} onChange={event => setForm(current => ({ ...current, [key]: event.target.value }))} style={inputStyle} />
                  </label>
                ))}
                <label style={{ display: 'block' }}>
                  <span style={{ display: 'block', color: 'var(--foreground)', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{t('Langue', 'اللغة', lang)}</span>
                  <select value={form.language} onChange={event => setForm(current => ({ ...current, language: event.target.value as Lang }))} style={inputStyle}>
                    <option value="fr">Français</option>
                    <option value="ar">العربية</option>
                  </select>
                </label>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--foreground)', margin: '24px 0 14px' }}>
                {t('Mot de passe', 'كلمة المرور', lang)}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
                <input type="password" placeholder={t('Mot de passe actuel', 'كلمة المرور الحالية', lang)} value={form.currentPassword} onChange={event => setForm(current => ({ ...current, currentPassword: event.target.value }))} style={inputStyle} />
                <input type="password" placeholder={t('Nouveau mot de passe', 'كلمة مرور جديدة', lang)} value={form.newPassword} onChange={event => setForm(current => ({ ...current, newPassword: event.target.value }))} style={inputStyle} />
              </div>
              <button disabled={saving} style={{ marginTop: 20, backgroundColor: saving ? 'var(--border)' : 'var(--accent)', color: saving ? 'var(--muted-foreground)' : 'var(--accent-foreground)', border: 'none', borderRadius: 12, padding: '12px 20px', cursor: saving ? 'default' : 'pointer', fontWeight: 800 }}>
                {saving ? t('Enregistrement...', 'جاري الحفظ...', lang) : t('Enregistrer', 'حفظ', lang)}
              </button>
            </form>

            <section style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: isMobile ? 18 : 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 14px' }}>{t('Historique récent', 'آخر الطلبات', lang)}</h2>
              {(profile?.orders.length || 0) === 0 ? (
                <p style={{ color: 'var(--muted-foreground)', margin: 0 }}>{t('Aucune commande récente.', 'لا توجد طلبات حديثة.', lang)}</p>
              ) : profile?.orders.map(order => (
                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 0', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ color: 'var(--foreground)', fontWeight: 800 }}>{order.publicId}</div>
                    <div style={{ color: 'var(--muted-foreground)', fontSize: 13 }}>{order.status}</div>
                  </div>
                  <strong style={{ color: 'var(--primary)' }}>{formatDzd(order.totalDzd)} DZD</strong>
                </div>
              ))}
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
