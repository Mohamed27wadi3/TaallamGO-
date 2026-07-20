import { useEffect, useRef, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import type { Lang } from '../data'
import { t } from '../data'
import { useIsMobile } from '../hooks/useIsMobile'
import type { Theme } from '../hooks/useTheme'
import { ThemeLogo } from './ThemeLogo'
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
  { key: 'catalog', fr: 'Catalogue', ar: 'Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬' },
  { key: 'platforms', fr: 'Plateformes', ar: 'Ø§Ù„Ù…Ù†ØµØ§Øª' },
  { key: 'how-it-works', fr: 'Comment Ã§a marche', ar: 'ÙƒÙŠÙ ÙŠØ¹Ù…Ù„' },
  { key: 'help', fr: 'Aide', ar: 'Ø§Ù„Ù…Ø³Ø§Ø¹Ø¯Ø©' },
]

export function Header({ lang, onLangToggle, currentPage, navigate, dir, theme, onThemeToggle }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const profileRef = useRef<HTMLDivElement | null>(null)
  const isMobile = useIsMobile()
  const isCompactHeader = useIsMobile(1100)
  const isTinyHeader = useIsMobile(380)
  const { data: session, status } = useSession()
  const user = session?.user
  const isSignedIn = status === 'authenticated' && Boolean(user)
  const userName = user?.name || user?.email || 'TaallamGo'
  const initial = (userName.trim()[0] || 'T').toUpperCase()

  const profileLinks = [
    { key: 'profile', label: t('Mon profil', 'Ù…Ù„ÙÙŠ Ø§Ù„Ø´Ø®ØµÙŠ', lang) },
    { key: 'dashboard', label: t('Mes commandes', 'Ø·Ù„Ø¨Ø§ØªÙŠ', lang) },
    { key: 'dashboard', label: t('Mes paiements', 'Ù…Ø¯ÙÙˆØ¹Ø§ØªÙŠ', lang) },
    { key: 'dashboard', label: t('Mes factures', 'ÙÙˆØ§ØªÙŠØ±ÙŠ', lang) },
    { key: 'dashboard', label: t('Mes tickets', 'ØªØ°Ø§ÙƒØ±ÙŠ', lang) },
    { key: 'dashboard', label: t('ParamÃ¨tres', 'Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª', lang) },
  ]

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    if (!profileOpen) return

    const onPointerDown = (event: PointerEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProfileOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [profileOpen])

  const handleProfileNavigate = (target: Page) => {
    navigate(target)
    setProfileOpen(false)
    setMobileOpen(false)
  }

  const handleSignOut = async () => {
    setProfileOpen(false)
    setMobileOpen(false)
    await signOut({ redirect: false })
    navigate('home')
  }

  return (
    <header
      className={`tg-header${scrolled ? ' is-scrolled' : ''}`}
      style={{ backgroundColor: scrolled ? 'var(--header-bg)' : 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 14px' : '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: isTinyHeader ? 6 : 10 }}>
        <button
          onClick={() => navigate('home')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', flexShrink: 0 }}
        >
          <ThemeLogo lang={lang} className="tg-theme-logo--header" />
        </button>

        <nav style={{ display: isCompactHeader ? 'none' : 'flex', alignItems: 'center', gap: 4 }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={onLangToggle}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              padding: isTinyHeader ? '5px 8px' : '5px 10px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {!isTinyHeader && <span>{lang === 'fr' ? 'ðŸ‡©ðŸ‡¿' : 'ðŸ‡«ðŸ‡·'}</span>}
            <span>{lang === 'fr' ? 'AR' : 'FR'}</span>
          </button>

          <ThemeToggle theme={theme} onToggle={onThemeToggle} />

          {isSignedIn ? (
            <div ref={profileRef} style={{ position: 'relative', display: isCompactHeader ? 'none' : 'block' }}>
              <button
                type="button"
                onClick={() => setProfileOpen(open => !open)}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--soft-accent)',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 800,
                  overflow: 'hidden',
                }}
              >
                {user?.image ? <img src={user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  style={{
                    position: 'absolute',
                    top: 44,
                    ...(dir === 'rtl' ? { left: 0 } : { right: 0 }),
                    width: 240,
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 14,
                    boxShadow: '0 18px 48px rgba(15,23,42,0.16)',
                    padding: 10,
                    zIndex: 80,
                    textAlign: dir === 'rtl' ? 'right' : 'left',
                  }}
                >
                  <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
                    {user?.email && <div style={{ fontSize: 12, color: 'var(--muted-foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>}
                  </div>
                  {profileLinks.map(link => (
                    <button
                      key={`${link.label}-${link.key}`}
                      role="menuitem"
                      onClick={() => handleProfileNavigate(link.key)}
                      style={{
                        display: 'block',
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        padding: '9px 10px',
                        color: 'var(--foreground)',
                        fontSize: 14,
                        textAlign: dir === 'rtl' ? 'right' : 'left',
                      }}
                    >
                      {link.label}
                    </button>
                  ))}
                  <button
                    role="menuitem"
                    onClick={handleSignOut}
                    style={{
                      display: 'block',
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      borderTop: '1px solid var(--border)',
                      cursor: 'pointer',
                      padding: '10px',
                      marginTop: 6,
                      color: 'var(--error)',
                      fontSize: 14,
                      fontWeight: 700,
                      textAlign: dir === 'rtl' ? 'right' : 'left',
                    }}
                  >
                    {t('DÃ©connexion', 'ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø®Ø±ÙˆØ¬', lang)}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('auth-login')}
              style={{
                display: isCompactHeader ? 'none' : 'block',
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
              {t('Connexion', 'ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„', lang)}
            </button>
          )}

          {!isSignedIn && (
            <button
              onClick={() => navigate('catalog')}
              style={{
                display: isCompactHeader ? 'none' : 'block',
                background: 'var(--primary)',
                border: 'none',
                cursor: 'pointer',
                padding: '7px 16px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--accent-foreground)',
                transition: 'all 0.15s',
              }}
            >
              {t('Explorer', 'Ø§Ø³ØªÙƒØ´Ù', lang)}
            </button>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: isCompactHeader ? 'inline-flex' : 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: 'var(--accent)',
              flexShrink: 0,
            }}
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

      {mobileOpen && (
        <div style={{ display: isCompactHeader ? 'block' : 'none', borderTop: '1px solid var(--border)', backgroundColor: 'var(--surface)', padding: '12px 20px 20px' }}>
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
                color: 'var(--foreground)',
                borderBottom: '1px solid var(--surface-secondary)',
              }}
            >
              {lang === 'ar' ? link.ar : link.fr}
            </button>
          ))}

          {isSignedIn ? (
            <>
              <div style={{ padding: '12px 0', borderBottom: '1px solid var(--surface-secondary)', textAlign: dir === 'rtl' ? 'right' : 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--foreground)' }}>{userName}</div>
                {user?.email && <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{user.email}</div>}
              </div>
              {profileLinks.map(link => (
                <button
                  key={`mobile-${link.label}-${link.key}`}
                  onClick={() => handleProfileNavigate(link.key)}
                  style={{ display: 'block', width: '100%', textAlign: dir === 'rtl' ? 'right' : 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0', fontSize: 15, fontWeight: 500, color: 'var(--foreground)' }}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={handleSignOut}
                style={{ display: 'block', width: '100%', textAlign: dir === 'rtl' ? 'right' : 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0', fontSize: 15, fontWeight: 700, color: 'var(--error)' }}
              >
                {t('DÃ©connexion', 'ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø®Ø±ÙˆØ¬', lang)}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { navigate('auth-login'); setMobileOpen(false) }}
                style={{ display: 'block', width: '100%', textAlign: dir === 'rtl' ? 'right' : 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0', fontSize: 15, fontWeight: 600, color: 'var(--accent)' }}
              >
                {t('Connexion', 'ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„', lang)}
              </button>
              <button
                onClick={() => { navigate('catalog'); setMobileOpen(false) }}
                style={{ display: 'block', width: '100%', background: 'var(--accent)', border: 'none', cursor: 'pointer', padding: '11px 14px', borderRadius: 8, fontSize: 15, fontWeight: 700, color: 'var(--accent-foreground)', marginTop: 8 }}
              >
                {t('Explorer les formations', 'Ø§Ø³ØªÙƒØ´Ù Ø§Ù„Ø¯ÙˆØ±Ø§Øª', lang)}
              </button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
