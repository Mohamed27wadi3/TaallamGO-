import type { Lang } from '../data'
import { t } from '../data'

interface Props {
  lang: Lang
  dir: 'ltr' | 'rtl'
  currentPage: string
  canGoBack: boolean
  onBack: () => void
}

const formPages = new Set(['custom-request', 'organizations', 'contact', 'auth-login', 'auth-register', 'auth-forgot'])

function hasEditedFormFields() {
  const fields = Array.from(document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select'))
  return fields.some(field => {
    if (field instanceof HTMLInputElement && ['checkbox', 'radio', 'submit', 'button'].includes(field.type)) {
      return field.checked
    }
    return field.value.trim().length > 0
  })
}

export function DynamicBackButton({ lang, dir, currentPage, canGoBack, onBack }: Props) {
  if (currentPage === 'home') return null

  const handleBack = () => {
    if (formPages.has(currentPage) && hasEditedFormFields()) {
      const confirmed = window.confirm(
        t(
          'Vous avez des informations non enregistrées. Voulez-vous vraiment quitter cette page ?',
          'لديك معلومات غير محفوظة. هل تريد فعلاً مغادرة هذه الصفحة؟',
          lang
        )
      )
      if (!confirmed) return
    }

    onBack()
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px 0' }}>
      <button
        type="button"
        onClick={handleBack}
        aria-label={t('Retour à la page précédente', 'رجوع إلى الصفحة السابقة', lang)}
        style={{
          minHeight: 44,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          border: '1px solid var(--border)',
          borderRadius: 10,
          backgroundColor: 'var(--surface)',
          color: canGoBack ? 'var(--primary)' : 'var(--muted-foreground)',
          cursor: 'pointer',
          padding: '0 14px',
          fontSize: 14,
          fontWeight: 700,
          fontFamily: lang === 'ar' ? "'IBM Plex Sans Arabic'" : "'Plus Jakarta Sans'",
          boxShadow: '0 4px 14px rgba(19,42,79,0.05)',
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
          style={{ transform: dir === 'rtl' ? 'scaleX(-1)' : 'none' }}
        >
          <path d="M11.25 4.5L6.75 9l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t('Retour', 'رجوع', lang)}
      </button>
    </div>
  )
}
