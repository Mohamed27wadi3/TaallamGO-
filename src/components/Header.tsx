import { useState } from 'react'
import type { Lang } from '../data'
import { t } from '../data'
import { useIsMobile } from '../hooks/useIsMobile'
import { taallamGoLogoSrc } from '../logo'

type Page = string

interface Props {
  lang: Lang
  onLangToggle: () => void
  currentPage: Page
  navigate: (page: Page) => void
  dir: 'ltr' | 'rtl'
}

const navLinks = [
  { key: 'catalog', fr: 'Catalogue', ar: 'الكتالوج' },
  { key: 'platforms', fr: 'Plateformes', ar: 'المنصات' },
  { key: 'how-it-works', fr: 'Comment ça marche', ar: 'كيف يعمل' },
  { key: 'help', fr: 'Aide', ar: 'المساعدة' },
]

export function Header({ lang, onLangToggle, currentPage, navigate, dir }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E4E9F0', position: 'sticky', top: 0, zIndex: 50 }}>
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
                color: currentPage === link.key ? '#132A4F' : '#667085',
                backgroundColor: currentPage === link.key ? '#E8EDF5' : 'transparent',
                transition: 'all 0.15s',
                fontFamily: lang === 'ar' ? "'IBM Plex Sans Arabic'" : "'Plus Jakarta Sans'",
              }}
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
              border: '1px solid #E4E9F0',
              cursor: 'pointer',
              padding: '5px 10px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: '#132A4F',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>{lang === 'fr' ? '🇩🇿' : '🇫🇷'}</span>
            <span>{lang === 'fr' ? 'AR' : 'FR'}</span>
          </button>

          <button
            onClick={() => navigate('auth-login')}
            className="hidden sm:block"
            style={{
              background: 'none',
              border: '1px solid #E4E9F0',
              cursor: 'pointer',
              padding: '7px 14px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#132A4F',
              transition: 'all 0.15s',
            }}
          >
            {t('Connexion', 'تسجيل الدخول', lang)}
          </button>

          <button
            onClick={() => navigate('catalog')}
            className="hidden sm:block"
            style={{
              background: '#132A4F',
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
            {t('Connexion', 'ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„', lang)}
          </button>
          <button
            onClick={() => { navigate('catalog'); setMobileOpen(false) }}
            style={{ display: 'block', width: '100%', background: '#132A4F', border: 'none', cursor: 'pointer', padding: '11px 14px', borderRadius: 8, fontSize: 15, fontWeight: 700, color: '#FFFFFF', marginTop: 8 }}
          >
            {t('Explorer les formations', 'Ø§Ø³ØªÙƒØ´Ù Ø§Ù„Ø¯ÙˆØ±Ø§Øª', lang)}
          </button>
        </div>
      )}
    </header>
  )
}
