import { useEffect, useMemo, useRef, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import type { Lang } from '../data'
import { t } from '../data'
import { useIsMobile } from '../hooks/useIsMobile'
import { LocalizedThemeLogo } from '../components/LocalizedThemeLogo'
import { formatDzd } from '../format'

interface Props {
  lang: Lang
  navigate: (page: string) => void
  dir: 'ltr' | 'rtl'
}

type Tab = 'overview' | 'orders' | 'order-detail' | 'wishlist' | 'profile' | 'support'

type ApiProduct = {
  title?: string | null
  titleAr?: string | null
  type?: string | null
}

type ApiOrderItem = {
  quantity: number
  priceDzd: number
  product?: ApiProduct | null
}

type ApiPayment = {
  status?: string | null
  provider?: string | null
}

type ApiOrder = {
  id: string
  publicId: string
  totalDzd: number
  status: string
  deliveryMethod?: string | null
  createdAt: string
  items?: ApiOrderItem[]
  payment?: ApiPayment | null
}

type OrdersResponse = {
  success: boolean
  data?: ApiOrder[]
  error?: string
}

type DashboardOrder = {
  id: string
  publicId: string
  course: string
  platform: string
  amount: number
  status: string
  date: string
  deliveryMethod: string
  quantity: number
  paymentStatus?: string | null
}

const sidebarLinks: Array<{ key: Tab; icon: string; fr: string; ar: string }> = [
  { key: 'overview', icon: '⌂', fr: "Vue d'ensemble", ar: 'نظرة عامة' },
  { key: 'orders', icon: '▣', fr: 'Mes commandes', ar: 'طلباتي' },
  { key: 'wishlist', icon: '♡', fr: 'Liste de souhaits', ar: 'قائمة الرغبات' },
  { key: 'support', icon: '?', fr: 'Support', ar: 'الدعم' },
  { key: 'profile', icon: '●', fr: 'Profil & sécurité', ar: 'الملف الشخصي والأمان' },
]

const statusMeta: Record<string, { fr: string; ar: string; color: string }> = {
  awaiting_payment: { fr: 'En attente de paiement', ar: 'في انتظار الدفع', color: 'var(--warning)' },
  pending_payment: { fr: 'En attente de paiement', ar: 'في انتظار الدفع', color: 'var(--warning)' },
  payment_review: { fr: 'Paiement en vérification', ar: 'التحقق من الدفع', color: 'var(--warning)' },
  payment_verif: { fr: 'Paiement en vérification', ar: 'التحقق من الدفع', color: 'var(--warning)' },
  paid: { fr: 'Paiement confirmé', ar: 'تم تأكيد الدفع', color: 'var(--accent)' },
  payment_confirmed: { fr: 'Paiement confirmé', ar: 'تم تأكيد الدفع', color: 'var(--accent)' },
  processing: { fr: 'Traitement en cours', ar: 'قيد المعالجة', color: 'var(--accent)' },
  customer_action_required: { fr: 'Action client requise', ar: 'إجراء مطلوب من العميل', color: 'var(--warning)' },
  delivered: { fr: 'Livrée', ar: 'تم التسليم', color: 'var(--accent)' },
  cancelled: { fr: 'Annulée', ar: 'ملغاة', color: 'var(--error)' },
  refund_pending: { fr: 'Remboursement en cours', ar: 'استرداد جاري', color: 'var(--muted-foreground)' },
  refunded: { fr: 'Remboursée', ar: 'تم الاسترداد', color: 'var(--muted-foreground)' },
  disputed: { fr: 'Litige', ar: 'نزاع', color: 'var(--error)' },
  dispute: { fr: 'Litige', ar: 'نزاع', color: 'var(--error)' },
}

const timelineSteps = [
  'awaiting_payment',
  'payment_review',
  'paid',
  'processing',
  'delivered',
]

function getStatusMeta(statusKey: string, lang: Lang) {
  const meta = statusMeta[statusKey] ?? {
    fr: statusKey.replace(/_/g, ' '),
    ar: statusKey.replace(/_/g, ' '),
    color: 'var(--muted-foreground)',
  }

  return {
    label: lang === 'ar' ? meta.ar : meta.fr,
    color: meta.color,
  }
}

function getOrderStepIndex(status: string) {
  if (status === 'pending_payment') return 0
  if (status === 'payment_verif') return 1
  if (status === 'payment_confirmed') return 2
  if (status === 'customer_action_required') return 3
  return Math.max(timelineSteps.indexOf(status), 0)
}

function formatDate(value: string, lang: Lang) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'fr-DZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function toDashboardOrder(order: ApiOrder, lang: Lang): DashboardOrder {
  const firstItem = order.items?.[0]
  const productTitle = lang === 'ar' && firstItem?.product?.titleAr
    ? firstItem.product.titleAr
    : firstItem?.product?.title

  return {
    id: order.id,
    publicId: order.publicId,
    course: productTitle || t('Commande personnalisée', 'طلب مخصص', lang),
    platform: firstItem?.product?.type || 'TaallamGo',
    amount: order.totalDzd,
    status: order.status,
    date: formatDate(order.createdAt, lang),
    deliveryMethod: order.deliveryMethod || t('Livraison numérique', 'تسليم رقمي', lang),
    quantity: order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    paymentStatus: order.payment?.status,
  }
}

