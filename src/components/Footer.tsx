import type { Lang } from '../data'
import { t } from '../data'
import { taallamGoLogoSrc } from '../logo'

interface Props {
  lang: Lang
  navigate: (page: string) => void
  dir: 'ltr' | 'rtl'
}

export function Footer({ lang, navigate, dir }: Props) {
  const cols = [
    {
      title: t('Plateforme', 'المنصة', lang),
      links: [
        { label: t('Catalogue', 'الكتالوج', lang), page: 'catalog' },
        { label: t('Plateformes', 'المنصات', lang), page: 'platforms' },
        { label: t('Comment ça marche', 'كيف يعمل', lang), page: 'how-it-works' },
        { label: t('Organisations', 'المؤسسات', lang), page: 'organizations' },
      ],
    },
    {
      title: t('Confiance', 'الثقة', lang),
      links: [
        { label: t('Sécurité & confidentialité', 'الأمان والخصوصية', lang), page: 'trust' },
        { label: t('À propos', 'حول', lang), page: 'about' },
        { label: t('Conditions d\'utilisation', 'شروط الاستخدام', lang), page: 'terms' },
        { label: t('Politique de confidentialité', 'سياسة الخصوصية', lang), page: 'privacy' },
      ],
    },
    {
      title: t('Support', 'الدعم', lang),
      links: [
        { label: t('Centre d\'aide', 'مركز المساعدة', lang), page: 'help' },
        { label: t('Contact', 'اتصل بنا', lang), page: 'contact' },
        { label: t('Demande personnalisée', 'طلب مخصص', lang), page: 'custom-request' },
        { label: t('Suivre ma commande', 'تتبع طلبي', lang), page: 'dashboard' },
      ],
    },
  ]

  return (
    <footer style={{ backgroundColor: '#132A4F', color: '#FFFFFF', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <img src={taallamGoLogoSrc} alt="TaallamGo" style={{ height: 36, width: 'auto', filter: 'brightness(0) invert(1)', marginBottom: 16 }} />
            <p style={{ fontSize: 14, color: '#94A6BE', lineHeight: 1.7, margin: 0 }}>
              {t(
                'Les meilleures formations mondiales, accessibles depuis l\'Algérie.',
                'أفضل الدورات العالمية، متاحة من الجزائر.',
                lang
              )}
            </p>
            <p style={{ fontSize: 13, color: '#667085', marginTop: 16, fontStyle: 'italic' }}>
              {t(
                '« Apprenez sans frontières, payez en dinars. »',
                '« تعلّم بلا حدود وادفع بالدينار. »',
                lang
              )}
            </p>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(link => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.page)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 14, color: '#94A6BE', padding: 0,
                        textAlign: dir === 'rtl' ? 'right' : 'left',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#94A6BE')}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 13, color: '#667085', margin: 0 }}>
            © 2025 TaallamGo. {t('Tous droits réservés.', 'جميع الحقوق محفوظة.', lang)}
          </p>
        </div>
      </div>
    </footer>
  )
}
