import { useState } from 'react'
import type { Lang } from '../data'
import { t } from '../data'

interface Props {
  lang: Lang
  navigate: (page: string) => void
  dir: 'ltr' | 'rtl'
}

const steps = [
  { key: 'url', fr: 'Lien officiel', ar: 'الرابط الرسمي' },
  { key: 'details', fr: 'Détails', ar: 'التفاصيل' },
  { key: 'confirm', fr: 'Confirmation', ar: 'التأكيد' },
]

export function CustomRequestPage({ lang, navigate }: Props) {
  const [step, setStep] = useState(0)
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const inputStyle = {
    width: '100%', height: 46, border: '1.5px solid #E4E9F0', borderRadius: 10,
    padding: '0 14px', fontSize: 14, color: '#172033', outline: 'none', backgroundColor: '#FFFFFF',
    fontFamily: lang === 'ar' ? "'IBM Plex Sans Arabic'" : "'Plus Jakarta Sans'",
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 460 }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#172033', margin: '0 0 12px' }}>
            {t('Demande envoyée !', 'تم إرسال الطلب!', lang)}
          </h2>
          <p style={{ fontSize: 15, color: '#667085', lineHeight: 1.7, margin: '0 0 28px' }}>
            {t(
              'Notre équipe va analyser votre demande et vous contacter sous 24-48h ouvrables. Vérifiez votre boite email.',
              'سيحلل فريقنا طلبك ويتواصل معك خلال 24-48 ساعة عمل. تحقق من بريدك الإلكتروني.',
              lang
            )}
          </p>
          <div style={{
            backgroundColor: '#FFF8F0', border: '1px solid #FDDCB5',
            borderRadius: 12, padding: '14px 18px', marginBottom: 28,
            fontSize: 13, color: '#92400E', textAlign: lang === 'ar' ? 'right' : 'left',
          }}>
            🔒 {t('TaallamGo ne vous demandera jamais votre mot de passe sur une plateforme externe.', 'لن يطلب منك TaallamGo أبداً كلمة مرورك على منصة خارجية.', lang)}
          </div>
          <button
            onClick={() => navigate('home')}
            style={{
              backgroundColor: '#132A4F', color: '#FFFFFF',
              border: 'none', cursor: 'pointer',
              padding: '13px 32px', borderRadius: 12,
              fontSize: 15, fontWeight: 700,
            }}
          >
            {t('Retour à l\'accueil', 'العودة للرئيسية', lang)}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F9FC', padding: '48px 24px' }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#172033', margin: '0 0 8px' }}>
            {t('Demande personnalisée', 'طلب مخصص', lang)}
          </h1>
          <p style={{ fontSize: 15, color: '#667085', margin: 0 }}>
            {t('Vous n\'avez pas trouvé votre formation ? Soumettez votre demande.', 'لم تجد دورتك؟ قدّم طلبك.', lang)}
          </p>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                backgroundColor: i <= step ? '#132A4F' : '#E4E9F0',
                color: i <= step ? '#FFFFFF' : '#667085',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                flexShrink: 0,
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 12, color: i === step ? '#172033' : '#667085', fontWeight: i === step ? 700 : 400, marginLeft: 6, marginRight: i < steps.length - 1 ? 0 : 0 }}>
                {lang === 'ar' ? s.ar : s.fr}
              </span>
              {i < steps.length - 1 && (
                <div style={{ width: 40, height: 2, backgroundColor: i < step ? '#132A4F' : '#E4E9F0', margin: '0 10px', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E9F0', borderRadius: 20, padding: '32px' }}>
          {step === 0 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#172033', margin: '0 0 20px' }}>
                {t('Lien officiel de l\'offre', 'الرابط الرسمي للعرض', lang)}
              </h2>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#172033', display: 'block', marginBottom: 6 }}>
                  {t('URL officielle', 'الرابط الرسمي', lang)}
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://www.udemy.com/course/..."
                  style={inputStyle}
                />
                <p style={{ fontSize: 12, color: '#667085', marginTop: 6 }}>
                  {t('Copiez l\'URL directement depuis la page officielle de la formation.', 'انسخ الرابط مباشرة من الصفحة الرسمية للدورة.', lang)}
                </p>
              </div>
              {url && (
                <div style={{
                  backgroundColor: '#F0FDF9', border: '1px solid #A7F3D0',
                  borderRadius: 10, padding: '12px 14px', marginBottom: 20, fontSize: 13, color: '#065F46',
                }}>
                  ✅ {t('Plateforme détectée : ', 'تم اكتشاف المنصة: ', lang)}
                  <strong>
                    {url.includes('udemy') ? 'Udemy' :
                     url.includes('coursera') ? 'Coursera' :
                     url.includes('hackthebox') || url.includes('htb') ? 'Hack The Box' :
                     t('Autre', 'أخرى', lang)}
                  </strong>
                </div>
              )}
              <button
                onClick={() => url && setStep(1)}
                disabled={!url}
                style={{
                  backgroundColor: url ? '#132A4F' : '#E4E9F0',
                  color: url ? '#FFFFFF' : '#667085',
                  border: 'none', cursor: url ? 'pointer' : 'default',
                  padding: '13px', borderRadius: 12,
                  fontSize: 15, fontWeight: 700, width: '100%',
                }}
              >
                {t('Continuer →', 'متابعة →', lang)}
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#172033', margin: '0 0 20px' }}>
                {t('Détails de votre demande', 'تفاصيل طلبك', lang)}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: t("Nom de l'offre", 'اسم العرض', lang), value: name, setter: setName, placeholder: 'Python Bootcamp...', type: 'text' },
                  { label: t('Votre email', 'بريدك الإلكتروني', lang), value: email, setter: setEmail, placeholder: 'vous@email.com', type: 'email' },
                ].map((field, i) => (
                  <div key={i}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#172033', display: 'block', marginBottom: 6 }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={e => field.setter(e.target.value)}
                      placeholder={field.placeholder}
                      style={inputStyle}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#172033', display: 'block', marginBottom: 6 }}>
                    {t('Commentaire (optionnel)', 'تعليق (اختياري)', lang)}
                  </label>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder={t('Précisions, délai souhaité, budget...', 'تفاصيل إضافية، الموعد المطلوب، الميزانية...', lang)}
                    rows={3}
                    style={{ ...inputStyle, height: 'auto', padding: '10px 14px', resize: 'vertical' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button onClick={() => setStep(0)} style={{
                  flex: 1, padding: '12px', borderRadius: 12,
                  border: '1.5px solid #E4E9F0', backgroundColor: '#FFFFFF',
                  cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#172033',
                }}>
                  ← {t('Retour', 'رجوع', lang)}
                </button>
                <button
                  onClick={() => name && email && setStep(2)}
                  disabled={!name || !email}
                  style={{
                    flex: 2, padding: '12px', borderRadius: 12, border: 'none',
                    backgroundColor: name && email ? '#132A4F' : '#E4E9F0',
                    color: name && email ? '#FFFFFF' : '#667085',
                    cursor: name && email ? 'pointer' : 'default',
                    fontSize: 15, fontWeight: 700,
                  }}
                >
                  {t('Continuer →', 'متابعة →', lang)}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#172033', margin: '0 0 20px' }}>
                {t('Résumé et confirmation', 'الملخص والتأكيد', lang)}
              </h2>
              {[
                { label: t('URL', 'الرابط', lang), value: url },
                { label: t("Nom de l'offre", 'اسم العرض', lang), value: name },
                { label: t('Email', 'البريد', lang), value: email },
                { label: t('Commentaire', 'التعليق', lang), value: comment || t('(aucun)', '(لا يوجد)', lang) },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #F0F3F8', fontSize: 14 }}>
                  <span style={{ color: '#667085', minWidth: 100, flexShrink: 0 }}>{row.label}</span>
                  <span style={{ color: '#172033', fontWeight: 500, wordBreak: 'break-all' }}>{row.value}</span>
                </div>
              ))}

              <div style={{
                backgroundColor: '#FFF8F0', border: '1px solid #FDDCB5',
                borderRadius: 10, padding: '12px 14px', margin: '20px 0',
                fontSize: 13, color: '#92400E',
              }}>
                🔒 {t('TaallamGo ne vous demandera jamais votre mot de passe sur une plateforme externe.', 'لن يطلب منك TaallamGo أبداً كلمة مرورك على منصة خارجية.', lang)}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)} style={{
                  flex: 1, padding: '12px', borderRadius: 12,
                  border: '1.5px solid #E4E9F0', backgroundColor: '#FFFFFF',
                  cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#172033',
                }}>
                  ← {t('Modifier', 'تعديل', lang)}
                </button>
                <button
                  onClick={() => setSubmitted(true)}
                  style={{
                    flex: 2, padding: '12px', borderRadius: 12, border: 'none',
                    backgroundColor: '#18A979', color: '#FFFFFF',
                    cursor: 'pointer', fontSize: 15, fontWeight: 700,
                  }}
                >
                  {t('Envoyer la demande', 'إرسال الطلب', lang)}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
