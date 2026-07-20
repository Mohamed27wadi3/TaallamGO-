import { useState } from 'react'
import type { Lang } from '../data'
import { t, categories, courses } from '../data'
import { CourseCard } from '../components/CourseCard'
import { useIsMobile } from '../hooks/useIsMobile'
import { AnimatedBackground } from '../components/AnimatedBackground'
import { Reveal } from '../components/Reveal'

interface Props {
  lang: Lang
  navigate: (page: string, data?: unknown) => void
  dir: 'ltr' | 'rtl'
}

const steps = [
  {
    num: '01',
    fr: 'Choisissez votre formation',
    ar: 'Ø§Ø®ØªØ± Ø¯ÙˆØ±ØªÙƒ',
    descFr: 'Parcourez notre catalogue de formations internationales et trouvez celle qui correspond Ã  vos objectifs.',
    descAr: 'ØªØµÙØ­ ÙƒØªØ§Ù„ÙˆØ¬ Ø§Ù„Ø¯ÙˆØ±Ø§Øª Ø§Ù„Ø¯ÙˆÙ„ÙŠØ© ÙˆØ§Ø¹Ø«Ø± Ø¹Ù„Ù‰ Ù…Ø§ ÙŠÙ†Ø§Ø³Ø¨ Ø£Ù‡Ø¯Ø§ÙÙƒ.',
    icon: 'ðŸ”',
  },
  {
    num: '02',
    fr: 'Consultez le prix final en DZD',
    ar: 'Ø§Ø³ØªØ´Ø± Ø§Ù„Ø³Ø¹Ø± Ø§Ù„Ù†Ù‡Ø§Ø¦ÙŠ Ø¨Ø§Ù„Ø¯ÙŠÙ†Ø§Ø±',
    descFr: 'Consultez directement le total Ã  payer en dinars avant de confirmer votre commande.',
    descAr: 'ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨ Ø¨Ø§Ù„Ø¯ÙŠÙ†Ø§Ø± Ù‚Ø¨Ù„ ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø·Ù„Ø¨.',
    icon: 'ðŸ’°',
  },
  {
    num: '03',
    fr: 'Payez avec un moyen local disponible',
    ar: 'Ø§Ø¯ÙØ¹ Ø¨ÙˆØ³ÙŠÙ„Ø© Ù…Ø­Ù„ÙŠØ© Ù…ØªØ§Ø­Ø©',
    descFr: 'Choisissez parmi les mÃ©thodes de paiement autorisÃ©es en AlgÃ©rie : virement, CCP, mobile money.',
    descAr: 'Ø§Ø®ØªØ± Ù…Ù† Ø·Ø±Ù‚ Ø§Ù„Ø¯ÙØ¹ Ø§Ù„Ù…ØªØ§Ø­Ø© ÙÙŠ Ø§Ù„Ø¬Ø²Ø§Ø¦Ø±: ØªØ­ÙˆÙŠÙ„ Ø¨Ù†ÙƒÙŠØŒ CCPØŒ Ù…ÙˆØ¨Ø§ÙŠÙ„ Ù…ÙˆÙ†ÙŠ.',
    icon: 'ðŸ¦',
  },
  {
    num: '04',
    fr: 'Recevez et suivez votre accÃ¨s',
    ar: 'Ø§Ø³ØªÙ„Ù… ÙˆØªØ§Ø¨Ø¹ ÙˆØµÙˆÙ„Ùƒ',
    descFr: 'Votre accÃ¨s est livrÃ© sur votre propre compte. Suivez l\'avancement de votre commande en temps rÃ©el.',
    descAr: 'ÙŠÙØ³Ù„ÙŽÙ‘Ù… Ø§Ù„ÙˆØµÙˆÙ„ Ø¥Ù„Ù‰ Ø­Ø³Ø§Ø¨Ùƒ Ø§Ù„Ø´Ø®ØµÙŠ. ØªØ§Ø¨Ø¹ ØªÙ‚Ø¯Ù… Ø·Ù„Ø¨Ùƒ ÙÙŠ Ø§Ù„ÙˆÙ‚Øª Ø§Ù„ÙØ¹Ù„ÙŠ.',
    icon: 'âœ…',
  },
]

