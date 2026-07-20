import { useState } from 'react'
import type { Lang } from '../data'
import { t } from '../data'
import { ImageWithFallback } from '../components/ImageWithFallback'
import { useIsMobile } from '../hooks/useIsMobile'
import { formatDzd } from '../format'

interface Course {
  id: string
  title: string
  titleAr: string
  platform: string
  category: string
  level: string
  levelAr: string
  price_usd: number
  price_dzd: number
  rating: number
  reviews: number
  duration: string
  instructor: string
  image: string
  certificate: boolean
  tag: string | null
  tagColor: string | null
}

interface Props {
  lang: Lang
  navigate: (page: string, data?: unknown) => void
  dir: 'ltr' | 'rtl'
  course: Course | null
}

const TOTAL_ADJUSTMENT_RATE = 0.12

export function CourseDetailPage({ lang, navigate, course: propCourse, dir }: Props) {
  const [orderStep, setOrderStep] = useState(0) // 0: view, 1: quote, 2: confirm, 3: payment, 4: success
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const isMobile = useIsMobile()

  const course = propCourse || {
    id: '1',
    title: 'The Complete Python Bootcamp: Zero to Hero',
    titleAr: 'دورة بايثون الشاملة: من الصفر إلى الاحتراف',
    platform: 'Udemy',
    category: 'dev',
    level: 'Débutant',
    levelAr: 'مبتدئ',
    price_usd: 13.99,
    price_dzd: 1890,
    rating: 4.7,
    reviews: 453210,
    duration: '22h',
    instructor: 'Jose Portilla',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop&auto=format',
    certificate: true,
    tag: 'Bestseller',
    tagColor: 'var(--warning)',
  }

  const totalAdjustment = Math.round(course.price_dzd * TOTAL_ADJUSTMENT_RATE)
  const total = course.price_dzd + totalAdjustment

  const paymentMethods = [
    { id: 'ccp', label: t('Virement CCP', 'تحويل CCP', lang), icon: '🏦' },
    { id: 'baridimob', label: 'BaridiMob', icon: '📱' },
    { id: 'virement', label: t('Virement bancaire', 'تحويل بنكي', lang), icon: '🏛️' },
    { id: 'mobilis', label: 'Mobilis Money', icon: '💳' },
  ]

  if (orderStep === 4) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            backgroundColor: 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: 36,
          }}>
            ✅
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 12px' }}>
            {t('Commande créée !', 'تم إنشاء الطلب!', lang)}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted-foreground)', margin: '0 0 8px' }}>
            {t('Numéro de commande :', 'رقم الطلب:', lang)} <strong style={{ color: 'var(--primary)' }}>TGO-2025-0099</strong>
          </p>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)', margin: '0 0 32px', lineHeight: 1.7 }}>
            {t(
              'Votre commande est en cours de traitement. Vous recevrez une mise à jour par email. Suivez votre commande depuis votre espace client.',
              'طلبك قيد المعالجة. ستتلقى تحديثاً عبر البريد الإلكتروني. تابع طلبك من لوحة التحكم.',
              lang
            )}
          </p>
          <button
            onClick={() => navigate('dashboard')}
            style={{
              backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)',
              border: 'none', cursor: 'pointer',
              padding: '13px 32px', borderRadius: 12,
              fontSize: 15, fontWeight: 700,
            }}
          >
            {t('Suivre ma commande', 'تتبع طلبي', lang)}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '12px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted-foreground)' }}>
          <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', fontSize: 13 }}>
            {t('Accueil', 'الرئيسية', lang)}
          </button>
          <span>/</span>
          <button onClick={() => navigate('catalog')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', fontSize: 13 }}>
            {t('Catalogue', 'الكتالوج', lang)}
          </button>
          <span>/</span>
          <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>
            {lang === 'ar' ? course.titleAr : course.title}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '22px 14px' : '36px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 360px', gap: isMobile ? 22 : 36, alignItems: 'start' }}>

          {/* Left column */}
          <div>
            {/* Course image */}
            <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 28, aspectRatio: isMobile ? '16/10' : '16/7' }}>
              <ImageWithFallback
                src={course.image}
                alt={lang === 'ar' ? course.titleAr : course.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 6,
                backgroundColor: 'var(--surface-secondary)', color: 'var(--primary)',
              }}>
                {course.platform}
              </span>
              <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
                {lang === 'ar' ? course.levelAr : course.level}
              </span>
              {course.certificate && (
                <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  🎓 {t('Certificat inclus', 'شهادة مرفقة', lang)}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: isMobile ? 23 : 28, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 12px', lineHeight: 1.25 }}>
              {lang === 'ar' ? course.titleAr : course.title}
            </h1>

            <p style={{ fontSize: 15, color: 'var(--muted-foreground)', margin: '0 0 16px' }}>
              {t('Par', 'بواسطة', lang)} <strong style={{ color: 'var(--foreground)' }}>{course.instructor}</strong>
            </p>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--warning)' }}>{course.rating}</span>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="14" height="14" viewBox="0 0 12 12" fill={i <= Math.round(course.rating) ? 'var(--warning)' : 'var(--border)'}>
                    <polygon points="6,1 7.5,4.5 11,4.9 8.5,7.2 9.2,11 6,9.1 2.8,11 3.5,7.2 1,4.9 4.5,4.5" />
                  </svg>
                ))}
              </div>
              <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>({formatDzd(course.reviews)} {t('avis', 'تقييم', lang)})</span>
              <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>• {course.duration}</span>
            </div>

            {/* Description */}
            <section style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)', margin: '0 0 12px' }}>
                {t('À propos de cette formation', 'حول هذه الدورة', lang)}
              </h2>
              <p style={{ fontSize: 15, color: 'var(--muted-foreground)', lineHeight: 1.75, margin: 0 }}>
                {t(
                  `Cette formation vous permettra d'acquérir toutes les compétences nécessaires dans le domaine de ${course.platform}. Conçue par ${course.instructor}, elle est reconnue mondialement et appréciée par des milliers d'apprenants.`,
                  `ستتيح لك هذه الدورة اكتساب جميع المهارات اللازمة في مجال ${course.platform}. صُممت بواسطة ${course.instructor} وتحظى باعتراف عالمي وتقدير من آلاف المتعلمين.`,
                  lang
                )}
              </p>
            </section>

            {/* Included */}
            <section style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)', margin: '0 0 14px' }}>
                {t('Ce qui est inclus', 'ما هو مرفق', lang)}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                {[
                  t('Accès à vie', 'وصول مدى الحياة', lang),
                  t(`${course.duration} de contenu`, `${course.duration} من المحتوى`, lang),
                  t('Accès mobile', 'وصول موبايل', lang),
                  course.certificate ? t('Certificat de complétion', 'شهادة إتمام', lang) : null,
                  t('Ressources téléchargeables', 'موارد قابلة للتنزيل', lang),
                  t('Support communauté', 'دعم مجتمعي', lang),
                ].filter(Boolean).map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--foreground)' }}>
                    <span style={{ color: 'var(--accent)', fontSize: 16, flexShrink: 0 }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* Not included */}
            <section style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)', margin: '0 0 14px' }}>
                {t('Non inclus', 'غير مرفق', lang)}
              </h2>
              {[
                t('Accès au compte d\'un autre utilisateur', 'الوصول إلى حساب مستخدم آخر', lang),
                t('Mot de passe externe — TaallamGo ne le demandera jamais', 'كلمة مرور خارجية — لن يطلبها TaallamGo أبداً', lang),
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--muted-foreground)', marginBottom: 6 }}>
                  <span style={{ color: 'var(--error)', fontSize: 16, flexShrink: 0 }}>✗</span>
                  {item}
                </div>
              ))}
            </section>

            {/* Lien officiel */}
            <div style={{
              backgroundColor: 'var(--surface-secondary)', borderRadius: 12,
              padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 12,
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  {t('Lien officiel', 'الرابط الرسمي', lang)}
                </div>
                <div style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 500 }}>
                  {course.platform}.com
                </div>
              </div>
              <span style={{ fontSize: 12, color: 'var(--muted-foreground)', fontStyle: 'italic' }}>
                {t('Les marques appartiennent à leurs propriétaires.', 'العلامات التجارية ملك أصحابها.', lang)}
              </span>
            </div>
          </div>

          {/* Right column — price panel */}
          <div style={{ position: isMobile ? 'static' : 'sticky', top: 80 }}>
            <div style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(19,42,79,0.08)',
            }}>
              {/* Price breakdown */}
              <div style={{ padding: '24px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
                  {t('Devis détaillé', 'عرض السعر المفصل', lang)}
                </div>


                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 0,
                }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)' }}>
                    {t('Total à payer', 'الإجمالي للدفع', lang)}
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>
                      {formatDzd(total)} DZD
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div style={{ padding: '0 24px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: '📅', label: t('Dernière vérification', 'آخر تحقق', lang), value: '20 Jan 2025' },
                  { icon: '⏱️', label: t('Durée du devis', 'مدة العرض', lang), value: t('48h ouvrables', '48 ساعة عمل', lang) },
                  { icon: '🚚', label: t('Délai de livraison', 'مهلة التسليم', lang), value: t('24–72h ouvrables', '24-72 ساعة عمل', lang) },
                  { icon: '📦', label: t('Méthode de livraison', 'طريقة التسليم', lang), value: t('Accès compte personnel', 'وصول الحساب الشخصي', lang) },
                  { icon: '↩️', label: t('Remboursement', 'الاسترداد', lang), value: t('Politique transparente', 'سياسة شفافة', lang) },
                ].map((meta, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13 }}>
                    <span style={{ flexShrink: 0 }}>{meta.icon}</span>
                    <span style={{ color: 'var(--muted-foreground)' }}>{meta.label} :</span>
                    <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{meta.value}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              {orderStep === 0 && (
                <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    onClick={() => setOrderStep(1)}
                    style={{
                      backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)',
                      border: 'none', cursor: 'pointer',
                      padding: '14px', borderRadius: 12,
                      fontSize: 16, fontWeight: 700, width: '100%',
                      boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
                    }}
                  >
                    {t('Commander', 'اطلب الآن', lang)}
                  </button>
                  <button
                    onClick={() => navigate('help')}
                    style={{
                      backgroundColor: 'var(--surface-secondary)', color: 'var(--foreground)',
                      border: 'none', cursor: 'pointer',
                      padding: '12px', borderRadius: 12,
                      fontSize: 14, fontWeight: 600, width: '100%',
                    }}
                  >
                    {t('Poser une question', 'طرح سؤال', lang)}
                  </button>
                </div>
              )}

              {/* Order flow — step 1: quote confirm */}
              {orderStep === 1 && (
                <div style={{ padding: '0 24px 24px' }}>
                  <div style={{
                    backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border)',
                    borderRadius: 10, padding: '14px', marginBottom: 16, fontSize: 13, color: 'var(--accent)',
                  }}>
                    ✅ {t('Votre devis est valide 48h. Total confirmé avant commande.', 'عرض السعر صالح 48 ساعة. يتم تأكيد الإجمالي قبل الطلب.', lang)}
                  </div>
                  <button
                    onClick={() => setOrderStep(2)}
                    style={{
                      backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)',
                      border: 'none', cursor: 'pointer',
                      padding: '14px', borderRadius: 12,
                      fontSize: 15, fontWeight: 700, width: '100%',
                    }}
                  >
                    {t('Confirmer la commande', 'تأكيد الطلب', lang)}
                  </button>
                </div>
              )}

              {/* Step 2: payment method */}
              {orderStep === 2 && (
                <div style={{ padding: '0 24px 24px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', marginBottom: 12 }}>
                    {t('Choisissez votre moyen de paiement', 'اختر طريقة الدفع', lang)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                    {paymentMethods.map(pm => (
                      <button
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 14px', borderRadius: 10,
                          border: `1.5px solid ${paymentMethod === pm.id ? 'var(--accent)' : 'var(--border)'}`,
                          backgroundColor: paymentMethod === pm.id ? 'var(--surface-secondary)' : 'var(--surface)',
                          cursor: 'pointer', fontSize: 14, fontWeight: 500, color: 'var(--foreground)',
                          textAlign: dir === 'rtl' ? 'right' : 'left',
                        }}
                      >
                        <span>{pm.icon}</span>
                        <span>{pm.label}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={!paymentMethod}
                    onClick={() => setOrderStep(3)}
                    style={{
                      backgroundColor: paymentMethod ? 'var(--accent)' : 'var(--border)',
                      color: paymentMethod ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
                      border: 'none', cursor: paymentMethod ? 'pointer' : 'default',
                      padding: '14px', borderRadius: 12,
                      fontSize: 15, fontWeight: 700, width: '100%',
                    }}
                  >
                    {t('Procéder au paiement', 'انتقل للدفع', lang)}
                  </button>
                </div>
              )}

              {/* Step 3: demo payment */}
              {orderStep === 3 && (
                <div style={{ padding: '0 24px 24px' }}>
                  <div style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.14)', border: '1px solid var(--warning)',
                    borderRadius: 10, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: 'var(--warning)',
                  }}>
                    ⚠️ {t('Paiement de démonstration — aucune somme ne sera débitée.', 'دفع تجريبي — لن يُخصم أي مبلغ.', lang)}
                  </div>
                  <button
                    onClick={() => setOrderStep(4)}
                    style={{
                      backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)',
                      border: 'none', cursor: 'pointer',
                      padding: '14px', borderRadius: 12,
                      fontSize: 15, fontWeight: 700, width: '100%',
                    }}
                  >
                    {t('Simuler le paiement →', 'محاكاة الدفع →', lang)}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
