import type { Lang } from '../data'
import { t, platforms } from '../data'

interface Props {
  lang: Lang
  navigate: (page: string) => void
  dir: 'ltr' | 'rtl'
}

export function PlatformsPage({ lang, navigate }: Props) {
  const statusConfig = {
    available: { fr: 'Disponible', ar: 'متاح', color: '#16A36A', bg: '#E8FDF5' },
    'on-request': { fr: 'Sur demande', ar: 'عند الطلب', color: '#F59E0B', bg: '#FFFBEB' },
    'coming-soon': { fr: 'Bientôt', ar: 'قريباً', color: '#667085', bg: '#F0F3F8' },
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F9FC' }}>
      <div style={{ backgroundColor: '#132A4F', padding: '56px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#FFFFFF', margin: '0 0 12px' }}>
          {t('Plateformes disponibles', 'المنصات المتاحة', lang)}
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', margin: 0, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
          {t(
            'Accédez aux formations des meilleures plateformes mondiales depuis l\'Algérie.',
            'الوصول إلى دورات أفضل المنصات العالمية من الجزائر.',
            lang
          )}
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {platforms.map(platform => {
            const sc = statusConfig[platform.status as keyof typeof statusConfig]
            return (
              <div
                key={platform.id}
                style={{
                  backgroundColor: '#FFFFFF', border: '1px solid #E4E9F0', borderRadius: 16,
                  padding: '24px', transition: 'all 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 20px rgba(19,42,79,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    backgroundColor: platform.dark ? '#1A1A2E' : platform.color + '15',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: platform.dark ? platform.color : platform.color }}>
                      {platform.name.charAt(0)}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                    backgroundColor: sc.bg, color: sc.color,
                    border: `1px solid ${sc.color}40`,
                  }}>
                    {lang === 'ar' ? platform.statusAr : sc.fr}
                  </span>
                </div>

                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#172033', margin: '0 0 8px' }}>
                  {platform.name}
                </h3>

                <p style={{ fontSize: 14, color: '#667085', margin: '0 0 16px', lineHeight: 1.6 }}>
                  {t(
                    `Accédez aux formations ${platform.name} payées en dinars.`,
                    `الوصول إلى دورات ${platform.name} مدفوعة بالدينار.`,
                    lang
                  )}
                </p>

                {platform.status === 'available' && (
                  <button
                    onClick={() => navigate('catalog')}
                    style={{
                      backgroundColor: '#132A4F', color: '#FFFFFF',
                      border: 'none', cursor: 'pointer',
                      padding: '9px 18px', borderRadius: 8,
                      fontSize: 13, fontWeight: 700, width: '100%',
                    }}
                  >
                    {t('Voir les formations', 'عرض الدورات', lang)}
                  </button>
                )}
                {platform.status === 'on-request' && (
                  <button
                    onClick={() => navigate('custom-request')}
                    style={{
                      backgroundColor: '#FFFBEB', color: '#F59E0B',
                      border: '1.5px solid #FDE68A', cursor: 'pointer',
                      padding: '9px 18px', borderRadius: 8,
                      fontSize: 13, fontWeight: 700, width: '100%',
                    }}
                  >
                    {t('Faire une demande', 'تقديم طلب', lang)}
                  </button>
                )}
                {platform.status === 'coming-soon' && (
                  <div style={{
                    backgroundColor: '#F0F3F8', borderRadius: 8,
                    padding: '9px', textAlign: 'center',
                    fontSize: 13, fontWeight: 600, color: '#667085',
                  }}>
                    {t('Bientôt disponible', 'قريباً', lang)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
