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
    ar: 'اختر دورتك',
    descFr: 'Parcourez notre catalogue de formations internationales et trouvez celle qui correspond à vos objectifs.',
    descAr: 'تصفح كتالوج الدورات الدولية واعثر على ما يناسب أهدافك.',
    icon: '🔍',
  },
  {
    num: '02',
    fr: 'Consultez le prix final en DZD',
    ar: 'استشر السعر النهائي بالدينار',
    descFr: 'Obtenez un devis transparent incluant la conversion, les frais de service et le total à payer en dinars.',
    descAr: 'احصل على عرض سعر شفاف يتضمن التحويل ورسوم الخدمة والإجمالي بالدينار.',
    icon: '💰',
  },
  {
    num: '03',
    fr: 'Payez avec un moyen local disponible',
    ar: 'ادفع بوسيلة محلية متاحة',
    descFr: 'Choisissez parmi les méthodes de paiement autorisées en Algérie : virement, CCP, mobile money.',
    descAr: 'اختر من طرق الدفع المتاحة في الجزائر: تحويل بنكي، CCP، موبايل موني.',
    icon: '🏦',
  },
  {
    num: '04',
    fr: 'Recevez et suivez votre accès',
    ar: 'استلم وتابع وصولك',
    descFr: 'Votre accès est livré sur votre propre compte. Suivez l\'avancement de votre commande en temps réel.',
    descAr: 'يُسلَّم الوصول إلى حسابك الشخصي. تابع تقدم طلبك في الوقت الفعلي.',
    icon: '✅',
  },
]

const trustPoints = [
  {
    icon: '👤',
    fr: 'Accès personnel',
    ar: 'وصول شخصي',
    descFr: 'Votre accès est livré sur votre propre compte existant. Vos données restent les vôtres.',
    descAr: 'يُسلَّم الوصول إلى حسابك الشخصي. بياناتك تبقى ملكك.',
  },
  {
    icon: '💎',
    fr: 'Prix transparent',
    ar: 'سعر شفاف',
    descFr: 'Devis complet avant tout engagement. Aucun frais caché, aucune surprise.',
    descAr: 'عرض سعر كامل قبل أي التزام. لا رسوم خفية، لا مفاجآت.',
  },
  {
    icon: '🔒',
    fr: 'Paiement sécurisé',
    ar: 'دفع آمن',
    descFr: 'Moyens de paiement locaux autorisés. Votre argent est protégé jusqu\'à livraison.',
    descAr: 'طرق دفع محلية مرخصة. أموالك محمية حتى التسليم.',
  },
  {
    icon: '🤝',
    fr: 'Support local',
    ar: 'دعم محلي',
    descFr: 'Une équipe algérienne à votre écoute en français et en arabe.',
    descAr: 'فريق جزائري في خدمتك بالعربية والفرنسية.',
  },
]

