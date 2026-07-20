import { useState } from 'react'
import type { Lang } from '../data'
import { t, mockOrders, orderStatuses } from '../data'
import { useIsMobile } from '../hooks/useIsMobile'
import { taallamGoLogoSrc } from '../logo'
import { formatDzd } from '../format'

interface Props {
  lang: Lang
  navigate: (page: string) => void
  dir: 'ltr' | 'rtl'
}

type Tab = 'overview' | 'orders' | 'order-detail' | 'wishlist' | 'profile' | 'support'

const sidebarLinks = [
  { key: 'overview', icon: '🏠', fr: 'Vue d\'ensemble', ar: 'نظرة عامة' },
  { key: 'orders', icon: '📦', fr: 'Mes commandes', ar: 'طلباتي' },
  { key: 'wishlist', icon: '❤️', fr: 'Liste de souhaits', ar: 'قائمة الرغبات' },
  { key: 'support', icon: '💬', fr: 'Support', ar: 'الدعم' },
  { key: 'profile', icon: '👤', fr: 'Profil & sécurité', ar: 'الملف الشخصي' },
]

function StatusBadge({ statusKey, lang }: { statusKey: string; lang: Lang }) {
  const s = orderStatuses.find(x => x.key === statusKey) || orderStatuses[0]
  return (
    <span style={{
      fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
      backgroundColor: s.color + '18',
      color: s.color,
      border: `1px solid ${s.color}40`,
      whiteSpace: 'nowrap',
    }}>
      {lang === 'ar' ? s.labelAr : s.label}
    </span>
  )
}

