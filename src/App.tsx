import { useEffect, useState } from 'react'
import type { Lang } from './data'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { CustomCursor } from './components/CustomCursor'
import { DynamicBackButton } from './components/DynamicBackButton'
import { useTheme } from './hooks/useTheme'
import { useIsMobile } from './hooks/useIsMobile'
import { HomePage } from './views/HomePage'
import { CatalogPage } from './views/CatalogPage'
import { CourseDetailPage } from './views/CourseDetailPage'
import { AuthPage } from './views/AuthPage'
import { CustomerDashboard } from './views/CustomerDashboard'
import { AdminDashboard } from './views/AdminDashboard'
import { PlatformsPage } from './views/PlatformsPage'
import { HowItWorksPage } from './views/HowItWorksPage'
import { CustomRequestPage } from './views/CustomRequestPage'

type Page =
  | 'home'
  | 'catalog'
  | 'course'
  | 'platforms'
  | 'how-it-works'
  | 'help'
  | 'auth-login'
  | 'auth-register'
  | 'auth-forgot'
  | 'dashboard'
  | 'admin'
  | 'custom-request'
  | 'organizations'
  | 'about'
  | 'trust'
  | 'contact'

const PAGES_NO_HEADER: Page[] = ['dashboard', 'admin']
const PAGES_NO_FOOTER: Page[] = ['dashboard', 'admin', 'auth-login', 'auth-register', 'auth-forgot']

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'fr'
  const saved = window.localStorage.getItem('taallamgo-lang')
  return saved === 'ar' || saved === 'fr' ? saved : 'fr'
}

type NavigationEntry = {
  page: Page
  data?: unknown
}

const BACK_FALLBACKS: Record<Page, Page> = {
  home: 'home',
  catalog: 'home',
  course: 'catalog',
  platforms: 'home',
  'how-it-works': 'home',
  help: 'home',
  'auth-login': 'home',
  'auth-register': 'home',
  'auth-forgot': 'auth-login',
  dashboard: 'home',
  admin: 'home',
  'custom-request': 'catalog',
  organizations: 'home',
  about: 'home',
  trust: 'home',
  contact: 'home',
}

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [lang, setLang] = useState<Lang>(getInitialLang)
  const [courseData, setCourseData] = useState<unknown>(null)
  const [navigationHistory, setNavigationHistory] = useState<NavigationEntry[]>([])
  const { theme, toggleTheme } = useTheme()

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [dir, lang])

  const navigate = (target: string, data?: unknown) => {
    const nextPage = target as Page
    if (nextPage === page && data === undefined) return

    setNavigationHistory(prev => [...prev, { page, data: courseData }].slice(-12))
    setPage(nextPage)
    if (data !== undefined) setCourseData(data)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack = () => {
    const previous = navigationHistory[navigationHistory.length - 1]
    const target = previous ?? { page: BACK_FALLBACKS[page] }

    setNavigationHistory(prev => prev.slice(0, -1))
    setPage(target.page)
    setCourseData(target.data)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleLang = () => {
    setLang(prev => {
      const next = prev === 'fr' ? 'ar' : 'fr'
      window.localStorage.setItem('taallamgo-lang', next)
      return next
    })
  }

  const props = { lang, navigate, dir: dir as 'ltr' | 'rtl' }

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage {...props} />
      case 'catalog': return <CatalogPage {...props} />
      case 'course': return <CourseDetailPage {...props} course={(courseData as unknown) as Parameters<typeof CourseDetailPage>[0]['course']} />
      case 'platforms': return <PlatformsPage {...props} />
      case 'how-it-works': return <HowItWorksPage {...props} />
      case 'custom-request': return <CustomRequestPage {...props} />
      case 'auth-login': return <AuthPage {...props} mode="login" />
      case 'auth-register': return <AuthPage {...props} mode="register" />
      case 'auth-forgot': return <AuthPage {...props} mode="forgot" />
      case 'dashboard': return <CustomerDashboard {...props} />
      case 'admin': return <AdminDashboard {...props} />
      case 'organizations': return <OrganizationsPage {...props} />
      case 'help': return <HelpPage {...props} />
      case 'about': return <AboutPage {...props} />
      case 'trust': return <TrustPage {...props} />
      case 'contact': return <ContactPage {...props} />
      default: return <HomePage {...props} />
    }
  }

  const showHeader = !PAGES_NO_HEADER.includes(page)
  const showFooter = !PAGES_NO_FOOTER.includes(page)

  return (
    <div dir={dir} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CustomCursor />
      {showHeader && (
        <Header
          lang={lang}
          onLangToggle={toggleLang}
          currentPage={page}
          navigate={navigate}
          dir={dir as 'ltr' | 'rtl'}
          theme={theme}
          onThemeToggle={toggleTheme}
        />
      )}
      <main style={{ flex: 1 }}>
        <DynamicBackButton
          lang={lang}
          dir={dir as 'ltr' | 'rtl'}
          currentPage={page}
          canGoBack={navigationHistory.length > 0}
          onBack={goBack}
        />
        {renderPage()}
      </main>
      {showFooter && (
        <Footer lang={lang} navigate={navigate} dir={dir as 'ltr' | 'rtl'} />
      )}
    </div>
  )
}

