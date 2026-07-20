import { useEffect, useState } from 'react'
import type { Lang } from '../data'
import { t } from '../data'
import { useIsMobile } from '../hooks/useIsMobile'
import { taallamGoLogoSrc } from '../logo'
import type { Theme } from '../hooks/useTheme'
import { ThemeToggle } from './ThemeToggle'

type Page = string

interface Props {
  lang: Lang
  onLangToggle: () => void
  currentPage: Page
  navigate: (page: Page) => void
  dir: 'ltr' | 'rtl'
  theme: Theme
  onThemeToggle: () => void
}

const navLinks = [
  { key: 'catalog', fr: 'Catalogue', ar: 'الكتالوج' },
  { key: 'platforms', fr: 'Plateformes', ar: 'المنصات' },
  { key: 'how-it-works', fr: 'Comment ça marche', ar: 'كيف يعمل' },
  { key: 'help', fr: 'Aide', ar: 'المساعدة' },
]

export function Header({ lang, onLangToggle, currentPage, navigate, dir, theme, onThemeToggle }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header
      className={`tg-header${scrolled ? ' is-scrolled' : ''}`}
      style={{ backgroundColor: scrolled ? 'var(--header-bg)' : 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 14px' : '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        {/* Logo */}
        <button
          onClick={() => navigate('home')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
        >
          <img src={taallamGoLogoSrc} alt="TaallamGo" style={{ height: isMobile ? 30 : 36, width: 'auto', maxWidth: isMobile ? 150 : 190 }} />
        </button>

        {/* Desktop nav */}
        <nav style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: 4 }}>
          {navLinks.map(link => (
            <button
              key={link.key}
              onClick={() => navigate(link.key)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: currentPage === link.key ? 'var(--primary)' : 'var(--muted-foreground)',
                backgroundColor: currentPage === link.key ? 'var(--soft-accent)' : 'transparent',
                transition: 'all 0.15s',
                fontFamily: lang === 'ar' ? "'IBM Plex Sans Arabic'" : "'Plus Jakarta Sans'",
                position: 'relative',
              }}
              className={currentPage === link.key ? 'tg-nav-link is-active' : 'tg-nav-link'}
            >
              {lang === 'ar' ? link.ar : link.fr}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Lang toggle */}
          <button
            onClick={onLangToggle}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              padding: '5px 10px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>{lang === 'fr' ? '🇩🇿' : '🇫🇷'}</span>
            <span>{lang === 'fr' ? 'AR' : 'FR'}</span>
          </button>

          <ThemeToggle theme={theme} onToggle={onThemeToggle} />

          <button
            onClick={() => navigate('auth-login')}
            className="hidden sm:block"
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              padding: '7px 14px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--primary)',
              transition: 'all 0.15s',
            }}
          >
            {t('Connexion', 'تسجيل الدخول', lang)}
          </button>

          <button
            onClick={() => navigate('catalog')}
            className="hidden sm:block"
            style={{
              background: 'var(--primary)',
              border: 'none',
              cursor: 'pointer',
              padding: '7px 16px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#FFFFFF',
              transition: 'all 0.15s',
            }}
          >
            {t('Explorer', 'استكشف', lang)}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#132A4F' }}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {mobileOpen ? (
                <>
                  <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ borderTop: '1px solid #E4E9F0', backgroundColor: '#FFFFFF', padding: '12px 24px 20px' }} className="md:hidden">
          {navLinks.map(link => (
            <button
              key={link.key}
              onClick={() => { navigate(link.key); setMobileOpen(false) }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: dir === 'rtl' ? 'right' : 'left',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '10px 0',
                fontSize: 15,
                fontWeight: 500,
                color: '#172033',
                borderBottom: '1px solid #F0F3F8',
              }}
            >
              {lang === 'ar' ? link.ar : link.fr}
            </button>
          ))}
          <button
            onClick={() => { navigate('auth-login'); setMobileOpen(false) }}
            style={{ display: 'block', width: '100%', textAlign: dir === 'rtl' ? 'right' : 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0', fontSize: 15, fontWeight: 600, color: '#132A4F' }}
          >
            {t('Connexion', 'تسجيل الدخول', lang)}
          </button>
          <button
            onClick={() => { navigate('catalog'); setMobileOpen(false) }}
            style={{ display: 'block', width: '100%', background: '#132A4F', border: 'none', cursor: 'pointer', padding: '11px 14px', borderRadius: 8, fontSize: 15, fontWeight: 700, color: '#FFFFFF', marginTop: 8 }}
          >
            {t('Explorer les formations', 'استكشف الدورات', lang)}
          </button>
        </div>
      )}
    </header>
  )
}