function StatusBadge({ statusKey, lang }: { statusKey: string; lang: Lang }) {
  const meta = getStatusMeta(statusKey, lang)

  return (
    <span style={{
      fontSize: 12,
      fontWeight: 700,
      padding: '4px 10px',
      borderRadius: 20,
      backgroundColor: `color-mix(in srgb, ${meta.color} 14%, transparent)`,
      color: meta.color,
      border: `1px solid color-mix(in srgb, ${meta.color} 28%, transparent)`,
      whiteSpace: 'nowrap',
    }}>
      {meta.label}
    </span>
  )
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div style={{
      border: '1px dashed var(--border)',
      borderRadius: 14,
      padding: 24,
      textAlign: 'center',
      backgroundColor: 'var(--surface-secondary)',
      color: 'var(--muted-foreground)',
    }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--foreground)', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13 }}>{description}</div>
    </div>
  )
}

export function CustomerDashboard({ lang, navigate, dir }: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const [selectedOrder, setSelectedOrder] = useState<DashboardOrder | null>(null)
  const [orders, setOrders] = useState<DashboardOrder[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState('')
  const isMobile = useIsMobile()
  const { data: session, status: sessionStatus } = useSession()
  const navigateRef = useRef(navigate)

  useEffect(() => {
    navigateRef.current = navigate
  }, [navigate])

  const userName = session?.user?.name?.trim() || session?.user?.email?.split('@')[0] || t('Client', 'العميل', lang)
  const userEmail = session?.user?.email || t('Non renseigné', 'غير محدد', lang)
  const userInitial = userName.slice(0, 1).toUpperCase()

  useEffect(() => {
    if (sessionStatus === 'loading') return
    if (sessionStatus === 'unauthenticated') {
      navigateRef.current('auth-login')
      return
    }

    let isActive = true
    setOrdersLoading(true)
    setOrdersError('')

    fetch('/api/orders', { credentials: 'include' })
      .then(async response => {
        const payload = await response.json() as OrdersResponse
        if (!response.ok || !payload.success) {
          throw new Error(payload.error || 'Failed to fetch orders')
        }
        return payload.data || []
      })
      .then(data => {
        if (!isActive) return
        const nextOrders = data.map(order => toDashboardOrder(order, lang))
        setOrders(nextOrders)
        setSelectedOrder(current => {
          if (!current) return null
          return nextOrders.find(order => order.id === current.id) || null
        })
      })
      .catch(error => {
        if (!isActive) return
        setOrdersError(error instanceof Error ? error.message : 'Failed to fetch orders')
      })
      .finally(() => {
        if (isActive) setOrdersLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [lang, sessionStatus])

  const stats = useMemo(() => {
    const delivered = orders.filter(order => order.status === 'delivered').length
    const inProgress = orders.filter(order => (
      order.status === 'awaiting_payment' ||
      order.status === 'payment_review' ||
      order.status === 'paid' ||
      order.status === 'processing' ||
      order.status === 'customer_action_required'
    )).length
    const totalSpent = orders
      .filter(order => order.status === 'delivered' || order.status === 'paid' || order.status === 'processing')
      .reduce((sum, order) => sum + order.amount, 0)

    return [
      { label: t('Commandes', 'الطلبات', lang), value: String(orders.length), icon: '01', color: 'var(--accent)' },
      { label: t('Livrées', 'المسلّمة', lang), value: String(delivered), icon: '02', color: 'var(--accent)' },
      { label: t('En cours', 'قيد المعالجة', lang), value: String(inProgress), icon: '03', color: 'var(--warning)' },
      { label: t('Total dépensé', 'إجمالي الإنفاق', lang), value: `${formatDzd(totalSpent)} DZD`, icon: '04', color: 'var(--foreground)' },
    ]
  }, [lang, orders])

  const goHomeLabel = t('Retour à la page principale', 'العودة إلى الصفحة الرئيسية', lang)
  const backArrow = dir === 'rtl' ? '→' : '←'

  const renderOrdersList = (compact = false) => {
    if (ordersLoading) {
      return <EmptyState title={t('Chargement des commandes...', 'جاري تحميل الطلبات...', lang)} description={t('Veuillez patienter un instant.', 'يرجى الانتظار قليلا.', lang)} />
    }

    if (ordersError) {
      return <EmptyState title={t('Commandes indisponibles', 'الطلبات غير متاحة', lang)} description={t('Connectez votre base de données puis réessayez.', 'اربط قاعدة البيانات ثم حاول مرة أخرى.', lang)} />
    }

    const visibleOrders = compact ? orders.slice(0, 3) : orders

    if (visibleOrders.length === 0) {
      return <EmptyState title={t('Aucune commande pour le moment', 'لا توجد طلبات حاليا', lang)} description={t('Vos achats apparaîtront ici après validation.', 'ستظهر مشترياتك هنا بعد التأكيد.', lang)} />
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 10 : 12 }}>
        {visibleOrders.map(order => (
          <div
            key={order.id}
            onClick={() => { setSelectedOrder(order); setTab('order-detail') }}
            style={{
              backgroundColor: compact ? 'transparent' : 'var(--surface)',
              border: compact ? 'none' : '1px solid var(--border)',
              borderBottom: compact ? '1px solid var(--surface-secondary)' : undefined,
              borderRadius: compact ? 0 : 14,
              padding: compact ? '12px 0' : '18px 20px',
              cursor: 'pointer',
              transition: 'border-color 0.15s, transform 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
            onMouseEnter={e => {
              if (!compact) e.currentTarget.style.borderColor = 'var(--accent)'
            }}
            onMouseLeave={e => {
              if (!compact) e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--foreground)', marginBottom: 4 }}>{order.course}</div>
              <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
                {order.publicId} - {order.platform} - {order.date}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>
                {formatDzd(order.amount)} DZD
              </span>
              <StatusBadge statusKey={order.status} lang={lang} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderContent = () => {
    if (tab === 'order-detail' && selectedOrder) {
      const activeStep = getOrderStepIndex(selectedOrder.status)

      return (
        <div>
          <button
            onClick={() => setTab('orders')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', fontSize: 14, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {backArrow} {t('Retour aux commandes', 'العودة للطلبات', lang)}
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 4px' }}>
                {t('Commande', 'طلب', lang)} {selectedOrder.publicId}
              </h2>
              <p style={{ fontSize: 14, color: 'var(--muted-foreground)', margin: 0 }}>{selectedOrder.date}</p>
            </div>
            <StatusBadge statusKey={selectedOrder.status} lang={lang} />
          </div>

          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 24px' }}>
              {t('Suivi de commande', 'تتبع الطلب', lang)}
            </h3>
            <div style={{ position: 'relative', paddingInlineStart: 24 }}>
              <div style={{
                position: 'absolute',
                insetInlineStart: 10,
                top: 0,
                bottom: 0,
                width: 2,
                background: 'linear-gradient(to bottom, var(--accent) 60%, var(--border) 60%)',
              }} />
              {timelineSteps.map((step, i) => {
                const meta = getStatusMeta(step, lang)
                const done = i < activeStep
                const active = i === activeStep
                return (
                  <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20, position: 'relative' }}>
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      flexShrink: 0,
                      backgroundColor: done || active ? 'var(--accent)' : 'var(--border)',
                      border: active ? '2px solid var(--accent)' : 'none',
                      marginInlineStart: -10,
                      marginTop: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-foreground)',
                      fontSize: 10,
                      fontWeight: 800,
                    }}>
                      {done ? '✓' : active ? '' : ''}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: active ? 800 : 600, color: done || active ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                        {meta.label}
                      </div>
                      {active && (
                        <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 2 }}>
                          {t('En cours...', 'جاري...', lang)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 16px' }}>
              {t('Détails de la commande', 'تفاصيل الطلب', lang)}
            </h3>
            {[
              { label: t('Formation', 'الدورة', lang), value: selectedOrder.course },
              { label: t('Plateforme', 'المنصة', lang), value: selectedOrder.platform },
              { label: t('Quantité', 'الكمية', lang), value: String(selectedOrder.quantity || 1) },
              { label: t('Total à payer', 'المجموع للدفع', lang), value: `${formatDzd(selectedOrder.amount)} DZD` },
              { label: t('Méthode de livraison', 'طريقة التسليم', lang), value: selectedOrder.deliveryMethod },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 16,
                padding: '10px 0',
                borderBottom: '1px solid var(--surface-secondary)',
                fontSize: 14,
                flexWrap: 'wrap',
              }}>
                <span style={{ color: 'var(--muted-foreground)' }}>{row.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--foreground)', textAlign: dir === 'rtl' ? 'left' : 'right' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (tab === 'orders') {
      return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 24px' }}>
            {t('Mes commandes', 'طلباتي', lang)}
          </h2>
          {renderOrdersList(false)}
        </div>
      )
    }

    if (tab === 'profile') {
      return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 24px' }}>
            {t('Profil & sécurité', 'الملف الشخصي والأمان', lang)}
          </h2>
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
              {session?.user?.image ? (
                <img src={session.user.image} alt="" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  color: 'var(--accent-foreground)',
                  fontWeight: 800,
                }}>{userInitial}</div>
              )}
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--foreground)' }}>{userName}</div>
                <div style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>{userEmail}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              {[
                { label: t('Nom complet', 'الاسم الكامل', lang), value: userName },
                { label: t('Email', 'البريد الإلكتروني', lang), value: userEmail },
                { label: t('Session', 'الجلسة', lang), value: sessionStatus === 'authenticated' ? t('Connectée', 'متصلة', lang) : t('Chargement', 'تحميل', lang) },
                { label: t('Compte', 'الحساب', lang), value: t('Client TaallamGo', 'عميل TaallamGo', lang) },
              ].map((field, i) => (
                <div key={i}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted-foreground)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {field.label}
                  </label>
                  <input
                    value={field.value}
                    readOnly
                    style={{
                      width: '100%',
                      height: 44,
                      border: '1.5px solid var(--border)',
                      borderRadius: 10,
                      padding: '0 12px',
                      fontSize: 14,
                      color: 'var(--foreground)',
                      backgroundColor: 'var(--surface-secondary)',
                      outline: 'none',
                    }}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              style={{
                marginTop: 20,
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-foreground)',
                border: 'none',
                cursor: 'pointer',
                padding: '11px 24px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              {t('Se déconnecter', 'تسجيل الخروج', lang)}
            </button>
          </div>
        </div>
      )
    }

    if (tab === 'support') {
      return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 24px' }}>
            {t('Support', 'الدعم', lang)}
          </h2>
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: 'var(--muted-foreground)', marginBottom: 16 }}>
              {t('Assistance compte et commandes', 'مساعدة الحساب والطلبات', lang)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <div style={{ backgroundColor: 'var(--surface-secondary)', borderRadius: 10, padding: '12px 14px', maxWidth: isMobile ? '100%' : '80%' }}>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4 }}>{userName}</div>
                <div style={{ fontSize: 14, color: 'var(--foreground)' }}>
                  {t('Bonjour, je souhaite avoir une mise à jour sur ma commande.', 'مرحبا، أريد تحديثا حول طلبي.', lang)}
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--surface-secondary)', borderRadius: 10, padding: '12px 14px', maxWidth: isMobile ? '100%' : '80%', marginInlineStart: 'auto' }}>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4 }}>TaallamGo Support</div>
                <div style={{ fontSize: 14, color: 'var(--foreground)' }}>
                  {t('Notre équipe vous répondra dans les plus brefs délais.', 'سيرد عليك فريقنا في أقرب وقت.', lang)}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
              <input
                type="text"
                placeholder={t('Votre message...', 'رسالتك...', lang)}
                style={{
                  flex: 1,
                  height: 42,
                  border: '1.5px solid var(--border)',
                  borderRadius: 10,
                  padding: '0 14px',
                  fontSize: 14,
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--surface)',
                  outline: 'none',
                }}
              />
              <button style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-foreground)',
                border: 'none',
                cursor: 'pointer',
                padding: '0 18px',
                minHeight: 42,
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 800,
              }}>
                {t('Envoyer', 'إرسال', lang)}
              </button>
            </div>
          </div>
        </div>
      )
    }

    if (tab === 'wishlist') {
      return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 24px' }}>
            {t('Liste de souhaits', 'قائمة الرغبات', lang)}
          </h2>
          <EmptyState
            title={t('Votre liste est vide', 'قائمتك فارغة', lang)}
            description={t('Ajoutez des formations depuis le catalogue pour les retrouver ici.', 'أضف دورات من الكتالوج لتجدها هنا.', lang)}
          />
        </div>
      )
    }

    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 900, color: 'var(--foreground)', margin: '0 0 6px' }}>
            {t(`Bonjour, ${userName}`, `مرحبا، ${userName}`, lang)}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted-foreground)', margin: 0 }}>
            {t('Voici un aperçu dynamique de vos formations et commandes.', 'إليك نظرة ديناميكية على دوراتك وطلباتك.', lang)}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))', gap: 16, marginBottom: 28 }}>
          {stats.map((kpi) => (
            <div key={kpi.label} style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 16px' }}>
              <div style={{ fontSize: 12, marginBottom: 12, color: 'var(--muted-foreground)', fontWeight: 900 }}>{kpi.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: kpi.color }}>{ordersLoading ? '...' : kpi.value}</div>
              <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>{kpi.label}</div>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: isMobile ? 18 : 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>
              {t('Commandes récentes', 'الطلبات الأخيرة', lang)}
            </h3>
            <button
              onClick={() => setTab('orders')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--accent)', fontWeight: 800 }}
            >
              {t('Voir tout', 'عرض الكل', lang)}
            </button>
          </div>
          {renderOrdersList(true)}
        </div>
      </div>
    )
  }

  return (
    <div
      dir={dir}
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
      }}
    >
      <aside style={{
        width: isMobile ? '100%' : 260,
        flexShrink: 0,
        backgroundColor: 'var(--surface)',
        borderInlineEnd: isMobile ? 'none' : '1px solid var(--border)',
        borderBottom: isMobile ? '1px solid var(--border)' : 'none',
        padding: isMobile ? '10px 12px' : '24px 0',
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        overflowX: isMobile ? 'auto' : 'visible',
        gap: isMobile ? 8 : 0,
      }}>
        <div style={{ padding: isMobile ? 0 : '0 20px', marginBottom: isMobile ? 0 : 12, flexShrink: 0 }}>
          <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: isMobile ? 0 : 24 }}>
            <LocalizedThemeLogo lang={lang} className="tg-theme-logo--sidebar" />
          </button>
        </div>

        <nav style={{ flex: 1, padding: isMobile ? 0 : '0 10px', display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: isMobile ? 8 : 0 }}>
          {sidebarLinks.map(link => {
            const active = tab === link.key || (tab === 'order-detail' && link.key === 'orders')
            return (
              <button
                key={link.key}
                onClick={() => setTab(link.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: isMobile ? 'auto' : '100%',
                  whiteSpace: 'nowrap',
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: active ? '1px solid color-mix(in srgb, var(--accent) 28%, transparent)' : '1px solid transparent',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 700,
                  backgroundColor: active ? 'var(--surface-secondary)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--muted-foreground)',
                  textAlign: dir === 'rtl' ? 'right' : 'left',
                  transition: 'all 0.15s',
                  marginBottom: 2,
                }}
              >
                <span aria-hidden="true" style={{ width: 18, textAlign: 'center' }}>{link.icon}</span>
                <span>{lang === 'ar' ? link.ar : link.fr}</span>
              </button>
            )
          })}
        </nav>

        <div style={{ display: isMobile ? 'none' : 'block', padding: '16px 20px', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
          <button
            onClick={() => navigate('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              color: 'var(--muted-foreground)',
              fontWeight: 700,
            }}
          >
            {backArrow} {t('Retour au site', 'العودة للموقع', lang)}
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: isMobile ? '18px 14px 28px' : '28px 32px 40px', minWidth: 0, width: '100%', overflowX: 'hidden' }}>
        <button
          onClick={() => navigate('home')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            minHeight: 42,
            padding: '0 16px',
            marginBottom: 22,
            borderRadius: 12,
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--accent)',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 900,
          }}
        >
          {backArrow} {goHomeLabel}
        </button>
        {renderContent()}
      </main>
    </div>
  )
}