// ─── Lightweight inline pages ─────────────────────────────────────────────────

type InlineProps = { lang: Lang; navigate: (p: string) => void; dir: 'ltr' | 'rtl' }

function OrganizationsPage({ lang }: InlineProps) {
  const t = (fr: string, ar: string, _?: unknown) => lang === 'ar' ? ar : fr
  const isMobile = useIsMobile()
  const [submitted, setSubmitted] = useState(false)
  const inputStyle = { width: '100%', height: 44, border: '1.5px solid var(--border)', borderRadius: 10, padding: '0 14px', fontSize: 14, color: 'var(--foreground)', outline: 'none', backgroundColor: 'var(--surface)', fontFamily: lang === 'ar' ? "'IBM Plex Sans Arabic'" : "'Plus Jakarta Sans'" }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '56px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 12px' }}>
          {t('Pour les organisations', 'للمؤسسات', lang)}
        </h1>
        <p style={{ fontSize: 17, color: 'var(--muted-foreground)', margin: 0, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
          {t('Universités, entreprises, clubs et établissements. Formations groupées avec factures.', 'الجامعات والشركات والنوادي. دورات جماعية مع فواتير.', lang)}
        </p>
      </div>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: 20, marginBottom: 48 }}>
          {[
            { icon: '🎓', title: t('Universités & écoles', 'الجامعات والمدارس', lang), desc: t('Certifications pour les étudiants en bloc.', 'شهادات للطلاب بشكل جماعي.', lang) },
            { icon: '🏢', title: t('Entreprises', 'الشركات', lang), desc: t('Formation des équipes avec facture officielle.', 'تدريب الفرق مع فاتورة رسمية.', lang) },
            { icon: '🎯', title: t('Clubs & associations', 'النوادي والجمعيات', lang), desc: t('Accès pour vos membres aux meilleurs cours.', 'وصول لأعضائكم إلى أفضل الدورات.', lang) },
            { icon: '📊', title: t('Tarifs préférentiels', 'أسعار تفضيلية', lang), desc: t('Réductions sur commandes groupées.', 'خصومات على الطلبات الجماعية.', lang) },
          ].map((item, i) => (
            <div key={i} style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--foreground)', margin: '0 0 8px' }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 10px' }}>{t('Demande reçue !', 'تم استلام الطلب!', lang)}</h2>
            <p style={{ fontSize: 15, color: 'var(--muted-foreground)' }}>{t('Nous vous contacterons sous 48h.', 'سنتواصل معكم خلال 48 ساعة.', lang)}</p>
          </div>
        ) : (
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 24px' }}>{t('Demande de devis groupé', 'طلب عرض سعر جماعي', lang)}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {[
                { label: t('Organisation', 'المؤسسة', lang), ph: t('Nom de votre organisation', 'اسم مؤسستكم', lang) },
                { label: t('Responsable', 'المسؤول', lang), ph: t('Votre nom', 'اسمكم', lang) },
                { label: t('Email', 'البريد الإلكتروني', lang), ph: 'contact@organisation.dz' },
                { label: t('Nombre d\'apprenants', 'عدد المتعلمين', lang), ph: '10, 50, 100...' },
              ].map((f, i) => (
                <div key={i}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input type="text" placeholder={f.ph} style={inputStyle} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', display: 'block', marginBottom: 6 }}>
                {t('Besoins et commentaires', 'الاحتياجات والتعليقات', lang)}
              </label>
              <textarea placeholder={t('Plateformes souhaitées, budget, délai...', 'المنصات المطلوبة، الميزانية، الموعد...', lang)} rows={3}
                style={{ ...inputStyle, height: 'auto', padding: '10px 14px', resize: 'vertical' }} />
            </div>
            <button onClick={() => setSubmitted(true)} style={{
              backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)', border: 'none', cursor: 'pointer',
              padding: '13px', borderRadius: 12, fontSize: 15, fontWeight: 700, width: '100%',
            }}>
              {t('Envoyer la demande', 'إرسال الطلب', lang)}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function HelpPage({ lang, navigate }: InlineProps) {
  const t = (fr: string, ar: string, _?: unknown) => lang === 'ar' ? ar : fr
  const faqs = [
    { q: t('TaallamGo est-il légal ?', 'هل TaallamGo قانوني؟', lang), a: t('Oui. Nous utilisons uniquement des moyens de paiement autorisés.', 'نعم. نستخدم فقط طرق الدفع المرخصة.', lang) },
    { q: t('Mon mot de passe sera-t-il demandé ?', 'هل ستُطلب كلمة مروري؟', lang), a: t('Non, jamais. Votre sécurité est notre priorité.', 'لا، أبداً. أمانك هو أولويتنا.', lang) },
    { q: t('Quels sont les délais ?', 'ما هي المواعيد؟', lang), a: t('24 à 72h ouvrables selon la plateforme.', '24 إلى 72 ساعة عمل حسب المنصة.', lang) },
    { q: t('Comment suivre ma commande ?', 'كيف أتابع طلبي؟', lang), a: t('Connectez-vous et consultez votre espace client.', 'سجّل الدخول وادخل لوحة تحكم العميل.', lang) },
    { q: t('Puis-je demander un remboursement ?', 'هل يمكنني طلب الاسترداد؟', lang), a: t('Oui, si l\'accès n\'a pas été activé et la livraison est impossible.', 'نعم، إذا لم يُفعَّل الوصول وكان التسليم مستحيلاً.', lang) },
  ]
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '56px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 12px' }}>
          {t('Centre d\'aide', 'مركز المساعدة', lang)}
        </h1>
      </div>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 24px' }}>
          {t('Questions fréquentes', 'الأسئلة الشائعة', lang)}
        </h2>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>{faq.q}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginLeft: 16, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'none' }}>
                <polyline points="5,8 10,13 15,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {openFaq === i && (
              <p style={{ margin: '12px 0 0', fontSize: 14, color: 'var(--muted-foreground)', lineHeight: 1.7 }}>{faq.a}</p>
            )}
          </div>
        ))}
        <div style={{ marginTop: 40, backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, textAlign: 'center' }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--foreground)', margin: '0 0 10px' }}>{t('Besoin d\'aide supplémentaire ?', 'تحتاج مزيداً من المساعدة؟', lang)}</h3>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)', margin: '0 0 20px' }}>{t('Notre équipe est disponible pour vous aider.', 'فريقنا متاح لمساعدتك.', lang)}</p>
          <button onClick={() => navigate('dashboard')} style={{
            backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)', border: 'none', cursor: 'pointer',
            padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700,
          }}>
            {t('Ouvrir un ticket', 'فتح تذكرة', lang)}
          </button>
        </div>
      </div>
    </div>
  )
}