const trustPoints = [
  {
    icon: 'ðŸ‘¤',
    fr: 'AccÃ¨s personnel',
    ar: 'ÙˆØµÙˆÙ„ Ø´Ø®ØµÙŠ',
    descFr: 'Votre accÃ¨s est livrÃ© sur votre propre compte existant. Vos donnÃ©es restent les vÃ´tres.',
    descAr: 'ÙŠÙØ³Ù„ÙŽÙ‘Ù… Ø§Ù„ÙˆØµÙˆÙ„ Ø¥Ù„Ù‰ Ø­Ø³Ø§Ø¨Ùƒ Ø§Ù„Ø´Ø®ØµÙŠ. Ø¨ÙŠØ§Ù†Ø§ØªÙƒ ØªØ¨Ù‚Ù‰ Ù…Ù„ÙƒÙƒ.',
  },
  {
    icon: 'ðŸ’Ž',
    fr: 'Prix transparent',
    ar: 'Ø³Ø¹Ø± Ø´ÙØ§Ù',
    descFr: 'Total clair avant tout engagement, sans surprise.',
    descAr: 'Ø¥Ø¬Ù…Ø§Ù„ÙŠ ÙˆØ§Ø¶Ø­ Ù‚Ø¨Ù„ Ø£ÙŠ Ø§Ù„ØªØ²Ø§Ù…ØŒ Ø¨Ø¯ÙˆÙ† Ù…ÙØ§Ø¬Ø¢Øª.',
  },
  {
    icon: 'ðŸ”’',
    fr: 'Paiement sÃ©curisÃ©',
    ar: 'Ø¯ÙØ¹ Ø¢Ù…Ù†',
    descFr: 'Moyens de paiement locaux autorisÃ©s. Votre argent est protÃ©gÃ© jusqu\'Ã  livraison.',
    descAr: 'Ø·Ø±Ù‚ Ø¯ÙØ¹ Ù…Ø­Ù„ÙŠØ© Ù…Ø±Ø®ØµØ©. Ø£Ù…ÙˆØ§Ù„Ùƒ Ù…Ø­Ù…ÙŠØ© Ø­ØªÙ‰ Ø§Ù„ØªØ³Ù„ÙŠÙ….',
  },
  {
    icon: 'ðŸ¤',
    fr: 'Support local',
    ar: 'Ø¯Ø¹Ù… Ù…Ø­Ù„ÙŠ',
    descFr: 'Une Ã©quipe algÃ©rienne Ã  votre Ã©coute en franÃ§ais et en arabe.',
    descAr: 'ÙØ±ÙŠÙ‚ Ø¬Ø²Ø§Ø¦Ø±ÙŠ ÙÙŠ Ø®Ø¯Ù…ØªÙƒ Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© ÙˆØ§Ù„ÙØ±Ù†Ø³ÙŠØ©.',
  },
]

const categoryImages: Record<string, string> = {
  security: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=640&h=420&fit=crop&auto=format&q=80',
  dev: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=640&h=420&fit=crop&auto=format&q=80',
  cloud: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&h=420&fit=crop&auto=format&q=80',
  data: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=420&fit=crop&auto=format&q=80',
  design: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=640&h=420&fit=crop&auto=format&q=80',
  business: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=640&h=420&fit=crop&auto=format&q=80',
  lang: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=640&h=420&fit=crop&auto=format&q=80',
  marketing: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&h=420&fit=crop&auto=format&q=80',
}