export function HomePage({ lang, navigate, dir }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const isMobile = useIsMobile()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('catalog')
  }

  const featuredCourses = courses.slice(0, 4)

  return (
    <div style={{ backgroundColor: '#F7F9FC' }}>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #F7F9FC 0%, #FFFFFF 48%, #EFF8F4 100%)',
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
              backgroundColor: 'rgba(24,169,121,0.15)',
              border: '1px solid rgba(24,169,121,0.3)',
              borderRadius: 100, padding: '6px 14px', marginBottom: 24,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#18A979', display: 'inline-block' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#132A4F' }}>
                {t('Plateforme algérienne EdTech', 'منصة جزائرية للتعليم', lang)}
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: 800,
              color: '#132A4F',
              lineHeight: 1.15,
              margin: '0 0 20px',
              letterSpacing: 0,
            }}>
              {t(
                'Les meilleures formations mondiales, accessibles depuis l\'Algérie.',
                'أفضل الدورات العالمية، متاحة من الجزائر.',
                lang
              )}
            </h1>

            <p style={{
              fontSize: 'clamp(15px, 1.5vw, 18px)',
              color: '#667085',
              lineHeight: 1.7,
              margin: '0 0 36px',
              maxWidth: 560,
            }}>
              {t(
                'Découvrez des cours et certifications internationales, payez simplement en dinars et recevez votre accès en toute sécurité.',
                'اكتشف الدورات والشهادات الدولية، ادفع بسهولة بالدينار واستلم وصولك بأمان.',
                lang
              )}
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: isMobile ? 32 : 48 }}>
              <button
                onClick={() => navigate('catalog')}
                style={{
                  backgroundColor: '#18A979', color: '#FFFFFF',
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
                {t('Explorer les formations', 'استكشف الدورات', lang)} →
              </button>
              <button
                onClick={() => navigate('custom-request')}
                style={{
                  backgroundColor: '#FFFFFF', color: '#132A4F',
                  border: '1.5px solid #E4E9F0', cursor: 'pointer',
                  padding: '13px 20px', borderRadius: 12,
                  fontSize: 16, fontWeight: 600,
                  width: isMobile ? '100%' : 'auto',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#18A979')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#E4E9F0')}
              >
                {t('Demander une formation', 'اطلب دورة', lang)}
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
                  placeholder={t('Rechercher Python, AWS, Figma...', 'ابحث عن Python, AWS, Figma...', lang)}
                  style={{
                    width: '100%', height: 50,
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E4E9F0',
                    borderRight: isMobile ? '1.5px solid #E4E9F0' : 'none',
                    borderRadius: isMobile ? 12 : '12px 0 0 12px',
                    padding: '0 16px 0 42px',
                    fontSize: 15, color: '#172033',
                    outline: 'none',
                    fontFamily: lang === 'ar' ? "'IBM Plex Sans Arabic'" : "'Plus Jakarta Sans'",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: '#18A979', color: '#FFFFFF',
                  border: 'none', cursor: 'pointer',
                  padding: isMobile ? '14px 22px' : '0 22px', borderRadius: isMobile ? 12 : '0 12px 12px 0',
                  fontSize: 14, fontWeight: 700,
                  whiteSpace: 'nowrap',
                  width: isMobile ? '100%' : 'auto',
                }}
              >
                {t('Rechercher', 'بحث', lang)}
              </button>
            </form>
          </Reveal>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 32, marginTop: 56, flexWrap: 'wrap' }}>
            {[
              { num: '500+', label: t('Formations disponibles', 'دورة متاحة', lang) },
              { num: '8', label: t('Plateformes intégrées', 'منصة متكاملة', lang) },
              { num: '100%', label: t('Paiement en DZD', 'دفع بالدينار', lang) },
              { num: '24h', label: t('Support réactif', 'دعم متجاوب', lang) },
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
      <section style={{ padding: '64px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 40, textAlign: dir === 'rtl' ? 'right' : 'left' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#172033', margin: '0 0 8px' }}>
            {t('Catégories populaires', 'الفئات الشائعة', lang)}
          </h2>
          <p style={{ fontSize: 15, color: '#667085', margin: 0 }}>
            {t('Explorez par domaine et trouvez votre prochain objectif.', 'استكشف حسب المجال واعثر على هدفك القادم.', lang)}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate('catalog')}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E4E9F0',
                borderRadius: 14,
                padding: '20px 16px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#18A979'
                e.currentTarget.style.backgroundColor = '#F0FDF9'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E4E9F0'
                e.currentTarget.style.backgroundColor = '#FFFFFF'
              }}
            >
              <span style={{ fontSize: 28 }}>{cat.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#172033' }}>
                {lang === 'ar' ? cat.labelAr : cat.label}
              </span>
              <span style={{ fontSize: 12, color: '#667085' }}>{cat.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Popular offers */}
      <section style={{ padding: '16px 24px 64px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#172033', margin: '0 0 8px' }}>
              {t('Offres populaires', 'العروض الشائعة', lang)}
            </h2>
            <p style={{ fontSize: 15, color: '#667085', margin: 0 }}>
              {t('Les formations les plus demandées par nos clients.', 'الدورات الأكثر طلباً لدى عملائنا.', lang)}
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
            {t('Voir tout', 'عرض الكل', lang)} →
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
              {t('Comment ça marche ?', 'كيف يعمل؟', lang)}
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
              {t('Simple, transparent et sécurisé en 4 étapes.', 'بسيط وشفاف وآمن في 4 خطوات.', lang)}
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
                  {t('ÉTAPE', 'خطوة', lang)} {step.num}
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
              {t('En savoir plus', 'اعرف أكثر', lang)}
            </button>
          </div>
        </div>
      </section>

      {/* Trust block */}
      <section style={{ padding: '72px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#172033', margin: '0 0 12px' }}>
            {t('Pourquoi nous faire confiance ?', 'لماذا تثق بنا؟', lang)}
          </h2>
          <p style={{ fontSize: 16, color: '#667085', margin: 0, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            {t('Votre sécurité et votre satisfaction sont notre priorité absolue.', 'أمانك ورضاك هو أولويتنا المطلقة.', lang)}
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
          background: 'linear-gradient(135deg, #132A4F 0%, #1B3A6B 100%)',
          borderRadius: 20, padding: '48px 56px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24,
        }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px' }}>
              {t('Une offre pour les organisations', 'عرض للمؤسسات', lang)}
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: 0, maxWidth: 440 }}>
              {t(
                'Universités, entreprises, clubs et établissements — bénéficiez de tarifs groupés et de factures.',
                'الجامعات والشركات والنوادي - استفد من أسعار الجملة والفواتير.',
                lang
              )}
            </p>
          </div>
          <button
            onClick={() => navigate('organizations')}
            style={{
              backgroundColor: '#18A979', color: '#FFFFFF',
              border: 'none', cursor: 'pointer',
              padding: '13px 28px', borderRadius: 12,
              fontSize: 15, fontWeight: 700,
              boxShadow: '0 4px 14px rgba(24,169,121,0.35)',
              flexShrink: 0,
            }}
          >
            {t('Demander un devis', 'طلب عرض سعر', lang)}
          </button>
        </div>
      </section>

      {/* FAQ teaser */}
      <section style={{ padding: '0 24px 72px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#172033', margin: '0 0 32px', textAlign: 'center' }}>
          {t('Questions fréquentes', 'الأسئلة الشائعة', lang)}
        </h2>

        {[
          {
            q: t('TaallamGo est-il légal en Algérie ?', 'هل TaallamGo قانوني في الجزائر؟', lang),
            a: t('Oui. TaallamGo facilite l\'accès légal aux plateformes en utilisant uniquement des moyens de paiement autorisés par la réglementation algérienne.', 'نعم. يسهّل TaallamGo الوصول القانوني إلى المنصات باستخدام وسائل الدفع المرخصة بالتنظيم الجزائري فقط.', lang),
          },
          {
            q: t('TaallamGo me demandera-t-il mon mot de passe ?', 'هل سيطلب TaallamGo كلمة مروري؟', lang),
            a: t('Non, jamais. Vous n\'avez à fournir aucun mot de passe externe. Votre accès vous est livré via des méthodes officielles.', 'لا، أبداً. لا تحتاج إلى تقديم أي كلمة مرور خارجية. يُسلَّم وصولك عبر طرق رسمية.', lang),
          },
          {
            q: t('Quels sont les délais de livraison ?', 'ما هي مواعيد التسليم؟', lang),
            a: t('En général sous 24 à 72h ouvrables selon la plateforme et le type d\'offre. Un devis précis est fourni avant commande.', 'عادةً خلال 24 إلى 72 ساعة عمل حسب المنصة ونوع العرض. يُقدَّم عرض سعر دقيق قبل الطلب.', lang),
          },
        ].map((faq, i) => (
          <FaqItem key={i} q={faq.q} a={faq.a} />
        ))}

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button
            onClick={() => navigate('help')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 15, fontWeight: 600, color: '#18A979',
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}
          >
            {t('Voir toutes les questions →', 'عرض جميع الأسئلة →', lang)}
          </button>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #18A979 0%, #15956A 100%)',
        padding: '64px 24px', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px' }}>
          {t('Prêt à commencer ?', 'مستعد للبدء؟', lang)}
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', margin: '0 0 36px' }}>
          {t('Rejoignez des milliers d\'Algériens qui apprennent sans frontières.', 'انضم إلى آلاف الجزائريين الذين يتعلمون بلا حدود.', lang)}
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
            {t('Explorer les formations', 'استكشف الدورات', lang)}
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
            {t('Créer un compte', 'إنشاء حساب', lang)}
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