function AboutPage({ lang }: InlineProps) {
  const t = (fr: string, ar: string, _?: unknown) => lang === 'ar' ? ar : fr
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '56px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 12px' }}>
          {t('À propos de TaallamGo', 'حول TaallamGo', lang)}
        </h1>
      </div>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '36px', marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 16px' }}>
            {t('Notre mission', 'مهمتنا', lang)}
          </h2>
          <p style={{ fontSize: 16, color: 'var(--muted-foreground)', lineHeight: 1.8, margin: 0 }}>
            {t(
              'TaallamGo a été créé pour résoudre un problème réel : les Algériens souhaitant se former aux meilleures plateformes mondiales se heurtent aux barrières de paiement. Notre mission est de rendre l\'apprentissage international accessible à tous, simplement et légalement.',
              'تأسّست TaallamGo لحلّ مشكلة حقيقية: الجزائريون الراغبون في التعلم على أفضل المنصات العالمية يواجهون عوائق الدفع. مهمتنا هي جعل التعلم الدولي متاحاً للجميع، بشكل بسيط وقانوني.',
              lang
            )}
          </p>
        </div>
        {[
          { title: t('Transparence', 'الشفافية', lang), desc: t('Total clair en DZD avant confirmation de commande.', 'إجمالي واضح بالدينار قبل تأكيد الطلب.', lang) },
          { title: t('Sécurité', 'الأمان', lang), desc: t('Vos données et votre argent sont protégés. Nous ne demanderons jamais votre mot de passe.', 'بياناتك وأموالك محمية. لن نطلب أبداً كلمة مرورك.', lang) },
          { title: t('Légalité', 'الشرعية', lang), desc: t('Uniquement des moyens de paiement autorisés par la réglementation algérienne.', 'طرق دفع مرخصة بالتنظيم الجزائري فقط.', lang) },
        ].map((v, i) => (
          <div key={i} style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', marginBottom: 16, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
              {['🔍', '🔒', '⚖️'][i]}
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)', margin: '0 0 6px' }}>{v.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted-foreground)', margin: 0, lineHeight: 1.65 }}>{v.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrustPage({ lang }: InlineProps) {
  const t = (fr: string, ar: string, _?: unknown) => lang === 'ar' ? ar : fr
  const points = [
    { icon: '👤', title: t('Accès personnel uniquement', 'وصول شخصي فقط', lang), desc: t('Votre accès est livré sur votre propre compte. Nous ne partageons jamais de compte avec plusieurs utilisateurs.', 'يُسلَّم وصولك على حسابك الشخصي. لا نشارك أي حساب بين مستخدمين.', lang) },
    { icon: '🔐', title: t('Aucun mot de passe externe', 'لا كلمة مرور خارجية', lang), desc: t('TaallamGo ne demandera jamais votre mot de passe sur une plateforme externe. C\'est un signal d\'alerte si quelqu\'un le demande en notre nom.', 'لن يطلب TaallamGo أبداً كلمة مرورك على منصة خارجية. هذا تحذير إذا طلبها أحد باسمنا.', lang) },
    { icon: '🛡️', title: t('Paiements autorisés', 'مدفوعات مرخصة', lang), desc: t('Nous n\'utilisons que des méthodes de paiement conformes à la réglementation algérienne en vigueur.', 'نستخدم فقط طرق الدفع المتوافقة مع التنظيم الجزائري المعمول به.', lang) },
    { icon: '📋', title: t('Preuve de traitement', 'إثبات المعالجة', lang), desc: t('Chaque commande est documentée et traçable. Vous pouvez suivre l\'avancement en temps réel.', 'كل طلب موثق وقابل للتتبع. يمكنك متابعة التقدم في الوقت الفعلي.', lang) },
  ]
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '56px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 12px' }}>
          {t('Confiance & sécurité', 'الثقة والأمان', lang)}
        </h1>
      </div>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {points.map((p, i) => (
            <div key={i} style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{p.icon}</div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--foreground)', margin: '0 0 8px' }}>{p.title}</h3>
                <p style={{ fontSize: 15, color: 'var(--muted-foreground)', margin: 0, lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ContactPage({ lang }: InlineProps) {
  const t = (fr: string, ar: string, _?: unknown) => lang === 'ar' ? ar : fr
  const [submitted, setSubmitted] = useState(false)
  const inputStyle = { width: '100%', height: 44, border: '1.5px solid var(--border)', borderRadius: 10, padding: '0 14px', fontSize: 14, color: 'var(--foreground)', outline: 'none', backgroundColor: 'var(--surface)', fontFamily: lang === 'ar' ? "'IBM Plex Sans Arabic'" : "'Plus Jakarta Sans'" }
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <div style={{ backgroundColor: 'var(--surface-secondary)', padding: '56px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 12px' }}>
          {t('Contact', 'تواصل معنا', lang)}
        </h1>
      </div>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '56px 24px' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 10px' }}>{t('Message envoyé !', 'تم إرسال الرسالة!', lang)}</h2>
            <p style={{ fontSize: 15, color: 'var(--muted-foreground)' }}>{t('Nous vous répondrons sous 48h ouvrables.', 'سنرد عليك خلال 48 ساعة عمل.', lang)}</p>
          </div>
        ) : (
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 36 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: t('Nom', 'الاسم', lang), ph: t('Votre nom', 'اسمك', lang), type: 'text' },
                { label: t('Email', 'البريد', lang), ph: 'vous@email.com', type: 'email' },
                { label: t('Objet', 'الموضوع', lang), ph: t('Sujet de votre message', 'موضوع رسالتك', lang), type: 'text' },
              ].map((f, i) => (
                <div key={i}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', display: 'block', marginBottom: 6 }}>{t('Message', 'الرسالة', lang)}</label>
                <textarea placeholder={t('Votre message...', 'رسالتك...', lang)} rows={4}
                  style={{ ...inputStyle, height: 'auto', padding: '10px 14px', resize: 'vertical' }} />
              </div>
              <button onClick={() => setSubmitted(true)} style={{
                backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)', border: 'none', cursor: 'pointer',
                padding: '13px', borderRadius: 12, fontSize: 15, fontWeight: 700,
              }}>
                {t('Envoyer', 'إرسال', lang)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