export function CustomerDashboard({ lang, navigate }: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null)
  const isMobile = useIsMobile()


  const orderTimelineSteps = [
    { key: 'pending_payment', done: true },
    { key: 'payment_verif', done: true },
    { key: 'payment_confirmed', done: true },
    { key: 'processing', done: false, active: true },
    { key: 'delivered', done: false },
  ]

  const renderContent = () => {
    if (tab === 'order-detail' && selectedOrder) {
      return (
        <div>
          <button
            onClick={() => setTab('orders')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#667085', fontSize: 14, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            ← {t('Retour aux commandes', 'العودة للطلبات', lang)}
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#172033', margin: '0 0 4px' }}>
                {t('Commande', 'طلب', lang)} {selectedOrder.id}
              </h2>
              <p style={{ fontSize: 14, color: '#667085', margin: 0 }}>{selectedOrder.date}</p>
            </div>
            <StatusBadge statusKey={selectedOrder.status} lang={lang} />
          </div>

          {/* Order timeline */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E9F0', borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#172033', margin: '0 0 24px' }}>
              {t('Suivi de commande', 'تتبع الطلب', lang)}
            </h3>
            <div style={{ position: 'relative', paddingLeft: 24 }}>
              <div style={{
                position: 'absolute', left: 10, top: 0, bottom: 0, width: 2,
                background: 'linear-gradient(to bottom, #18A979 60%, #E4E9F0 60%)',
              }} />
              {orderTimelineSteps.map((step, i) => {
                const s = orderStatuses.find(x => x.key === step.key)!
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20, position: 'relative' }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      backgroundColor: step.done ? '#18A979' : step.active ? '#132A4F' : '#E4E9F0',
                      border: step.active ? '2px solid #132A4F' : 'none',
                      marginLeft: -10, marginTop: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {step.done && <span style={{ color: '#FFFFFF', fontSize: 10 }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: step.active ? 700 : 500, color: step.done || step.active ? '#172033' : '#667085' }}>
                        {lang === 'ar' ? s.labelAr : s.label}
                      </div>
                      {step.active && (
                        <div style={{ fontSize: 12, color: '#18A979', marginTop: 2 }}>
                          {t('En cours...', 'جاري...', lang)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Order summary */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E9F0', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#172033', margin: '0 0 16px' }}>
              {t('Détails de la commande', 'تفاصيل الطلب', lang)}
            </h3>
            {[
              { label: t('Formation', 'الدورة', lang), value: selectedOrder.course },
              { label: t('Plateforme', 'المنصة', lang), value: selectedOrder.platform },
              { label: t('Montant', 'المبلغ', lang), value: `${formatDzd(selectedOrder.amount)} DZD` },
              { label: t('Méthode de livraison', 'طريقة التسليم', lang), value: selectedOrder.deliveryMethod },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: '1px solid #F0F3F8',
                fontSize: 14,
              }}>
                <span style={{ color: '#667085' }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: '#172033' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (tab === 'orders') {
      return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#172033', margin: '0 0 24px' }}>
            {t('Mes commandes', 'طلباتي', lang)}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mockOrders.map(order => (
              <div
                key={order.id}
                onClick={() => { setSelectedOrder(order); setTab('order-detail') }}
                style={{
                  backgroundColor: '#FFFFFF', border: '1px solid #E4E9F0', borderRadius: 14,
                  padding: '18px 20px', cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#132A4F')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#E4E9F0')}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#172033', marginBottom: 4 }}>{order.course}</div>
                  <div style={{ fontSize: 13, color: '#667085' }}>
                    {order.id} · {order.platform} · {order.date}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#132A4F' }}>
                    {formatDzd(order.amount)} DZD
                  </span>
                  <StatusBadge statusKey={order.status} lang={lang} />
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <polyline points="5,3 11,8 5,13" stroke="#667085" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (tab === 'profile') {
      return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#172033', margin: '0 0 24px' }}>
            {t('Profil & sécurité', 'الملف الشخصي والأمان', lang)}
          </h2>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E9F0', borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                backgroundColor: '#132A4F', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, color: '#FFFFFF', fontWeight: 700,
              }}>A</div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#172033' }}>Ahmed Bensalem</div>
                <div style={{ fontSize: 14, color: '#667085' }}>ahmed.bensalem@email.com</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              {[
                { label: t('Prénom', 'الاسم الأول', lang), value: 'Ahmed' },
                { label: t('Nom', 'اللقب', lang), value: 'Bensalem' },
                { label: t('Email', 'البريد الإلكتروني', lang), value: 'ahmed@email.com' },
                { label: t('Téléphone', 'الهاتف', lang), value: '+213 654 321 987' },
              ].map((field, i) => (
                <div key={i}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#667085', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {field.label}
                  </label>
                  <input
                    defaultValue={field.value}
                    style={{
                      width: '100%', height: 42, border: '1.5px solid #E4E9F0', borderRadius: 10,
                      padding: '0 12px', fontSize: 14, color: '#172033', outline: 'none',
                    }}
                  />
                </div>
              ))}
            </div>
            <button style={{
              marginTop: 20, backgroundColor: '#132A4F', color: '#FFFFFF',
              border: 'none', cursor: 'pointer', padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700,
            }}>
              {t('Enregistrer', 'حفظ', lang)}
            </button>
          </div>
        </div>
      )
    }

    if (tab === 'support') {
      return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#172033', margin: '0 0 24px' }}>
            {t('Support', 'الدعم', lang)}
          </h2>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E9F0', borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: '#667085', marginBottom: 16 }}>
              {t('Ticket #TKT-2025-0041', 'تذكرة #TKT-2025-0041', lang)} · {t('En attente de réponse', 'في انتظار الرد', lang)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <div style={{ backgroundColor: '#F0F3F8', borderRadius: 10, padding: '12px 14px', maxWidth: '80%' }}>
                <div style={{ fontSize: 12, color: '#667085', marginBottom: 4 }}>Ahmed · 20 Jan 2025</div>
                <div style={{ fontSize: 14, color: '#172033' }}>
                  {t("Bonjour, ma commande TGO-2025-0031 est en traitement depuis 2 jours. Pouvez-vous me donner une mise à jour ?", 'مرحباً، طلبي TGO-2025-0031 في المعالجة منذ يومين. هل يمكنكم تقديم تحديث؟', lang)}
                </div>
              </div>
              <div style={{ backgroundColor: '#E8EDF5', borderRadius: 10, padding: '12px 14px', maxWidth: '80%', marginLeft: 'auto' }}>
                <div style={{ fontSize: 12, color: '#667085', marginBottom: 4 }}>TaallamGo Support · 20 Jan 2025</div>
                <div style={{ fontSize: 14, color: '#172033' }}>
                  {t("Bonjour Ahmed, votre commande est en cours de traitement. Nous vous répondrons dans les 24h. Merci de votre patience.", 'مرحباً أحمد، طلبك قيد المعالجة. سنرد عليك خلال 24 ساعة. شكراً لصبرك.', lang)}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder={t('Votre message...', 'رسالتك...', lang)}
                style={{
                  flex: 1, height: 42, border: '1.5px solid #E4E9F0', borderRadius: 10,
                  padding: '0 14px', fontSize: 14, color: '#172033', outline: 'none',
                }}
              />
              <button style={{
                backgroundColor: '#132A4F', color: '#FFFFFF', border: 'none', cursor: 'pointer',
                padding: '0 18px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              }}>
                {t('Envoyer', 'إرسال', lang)}
              </button>
            </div>
          </div>
        </div>
      )
    }

    // Default: overview
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#172033', margin: '0 0 4px' }}>
            {t('Bonjour, Ahmed 👋', 'مرحباً، أحمد 👋', lang)}
          </h2>
          <p style={{ fontSize: 15, color: '#667085', margin: 0 }}>
            {t('Voici un aperçu de vos formations et commandes.', 'إليك نظرة عامة على دوراتك وطلباتك.', lang)}
          </p>
        </div>

        {/* KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
          {[
            { label: t('Commandes', 'الطلبات', lang), value: '3', icon: '📦', color: '#132A4F' },
            { label: t('Livrées', 'المسلّمة', lang), value: '1', icon: '✅', color: '#18A979' },
            { label: t('En cours', 'قيد المعالجة', lang), value: '2', icon: '⚙️', color: '#F59E0B' },
            { label: t('Total dépensé', 'إجمالي الإنفاق', lang), value: '10 400 DZD', icon: '💰', color: '#667085' },
          ].map((kpi, i) => (
            <div key={i} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E9F0', borderRadius: 14, padding: '18px 16px' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{kpi.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
              <div style={{ fontSize: 13, color: '#667085', marginTop: 2 }}>{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E9F0', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#172033', margin: 0 }}>
              {t('Commandes récentes', 'الطلبات الأخيرة', lang)}
            </h3>
            <button
              onClick={() => setTab('orders')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#18A979', fontWeight: 600 }}
            >
              {t('Voir tout', 'عرض الكل', lang)}
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mockOrders.slice(0, 2).map(order => (
              <div
                key={order.id}
                onClick={() => { setSelectedOrder(order); setTab('order-detail') }}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: '1px solid #F0F3F8', cursor: 'pointer', flexWrap: 'wrap', gap: 8,
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#172033' }}>{order.course}</div>
                  <div style={{ fontSize: 12, color: '#667085' }}>{order.id} · {order.date}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#132A4F' }}>{formatDzd(order.amount)} DZD</span>
                  <StatusBadge statusKey={order.status} lang={lang} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F9FC', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
      {/* Sidebar */}
      <aside style={{
        width: isMobile ? '100%' : 240, flexShrink: 0,
        backgroundColor: '#FFFFFF', borderRight: '1px solid #E4E9F0',
        padding: isMobile ? '10px 12px' : '24px 0',
        display: 'flex', flexDirection: isMobile ? 'row' : 'column',
        overflowX: isMobile ? 'auto' : 'visible',
        gap: isMobile ? 8 : 0,
      }}
      >
        <div style={{ padding: isMobile ? 0 : '0 20px', marginBottom: isMobile ? 0 : 8, flexShrink: 0 }}>
          <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: isMobile ? 0 : 24 }}>
            <img src={taallamGoLogoSrc} alt="TaallamGo" style={{ height: isMobile ? 28 : 30, width: 'auto', maxWidth: 130 }} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: isMobile ? 0 : '0 10px', display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: isMobile ? 8 : 0 }}>
          {sidebarLinks.map(link => (
            <button
              key={link.key}
              onClick={() => setTab(link.key as Tab)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: isMobile ? 'auto' : '100%',
                whiteSpace: 'nowrap',
                padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 500,
                backgroundColor: tab === link.key || (tab === 'order-detail' && link.key === 'orders') ? '#E8EDF5' : 'transparent',
                color: tab === link.key || (tab === 'order-detail' && link.key === 'orders') ? '#132A4F' : '#667085',
                textAlign: 'left',
                transition: 'all 0.15s',
                marginBottom: 2,
              }}
            >
              <span>{link.icon}</span>
              <span>{lang === 'ar' ? link.ar : link.fr}</span>
            </button>
          ))}
        </nav>

        <div style={{ display: isMobile ? 'none' : 'block', padding: '16px 20px', borderTop: '1px solid #E4E9F0', marginTop: 'auto' }}>
          <button
            onClick={() => navigate('home')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, background: 'none',
              border: 'none', cursor: 'pointer', fontSize: 14, color: '#667085', fontWeight: 500,
            }}
          >
            ← {t('Retour au site', 'العودة للموقع', lang)}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: isMobile ? '18px 14px 28px' : '32px 32px', minWidth: 0, width: '100%', overflowX: 'hidden' }}>
        {renderContent()}
      </main>
    </div>
  )
}