export function HomePage({ lang, navigate, dir }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const isMobile = useIsMobile()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('catalog')
  }

  const featuredCourses = courses.slice(0, 4)

  return (
    <div style={{ backgroundColor: 'var(--background)' }}>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--background) 0%, var(--surface) 48%, var(--surface-secondary) 100%)',
        padding: isMobile ? '48px 14px 62px' : '80px 24px 96px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <AnimatedBackground variant="hero" />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <Reveal style={{ maxWidth: 680 }}>
            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              backgroundColor: 'var(--soft-accent)',
              border: '1px solid var(--border)',
              borderRadius: 100, padding: '6px 14px', marginBottom: 24,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'inline-block' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
                {t('Plateforme algÃ©rienne EdTech', 'Ù…Ù†ØµØ© Ø¬Ø²Ø§Ø¦Ø±ÙŠØ© Ù„Ù„ØªØ¹Ù„ÙŠÙ…', lang)}
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: 800,
              color: 'var(--primary)',
              lineHeight: 1.15,
              margin: '0 0 20px',
              letterSpacing: 0,
            }}>
              {t(
                'Les meilleures formations mondiales, accessibles depuis l\'AlgÃ©rie.',
                'Ø£ÙØ¶Ù„ Ø§Ù„Ø¯ÙˆØ±Ø§Øª Ø§Ù„Ø¹Ø§Ù„Ù…ÙŠØ©ØŒ Ù…ØªØ§Ø­Ø© Ù…Ù† Ø§Ù„Ø¬Ø²Ø§Ø¦Ø±.',
                lang
              )}
            </h1>

            <p style={{
              fontSize: 'clamp(15px, 1.5vw, 18px)',
              color: 'var(--muted-foreground)',
              lineHeight: 1.7,
              margin: '0 0 36px',
              maxWidth: 560,
            }}>
              {t(
                'DÃ©couvrez des cours et certifications internationales, payez simplement en dinars et recevez votre accÃ¨s en toute sÃ©curitÃ©.',
                'Ø§ÙƒØªØ´Ù Ø§Ù„Ø¯ÙˆØ±Ø§Øª ÙˆØ§Ù„Ø´Ù‡Ø§Ø¯Ø§Øª Ø§Ù„Ø¯ÙˆÙ„ÙŠØ©ØŒ Ø§Ø¯ÙØ¹ Ø¨Ø³Ù‡ÙˆÙ„Ø© Ø¨Ø§Ù„Ø¯ÙŠÙ†Ø§Ø± ÙˆØ§Ø³ØªÙ„Ù… ÙˆØµÙˆÙ„Ùƒ Ø¨Ø£Ù…Ø§Ù†.',
                lang
              )}
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: isMobile ? 32 : 48 }}>
              <button
                onClick={() => navigate('catalog')}
                style={{
                  backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)',
                  border: 'none', cursor: 'pointer',
                  padding: '13px 20px', borderRadius: 12,
                  fontSize: 16, fontWeight: 700,
                  width: isMobile ? '100%' : 'auto',
                  transition: 'all 0.15s',
                  boxShadow: '0 4px 16px rgba(24,169,121,0.35)',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#15956A')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#18A979')}
              >
                {t('Explorer les formations', 'Ø§Ø³ØªÙƒØ´Ù Ø§Ù„Ø¯ÙˆØ±Ø§Øª', lang)} â†’
              </button>
              <button
                onClick={() => navigate('custom-request')}
                style={{
                  backgroundColor: 'var(--surface)', color: 'var(--primary)',
                  border: '1.5px solid var(--border)', cursor: 'pointer',
                  padding: '13px 20px', borderRadius: 12,
                  fontSize: 16, fontWeight: 600,
                  width: isMobile ? '100%' : 'auto',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                {t('Demander une formation', 'Ø§Ø·Ù„Ø¨ Ø¯ÙˆØ±Ø©', lang)}
              </button>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 10 : 0, maxWidth: 520 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <svg
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  width="18" height="18" viewBox="0 0 18 18" fill="none"
                >
                  <circle cx="7.5" cy="7.5" r="5" stroke="#667085" strokeWidth="1.8" />
                  <line x1="11" y1="11" x2="15" y2="15" stroke="#667085" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('Rechercher Python, AWS, Figma...', 'Ø§Ø¨Ø­Ø« Ø¹Ù† Python, AWS, Figma...', lang)}
                  style={{
                    width: '100%', height: 50,
                    backgroundColor: 'var(--surface)',
                    border: '1.5px solid var(--border)',
                    borderRight: isMobile ? '1.5px solid var(--border)' : 'none',
                    borderRadius: isMobile ? 12 : '12px 0 0 12px',
                    padding: '0 16px 0 42px',
                    fontSize: 15, color: 'var(--foreground)',
                    outline: 'none',
                    fontFamily: lang === 'ar' ? "'IBM Plex Sans Arabic'" : "'Plus Jakarta Sans'",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)',
                  border: 'none', cursor: 'pointer',
                  padding: isMobile ? '14px 22px' : '0 22px', borderRadius: isMobile ? 12 : '0 12px 12px 0',
                  fontSize: 14, fontWeight: 700,
                  whiteSpace: 'nowrap',
                  width: isMobile ? '100%' : 'auto',
                }}
              >
                {t('Rechercher', 'Ø¨Ø­Ø«', lang)}
              </button>
            </form>
          </Reveal>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 32, marginTop: 56, flexWrap: 'wrap' }}>
            {[
              { num: '500+', label: t('Formations disponibles', 'Ø¯ÙˆØ±Ø© Ù…ØªØ§Ø­Ø©', lang) },
              { num: '8', label: t('Plateformes intÃ©grÃ©es', 'Ù…Ù†ØµØ© Ù…ØªÙƒØ§Ù…Ù„Ø©', lang) },
              { num: '100%', label: t('Paiement en DZD', 'Ø¯ÙØ¹ Ø¨Ø§Ù„Ø¯ÙŠÙ†Ø§Ø±', lang) },
              { num: '24h', label: t('Support rÃ©actif', 'Ø¯Ø¹Ù… Ù…ØªØ¬Ø§ÙˆØ¨', lang) },
            ].map(stat => (
              <div key={stat.num} style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#18A979', lineHeight: 1 }}>{stat.num}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '56px 24px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 10px' }}>
            {t('Catégories populaires', 'الفئات الشائعة', lang)}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted-foreground)', margin: 0 }}>
            {t('Explorez les domaines les plus demandés.', 'استكشف المجالات الأكثر طلباً.', lang)}
          </p>
        </div>
        <div className="tg-category-grid">
          {categories.map((cat, index) => (
            <Reveal key={cat.id} delay={index * 45}>
              <button
                onClick={() => navigate('catalog')}
                className="tg-category-card"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  cursor: 'pointer',
                  textAlign: dir === 'rtl' ? 'right' : 'left',
                  overflow: 'hidden',
                  padding: 0,
                  width: '100%',
                  boxShadow: '0 8px 24px rgba(19,42,79,0.06)',
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden' }}>
                  <img
                    src={categoryImages[cat.id]}
                    alt={lang === 'ar' ? cat.labelAr : cat.label}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,32,0.08) 0%, rgba(15,23,32,0.72) 100%)' }} />
                  <div style={{ position: 'absolute', right: 16, bottom: 14, left: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px' }}>
                      {lang === 'ar' ? cat.labelAr : cat.label}
                    </h3>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.86)', margin: 0 }}>
                      {cat.count} {t('formations', 'دورة', lang)}
                    </p>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Popular offers */}
      <section style={{ padding: '16px 24px 64px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#172033', margin: '0 0 8px' }}>
              {t('Offres populaires', 'Ø§Ù„Ø¹Ø±ÙˆØ¶ Ø§Ù„Ø´Ø§Ø¦Ø¹Ø©', lang)}
            </h2>
            <p style={{ fontSize: 15, color: '#667085', margin: 0 }}>
              {t('Les formations les plus demandÃ©es par nos clients.', 'Ø§Ù„Ø¯ÙˆØ±Ø§Øª Ø§Ù„Ø£ÙƒØ«Ø± Ø·Ù„Ø¨Ø§Ù‹ Ù„Ø¯Ù‰ Ø¹Ù…Ù„Ø§Ø¦Ù†Ø§.', lang)}
            </p>
          </div>
          <button
            onClick={() => navigate('catalog')}
            style={{
              background: 'none', border: '1.5px solid #132A4F',
              cursor: 'pointer', padding: '8px 18px', borderRadius: 10,
              fontSize: 14, fontWeight: 600, color: '#132A4F',
              whiteSpace: 'nowrap',
            }}
          >
            {t('Voir tout', 'Ø¹Ø±Ø¶ Ø§Ù„ÙƒÙ„', lang)} â†’
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {featuredCourses.map((course, index) => (
              <Reveal key={course.id} delay={index * 70}>
                <CourseCard
                  course={course}
                  lang={lang}
                  onClick={() => navigate('course', course)}
                />
              </Reveal>
            ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ backgroundColor: '#132A4F', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', margin: '0 0 12px' }}>
              {t('Comment Ã§a marche ?', 'ÙƒÙŠÙ ÙŠØ¹Ù…Ù„ØŸ', lang)}
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
              {t('Simple, transparent et sÃ©curisÃ© en 4 Ã©tapes.', 'Ø¨Ø³ÙŠØ· ÙˆØ´ÙØ§Ù ÙˆØ¢Ù…Ù† ÙÙŠ 4 Ø®Ø·ÙˆØ§Øª.', lang)}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {steps.map((step, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16, padding: '28px 24px',
                  position: 'relative',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  backgroundColor: 'rgba(24,169,121,0.15)',
                  border: '1.5px solid rgba(24,169,121,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, marginBottom: 16,
                }}>
                  {step.icon}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#18A979', marginBottom: 8, letterSpacing: '0.06em' }}>
                  {t('Ã‰TAPE', 'Ø®Ø·ÙˆØ©', lang)} {step.num}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', margin: '0 0 10px', lineHeight: 1.4 }}>
                  {lang === 'ar' ? step.ar : step.fr}
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.65 }}>
                  {lang === 'ar' ? step.descAr : step.descFr}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <button
              onClick={() => navigate('how-it-works')}
              style={{
                backgroundColor: 'transparent', border: '1.5px solid rgba(255,255,255,0.35)',
                color: '#FFFFFF', cursor: 'pointer',
                padding: '12px 28px', borderRadius: 12,
                fontSize: 15, fontWeight: 600,
              }}
            >
              {t('En savoir plus', 'Ø§Ø¹Ø±Ù Ø£ÙƒØ«Ø±', lang)}
            </button>
          </div>
        </div>
      </section>

      {/* Trust block */}
      <section style={{ padding: '72px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#172033', margin: '0 0 12px' }}>
            {t('Pourquoi nous faire confiance ?', 'Ù„Ù…Ø§Ø°Ø§ ØªØ«Ù‚ Ø¨Ù†Ø§ØŸ', lang)}
          </h2>
          <p style={{ fontSize: 16, color: '#667085', margin: 0, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            {t('Votre sÃ©curitÃ© et votre satisfaction sont notre prioritÃ© absolue.', 'Ø£Ù…Ø§Ù†Ùƒ ÙˆØ±Ø¶Ø§Ùƒ Ù‡Ùˆ Ø£ÙˆÙ„ÙˆÙŠØªÙ†Ø§ Ø§Ù„Ù…Ø·Ù„Ù‚Ø©.', lang)}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {trustPoints.map((point, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4E9F0',
                borderRadius: 16, padding: '28px 24px',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(19,42,79,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>{point.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#172033', margin: '0 0 10px' }}>
                {lang === 'ar' ? point.ar : point.fr}
              </h3>
              <p style={{ fontSize: 14, color: '#667085', margin: 0, lineHeight: 1.65 }}>
                {lang === 'ar' ? point.descAr : point.descFr}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Organizations CTA */}
      <section style={{ padding: '0 24px 72px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          borderRadius: 20, padding: '48px 56px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24,
        }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px' }}>
              {t('Une offre pour les organisations', 'Ø¹Ø±Ø¶ Ù„Ù„Ù…Ø¤Ø³Ø³Ø§Øª', lang)}
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: 0, maxWidth: 440 }}>
              {t(
                'UniversitÃ©s, entreprises, clubs et Ã©tablissements â€” bÃ©nÃ©ficiez de tarifs groupÃ©s et de factures.',
                'Ø§Ù„Ø¬Ø§Ù…Ø¹Ø§Øª ÙˆØ§Ù„Ø´Ø±ÙƒØ§Øª ÙˆØ§Ù„Ù†ÙˆØ§Ø¯ÙŠ - Ø§Ø³ØªÙØ¯ Ù…Ù† Ø£Ø³Ø¹Ø§Ø± Ø§Ù„Ø¬Ù…Ù„Ø© ÙˆØ§Ù„ÙÙˆØ§ØªÙŠØ±.',
                lang
              )}
            </p>
          </div>
          <button
            onClick={() => navigate('organizations')}
            style={{
              backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)',
              border: 'none', cursor: 'pointer',
              padding: '13px 28px', borderRadius: 12,
              fontSize: 15, fontWeight: 700,
              boxShadow: '0 4px 14px rgba(24,169,121,0.35)',
              flexShrink: 0,
            }}
          >
            {t('Demander un devis', 'Ø·Ù„Ø¨ Ø¹Ø±Ø¶ Ø³Ø¹Ø±', lang)}
          </button>
        </div>
      </section>

      {/* FAQ teaser */}
      <section style={{ padding: '0 24px 72px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 32px', textAlign: 'center' }}>
          {t('Questions frÃ©quentes', 'Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø´Ø§Ø¦Ø¹Ø©', lang)}
        </h2>

        {[
          {
            q: t('TaallamGo est-il lÃ©gal en AlgÃ©rie ?', 'Ù‡Ù„ TaallamGo Ù‚Ø§Ù†ÙˆÙ†ÙŠ ÙÙŠ Ø§Ù„Ø¬Ø²Ø§Ø¦Ø±ØŸ', lang),
            a: t('Oui. TaallamGo facilite l\'accÃ¨s lÃ©gal aux plateformes en utilisant uniquement des moyens de paiement autorisÃ©s par la rÃ©glementation algÃ©rienne.', 'Ù†Ø¹Ù…. ÙŠØ³Ù‡Ù‘Ù„ TaallamGo Ø§Ù„ÙˆØµÙˆÙ„ Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠ Ø¥Ù„Ù‰ Ø§Ù„Ù…Ù†ØµØ§Øª Ø¨Ø§Ø³ØªØ®Ø¯Ø§Ù… ÙˆØ³Ø§Ø¦Ù„ Ø§Ù„Ø¯ÙØ¹ Ø§Ù„Ù…Ø±Ø®ØµØ© Ø¨Ø§Ù„ØªÙ†Ø¸ÙŠÙ… Ø§Ù„Ø¬Ø²Ø§Ø¦Ø±ÙŠ ÙÙ‚Ø·.', lang),
          },
          {
            q: t('TaallamGo me demandera-t-il mon mot de passe ?', 'Ù‡Ù„ Ø³ÙŠØ·Ù„Ø¨ TaallamGo ÙƒÙ„Ù…Ø© Ù…Ø±ÙˆØ±ÙŠØŸ', lang),
            a: t('Non, jamais. Vous n\'avez Ã  fournir aucun mot de passe externe. Votre accÃ¨s vous est livrÃ© via des mÃ©thodes officielles.', 'Ù„Ø§ØŒ Ø£Ø¨Ø¯Ø§Ù‹. Ù„Ø§ ØªØ­ØªØ§Ø¬ Ø¥Ù„Ù‰ ØªÙ‚Ø¯ÙŠÙ… Ø£ÙŠ ÙƒÙ„Ù…Ø© Ù…Ø±ÙˆØ± Ø®Ø§Ø±Ø¬ÙŠØ©. ÙŠÙØ³Ù„ÙŽÙ‘Ù… ÙˆØµÙˆÙ„Ùƒ Ø¹Ø¨Ø± Ø·Ø±Ù‚ Ø±Ø³Ù…ÙŠØ©.', lang),
          },
          {
            q: t('Quels sont les dÃ©lais de livraison ?', 'Ù…Ø§ Ù‡ÙŠ Ù…ÙˆØ§Ø¹ÙŠØ¯ Ø§Ù„ØªØ³Ù„ÙŠÙ…ØŸ', lang),
            a: t('En gÃ©nÃ©ral sous 24 Ã  72h ouvrables selon la plateforme et le type d\'offre. Un devis prÃ©cis est fourni avant commande.', 'Ø¹Ø§Ø¯Ø©Ù‹ Ø®Ù„Ø§Ù„ 24 Ø¥Ù„Ù‰ 72 Ø³Ø§Ø¹Ø© Ø¹Ù…Ù„ Ø­Ø³Ø¨ Ø§Ù„Ù…Ù†ØµØ© ÙˆÙ†ÙˆØ¹ Ø§Ù„Ø¹Ø±Ø¶. ÙŠÙÙ‚Ø¯ÙŽÙ‘Ù… Ø¹Ø±Ø¶ Ø³Ø¹Ø± Ø¯Ù‚ÙŠÙ‚ Ù‚Ø¨Ù„ Ø§Ù„Ø·Ù„Ø¨.', lang),
          },
        ].map((faq, i) => (
          <FaqItem key={i} q={faq.q} a={faq.a} />
        ))}

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button
            onClick={() => navigate('help')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 15, fontWeight: 600, color: 'var(--accent)',
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}
          >
            {t('Voir toutes les questions â†’', 'Ø¹Ø±Ø¶ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø£Ø³Ø¦Ù„Ø© â†’', lang)}
          </button>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)',
        padding: '64px 24px', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px' }}>
          {t('PrÃªt Ã  commencer ?', 'Ù…Ø³ØªØ¹Ø¯ Ù„Ù„Ø¨Ø¯Ø¡ØŸ', lang)}
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', margin: '0 0 36px' }}>
          {t('Rejoignez des milliers d\'AlgÃ©riens qui apprennent sans frontiÃ¨res.', 'Ø§Ù†Ø¶Ù… Ø¥Ù„Ù‰ Ø¢Ù„Ø§Ù Ø§Ù„Ø¬Ø²Ø§Ø¦Ø±ÙŠÙŠÙ† Ø§Ù„Ø°ÙŠÙ† ÙŠØªØ¹Ù„Ù…ÙˆÙ† Ø¨Ù„Ø§ Ø­Ø¯ÙˆØ¯.', lang)}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('catalog')}
            style={{
              backgroundColor: '#FFFFFF', color: '#18A979',
              border: 'none', cursor: 'pointer',
              padding: '13px 32px', borderRadius: 12,
              fontSize: 16, fontWeight: 800,
            }}
          >
            {t('Explorer les formations', 'Ø§Ø³ØªÙƒØ´Ù Ø§Ù„Ø¯ÙˆØ±Ø§Øª', lang)}
          </button>
          <button
            onClick={() => navigate('auth-register')}
            style={{
              backgroundColor: 'transparent', color: '#FFFFFF',
              border: '1.5px solid rgba(255,255,255,0.5)',
              cursor: 'pointer',
              padding: '13px 32px', borderRadius: 12,
              fontSize: 16, fontWeight: 600,
            }}
          >
            {t('CrÃ©er un compte', 'Ø¥Ù†Ø´Ø§Ø¡ Ø­Ø³Ø§Ø¨', lang)}
          </button>
        </div>
      </section>
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #E4E9F0', padding: '18px 0' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: 0, textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: '#172033' }}>{q}</span>
        <svg
          width="20" height="20" viewBox="0 0 20 20" fill="none"
          style={{ flexShrink: 0, marginLeft: 16, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}
        >
          <polyline points="5,8 10,13 15,8" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <p style={{ margin: '12px 0 0', fontSize: 14, color: '#667085', lineHeight: 1.7 }}>{a}</p>
      )}
    </div>
  )
}
