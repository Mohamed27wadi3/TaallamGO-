import { useState } from 'react'
import type { Lang } from '../data'
import { t } from '../data'
import { taallamGoLogoSrc } from '../logo'

interface Props {
  lang: Lang
  navigate: (page: string) => void
  mode: 'login' | 'register' | 'forgot'
}

export function AuthPage({ lang, navigate, mode: initialMode }: Props) {
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (mode === 'login' || mode === 'register') {
        navigate('dashboard')
      } else {
        setSubmitted(true)
      }
    }, 1400)
  }

  const inputStyle = {
    width: '100%', height: 46,
    border: '1.5px solid #E4E9F0', borderRadius: 10,
    padding: '0 14px', fontSize: 14, color: '#172033',
    backgroundColor: '#FFFFFF', outline: 'none',
    fontFamily: lang === 'ar' ? "'IBM Plex Sans Arabic'" : "'Plus Jakarta Sans'",
    transition: 'border-color 0.15s',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#EEF6FF', padding: 24,
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E4E9F0',
        borderRadius: 20,
        padding: '40px 40px',
        width: '100%', maxWidth: 440,
        boxShadow: '0 8px 40px rgba(19,42,79,0.08)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <img src={taallamGoLogoSrc} alt="TaallamGo" style={{ height: 40, width: 'auto' }} />
          </button>
        </div>

        {mode === 'forgot' && submitted ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📧</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#172033', margin: '0 0 10px' }}>
              {t('Email envoyé !', 'تم إرسال البريد!', lang)}
            </h2>
            <p style={{ fontSize: 14, color: '#667085', lineHeight: 1.7 }}>
              {t(
                `Un lien de réinitialisation a été envoyé à ${email || 'votre adresse'}. Vérifiez aussi vos spams.`,
                `تم إرسال رابط إعادة التعيين إلى ${email || 'بريدك'}. تحقق من البريد غير المرغوب أيضاً.`,
                lang
              )}
            </p>
            <button
              onClick={() => setMode('login')}
              style={{
                marginTop: 24, background: 'none', border: 'none', cursor: 'pointer',
                color: '#132A4F', fontSize: 14, fontWeight: 600, textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}
            >
              {t('Retour à la connexion', 'العودة لتسجيل الدخول', lang)}
            </button>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#172033', margin: '0 0 6px', textAlign: 'center' }}>
              {mode === 'login' && t('Connexion', 'تسجيل الدخول', lang)}
              {mode === 'register' && t('Créer un compte', 'إنشاء حساب', lang)}
              {mode === 'forgot' && t('Mot de passe oublié', 'نسيت كلمة المرور', lang)}
            </h1>
            <p style={{ fontSize: 14, color: '#667085', textAlign: 'center', margin: '0 0 28px' }}>
              {mode === 'login' && t('Bon retour ! Entrez vos identifiants.', 'مرحباً بعودتك! أدخل بياناتك.', lang)}
              {mode === 'register' && t('Rejoignez TaallamGo gratuitement.', 'انضم إلى TaallamGo مجاناً.', lang)}
              {mode === 'forgot' && t('Entrez votre email pour réinitialiser.', 'أدخل بريدك لإعادة التعيين.', lang)}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {mode === 'register' && (
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#172033', display: 'block', marginBottom: 6 }}>
                    {t('Nom complet', 'الاسم الكامل', lang)}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={t('Votre nom complet', 'اسمك الكامل', lang)}
                    required
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#132A4F')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E4E9F0')}
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#172033', display: 'block', marginBottom: 6 }}>
                  {t('Adresse email', 'البريد الإلكتروني', lang)}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  required
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#132A4F')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E4E9F0')}
                />
              </div>

              {mode === 'register' && (
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#172033', display: 'block', marginBottom: 6 }}>
                    {t('Téléphone (optionnel)', 'الهاتف (اختياري)', lang)}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+213 6XX XXX XXX"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#132A4F')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E4E9F0')}
                  />
                </div>
              )}

              {mode !== 'forgot' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#172033' }}>
                      {t('Mot de passe', 'كلمة المرور', lang)}
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#2F80ED', fontWeight: 500 }}
                      >
                        {t('Oublié ?', 'نسيت؟', lang)}
                      </button>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      style={{ ...inputStyle, paddingRight: 44 }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#132A4F')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#E4E9F0')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', color: '#667085', fontSize: 16,
                      }}
                    >
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {mode === 'register' && (
                    <p style={{ fontSize: 12, color: '#667085', margin: '6px 0 0' }}>
                      {t('Minimum 8 caractères.', 'الحد الأدنى 8 أحرف.', lang)}
                    </p>
                  )}
                </div>
              )}

              {mode === 'register' && (
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 13, color: '#667085' }}>
                  <input type="checkbox" required style={{ marginTop: 2, accentColor: '#132A4F' }} />
                  <span>
                    {t(
                      "J'accepte les conditions d'utilisation et la politique de confidentialité.",
                      'أوافق على شروط الاستخدام وسياسة الخصوصية.',
                      lang
                    )}
                  </span>
                </label>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#E4E9F0' : '#132A4F',
                  color: loading ? '#667085' : '#FFFFFF',
                  border: 'none', cursor: loading ? 'default' : 'pointer',
                  padding: '13px', borderRadius: 12,
                  fontSize: 15, fontWeight: 700, marginTop: 4,
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 16, height: 16, border: '2px solid #667085',
                      borderTopColor: 'transparent', borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.6s linear infinite',
                    }} />
                    {t('Chargement...', 'جاري...', lang)}
                  </>
                ) : (
                  mode === 'login' ? t('Se connecter', 'تسجيل الدخول', lang) :
                  mode === 'register' ? t('Créer mon compte', 'إنشاء حسابي', lang) :
                  t('Envoyer le lien', 'إرسال الرابط', lang)
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#667085' }}>
              {mode === 'login' ? (
                <>
                  {t("Pas encore de compte ?", "ليس لديك حساب؟", lang)}{' '}
                  <button onClick={() => setMode('register')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#132A4F', fontWeight: 700, fontSize: 14 }}>
                    {t("S'inscrire", 'سجل الآن', lang)}
                  </button>
                </>
              ) : (
                <>
                  {t("Déjà un compte ?", "لديك حساب؟", lang)}{' '}
                  <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#132A4F', fontWeight: 700, fontSize: 14 }}>
                    {t("Se connecter", 'تسجيل الدخول', lang)}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
